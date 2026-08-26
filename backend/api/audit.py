from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from models.db import Transaction, AuditLog

router = APIRouter()


def get_db_session():
    from api.main import get_session
    yield from get_session()


@router.get("/transactions/{transaction_id}")
def get_transaction(transaction_id: int, session: Session = Depends(get_db_session)):
    txn = session.query(Transaction).filter_by(id=transaction_id).first()
    if txn is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {
        "transaction_id": txn.id,
        "mandate_id": txn.mandate_id,
        "sku": txn.sku,
        "status": txn.status,
        "razorpay_order_id": txn.razorpay_order_id,
        "razorpay_payment_id": txn.razorpay_payment_id,
        "reasoning_summary": txn.reasoning_summary,
        "baseline_sku": txn.baseline_sku,
        "baseline_price_paise": txn.baseline_price_paise,
        "created_at": txn.created_at.isoformat(),
    }


@router.get("/audit/{mandate_id}")
def get_audit_trail(mandate_id: str, session: Session = Depends(get_db_session)):
    logs = (
        session.query(AuditLog)
        .filter_by(mandate_id=mandate_id)
        .order_by(AuditLog.timestamp.asc())
        .all()
    )
    return {
        "mandate_id": mandate_id,
        "events": [
            {
                "timestamp": log.timestamp.isoformat(),
                "event_type": log.event_type,
                "actor": log.actor,
                "reason_summary": log.reason_summary,
                "rule_fired": log.rule_fired,
                "transaction_id": log.transaction_id,
            }
            for log in logs
        ],
    }
