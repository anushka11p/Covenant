import { useState } from "react";
import { runAttackScenario } from "../../api";
import { transformAttackScenario } from "../../domain/presentationTransforms";
import TechnicalDrawer from "../shared/TechnicalDrawer";
import { colors, type, shadow } from "../../theme";

const BEATS = ["idle", "confidence", "surprise", "danger", "relief", "trust"];

export default function AttackStation({ mandateId, onCompleted }) {
  const [beat, setBeat] = useState("idle");
  const [result, setResult] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleRun() {
    setBeat("confidence");
    await sleep(600);
    setBeat("surprise");

    const raw = await runAttackScenario(mandateId); // real API call happens here
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
      <button onClick={handleRun} disabled={beat !== "idle"} style={btnStyle}>
        {beat === "idle" ? "Run Attack Scenario" : "Running…"}
      </button>

      {beat !== "idle" && (
        <div style={{ marginTop: 20 }}>
          {(beat === "confidence") && (
            <StatusLine color={colors.forest}>✓ Product found &nbsp; ✓ Ready to purchase</StatusLine>
          )}

          {(beat === "surprise" || beat === "danger" || beat === "relief" || beat === "trust") && (
            <div>
              <StatusLine color={colors.caution}>⚠️ Product information changed the AI's recommendation</StatusLine>
              {result && (
                <Card border={colors.caution}>
                  <div style={{ ...type.body, color: colors.textPrimary }}>Proposed purchase</div>
                  <div style={{ ...type.h3, color: colors.caution, marginTop: 4 }}>{result.proposedSku} (compromised listing)</div>
                  <div style={{ ...type.small, color: colors.textMuted, marginTop: 6 }}>But permission says: NO CHICKEN</div>
                </Card>
              )}
            </div>
          )}

          {(beat === "danger" || beat === "relief" || beat === "trust") && (
            <Card border={colors.blocked}>
              <div style={{ ...type.label, color: colors.blocked }}>SAFETY CHECK</div>
              <div style={{ ...type.body, color: colors.textPrimary, marginTop: 6 }}>✕ BLOCKED — Chicken is not allowed for this customer</div>
              <div style={{ ...type.small, color: colors.forest, marginTop: 8 }}>₹0 charged</div>
            </Card>
          )}

          {(beat === "relief" || beat === "trust") && (
            <Card border={colors.forest}>
              <div style={{ ...type.label, color: colors.forest }}>RECOVERING…</div>
              <div style={{ ...type.body, color: colors.textPrimary, marginTop: 6 }}>Safe product restored. Payment complete.</div>
            </Card>
          )}

          {beat === "trust" && (
            <div style={{ marginTop: 12, color: colors.forest, ...type.small, lineHeight: 1.8 }}>
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

function StatusLine({ color, children }) {
  return <div style={{ color, fontSize: 14, marginBottom: 10 }}>{children}</div>;
}

function Card({ border, children }) {
  return (
    <div style={{ padding: 14, borderRadius: 10, background: colors.surface, border: `1px solid ${border}`, marginTop: 10, boxShadow: shadow.soft }}>
      {children}
    </div>
  );
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

const btnStyle = { padding: "10px 18px", borderRadius: 8, border: "none", background: colors.verify, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 };
const linkStyle = { display: "block", marginTop: 14, background: "none", border: "none", color: colors.verify, cursor: "pointer", fontSize: 13, padding: 0 };
