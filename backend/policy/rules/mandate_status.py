from __future__ import annotations
from datetime import datetime, timezone

def check_mandate_status(mandate) -> tuple[bool, str | None]:
    """Returns (passed, denial_reason)."""
    if mandate.status != "active":
        return False, "mandate_inactive"
    if mandate.expiry < datetime.now(timezone.utc).replace(tzinfo=None):
        return False, "mandate_expired"
    return True, None
