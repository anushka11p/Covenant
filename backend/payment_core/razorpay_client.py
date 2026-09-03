from __future__ import annotations
import os
from dotenv import load_dotenv

load_dotenv()

from payment_core._guard import verify_caller
from payment_core.mock_client import MockRazorpayClient

_mock_singleton = MockRazorpayClient()
_real_client = None


def _get_real_client():
    global _real_client
    if _real_client is None:
        import razorpay
        key_id = os.environ["RAZORPAY_KEY_ID"]
        key_secret = os.environ["RAZORPAY_KEY_SECRET"]
        _real_client = razorpay.Client(auth=(key_id, key_secret))
    return _real_client


def _using_real_client() -> bool:
    return bool(os.environ.get("RAZORPAY_KEY_ID") and os.environ.get("RAZORPAY_KEY_SECRET"))


def create_order(*, amount_paise: int, currency: str, receipt: str, notes: dict) -> dict:
    verify_caller()
    if _using_real_client():
        client = _get_real_client()
        order = client.order.create({
            "amount": amount_paise,
            "currency": currency,
            "receipt": receipt,
            "notes": notes,
        })
        return order
    return _mock_singleton.create_order(amount_paise=amount_paise, currency=currency, receipt=receipt, notes=notes)


def simulate_payment(*, order_id: str, upi_id: str = "success@razorpay") -> dict:
    """
    Test-mode only. The real Razorpay Orders API does not expose a
    'simulate payment' call — real payments happen via Checkout (a hosted
    payment page) or S2S APIs, not a direct server-side call like this.
    Until Checkout is wired into the frontend, this path still uses the
    mock even when real keys are present, so payment *confirmation* is
    simulated but the Order itself is real and verifiable in the Razorpay
    dashboard.
    """
    verify_caller()
    return _mock_singleton.simulate_payment(order_id=order_id, upi_id=upi_id)


def build_webhook_payload(*, order_id: str, payment: dict) -> dict:
    verify_caller()
    return _mock_singleton.build_webhook_payload(order_id=order_id, payment=payment)
