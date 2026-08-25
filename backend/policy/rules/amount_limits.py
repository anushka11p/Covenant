from __future__ import annotations

def check_amount_limits(mandate, proposed_amount_paise: int, daily_spent: int, monthly_spent: int) -> tuple[bool, str | None]:
    if proposed_amount_paise > mandate.max_transaction_amount:
        return False, "max_transaction_amount_exceeded"
    if daily_spent + proposed_amount_paise > mandate.daily_limit:
        return False, "daily_limit_exceeded"
    if monthly_spent + proposed_amount_paise > mandate.monthly_limit:
        return False, "monthly_limit_exceeded"
    return True, None
