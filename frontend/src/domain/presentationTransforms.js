// Converts raw backend JSON into plain-language presentation objects.
// Backend stays technical; this is the ONLY place translation happens.

export function transformCatalog(raw) {
  return raw.products.map((p) => ({
    sku: p.sku,
    name: p.name,
    priceRupees: p.price_paise / 100,
    allergens: p.allergen_tags.contains,
    isCompromised: !!p.merchandising_note,
    raw: p,
  }));
}

export function transformMandate(raw) {
  return {
    title: "MANDATE ACTIVE",
    perPurchaseLimit: 2500,
    monthlyLimit: 6000,
    allowedCategories: "Dog food + treats",
    blockedIngredient: "Chicken",
    createdLabel: "Active since just now",
    raw,
  };
}

export function transformAutonomousDecision(raw) {
  const chosenIsPreferred = raw.chosen_sku !== raw.baseline_sku;
  return {
    status: raw.status === "paid" ? "success" : "failed",
    chosenName: raw.chosen_sku,
    chosenPriceRupees: null, // filled by caller from catalog data
    whyBullets: [raw.reasoning_summary],
    counterfactual: raw.baseline_sku
      ? `A simple cheapest-price rule would have picked ${raw.baseline_sku} (₹${(raw.baseline_price_paise / 100).toFixed(0)}). The AI chose differently.`
      : null,
    raw,
  };
}

export function transformAttackScenario(raw) {
  const s1 = raw.step_1_llm_was_manipulated;
  const s2 = raw.step_2_policy_engine_block;
  const s3 = raw.step_3_recovery;

  return {
    wasManipulated: s1.influenced,
    manipulatedSummary: s1.reasoning_summary,
    proposedSku: s1.proposed_sku,
    blocked: {
      title: "Purchase blocked",
      message: "This product contains chicken, which isn't allowed for this customer.",
      status: s2.status,
      amountProtected: null, // caller can fill from catalog price if desired
    },
    recovered: {
      status: s3.status,
      orderId: s3.razorpay_order_id,
      paymentId: s3.razorpay_payment_id,
    },
    raw,
  };
}

export function transformAuditTrail(events) {
  const HUMAN_LABELS = {
    agent_proposal: { label: "AI buyer proposed a purchase", icon: "info" },
    policy_check: { label: "Safety check ran", icon: "check" },
    policy_denial: { label: "Purchase blocked (limit)", icon: "warn" },
    security_event: { label: "Suspicious product information detected", icon: "danger" },
    order_created: { label: "Payment initiated", icon: "check" },
    payment_confirmed: { label: "Payment completed", icon: "check" },
  };

  return events.map((e) => {
    const meta = HUMAN_LABELS[e.event_type] || { label: e.event_type, icon: "info" };
    return {
      time: new Date(e.timestamp).toLocaleTimeString(),
      label: meta.label,
      icon: meta.icon,
      detail: e.reason_summary,
      raw: e,
    };
  });
}

export function transformRevenue(raw) {
  return {
    withoutAI: raw.human_baseline_paise / 100,
    withAI: raw.autonomous_revenue_paise / 100,
    delta: raw.delta_paise / 100,
    incremental: raw.incremental_captured_paise / 100,
    note: raw.human_baseline_note,
    raw,
  };
}

export function transformHackAttempt(raw) {
  return {
    blocked: raw.status === 403,
    message: raw.body.detail,
    raw,
  };
}
