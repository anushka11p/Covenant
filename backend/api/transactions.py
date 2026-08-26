from __future__ import annotations
import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from models.db import Mandate, Product, Transaction
from policy.engine import PolicyEngine
from agents.buyer_agent import Proposal, attempt_direct_payment_hack
from payment_core._guard import PaymentAccessDenied

router = APIRouter()


def get_db_session():
    from api.main import get_session
    yield from get_session()


class ProposeTransactionRequest(BaseModel):
    mandate_id: str
    sku: str
    amount_paise: int
    qty: int = 1
    reasoning_summary: str
    baseline_sku: str | None = None
    baseline_price_paise: int | None = None


def _spent_so_far(session: Session, mandate_id: str) -> tuple[int, int]:
    # Simplified for the demo: sums ALL paid transactions for this mandate.
    # A production version would window this by actual day/month boundaries.
    paid = session.query(Transaction).filter_by(mandate_id=mandate_id).all()
    total = sum(t.proposed_amount_paise for t in paid if t.status.value == "paid")
    return total, total  # (daily_spent, monthly_spent) — same value for demo simplicity


@router.post("/transactions/propose")
def propose_transaction_route(payload: ProposeTransactionRequest, session: Session = Depends(get_db_session)):
    mandate = session.query(Mandate).filter_by(mandate_id=payload.mandate_id).first()
    if mandate is None:
        raise HTTPException(status_code=404, detail="Mandate not found")

    product = session.query(Product).filter_by(sku=payload.sku).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    proposal = Proposal(
        mandate_id=payload.mandate_id, sku=payload.sku, amount_paise=payload.amount_paise,
        qty=payload.qty, nonce=str(uuid.uuid4()), reasoning_summary=payload.reasoning_summary,
        baseline_sku=payload.baseline_sku, baseline_price_paise=payload.baseline_price_paise,
    )

    daily_spent, monthly_spent = _spent_so_far(session, payload.mandate_id)

    result = PolicyEngine().authorize_and_execute(
        session, mandate=mandate, product=product, proposal=proposal,
        daily_spent=daily_spent, monthly_spent=monthly_spent,
    )

    return {
        "transaction_id": result.id,
        "status": result.status,
        "razorpay_order_id": result.razorpay_order_id,
        "razorpay_payment_id": result.razorpay_payment_id,
        "reasoning_summary": result.reasoning_summary,
    }


@router.post("/demo/attempt-agent-hack")
def attempt_agent_hack_route():
    """
    DEMO-ONLY: proves live, via HTTP, that the Buyer Agent cannot reach
    Razorpay directly. Should always return 403.
    """
    try:
        attempt_direct_payment_hack()
        # If we ever get here, the isolation boundary has failed. This is
        # intentionally left without a success response.
        raise HTTPException(status_code=500, detail="ISOLATION BOUNDARY FAILURE — investigate immediately")
    except PaymentAccessDenied as e:
        raise HTTPException(status_code=403, detail=str(e))


class AutonomousProposeRequest(BaseModel):
    mandate_id: str
    preferred_sku: str
    substitute_sku: str
    last_order_qty: int
    days_since_last_order: int


@router.post("/transactions/propose-autonomous")
def propose_autonomous_route(payload: AutonomousProposeRequest, session: Session = Depends(get_db_session)):
    """
    Runs the REAL Buyer Agent pipeline: computes the stock interval,
    computes the deterministic baseline, calls the LLM for the actual
    buy/substitute/defer decision, then sends the result through the
    Policy Engine. This is what the demo should actually call — the
    manual /transactions/propose route above is for direct testing only.
    """
    from agents.buyer_agent import build_proposal

    mandate = session.query(Mandate).filter_by(mandate_id=payload.mandate_id).first()
    if mandate is None:
        raise HTTPException(status_code=404, detail="Mandate not found")

    preferred_product = session.query(Product).filter_by(sku=payload.preferred_sku).first()
    substitute_product = session.query(Product).filter_by(sku=payload.substitute_sku).first()
    if preferred_product is None or substitute_product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    daily_spent, monthly_spent = _spent_so_far(session, payload.mandate_id)
    monthly_headroom_paise = mandate.monthly_limit - monthly_spent

    proposal = build_proposal(
        mandate_id=payload.mandate_id, nonce=str(uuid.uuid4()),
        preferred={"sku": preferred_product.sku, "price_paise": preferred_product.price_paise,
                   "allergens": preferred_product.allergen_tags.get("contains", [])},
        substitute={"sku": substitute_product.sku, "price_paise": substitute_product.price_paise,
                    "allergens": substitute_product.allergen_tags.get("contains", [])},
        last_order_qty=payload.last_order_qty,
        days_per_unit_for_sku=preferred_product.days_per_unit_for_sku,
        days_since_last_order=payload.days_since_last_order,
        monthly_headroom_paise=monthly_headroom_paise,
        excluded_allergens=mandate.hard_constraints.get("excluded_allergens", []),
    )

    if proposal is None:
        return {"action": "defer", "message": "Agent decided to defer this purchase — stock is not yet urgent."}

    chosen_product = preferred_product if proposal.sku == preferred_product.sku else substitute_product

    result = PolicyEngine().authorize_and_execute(
        session, mandate=mandate, product=chosen_product, proposal=proposal,
        daily_spent=daily_spent, monthly_spent=monthly_spent,
    )

    return {
        "transaction_id": result.id,
        "status": result.status,
        "chosen_sku": result.sku,
        "razorpay_order_id": result.razorpay_order_id,
        "razorpay_payment_id": result.razorpay_payment_id,
        "reasoning_summary": result.reasoning_summary,
        "baseline_sku": result.baseline_sku,
        "baseline_price_paise": result.baseline_price_paise,
        "days_vs_baseline": result.days_vs_baseline,
    }
