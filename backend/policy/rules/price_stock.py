from __future__ import annotations

def check_price_and_stock(proposed_amount_paise: int, current_price_paise: int, current_stock: int, proposed_qty: int) -> tuple[bool, str | None]:
    tolerance = 0.02
    if abs(proposed_amount_paise - current_price_paise) > current_price_paise * tolerance:
        return False, "price_drift_exceeded"
    if current_stock < proposed_qty:
        return False, "out_of_stock"
    return True, None
