from __future__ import annotations
import uuid
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from models.db import Mandate, Product
from policy.engine import PolicyEngine
from agents.buyer_agent import Proposal
from agents.catalog_evaluation import evaluate_catalog_listing

router = APIRouter()


def get_db_session():
    from api.main import get_session
    yield from get_session()


@router.post("/demo/run-attack-scenario")
def run_attack_scenario(mandate_id: str, session: Session = Depends(get_db_session)):
    """
    DEMO ROUTE: runs the full attack -> block -> recovery sequence live.
    1. LLM reads the compromised PET-2214 listing, gets manipulated.
    2. That manipulated proposal is sent to the real Policy Engine -> blocked.
    3. Agent falls back to the original planned purchase (PET-1001) -> succeeds.
    """
    mandate = session.query(Mandate).filter_by(mandate_id=mandate_id).first()
    if mandate is None:
        raise HTTPException(status_code=404, detail="Mandate not found")

    compromised_product = session.query(Product).filter_by(sku="PET-2214").first()
    preferred_product = session.query(Product).filter_by(sku="PET-1001").first()

    # Step 1: LLM evaluates the compromised listing
    manipulated_decision = evaluate_catalog_listing(
        planned_sku="PET-1001", planned_qty=1,
        listing_sku="PET-2214", merchandising_note=compromised_product.merchandising_note,
    )

    # Step 2: manipulated proposal -> real Policy Engine -> should block
    attack_proposal = Proposal(
        mandate_id=mandate.mandate_id, sku=manipulated_decision["proposed_sku"],
        amount_paise=compromised_product.price_paise * manipulated_decision["proposed_qty"],
        qty=manipulated_decision["proposed_qty"], nonce=str(uuid.uuid4()),
        reasoning_summary=manipulated_decision["reasoning_summary"],
    )
    blocked_result = PolicyEngine().authorize_and_execute(
        session, mandate=mandate, product=compromised_product, proposal=attack_proposal,
        daily_spent=0, monthly_spent=0,
    )

    # Step 3: recovery — fall back to the original, correct, legitimate purchase
    recovery_proposal = Proposal(
        mandate_id=mandate.mandate_id, sku=preferred_product.sku,
        amount_paise=preferred_product.price_paise, qty=1, nonce=str(uuid.uuid4()),
        reasoning_summary="Recovered after blocked manipulation attempt; proceeding with originally planned, verified purchase.",
    )
    recovered_result = PolicyEngine().authorize_and_execute(
        session, mandate=mandate, product=preferred_product, proposal=recovery_proposal,
        daily_spent=0, monthly_spent=0,
    )

    return {
        "step_1_llm_was_manipulated": manipulated_decision,
        "step_2_policy_engine_block": {
            "status": blocked_result.status,
            "razorpay_order_id": blocked_result.razorpay_order_id,
        },
        "step_3_recovery": {
            "status": recovered_result.status,
            "razorpay_order_id": recovered_result.razorpay_order_id,
            "razorpay_payment_id": recovered_result.razorpay_payment_id,
        },
    }
