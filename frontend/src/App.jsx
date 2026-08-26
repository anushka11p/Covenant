import { useState } from "react";
import {
  getCatalog, createMandate, proposeAutonomous,
  runAttackScenario, getAuditTrail, getRevenue, attemptAgentHack,
} from "./api";

const MERCHANT_ID = 1;
const PRINCIPAL_ID = 1;

export default function App() {
  const [catalog, setCatalog] = useState(null);
  const [mandate, setMandate] = useState(null);
  const [lastDecision, setLastDecision] = useState(null);
  const [attackResult, setAttackResult] = useState(null);
  const [auditEvents, setAuditEvents] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [hackResult, setHackResult] = useState(null);
  const [loading, setLoading] = useState("");

  async function loadCatalog() {
    setLoading("catalog");
    setCatalog(await getCatalog(MERCHANT_ID));
    setLoading("");
  }

  async function handleCreateMandate() {
    setLoading("mandate");
    const m = await createMandate({
      principal_id: PRINCIPAL_ID,
      agent_id: "agent_buyer_1",
      merchant_allowlist: [MERCHANT_ID],
      allowed_categories: ["pet_food", "pet_treats"],
      max_transaction_amount: 250000,
      daily_limit: 250000,
      monthly_limit: 600000,
      hard_constraints: { excluded_allergens: ["chicken"] },
      allowed_payment_method: "test_upi",
      purpose: "Recurring pet nutrition replenishment",
    });
    setMandate(m);
    setLoading("");
  }

  async function handleAutonomousPurchase() {
    if (!mandate) return;
    setLoading("decision");
    const result = await proposeAutonomous({
      mandate_id: mandate.mandate_id,
      preferred_sku: "PET-1001",
      substitute_sku: "PET-1030",
      last_order_qty: 2,
      days_since_last_order: 27,
    });
    setLastDecision(result);
    setLoading("");
  }

  async function handleAttack() {
    if (!mandate) return;
    setLoading("attack");
    const result = await runAttackScenario(mandate.mandate_id);
    setAttackResult(result);
    setLoading("");
  }

  async function handleLoadAudit() {
    if (!mandate) return;
    setLoading("audit");
    const trail = await getAuditTrail(mandate.mandate_id);
    setAuditEvents(trail.events || []);
    setLoading("");
  }

  async function handleLoadRevenue() {
    setLoading("revenue");
    setRevenue(await getRevenue(MERCHANT_ID));
    setLoading("");
  }

  async function handleHackAttempt() {
    setLoading("hack");
    const result = await attemptAgentHack();
    setHackResult(result);
    setLoading("");
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 900, margin: "0 auto", padding: 24, background: "#0d0d10", color: "#eaeaea", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>Covenant</h1>
      <p style={{ color: "#999", marginTop: 0 }}>Deterministic clearance layer for AI-agent-initiated commerce</p>

      {/* SCREEN 1: Catalog */}
      <Section title="1. Merchant Catalog — Bramble & Co.">
        <button onClick={loadCatalog} disabled={loading === "catalog"}>
          {loading === "catalog" ? "Loading..." : "Load Catalog"}
        </button>
        {catalog && (
          <table style={{ width: "100%", marginTop: 12, borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #333" }}>
                <th>SKU</th><th>Name</th><th>Price</th><th>Allergens</th>
              </tr>
            </thead>
            <tbody>
              {catalog.products.map((p) => (
                <tr key={p.sku} style={{ borderBottom: "1px solid #222" }}>
                  <td>{p.sku}</td>
                  <td>{p.name} {p.merchandising_note && <span style={{ color: "#e05252" }}> ⚠ compromised listing</span>}</td>
                  <td>₹{(p.price_paise / 100).toFixed(2)}</td>
                  <td>{p.allergen_tags.contains.join(", ") || "none"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      {/* SCREEN 2: Mandate creation */}
      <Section title="2. Mandate Creation">
        <button onClick={handleCreateMandate} disabled={loading === "mandate"}>
          {loading === "mandate" ? "Creating..." : "Create Mandate"}
        </button>
        {mandate && (
          <pre style={{ background: "#1a1a1f", padding: 12, borderRadius: 6, fontSize: 13, overflowX: "auto" }}>
{JSON.stringify(mandate, null, 2)}
          </pre>
        )}
      </Section>

      {/* SCREEN 3: Buyer Agent decision */}
      <Section title="3. Buyer Agent — Autonomous Decision">
        <button onClick={handleAutonomousPurchase} disabled={!mandate || loading === "decision"}>
          {loading === "decision" ? "Agent deciding..." : "Trigger Autonomous Purchase (PET-1001 vs PET-1030)"}
        </button>
        {lastDecision && (
          <div style={{ marginTop: 12, background: "#1a1a1f", padding: 12, borderRadius: 6, fontSize: 14 }}>
            <div><strong>Status:</strong> {lastDecision.status}</div>
            <div><strong>Chosen SKU:</strong> {lastDecision.chosen_sku}</div>
            <div><strong>Reasoning:</strong> {lastDecision.reasoning_summary}</div>
            {lastDecision.baseline_sku && (
              <div style={{ color: "#f0a500", marginTop: 8 }}>
                A cheapest-safe-SKU rule would have selected {lastDecision.baseline_sku}
                {" "}(₹{(lastDecision.baseline_price_paise / 100).toFixed(2)}).
                The agent selected {lastDecision.chosen_sku} instead.
              </div>
            )}
          </div>
        )}
      </Section>

      {/* SCREEN 4: Attack scenario (Policy Engine decision panel) */}
      <Section title="4. Compromised Listing Attack + Policy Engine Block">
        <button onClick={handleAttack} disabled={!mandate || loading === "attack"}>
          {loading === "attack" ? "Running attack scenario..." : "Run Attack Scenario"}
        </button>
        {attackResult && (
          <div style={{ marginTop: 12, fontSize: 14 }}>
            <StepBox label="Step 1 — Agent reads compromised listing" color="#f0a500">
              Influenced: {String(attackResult.step_1_llm_was_manipulated.influenced)} —{" "}
              {attackResult.step_1_llm_was_manipulated.reasoning_summary}
            </StepBox>
            <StepBox label="Step 2 — Policy Engine independently checks trusted data" color="#e05252">
              Status: {attackResult.step_2_policy_engine_block.status} — Razorpay order created: {String(!!attackResult.step_2_policy_engine_block.razorpay_order_id)}
            </StepBox>
            <StepBox label="Step 3 — Agent recovers, legitimate purchase completes" color="#4caf50">
              Status: {attackResult.step_3_recovery.status} — Order: {attackResult.step_3_recovery.razorpay_order_id}
            </StepBox>
          </div>
        )}
      </Section>

      {/* SCREEN 5: Audit trail */}
      <Section title="5. Audit Trail">
        <button onClick={handleLoadAudit} disabled={!mandate || loading === "audit"}>
          {loading === "audit" ? "Loading..." : "Load Audit Trail"}
        </button>
        {auditEvents.length > 0 && (
          <div style={{ marginTop: 12, fontSize: 13 }}>
            {auditEvents.map((e, i) => (
              <div key={i} style={{ padding: "6px 0", borderBottom: "1px solid #222" }}>
                <span style={{ color: "#888" }}>{e.timestamp}</span>{" "}
                <span style={{ color: e.event_type === "security_event" ? "#e05252" : "#4caf50", fontWeight: 600 }}>
                  {e.event_type}
                </span>{" "}
                <span style={{ color: "#aaa" }}>({e.actor}{e.rule_fired ? `, rule: ${e.rule_fired}` : ""})</span>
                {e.reason_summary && <div style={{ color: "#ccc" }}>{e.reason_summary}</div>}
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* SCREEN 6: Revenue counter */}
      <Section title="6. Revenue — Human Baseline vs Autonomous">
        <button onClick={handleLoadRevenue} disabled={loading === "revenue"}>
          {loading === "revenue" ? "Loading..." : "Load Revenue"}
        </button>
        {revenue && (
          <div style={{ display: "flex", gap: 24, marginTop: 12 }}>
            <RevenueCard label="Human Baseline" value={revenue.human_baseline_paise} note={revenue.human_baseline_note} />
            <RevenueCard label="Covenant (Autonomous)" value={revenue.autonomous_revenue_paise} highlight />
          </div>
        )}
        {revenue && (
          <div style={{ marginTop: 8, color: revenue.delta_paise >= 0 ? "#4caf50" : "#f0a500" }}>
            Δ {revenue.delta_paise >= 0 ? "+" : ""}₹{(revenue.delta_paise / 100).toFixed(2)} · Incremental captured: ₹{(revenue.incremental_captured_paise / 100).toFixed(2)}
          </div>
        )}
      </Section>

      {/* Isolation boundary demo button */}
      <Section title="Isolation Boundary Proof (demo button)">
        <button onClick={handleHackAttempt} disabled={loading === "hack"} style={{ background: "#e05252", color: "white" }}>
          {loading === "hack" ? "Attempting..." : "Attempt Direct Agent → Razorpay Call (should fail)"}
        </button>
        {hackResult && (
          <div style={{ marginTop: 12, color: hackResult.status === 403 ? "#4caf50" : "#e05252" }}>
            HTTP {hackResult.status} — {hackResult.body.detail}
          </div>
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid #222" }}>
      <h2 style={{ fontSize: 16, color: "#ccc" }}>{title}</h2>
      {children}
    </div>
  );
}

function StepBox({ label, color, children }) {
  return (
    <div style={{ marginBottom: 8, padding: 10, borderLeft: `3px solid ${color}`, background: "#1a1a1f" }}>
      <div style={{ fontWeight: 600, color }}>{label}</div>
      <div style={{ color: "#ccc" }}>{children}</div>
    </div>
  );
}

function RevenueCard({ label, value, note, highlight }) {
  return (
    <div style={{ flex: 1, padding: 16, borderRadius: 8, background: highlight ? "#1a2a1a" : "#1a1a1f", border: highlight ? "1px solid #4caf50" : "1px solid #333" }}>
      <div style={{ color: "#999", fontSize: 13 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700 }}>₹{(value / 100).toFixed(2)}</div>
      {note && <div style={{ color: "#777", fontSize: 11, marginTop: 4 }}>{note}</div>}
    </div>
  );
}
