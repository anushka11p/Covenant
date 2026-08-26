import { useState } from "react";
import { attemptAgentHack } from "../../api";
import { transformHackAttempt } from "../../domain/presentationTransforms";
import TechnicalDrawer from "../shared/TechnicalDrawer";

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
      <h2 style={{ color: "#f2f2f5" }}>Test the Safety Lock</h2>
      <p style={{ color: "#9a9aa5", fontSize: 14 }}>We intentionally try to let the AI access payment directly.</p>
      <button onClick={handleTest} disabled={loading} style={{ ...btnStyle, background: "#3a2020", color: "#e05252" }}>
        {loading ? "Attempting…" : "🔒 Attempt Direct Payment Access"}
      </button>

      {result && (
        <div style={{ marginTop: 20, padding: 20, borderRadius: 12, background: "#15151a", border: `1px solid ${result.blocked ? "#4caf50" : "#e05252"}` }}>
          <div style={{ color: result.blocked ? "#4caf50" : "#e05252", fontSize: 15, fontWeight: 700 }}>
            {result.blocked ? "BLOCKED" : "⚠️ UNEXPECTED: NOT BLOCKED"}
          </div>
          <div style={{ color: "#c0c0cc", fontSize: 14, marginTop: 8 }}>
            The AI does not have direct access to the payment system. Only the verified purchase path can authorize a payment.
          </div>
          <div style={{ color: "#4caf50", fontSize: 13, marginTop: 10 }}>₹0 charged</div>
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

const btnStyle = { padding: "10px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14 };
const linkStyle = { display: "block", marginTop: 14, background: "none", border: "none", color: "#7a9eff", cursor: "pointer", fontSize: 13, padding: 0 };
