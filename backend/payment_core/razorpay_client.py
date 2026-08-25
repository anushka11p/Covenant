from __future__ import annotations
import os

from payment_core._guard import verify_caller
from payment_core.mock_client import MockRazorpayClient

_mock_singleton = MockRazorpayClient()

def _get_client():
    key_id = os.environ.get("RAZORPAY_KEY_ID")
    key_secret = os.environ.get("RAZORPAY_KEY_SECRET")
    if key_id and key_secret:
        raise NotImplementedError(
            "Real Razorpay keys detected but the real client is not wired "
            "up yet. Implement the real SDK path here."
        )
    return _mock_singleton

def create_order(*, amount_paise: int, currency: str, receipt: str, notes: dict) -> dict:
    verify_caller()
    client = _get_client()
    return client.create_order(amount_paise=amount_paise, currency=currency, receipt=receipt, notes=notes)

def simulate_payment(*, order_id: str, upi_id: str = "success@razorpay") -> dict:
    verify_caller()
    client = _get_client()
    return client.simulate_payment(order_id=order_id, upi_id=upi_id)

def build_webhook_payload(*, order_id: str, payment: dict) -> dict:
    verify_caller()
    client = _get_client()
    return client.build_webhook_payload(order_id=order_id, payment=payment)
