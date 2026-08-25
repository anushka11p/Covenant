from __future__ import annotations
import itertools
import time
import uuid

_order_counter = itertools.count(1)

class MockRazorpayClient:
    def __init__(self):
        self._orders: dict[str, dict] = {}

    def create_order(self, *, amount_paise: int, currency: str, receipt: str, notes: dict) -> dict:
        order_id = f"order_MOCK{next(_order_counter):06d}"
        order = {
            "id": order_id,
            "entity": "order",
            "amount": amount_paise,
            "currency": currency,
            "receipt": receipt,
            "status": "created",
            "notes": notes,
            "created_at": int(time.time()),
        }
        self._orders[order_id] = order
        return order

    def simulate_payment(self, *, order_id: str, upi_id: str = "success@razorpay") -> dict:
        if order_id not in self._orders:
            raise ValueError(f"Unknown mock order_id: {order_id}")
        payment_id = f"pay_MOCK{uuid.uuid4().hex[:12]}"
        succeeded = upi_id == "success@razorpay"
        status = "captured" if succeeded else "failed"
        self._orders[order_id]["status"] = "paid" if succeeded else "attempted"
        return {
            "id": payment_id,
            "entity": "payment",
            "order_id": order_id,
            "status": status,
            "method": "upi",
            "vpa": upi_id,
            "captured": succeeded,
        }

    def build_webhook_payload(self, *, order_id: str, payment: dict) -> dict:
        event = "payment.captured" if payment["captured"] else "payment.failed"
        return {
            "entity": "event",
            "event": event,
            "payload": {
                "payment": {"entity": payment},
                "order": {"entity": self._orders[order_id]},
            },
        }
