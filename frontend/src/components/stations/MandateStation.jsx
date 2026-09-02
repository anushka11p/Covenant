import { useState } from "react";
import { createMandate } from "../../api";
import { transformMandate } from "../../domain/presentationTransforms";
import TechnicalDrawer from "../shared/TechnicalDrawer";
import { colors, type, shadow } from "../../theme";

export default function MandateStation({ principalId, merchantId, onCreated }) {
  const [mandate, setMandate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleCreate() {
    setLoading(true);
    const raw = await createMandate({
      principal_id: principalId,
      agent_id: "agent_buyer_1",
      merchant_allowlist: [merchantId],
      allowed_categories: ["pet_food", "pet_treats"],
      max_transaction_amount: 250000,
      daily_limit: 250000,
      monthly_limit: 600000,
      hard_constraints: { excluded_allergens: ["chicken"] },
      allowed_payment_method: "test_upi",
      purpose: "Recurring pet nutrition replenishment",
    });
    const transformed = transformMandate(raw);
    setMandate(transformed);
    onCreated?.(raw);
    setLoading(false);
  }

  return (
    <div>
      <h2 style={{ ...type.h2, color: colors.textPrimary }}>Set Buying Permission</h2>
      <p style={{ ...type.body, color: colors.textSecondary }}>"Buy dog food for my dog — within these limits."</p>
      <button onClick={handleCreate} disabled={loading} className="btn-primary">
        {loading ? "Creating…" : "Create Permission"}
      </button>

      {mandate && (
        <div className="step-card" style={{ marginTop: 20, padding: 20, borderRadius: 12, background: colors.surface, border: `1px solid ${colors.border}`, boxShadow: shadow.soft }}>
          <div style={{ ...type.label, color: colors.success }}>{mandate.title}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
            <Rule value={`₹${mandate.perPurchaseLimit}`} label="Per-purchase limit" />
            <Rule value={`₹${mandate.monthlyLimit}`} label="Monthly limit" />
            <Rule value={mandate.allowedCategories} label="Allowed categories" />
            <Rule value={mandate.blockedIngredient} label="Blocked ingredient" />
          </div>
        </div>
      )}

      {mandate && (
        <button onClick={() => setDrawerOpen(true)} style={linkStyle}>View security details</button>
      )}

      <TechnicalDrawer
        open={drawerOpen} onClose={() => setDrawerOpen(false)}
        title="Mandate security details"
        explanation="The permission is cryptographically signed — any edit to the stored values would break this signature, proving it hasn't been tampered with."
        data={mandate?.raw}
      />
    </div>
  );
}

function Rule({ value, label }) {
  return (
    <div>
      <div style={{ ...type.h3, fontSize: 18, color: colors.textPrimary }}>{value}</div>
      <div style={{ ...type.small, color: colors.textSecondary }}>{label}</div>
    </div>
  );
}

const btnStyle = { padding: "10px 18px", borderRadius: 8, border: "none", background: colors.primary, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 };
const linkStyle = { display: "block", marginTop: 14, background: "none", border: "none", color: colors.primary, cursor: "pointer", fontSize: 13, padding: 0 };
