from __future__ import annotations


def cheapest_safe_sku(candidates: list[dict], excluded_allergens: list[str]) -> dict:
    """
    Pure deterministic baseline: among candidates that don't violate hard
    allergen constraints, pick the cheapest. Used as the counterfactual
    comparison against the agent's actual (possibly non-cheapest) choice.

    Each candidate dict expected to have: sku, price_paise, allergens (list).
    """
    safe = [c for c in candidates if not any(a in excluded_allergens for a in c["allergens"])]
    if not safe:
        raise ValueError("No safe candidates available")
    return min(safe, key=lambda c: c["price_paise"])
