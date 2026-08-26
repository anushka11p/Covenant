import { useState } from "react";
import { runAttackScenario } from "../../api";
import { transformAttackScenario } from "../../domain/presentationTransforms";
import TechnicalDrawer from "../shared/TechnicalDrawer";

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
      <h2 style={{ color: "#f2f2f5" }}>Run Attack Test</h2>
      <p style={{ color: "#9a9aa5", fontSize: 14 }}>See what happens when a product listing tries to trick the AI.</p>
      <button onClick={handleRun} disabled={beat !== "idle"} style={btnStyle}>
        {beat === "idle" ? "Run Attack Scenario" : "Running…"}
      </button>

      {beat !== "idle" && (
        <div style={{ marginTop: 20 }}>
          {(beat === "confidence") && (
            <StatusLine color="#4caf50">✓ Product found &nbsp; ✓ Ready to purchase</StatusLine>
          )}

          {(beat === "surprise" || beat === "danger" || beat === "relief" || beat === "trust") && (
            <div>
              <StatusLine color="#f0a500">⚠️ Product information changed the AI's recommendation</StatusLine>
              {result && (
                <Card border="#f0a500">
                  <div style={{ color: "#f2f2f5", fontSize: 14 }}>Proposed purchase</div>
                  <div style={{ color: "#f0a500", fontSize: 18, fontWeight: 700 }}>{result.proposedSku} (compromised listing)</div>
                  <div style={{ color: "#7a7a85", fontSize: 12, marginTop: 6 }}>But permission says: NO CHICKEN</div>
                </Card>
              )}
            </div>
          )}

          {(beat === "danger" || beat === "relief" || beat === "trust") && (
            <Card border="#e05252">
              <div style={{ color: "#e05252", fontSize: 13, fontWeight: 700 }}>SAFETY CHECK</div>
              <div style={{ color: "#f2f2f5", fontSize: 15, marginTop: 6 }}>✕ BLOCKED — Chicken is not allowed for this customer</div>
              <div style={{ color: "#4caf50", fontSize: 13, marginTop: 8 }}>₹0 charged</div>
            </Card>
          )}

          {(beat === "relief" || beat === "trust") && (
            <Card border="#4caf50">
              <div style={{ color: "#4caf50", fontSize: 13, fontWeight: 700 }}>RECOVERING…</div>
              <div style={{ color: "#f2f2f5", fontSize: 14, marginTop: 6 }}>Safe product restored. Payment complete.</div>
            </Card>
          )}

          {beat === "trust" && (
            <div style={{ marginTop: 12, color: "#4caf50", fontSize: 13, lineHeight: 1.8 }}>
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
    <div style={{ padding: 14, borderRadius: 10, background: "#15151a", border: `1px solid ${border}`, marginTop: 10 }}>
      {children}
    </div>
  );
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

const btnStyle = { padding: "10px 18px", borderRadius: 8, border: "none", background: "#2c2c34", color: "#f2f2f5", cursor: "pointer", fontSize: 14 };
const linkStyle = { display: "block", marginTop: 14, background: "none", border: "none", color: "#7a9eff", cursor: "pointer", fontSize: 13, padding: 0 };
