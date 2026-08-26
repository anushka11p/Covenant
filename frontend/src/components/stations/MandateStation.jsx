import { useState } from "react";
import { createMandate } from "../../api";
import { transformMandate } from "../../domain/presentationTransforms";
import TechnicalDrawer from "../shared/TechnicalDrawer";

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
      <h2 style={{ color: "#f2f2f5" }}>Set Buying Permission</h2>
      <p style={{ color: "#9a9aa5", fontSize: 14 }}>"Buy dog food for my dog — within these limits."</p>
      <button onClick={handleCreate} disabled={loading} style={btnStyle}>
        {loading ? "Creating…" : "Create Permission"}
      </button>

      {mandate && (
        <div style={{ marginTop: 20, padding: 20, borderRadius: 12, background: "#15151a", border: "1px solid #26262e" }}>
          <div style={{ color: "#4caf50", fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>{mandate.title}</div>
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
      <div style={{ color: "#f2f2f5", fontSize: 18, fontWeight: 700 }}>{value}</div>
      <div style={{ color: "#7a7a85", fontSize: 12 }}>{label}</div>
    </div>
  );
}

const btnStyle = { padding: "10px 18px", borderRadius: 8, border: "none", background: "#2c2c34", color: "#f2f2f5", cursor: "pointer", fontSize: 14 };
const linkStyle = { display: "block", marginTop: 14, background: "none", border: "none", color: "#7a9eff", cursor: "pointer", fontSize: 13, padding: 0 };
