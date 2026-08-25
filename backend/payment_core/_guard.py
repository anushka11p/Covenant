from __future__ import annotations
import inspect
import os

ALLOWED_CALLER_SUFFIXES = (
    os.path.join("policy", "engine.py"),
)

class PaymentAccessDenied(PermissionError):
    pass

def verify_caller() -> None:
    stack = inspect.stack()
    if len(stack) < 3:
        raise PaymentAccessDenied(
            "Permission denied – only PolicyEngine may access payment client"
        )
    caller_file = stack[2].filename
    if not any(caller_file.endswith(suffix) for suffix in ALLOWED_CALLER_SUFFIXES):
        raise PaymentAccessDenied(
            "Permission denied – only PolicyEngine may access payment client "
            f"(blocked caller: {caller_file})"
        )
