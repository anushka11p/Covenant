import { useState } from "react";
import { proposeAutonomous } from "../../api";
import { transformAutonomousDecision } from "../../domain/presentationTransforms";
import TechnicalDrawer from "../shared/TechnicalDrawer";
import { colors, type, shadow } from "../../theme";

export default function AIDecisionStation({ mandateId, onDecided }) {
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleTrigger() {
    setLoading(true);
    const raw = await proposeAutonomous({
      mandate_id: mandateId,
      preferred_sku: "PET-1001",
      substitute_sku: "PET-1030",
      last_order_qty: 2,
      days_since_last_order: 27,
    });
    const transformed = transformAutonomousDecision(raw);
    setDecision(transformed);
    onDecided?.(raw);
    setLoading(false);
  }

  const chosenIsPreferred = decision?.raw.chosen_sku === "PET-1001";

  return (
    <div>
      <h2 style={{ ...type.h2, color: colors.textPrimary }}>Let AI Shop</h2>
      <p style={{ ...type.body, color: colors.textSecondary }}>The dog is running low on food. The AI buyer checks options.</p>
      <button onClick={handleTrigger} disabled={!mandateId || loading} className="btn-primary" style={{ opacity: (!mandateId || loading) ? 0.6 : 1 }}>
        {loading ? "AI is thinking…" : "Let AI Decide"}
      </button>

      {decision && (
        <div className="step-card" style={{ marginTop: 20 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <OptionCard name="Usual food" price={1150} chosen={chosenIsPreferred} />
            <OptionCard name="Cheaper option" price={780} chosen={!chosenIsPreferred} dimmed={chosenIsPreferred} />
          </div>

          <div style={{ marginTop: 16, padding: 16, borderRadius: 10, background: colors.surface, border: `1px solid ${colors.border}`, boxShadow: shadow.soft }}>
            <div style={{ ...type.label, color: colors.warning }}>WHY I CHOSE THIS</div>
            <div style={{ ...type.body, color: colors.textPrimary, marginTop: 8 }}>{decision.whyBullets[0]}</div>
            {decision.counterfactual && (
              <div style={{ ...type.small, color: colors.textSecondary, marginTop: 10, fontStyle: "italic" }}>
                {decision.counterfactual}
              </div>
            )}
            <div style={{ marginTop: 12, color: colors.success, ...type.small, fontWeight: 700 }}>
              ✓ Within budget &nbsp; ✓ Safe ingredients &nbsp; ✓ Payment complete
            </div>
          </div>
        </div>
      )}

      {decision && (
        <button onClick={() => setDrawerOpen(true)} style={linkStyle}>See the numbers</button>
      )}

      <TechnicalDrawer
        open={drawerOpen} onClose={() => setDrawerOpen(false)}
        title="Decision details"
        explanation="Estimated stock, remaining budget, and the deterministic baseline comparison the AI's choice was measured against."
        data={decision?.raw}
      />
    </div>
  );
}

function OptionCard({ name, price, chosen, dimmed }) {
  return (
    <div style={{
      flex: 1, padding: 16, borderRadius: 10, background: colors.surface,
      border: chosen ? `1px solid ${colors.success}` : `1px solid ${colors.border}`,
      opacity: dimmed ? 0.5 : 1, transition: "opacity 0.3s, border 0.3s",
      boxShadow: shadow.soft,
    }}>
      <div style={{ ...type.body, color: colors.textPrimary }}>{name}</div>
      <div style={{ ...type.financial, fontSize: 20, color: chosen ? colors.success : colors.textSecondary, marginTop: 4 }}>₹{price}</div>
      {chosen && <div style={{ ...type.small, color: colors.success, marginTop: 6, fontWeight: 700 }}>✓ Chosen</div>}
    </div>
  );
}

const btnStyle = { padding: "10px 18px", borderRadius: 8, border: "none", background: colors.primary, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 };
const linkStyle = { display: "block", marginTop: 14, background: "none", border: "none", color: colors.primary, cursor: "pointer", fontSize: 13, padding: 0 };
