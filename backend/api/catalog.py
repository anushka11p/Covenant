from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from models.db import Merchant, Product

router = APIRouter()


def get_db_session():
    from api.main import get_session
    yield from get_session()


@router.get("/catalog/{merchant_id}")
def get_catalog(merchant_id: int, session: Session = Depends(get_db_session)):
    merchant = session.query(Merchant).filter_by(id=merchant_id).first()
    if merchant is None:
        raise HTTPException(status_code=404, detail="Merchant not found")

    products = session.query(Product).filter_by(merchant_id=merchant_id).all()

    return {
        "merchant": {"id": merchant.id, "name": merchant.name},
        "products": [
            {
                "sku": p.sku,
                "name": p.name,
                "price_paise": p.price_paise,
                "category": p.category,
                "allergen_tags": p.allergen_tags,
                "stock_qty": p.stock_qty,
                # merchandising_note IS returned here — it's a real catalog
                # field a human/UI would see. The invariant is that the
                # POLICY ENGINE never reads it for authorization, not that
                # it's hidden from the catalog entirely.
                "merchandising_note": p.merchandising_note,
            }
            for p in products
        ],
    }
