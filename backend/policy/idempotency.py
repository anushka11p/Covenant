from __future__ import annotations
import hashlib

def make_idempotency_key(mandate_id: str, sku: str, amount_paise: int, nonce: str) -> str:
    raw = f"{mandate_id}|{sku}|{amount_paise}|{nonce}"
    return hashlib.sha256(raw.encode()).hexdigest()
