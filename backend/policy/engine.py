from __future__ import annotations
from datetime import datetime, timezone

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from models.db import Transaction, AuditLog, TransactionStatus, EventType
from policy.rules.mandate_status import check_mandate_status
from policy.rules.hard_constraints import check_hard_constraints
from policy.rules.amount_limits import check_amount_limits
from policy.rules.price_stock import check_price_and_stock
from policy.idempotency import make_idempotency_key
from payment_core.razorpay_client import create_order, simulate_payment


def _log(session: Session, *, transaction_id, mandate_id, event_type, actor, reason_summary=None, rule_fired=None):
    session.add(AuditLog(
        transaction_id=transaction_id,
        mandate_id=mandate_id,
        event_type=event_type,
        actor=actor,
        reason_summary=reason_summary,
        rule_fired=rule_fired,
        timestamp=datetime.now(timezone.utc).replace(tzinfo=None),
    ))
    session.commit()


class PolicyEngine:
    def authorize_and_execute(self, session: Session, *, mandate, product, proposal, daily_spent: int, monthly_spent: int):
        """
        Runs the 7-step gate in frozen order. Returns the Transaction row,
        with .status reflecting the outcome.
        """
        idempotency_key = make_idempotency_key(
            mandate.mandate_id, product.sku, proposal.amount_paise, proposal.nonce
        )

        # Idempotency check FIRST at the DB layer — if this key already
        # exists, return the original result, do not re-run anything.
        existing = session.query(Transaction).filter_by(idempotency_key=idempotency_key).first()
        if existing:
            return existing

        txn = Transaction(
            mandate_id=mandate.mandate_id,
            sku=product.sku,
            proposed_amount_paise=proposal.amount_paise,
            proposed_qty=proposal.qty,
            nonce=proposal.nonce,
            idempotency_key=idempotency_key,
            status=TransactionStatus.proposed,
            baseline_sku=proposal.baseline_sku,
            baseline_price_paise=proposal.baseline_price_paise,
            reasoning_summary=proposal.reasoning_summary,
            days_vs_baseline=proposal.days_vs_baseline,
        )
        session.add(txn)
        try:
            session.commit()
        except IntegrityError:
            session.rollback()
            return session.query(Transaction).filter_by(idempotency_key=idempotency_key).first()

        _log(session, transaction_id=txn.id, mandate_id=mandate.mandate_id,
             event_type=EventType.agent_proposal, actor="buyer_agent",
             reason_summary=proposal.reasoning_summary)

        # Step 1: mandate live status
        passed, reason = check_mandate_status(mandate)
        _log(session, transaction_id=txn.id, mandate_id=mandate.mandate_id,
             event_type=EventType.policy_check, actor="policy_engine", rule_fired="mandate_status")
        if not passed:
            txn.status = TransactionStatus.denied
            session.commit()
            _log(session, transaction_id=txn.id, mandate_id=mandate.mandate_id,
                 event_type=EventType.policy_denial, actor="policy_engine",
                 reason_summary=reason, rule_fired="mandate_status")
            return txn

        # Step 2: hard constraints (structured fields ONLY — never merchandising_note)
        passed, reason = check_hard_constraints(mandate, product)
        _log(session, transaction_id=txn.id, mandate_id=mandate.mandate_id,
             event_type=EventType.policy_check, actor="policy_engine", rule_fired="hard_constraints")
        if not passed:
            txn.status = TransactionStatus.security_blocked
            session.commit()
            _log(session, transaction_id=txn.id, mandate_id=mandate.mandate_id,
                 event_type=EventType.security_event, actor="policy_engine",
                 reason_summary=reason, rule_fired="hard_constraints")
            return txn

        # Step 3+4: amount limits
        passed, reason = check_amount_limits(mandate, proposal.amount_paise, daily_spent, monthly_spent)
        _log(session, transaction_id=txn.id, mandate_id=mandate.mandate_id,
             event_type=EventType.policy_check, actor="policy_engine", rule_fired="amount_limits")
        if not passed:
            txn.status = TransactionStatus.denied
            session.commit()
            _log(session, transaction_id=txn.id, mandate_id=mandate.mandate_id,
                 event_type=EventType.policy_denial, actor="policy_engine",
                 reason_summary=reason, rule_fired="amount_limits")
            return txn

        # Step 5: price/stock re-validation
        passed, reason = check_price_and_stock(
            proposal.amount_paise, product.price_paise, product.stock_qty, proposal.qty
        )
        _log(session, transaction_id=txn.id, mandate_id=mandate.mandate_id,
             event_type=EventType.policy_check, actor="policy_engine", rule_fired="price_stock")
        if not passed:
            txn.status = TransactionStatus.denied
            session.commit()
            _log(session, transaction_id=txn.id, mandate_id=mandate.mandate_id,
                 event_type=EventType.policy_denial, actor="policy_engine",
                 reason_summary=reason, rule_fired="price_stock")
            return txn

        # All checks passed -> APPROVE -> the ONLY place Razorpay gets called
        txn.status = TransactionStatus.approved
        session.commit()

        # Razorpay caps receipt at 56 chars; idempotency_key (a full SHA-256
        # hex digest) is 64 chars, so we truncate ONLY the receipt field here.
        # The full idempotency_key still enforces real uniqueness at the DB
        # level (Transaction.idempotency_key column) — this truncation never
        # touches that constraint, it only shortens what Razorpay displays.
        order = create_order(
            amount_paise=proposal.amount_paise, currency=mandate.currency,
            receipt=idempotency_key[:56], notes={"mandate_id": mandate.mandate_id, "transaction_id": str(txn.id)},
        )
        txn.razorpay_order_id = order["id"]
        session.commit()
        _log(session, transaction_id=txn.id, mandate_id=mandate.mandate_id,
             event_type=EventType.order_created, actor="policy_engine", reason_summary=f"order {order['id']} created")

        payment = simulate_payment(order_id=order["id"], upi_id="success@razorpay")
        txn.razorpay_payment_id = payment["id"]
        txn.status = TransactionStatus.paid if payment["captured"] else TransactionStatus.failed
        session.commit()
        _log(session, transaction_id=txn.id, mandate_id=mandate.mandate_id,
             event_type=EventType.payment_confirmed, actor="policy_engine", reason_summary=f"payment {payment['id']} {payment['status']}")

        return txn
