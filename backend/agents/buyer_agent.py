from __future__ import annotations
from dataclasses import dataclass

from agents.baseline_rule import cheapest_safe_sku
from agents.stock_estimate import estimate_stock_interval
from agents.reasoning import get_agent_decision


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


def build_proposal(*, mandate_id: str, nonce: str, preferred: dict, substitute: dict,
                    last_order_qty: int, days_per_unit_for_sku: int, days_since_last_order: int,
                    monthly_headroom_paise: int, excluded_allergens: list[str]) -> Proposal | None:
    """
    Full pipeline: computes the stock interval, computes the deterministic
    baseline (for the counterfactual artifact), calls the LLM for the real
    decision, and returns a Proposal — or None if the agent decided to defer.
    """
    stock_interval = estimate_stock_interval(
        last_order_qty=last_order_qty, days_per_unit_for_sku=days_per_unit_for_sku,
        days_since_last_order=days_since_last_order,
    )

    baseline = cheapest_safe_sku(
        candidates=[
            {"sku": preferred["sku"], "price_paise": preferred["price_paise"], "allergens": preferred.get("allergens", [])},
            {"sku": substitute["sku"], "price_paise": substitute["price_paise"], "allergens": substitute.get("allergens", [])},
        ],
        excluded_allergens=excluded_allergens,
    )

    decision = get_agent_decision(
        preferred=preferred, substitute=substitute,
        stock_interval=stock_interval, monthly_headroom_paise=monthly_headroom_paise,
    )

    if decision["action"] == "defer":
        return None

    chosen = preferred if decision["chosen_sku"] == preferred["sku"] else substitute

    return Proposal(
        mandate_id=mandate_id, sku=chosen["sku"], amount_paise=chosen["price_paise"], qty=1,
        nonce=nonce, reasoning_summary=decision["reasoning_summary"],
        baseline_sku=baseline["sku"], baseline_price_paise=baseline["price_paise"],
    )


def attempt_direct_payment_hack() -> None:
    """DEMO-ONLY. Proves the isolation boundary holds at runtime."""
    from payment_core.razorpay_client import create_order  # dynamic, on purpose
    return create_order(
        amount_paise=999999, currency="INR",
        receipt="agent-side-hack-attempt",
        notes={"source": "buyer_agent direct call — should never succeed"},
    )
