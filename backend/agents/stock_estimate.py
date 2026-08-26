from __future__ import annotations

# Frozen: the point at which a human customer historically tends to reorder,
# used only for the days_vs_baseline growth metric — separate from the
# "urgent" safety threshold used in reasoning.py.
TYPICAL_HUMAN_REORDER_POINT_DAYS = 5


def estimate_stock_interval(last_order_qty: int, days_per_unit_for_sku: int, days_since_last_order: int) -> dict:
    """
    Frozen formula:
      point_estimate = (last_order_qty * days_per_unit_for_sku) - days_since_last_order
      displayed interval = point_estimate - 1 (lower) to point_estimate + 2 (upper)
    """
    point_estimate = (last_order_qty * days_per_unit_for_sku) - days_since_last_order
    return {
        "point_estimate": point_estimate,
        "lower_bound": point_estimate - 1,
        "upper_bound": point_estimate + 2,
    }


def compute_days_vs_baseline(point_estimate: int) -> int:
    """
    Growth metric: how many days before (negative) or after (positive) the
    typical human reorder point this purchase happened. <= 0 means the
    purchase was captured at or before when a human customer would
    typically have reordered — i.e. genuinely incremental, not just a
    purchase that would have happened anyway.
    """
    return point_estimate - TYPICAL_HUMAN_REORDER_POINT_DAYS
