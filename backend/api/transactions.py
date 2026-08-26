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
