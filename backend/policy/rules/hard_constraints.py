from __future__ import annotations

def check_hard_constraints(mandate, product) -> tuple[bool, str | None]:
    """
    CRITICAL INVARIANT: only reads structured fields (allergen_tags,
    category) — NEVER product.merchandising_note.
    """
    excluded_allergens = mandate.hard_constraints.get("excluded_allergens", [])
    product_allergens = product.allergen_tags.get("contains", [])
    if any(a in excluded_allergens for a in product_allergens):
        return False, "hard_constraint_violation"

    if product.category not in mandate.allowed_categories:
        return False, "category_not_allowed"

    return True, None
