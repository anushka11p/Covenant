from __future__ import annotations


def estimate_stock_interval(last_order_qty: int, days_per_unit_for_sku: int, days_since_last_order: int) -> dict:
    """
    Frozen formula:
      point_estimate = (last_order_qty * days_per_unit_for_sku) - days_since_last_order
      displayed interval = point_estimate - 1 (lower) to point_estimate + 2 (upper)
    Asymmetric on purpose: under-consumption is less likely than delayed
    reorder detection, so the band skews toward "could already be gone."
    """
    point_estimate = (last_order_qty * days_per_unit_for_sku) - days_since_last_order
    return {
        "point_estimate": point_estimate,
        "lower_bound": point_estimate - 1,
        "upper_bound": point_estimate + 2,
    }
