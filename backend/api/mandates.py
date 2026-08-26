from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from policy.mandate_service import create_mandate, revoke_mandate

router = APIRouter()


def get_db_session():
    from api.main import get_session
    yield from get_session()


class CreateMandateRequest(BaseModel):
    principal_id: int
    agent_id: str
    merchant_allowlist: list[int]
    allowed_categories: list[str]
    max_transaction_amount: int
    daily_limit: int
    monthly_limit: int
    hard_constraints: dict
    allowed_payment_method: str
    purpose: str


@router.post("/mandates")
def create_mandate_route(payload: CreateMandateRequest, session: Session = Depends(get_db_session)):
    mandate = create_mandate(
        session,
        principal_id=payload.principal_id,
        agent_id=payload.agent_id,
        merchant_allowlist=payload.merchant_allowlist,
        allowed_categories=payload.allowed_categories,
        max_transaction_amount=payload.max_transaction_amount,
        daily_limit=payload.daily_limit,
        monthly_limit=payload.monthly_limit,
        hard_constraints=payload.hard_constraints,
        allowed_payment_method=payload.allowed_payment_method,
        purpose=payload.purpose,
    )
    return {
        "mandate_id": mandate.mandate_id,
        "status": mandate.status,
        "expiry": mandate.expiry.isoformat(),
        "signature": mandate.signature,
    }


@router.patch("/mandates/{mandate_id}/revoke")
def revoke_mandate_route(mandate_id: str, session: Session = Depends(get_db_session)):
    try:
        mandate = revoke_mandate(session, mandate_id=mandate_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return {"mandate_id": mandate.mandate_id, "status": mandate.status}
