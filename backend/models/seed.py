from __future__ import annotations
from datetime import datetime, timezone

from models.db import get_engine, get_session_factory, init_db, Merchant, Product


def run_seed(db_url: str = "sqlite:///./covenant.db"):
    engine = get_engine(db_url)
    init_db(engine)
    Session = get_session_factory(engine)
    session = Session()

    existing = session.query(Merchant).filter_by(name="Bramble & Co.").first()
    if existing:
        print("Bramble & Co. already seeded, skipping.")
        return

    merchant = Merchant(name="Bramble & Co.", razorpay_account_id="acc_test_bramble")
    session.add(merchant)
    session.commit()

    products = [
        Product(
            merchant_id=merchant.id, sku="PET-1001", name="Classic Formula (Chicken-Free)",
            price_paise=115000, category="pet_food",
            allergen_tags={"contains": []}, stock_qty=20,
            days_per_unit_for_sku=15,
        ),
        Product(
            merchant_id=merchant.id, sku="PET-1030", name="Value Formula (Chicken-Free)",
            price_paise=78000, category="pet_food",
            allergen_tags={"contains": []}, stock_qty=30,
            days_per_unit_for_sku=None,
        ),
    ]
    session.add_all(products)
    session.commit()

    print(f"Seeded merchant '{merchant.name}' (id={merchant.id}) with {len(products)} products.")


if __name__ == "__main__":
    run_seed()
