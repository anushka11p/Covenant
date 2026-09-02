import { useState } from "react";
import { runAttackScenario } from "../../api";
import { transformAttackScenario } from "../../domain/presentationTransforms";
import TechnicalDrawer from "../shared/TechnicalDrawer";
import StatusBadge from "../StatusBadge";
import { colors, type, shadow } from "../../theme";

export default function AttackStation({ mandateId, onCompleted }) {
  const [beat, setBeat] = useState("idle");
  const [result, setResult] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleRun() {
    setBeat("confidence");
    await sleep(600);
    setBeat("surprise");

    const raw = await runAttackScenario(mandateId);
    const transformed = transformAttackScenario(raw);
    setResult(transformed);
    onCompleted?.(raw);

    await sleep(800);
    setBeat("danger");
    await sleep(1500);
    setBeat("relief");
    await sleep(1000);
    setBeat("trust");
  }

  return (
    <div>
      <h2 style={{ ...type.h2, color: colors.textPrimary }}>Run Attack Test</h2>
      <p style={{ ...type.body, color: colors.textSecondary }}>See what happens when a product listing tries to trick the AI.</p>
      <button onClick={handleRun} disabled={beat !== "idle"} className="btn-primary">
        {beat === "idle" ? "Run Attack Scenario" : "Running…"}
      </button>

      {beat !== "idle" && (
        <div style={{ marginTop: 20 }}>
          {beat === "confidence" && (
            <div style={{ ...type.small, color: colors.forest, marginBottom: 10 }}>✓ Product found &nbsp; ✓ Ready to purchase</div>
          )}

          {(beat === "surprise" || beat === "danger" || beat === "relief" || beat === "trust") && (
            <div>
              <div style={{ ...type.small, color: colors.caution, marginBottom: 10 }}>⚠️ Product information changed the AI's recommendation</div>
              {result && (
                <Card border={colors.caution} bg={colors.cautionSoft}>
                  <div style={{ ...type.body, color: colors.textPrimary }}>Proposed purchase</div>
                  <div style={{ ...type.h3, color: colors.caution, marginTop: 4 }}>{result.proposedSku} (compromised listing)</div>
                  <div style={{ ...type.small, color: colors.textMuted, marginTop: 6 }}>But permission says: NO CHICKEN</div>
                </Card>
              )}
            </div>
          )}

          {(beat === "danger" || beat === "relief" || beat === "trust") && (
            <Card border={colors.blocked} bg={colors.blockedSoft} accent>
              <StatusBadge status="blocked" />
              <div style={{ ...type.body, color: colors.textPrimary, marginTop: 10, fontWeight: 600 }}>
                Chicken is not allowed for this customer
              </div>
              <div style={{ ...type.financial, fontSize: 15, color: colors.blocked, marginTop: 8 }}>₹0 charged</div>
            </Card>
          )}

          {(beat === "relief" || beat === "trust") && (
            <Card border={colors.forest} bg={colors.forestSoft} accent>
              <StatusBadge status="recovered" />
              <div style={{ ...type.body, color: colors.textPrimary, marginTop: 10 }}>Safe product restored. Payment complete.</div>
            </Card>
          )}

          {beat === "trust" && (
            <div style={{ marginTop: 12, color: colors.forest, ...type.small, lineHeight: 1.8, fontWeight: 600 }}>
              ✓ Mandate preserved &nbsp; ✓ Unsafe purchase blocked &nbsp; ✓ Customer protected &nbsp; ✓ Merchant sale recovered
            </div>
          )}
        </div>
      )}

      {result && beat === "trust" && (
        <button onClick={() => setDrawerOpen(true)} style={linkStyle}>See what happened under the hood</button>
      )}

      <TechnicalDrawer
        open={drawerOpen} onClose={() => setDrawerOpen(false)}
        title="Attack scenario — technical trace"
        explanation="The AI's manipulated proposal, the exact safety rule that fired, and the recovered transaction — the safety check never reads marketing text, only verified structured data."
        data={result?.raw}
      />
    </div>
  );
}

function Card({ border, bg, accent, children }) {
  return (
    <div style={{
      padding: 16, borderRadius: 10, background: bg, marginTop: 10,
      border: `1px solid ${border}`,
      borderLeft: accent ? `4px solid ${border}` : `1px solid ${border}`,
      boxShadow: shadow.soft,
    }}>
      {children}
    </div>
  );
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

const btnStyle = { padding: "10px 18px", borderRadius: 8, border: "none", background: colors.verify, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 };
const linkStyle = { display: "block", marginTop: 14, background: "none", border: "none", color: colors.verify, cursor: "pointer", fontSize: 13, padding: 0 };
