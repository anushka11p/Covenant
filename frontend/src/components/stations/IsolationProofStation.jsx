import { useState } from "react";
import { attemptAgentHack } from "../../api";
import { transformHackAttempt } from "../../domain/presentationTransforms";
import TechnicalDrawer from "../shared/TechnicalDrawer";
import { colors, type, shadow } from "../../theme";

export default function IsolationProofStation() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleTest() {
    setLoading(true);
    const raw = await attemptAgentHack();
    setResult(transformHackAttempt(raw));
    setLoading(false);
  }

  return (
    <div>
      <h2 style={{ ...type.h2, color: colors.textPrimary }}>Test the Safety Lock</h2>
      <p style={{ ...type.body, color: colors.textSecondary }}>We intentionally try to let the AI access payment directly.</p>
      <button onClick={handleTest} disabled={loading} style={{ ...btnStyle, background: colors.dangerSoft, color: colors.danger, border: `1px solid ${colors.danger}` }}>
        {loading ? "Attempting…" : "🔒 Attempt Direct Payment Access"}
      </button>

      {result && (
        <div className="sharp-appear" style={{
          marginTop: 20, padding: 20, borderRadius: 12,
          background: result.blocked ? colors.successSoft : colors.dangerSoft,
          border: `1px solid ${result.blocked ? colors.success : colors.danger}`,
          borderLeft: `4px solid ${result.blocked ? colors.success : colors.danger}`,
          boxShadow: shadow.soft,
        }}>
          <div style={{ ...type.h3, color: result.blocked ? colors.success : colors.danger }}>
            {result.blocked ? "BLOCKED" : "⚠️ UNEXPECTED: NOT BLOCKED"}
          </div>
          <div style={{ ...type.body, color: colors.textPrimary, marginTop: 8 }}>
            The AI does not have direct access to the payment system. Only the verified purchase path can authorize a payment.
          </div>
          <div style={{ ...type.financial, fontSize: 15, color: colors.success, marginTop: 10 }}>₹0 charged</div>
        </div>
      )}

      {result && (
        <button onClick={() => setDrawerOpen(true)} style={linkStyle}>View technical proof</button>
      )}

      <TechnicalDrawer
        open={drawerOpen} onClose={() => setDrawerOpen(false)}
        title="Isolation boundary — technical proof"
        explanation="This isn't a rule the AI agreed to follow — the payment code physically rejects any caller that isn't the safety engine, verified by inspecting the actual call stack."
        data={result?.raw}
      />
    </div>
  );
}

const btnStyle = { padding: "10px 18px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 };
const linkStyle = { display: "block", marginTop: 14, background: "none", border: "none", color: colors.primary, cursor: "pointer", fontSize: 13, padding: 0 };
