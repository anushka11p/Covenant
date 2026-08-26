import { useState } from "react";
import { proposeAutonomous } from "../../api";
import { transformAutonomousDecision } from "../../domain/presentationTransforms";
import TechnicalDrawer from "../shared/TechnicalDrawer";

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
      <h2 style={{ color: "#f2f2f5" }}>Let AI Shop</h2>
      <p style={{ color: "#9a9aa5", fontSize: 14 }}>The dog is running low on food. The AI buyer checks options.</p>
      <button onClick={handleTrigger} disabled={!mandateId || loading} style={btnStyle}>
        {loading ? "AI is thinking…" : "Let AI Decide"}
      </button>

      {decision && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <OptionCard name="Usual food" price={1150} chosen={chosenIsPreferred} />
            <OptionCard name="Cheaper option" price={780} chosen={!chosenIsPreferred} dimmed={chosenIsPreferred} />
          </div>

          <div style={{ marginTop: 16, padding: 16, borderRadius: 10, background: "#15151a", border: "1px solid #26262e" }}>
            <div style={{ color: "#f0a500", fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>WHY I CHOSE THIS</div>
            <div style={{ color: "#c0c0cc", fontSize: 14, marginTop: 8 }}>{decision.whyBullets[0]}</div>
            {decision.counterfactual && (
              <div style={{ color: "#7a7a85", fontSize: 12, marginTop: 10, fontStyle: "italic" }}>
                {decision.counterfactual}
              </div>
            )}
            <div style={{ marginTop: 12, color: "#4caf50", fontSize: 13 }}>
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
      flex: 1, padding: 16, borderRadius: 10, background: "#15151a",
      border: chosen ? "1px solid #4caf50" : "1px solid #26262e",
      opacity: dimmed ? 0.4 : 1, transition: "opacity 0.3s, border 0.3s",
    }}>
      <div style={{ color: "#f2f2f5", fontSize: 14 }}>{name}</div>
      <div style={{ color: chosen ? "#4caf50" : "#c0c0cc", fontSize: 20, fontWeight: 700, marginTop: 4 }}>₹{price}</div>
      {chosen && <div style={{ color: "#4caf50", fontSize: 12, marginTop: 6 }}>✓ Chosen</div>}
    </div>
  );
}

const btnStyle = { padding: "10px 18px", borderRadius: 8, border: "none", background: "#2c2c34", color: "#f2f2f5", cursor: "pointer", fontSize: 14 };
const linkStyle = { display: "block", marginTop: 14, background: "none", border: "none", color: "#7a9eff", cursor: "pointer", fontSize: 13, padding: 0 };
