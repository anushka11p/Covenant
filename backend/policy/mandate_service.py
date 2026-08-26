from __future__ import annotations
import uuid
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from models.db import Mandate, MandateStatus
from policy.mandate_signing import canonical_mandate_body, sign_mandate


def create_mandate(session: Session, *, principal_id: int, agent_id: str,
                    merchant_allowlist: list, allowed_categories: list,
                    max_transaction_amount: int, daily_limit: int, monthly_limit: int,
                    hard_constraints: dict, allowed_payment_method: str,
                    purpose: str, expiry_days: int = 90, currency: str = "INR") -> Mandate:
    mandate_id = f"cov_mnd_{uuid.uuid4().hex[:12]}"
    expiry = datetime.now().replace(microsecond=0) + timedelta(days=expiry_days)

    body = canonical_mandate_body(
        mandate_id=mandate_id, version=1, principal_id=principal_id, agent_id=agent_id,
        merchant_allowlist=merchant_allowlist, allowed_categories=allowed_categories,
        max_transaction_amount=max_transaction_amount, daily_limit=daily_limit,
        monthly_limit=monthly_limit, currency=currency, hard_constraints=hard_constraints,
        allowed_payment_method=allowed_payment_method, purpose=purpose,
        expiry_iso=expiry.isoformat(),
    )
    signature = sign_mandate(body)

    mandate = Mandate(
        mandate_id=mandate_id, version=1, principal_id=principal_id, agent_id=agent_id,
        status=MandateStatus.active, merchant_allowlist=merchant_allowlist,
        allowed_categories=allowed_categories, max_transaction_amount=max_transaction_amount,
        daily_limit=daily_limit, monthly_limit=monthly_limit, currency=currency,
        hard_constraints=hard_constraints, allowed_payment_method=allowed_payment_method,
        purpose=purpose, expiry=expiry, signature=signature,
    )
    session.add(mandate)
    session.commit()
    return mandate


def revoke_mandate(session: Session, *, mandate_id: str) -> Mandate:
    mandate = session.query(Mandate).filter_by(mandate_id=mandate_id).first()
    if mandate is None:
        raise ValueError(f"No mandate found with id {mandate_id}")
    mandate.status = MandateStatus.revoked
    session.commit()
    return mandate
