from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from models.db import Transaction, InitiatedBy, TransactionStatus

router = APIRouter()

# Frozen per locked spec: static seeded baseline, honest tooltip on the frontend.
HUMAN_BASELINE_PAISE = 420000  # ₹4,200 — seeded cohort-average reorder revenue


def get_db_session():
    from api.main import get_session
    yield from get_session()


@router.get("/merchant/{merchant_id}/revenue")
def get_revenue(merchant_id: int, session: Session = Depends(get_db_session)):
    paid_agent_txns = (
        session.query(Transaction)
        .filter_by(status=TransactionStatus.paid, initiated_by=InitiatedBy.agent)
        .all()
    )

    autonomous_total_paise = sum(t.proposed_amount_paise for t in paid_agent_txns)
    incremental_paise = sum(
        t.proposed_amount_paise for t in paid_agent_txns
        if t.days_vs_baseline is not None and t.days_vs_baseline <= 0
    )

    return {
        "human_baseline_paise": HUMAN_BASELINE_PAISE,
        "human_baseline_note": "Based on this customer cohort's typical reorder cycle (seeded for demo).",
        "autonomous_revenue_paise": autonomous_total_paise,
        "incremental_captured_paise": incremental_paise,
        "delta_paise": autonomous_total_paise - HUMAN_BASELINE_PAISE,
        "order_count": len(paid_agent_txns),
    }
