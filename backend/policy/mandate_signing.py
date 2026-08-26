from __future__ import annotations
import hashlib
import hmac
import json
import os

# In production this would come from a secrets manager. For the hackathon,
# a fixed dev secret is fine since we are not protecting against a real
# attacker — this demonstrates tamper-evidence, not production key management.
_SIGNING_SECRET = os.environ.get("MANDATE_SIGNING_SECRET", "dev-secret-change-in-prod").encode()


def canonical_mandate_body(*, mandate_id: str, version: int, principal_id: int, agent_id: str,
                            merchant_allowlist: list, allowed_categories: list,
                            max_transaction_amount: int, daily_limit: int, monthly_limit: int,
                            currency: str, hard_constraints: dict, allowed_payment_method: str,
                            purpose: str, expiry_iso: str) -> str:
    """
    Deterministic JSON serialization (sorted keys) so the same logical
    mandate always produces the same signature input.
    """
    body = {
        "mandate_id": mandate_id, "version": version, "principal_id": principal_id,
        "agent_id": agent_id, "merchant_allowlist": merchant_allowlist,
        "allowed_categories": allowed_categories, "max_transaction_amount": max_transaction_amount,
        "daily_limit": daily_limit, "monthly_limit": monthly_limit, "currency": currency,
        "hard_constraints": hard_constraints, "allowed_payment_method": allowed_payment_method,
        "purpose": purpose, "expiry": expiry_iso,
    }
    return json.dumps(body, sort_keys=True)


def sign_mandate(canonical_body: str) -> str:
    digest = hmac.new(_SIGNING_SECRET, canonical_body.encode(), hashlib.sha256).hexdigest()
    return f"sha256:{digest}"


def verify_mandate_signature(canonical_body: str, signature: str) -> bool:
    expected = sign_mandate(canonical_body)
    return hmac.compare_digest(expected, signature)
