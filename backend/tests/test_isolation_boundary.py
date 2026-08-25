from __future__ import annotations
import ast
import pathlib
import pytest

BACKEND_ROOT = pathlib.Path(__file__).resolve().parents[1]

def test_buyer_agent_has_no_module_level_import_of_payment_core():
    """Checks only module-level imports — the demo hack's import is
    INSIDE a function on purpose, caught by the runtime test instead."""
    tree = ast.parse((BACKEND_ROOT / "agents" / "buyer_agent.py").read_text())
    top_level_imports: set[str] = set()
    for node in tree.body:
        if isinstance(node, ast.Import):
            top_level_imports.update(alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module:
            top_level_imports.add(node.module)
    assert "payment_core" not in top_level_imports
    assert not any(m.startswith("payment_core.") for m in top_level_imports)

def test_llm_cannot_reach_razorpay_without_prior_policy_approval():
    from agents.buyer_agent import attempt_direct_payment_hack
    from payment_core._guard import PaymentAccessDenied
    with pytest.raises(PaymentAccessDenied, match="only PolicyEngine may access payment client"):
        attempt_direct_payment_hack()

def test_policy_engine_legitimate_path_still_works():
    pytest.skip("Enabled once policy/engine.py APPROVE path exists — Step 3")