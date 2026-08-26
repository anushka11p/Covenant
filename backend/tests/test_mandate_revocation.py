from __future__ import annotations
import uuid

from models.db import get_engine, get_session_factory, init_db, Merchant, Product, User, UserRole, TransactionStatus
from policy.mandate_service import create_mandate, revoke_mandate
from policy.engine import PolicyEngine
from agents.buyer_agent import Proposal


def _setup():
    engine = get_engine("sqlite:///:memory:")
    init_db(engine)
    Session = get_session_factory(engine)
    session = Session()

    user = User(name="Test Principal", role=UserRole.principal)
    session.add(user); session.commit()

    merchant = Merchant(name="Bramble & Co.")
    session.add(merchant); session.commit()

    product = Product(
        merchant_id=merchant.id, sku="PET-1001", name="Classic Formula",
        price_paise=115000, category="pet_food",
        allergen_tags={"contains": []}, stock_qty=20,
    )
    session.add(product); session.commit()

    mandate = create_mandate(
        session, principal_id=user.id, agent_id="agent_1",
        merchant_allowlist=[merchant.id], allowed_categories=["pet_food"],
        max_transaction_amount=250000, daily_limit=250000, monthly_limit=600000,
        hard_constraints={"excluded_allergens": ["chicken"]},
        allowed_payment_method="test_upi", purpose="test",
    )
    return session, mandate, product


def test_active_mandate_allows_transaction():
    session, mandate, product = _setup()
    proposal = Proposal(
        mandate_id=mandate.mandate_id, sku=product.sku, amount_paise=115000,
        qty=1, nonce=str(uuid.uuid4()), reasoning_summary="normal purchase",
    )
    result = PolicyEngine().authorize_and_execute(
        session, mandate=mandate, product=product, proposal=proposal,
        daily_spent=0, monthly_spent=0,
    )
    assert result.status == TransactionStatus.paid


def test_revoked_mandate_blocks_transaction_even_if_agent_doesnt_know():
    """
    This is the actual invariant that matters: the agent proposes exactly
    the same transaction it would have proposed before revocation — it has
    no idea the mandate was revoked. The Policy Engine must catch this by
    re-checking live status, not by trusting anything the agent believes.
    """
    session, mandate, product = _setup()

    revoke_mandate(session, mandate_id=mandate.mandate_id)
    session.refresh(mandate)  # ensure we're checking the live DB state

    proposal = Proposal(
        mandate_id=mandate.mandate_id, sku=product.sku, amount_paise=115000,
        qty=1, nonce=str(uuid.uuid4()), reasoning_summary="agent unaware of revocation",
    )
    result = PolicyEngine().authorize_and_execute(
        session, mandate=mandate, product=product, proposal=proposal,
        daily_spent=0, monthly_spent=0,
    )
    assert result.status == TransactionStatus.denied
    assert result.razorpay_order_id is None
