from __future__ import annotations
import ast
import pathlib
import uuid
from datetime import datetime, timedelta, timezone

import pytest

BACKEND_ROOT = pathlib.Path(__file__).resolve().parents[1]


def test_buyer_agent_has_no_module_level_import_of_payment_core():
    """Checks only module-level imports — the demo hack's import is
    INSIDE a function on purpose, caught by the runtime test instead."""
    tree = ast.parse((BACKEND_ROOT / "agents" / "buyer_agent.py").read_text())
    top_level_imports: set[str] = set()
    for node in tree.body:
        if isinstance(node, ast.Import):
            top_level_imports.update(alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module:
            top_level_imports.add(node.module)
    assert "payment_core" not in top_level_imports
    assert not any(m.startswith("payment_core.") for m in top_level_imports)


def test_llm_cannot_reach_razorpay_without_prior_policy_approval():
    from agents.buyer_agent import attempt_direct_payment_hack
    from payment_core._guard import PaymentAccessDenied
    with pytest.raises(PaymentAccessDenied, match="only PolicyEngine may access payment client"):
        attempt_direct_payment_hack()


def test_policy_engine_legitimate_path_still_works():
    """
    Positive control: the guard isn't blocking everything — it specifically
    allows the ONE legitimate caller, policy/engine.py, to reach Razorpay.
    """
    from sqlalchemy.orm import Session
    from models.db import get_engine, get_session_factory, init_db, Merchant, Product, Mandate, MandateStatus, User, UserRole, TransactionStatus
    from policy.engine import PolicyEngine
    from agents.buyer_agent import Proposal

    engine = get_engine("sqlite:///:memory:")
    init_db(engine)
    Session = get_session_factory(engine)
    session: Session = Session()

    user = User(name="Test Principal", role=UserRole.principal)
    session.add(user)
    session.commit()

    merchant = Merchant(name="Bramble & Co.", razorpay_account_id="acc_test")
    session.add(merchant)
    session.commit()

    product = Product(
        merchant_id=merchant.id, sku="PET-TEST", name="Test Kibble",
        price_paise=115000, category="pet_food",
        allergen_tags={"contains": []}, stock_qty=10,
    )
    session.add(product)
    session.commit()

    mandate = Mandate(
        mandate_id="cov_mnd_test", version=1, principal_id=user.id,
        agent_id="agent_test", status=MandateStatus.active,
        merchant_allowlist=[merchant.id], allowed_categories=["pet_food"],
        max_transaction_amount=250000, daily_limit=250000, monthly_limit=600000,
        currency="INR", hard_constraints={"excluded_allergens": ["chicken"]},
        allowed_payment_method="test_upi", purpose="test",
        expiry=datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=30), signature="test-sig",
    )
    session.add(mandate)
    session.commit()

    proposal = Proposal(
        mandate_id=mandate.mandate_id, sku=product.sku, amount_paise=115000,
        qty=1, nonce=str(uuid.uuid4()), reasoning_summary="test proposal, within all limits",
    )

    result = PolicyEngine().authorize_and_execute(
        session, mandate=mandate, product=product, proposal=proposal,
        daily_spent=0, monthly_spent=0,
    )

    assert result.status == TransactionStatus.paid
    assert result.razorpay_order_id is not None
    assert result.razorpay_payment_id is not None
