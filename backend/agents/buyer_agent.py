from __future__ import annotations
from dataclasses import dataclass

@dataclass
class Proposal:
    mandate_id: str
    sku: str
    amount_paise: int
    qty: int
    nonce: str
    reasoning_summary: str
    baseline_sku: str | None = None
    baseline_price_paise: int | None = None

def propose_transaction(*, mandate, catalog_candidates, pet_profile, stock_interval) -> Proposal:
    raise NotImplementedError("Step 7: wire real LLM proposal logic here")

def attempt_direct_payment_hack() -> None:
    """DEMO-ONLY. Proves the isolation boundary holds at runtime."""
    from payment_core.razorpay_client import create_order  # dynamic, on purpose
    return create_order(
        amount_paise=999999, currency="INR",
        receipt="agent-side-hack-attempt",
        notes={"source": "buyer_agent direct call — should never succeed"},
    )
