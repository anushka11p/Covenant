import { useState, Suspense, lazy } from "react";
import { runAttackScenario } from "../../api";
import { transformAttackScenario } from "../../domain/presentationTransforms";
import TechnicalDrawer from "../shared/TechnicalDrawer";
import { colors, type } from "../../theme";

const PolicyRingsScene = lazy(() => import("../3d/PolicyRingsScene"));

const POLICY_RULES = [
  { id: 0, label: "MANDATE STATUS", desc: "Is mandate active and not revoked?" },
  { id: 1, label: "HARD CONSTRAINTS", desc: "Allergen and exclusion check against structured data" },
  { id: 2, label: "MERCHANT ALLOWLIST", desc: "Is this merchant permitted?" },
  { id: 3, label: "AMOUNT LIMIT", desc: "Does this exceed per-transaction cap?" },
  { id: 4, label: "PRICE / STOCK", desc: "Is price within tolerance and item in stock?" },
  { id: 5, label: "PROMO VALIDATION", desc: "Are any promotions correctly applied?" },
  { id: 6, label: "IDEMPOTENCY", desc: "Has this exact transaction already been submitted?" },
];

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function StatusDot({ status }) {
  const color = status === "clear" ? "#10D07A" : status === "blocked" ? "#FF3B3B" : status === "scanning" ? "#F59E0B" : "#2A3040";
  const glow = status === "blocked"
    ? "0 0 8px rgba(255,59,59,0.6)"
    : status === "clear"
    ? "0 0 8px rgba(16,208,122,0.6)"
    : status === "scanning"
    ? "0 0 8px rgba(245,158,11,0.6)"
    : "none";

  return (
    <div
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: color,
        boxShadow: glow,
        flexShrink: 0,
        transition: "all 0.3s ease",
      }}
    />
  );
}

function PolicyCheck({ rule, status, delay }) {
  const label = status === "clear" ? "CLEARED" : status === "blocked" ? "BLOCKED" : status === "scanning" ? "SCANNING…" : "WAITING";
  const labelColor = status === "clear" ? "#10D07A" : status === "blocked" ? "#FF3B3B" : status === "scanning" ? "#F59E0B" : "#2A3040";

  return (
    <div
      className="policy-check"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 16px",
        borderRadius: 6,
        background: status === "blocked"
          ? "rgba(255,59,59,0.06)"
          : status === "clear"
          ? "rgba(16,208,122,0.04)"
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${
          status === "blocked"
            ? "rgba(255,59,59,0.2)"
            : status === "clear"
            ? "rgba(16,208,122,0.12)"
            : "rgba(255,255,255,0.04)"
        }`,
        transition: "all 0.3s ease",
        animationDelay: `${delay}ms`,
      }}
    >
      <StatusDot status={status} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: status === "idle" ? colors.textMuted : colors.textSecondary,
              letterSpacing: "0.08em",
              fontWeight: status === "idle" ? 400 : 500,
            }}
          >
            {rule.label}
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: labelColor,
              letterSpacing: "0.1em",
              fontWeight: 700,
            }}
          >
            {label}
          </span>
        </div>
        {status === "blocked" && (
          <div
            style={{
              ...type.small,
              fontSize: 12,
              color: "#FF3B3B",
              marginTop: 3,
            }}
          >
            {rule.desc}
          </div>
        )}
      </div>
    </div>
  );
}

const BEATS = {
  idle: { policyStatuses: Array(7).fill("idle"), activeIndex: -1 },
  reading: { policyStatuses: Array(7).fill("idle"), activeIndex: -1 },
  manipulated: { policyStatuses: Array(7).fill("idle"), activeIndex: -1 },
  scanning: { policyStatuses: Array(7).fill("idle"), activeIndex: 0 },
  blocked: { policyStatuses: ["clear", "blocked", ...Array(5).fill("idle")], activeIndex: 1 },
  blocked_settled: { policyStatuses: ["clear", "blocked", ...Array(5).fill("idle")], activeIndex: -1 },
  recovering: { policyStatuses: Array(7).fill("idle"), activeIndex: -1 },
  recovered: { policyStatuses: Array(7).fill("clear"), activeIndex: -1 },
};

export default function AttackStation({ mandateId, onCompleted }) {
  const [beat, setBeat] = useState("idle");
  const [result, setResult] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scanningIndex, setScanningIndex] = useState(-1);

  async function handleRun() {
    setBeat("reading");
    await sleep(1200);
    setBeat("manipulated");
    await sleep(1400);

    // Start API call
    const rawPromise = runAttackScenario(mandateId);

    // Show scanning animation
    setBeat("scanning");
    for (let i = 0; i < 7; i++) {
      setScanningIndex(i);
      await sleep(i === 1 ? 900 : 280); // pause longer on allergen check
      if (i === 1) break; // blocked at rule 2
    }

    const raw = await rawPromise;
    const transformed = transformAttackScenario(raw);
    setResult(transformed);
    onCompleted?.(raw);

    setBeat("blocked");
    await sleep(2000);
    setBeat("blocked_settled");
    await sleep(1200);
    setBeat("recovering");
    await sleep(1000);
    setBeat("recovered");
  }

  function buildPolicyStatuses(beat, scanningIdx) {
    if (beat === "scanning") {
      return Array(7).fill("idle").map((_, i) =>
        i < scanningIdx ? "clear" : i === scanningIdx ? "scanning" : "idle"
      );
    }
    return BEATS[beat]?.policyStatuses || Array(7).fill("idle");
  }

  const policyStatuses = buildPolicyStatuses(beat, scanningIndex);
  const activeIdx = beat === "scanning" ? scanningIndex : (BEATS[beat]?.activeIndex ?? -1);
  const isRunning = beat !== "idle" && beat !== "recovered";
  const didBlock = ["blocked", "blocked_settled", "recovering", "recovered"].includes(beat);
  const didRecover = beat === "recovered";

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ ...type.label, color: "#FF3B3B", marginBottom: 12 }}>
          ⚠ ADVERSARIAL ATTACK SCENARIO
        </div>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 28,
            fontWeight: 800,
            color: colors.textPrimary,
            letterSpacing: "-0.5px",
            marginBottom: 12,
          }}
        >
          Attack, Block &amp; Recovery
        </h2>
        <p style={{ ...type.body, color: colors.textSecondary, maxWidth: 540, lineHeight: 1.7 }}>
          A product listing contains malicious merchandising text designed to trick the AI.
          The Policy Engine ignores it and checks structured allergen data directly.
        </p>
      </div>

      {/* Main grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* Left: Narrative */}
        <div>
          {/* Trigger button */}
          {beat === "idle" && (
            <button
              id="attack-run-btn"
              className="btn-danger"
              onClick={handleRun}
              disabled={!mandateId}
              style={{ marginBottom: 20, width: "100%" }}
            >
              {!mandateId ? "CREATE MANDATE FIRST" : "RUN ATTACK SCENARIO"}
            </button>
          )}

          {/* Step 1: AI reads */}
          {["reading", "manipulated", "scanning", "blocked", "blocked_settled", "recovering", "recovered"].includes(beat) && (
            <NarrativeStep
              step="01"
              label="AI READS CATALOG"
              status="done"
            >
              <p style={{ ...type.small, color: colors.textSecondary }}>
                The buyer agent reads all product listings, including Bramble &amp; Co.&apos;s catalog.
              </p>
            </NarrativeStep>
          )}

          {/* Step 2: Manipulation */}
          {["manipulated", "scanning", "blocked", "blocked_settled", "recovering", "recovered"].includes(beat) && (
            <NarrativeStep
              step="02"
              label="AI IS MANIPULATED"
              status="warn"
              accent="#F59E0B"
            >
              {result ? (
                <div>
                  <p style={{ ...type.small, color: "#F59E0B", marginBottom: 8, fontWeight: 600 }}>
                    Proposed: {result.proposedSku} (chicken-based listing)
                  </p>
                  <p style={{ ...type.small, color: colors.textSecondary, fontStyle: "italic" }}>
                    &ldquo;{result.manipulatedSummary}&rdquo;
                  </p>
                </div>
              ) : (
                <p style={{ ...type.small, color: "#F59E0B" }}>
                  Adversarial merchandising text influenced the AI&apos;s proposal…
                </p>
              )}
            </NarrativeStep>
          )}

          {/* Step 3: Block */}
          {["blocked", "blocked_settled", "recovering", "recovered"].includes(beat) && (
            <NarrativeStep
              step="03"
              label="POLICY ENGINE BLOCKS"
              status="blocked"
              accent="#FF3B3B"
            >
              <p style={{ ...type.small, color: "#FF3B3B", fontWeight: 600, marginBottom: 6 }}>
                ALLERGEN VIOLATION DETECTED
              </p>
              <p style={{ ...type.small, color: colors.textSecondary }}>
                Chicken is on the hard exclusion list. Policy Engine never reads marketing text — only structured tags.
              </p>
              <div
                style={{
                  marginTop: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: "#FF3B3B",
                  background: "rgba(255,59,59,0.06)",
                  border: "1px solid rgba(255,59,59,0.15)",
                  borderRadius: 4,
                  padding: "8px 12px",
                }}
              >
                ₹0.00 CHARGED · RAZORPAY NOT CALLED
              </div>
            </NarrativeStep>
          )}

          {/* Step 4: Recovery */}
          {["recovering", "recovered"].includes(beat) && (
            <NarrativeStep
              step="04"
              label="AGENT RECOVERS"
              status={beat === "recovered" ? "done" : "scanning"}
              accent="#10D07A"
            >
              {beat === "recovered" && result && (
                <div>
                  <p style={{ ...type.small, color: "#10D07A", fontWeight: 600, marginBottom: 6 }}>
                    CORRECT PRODUCT PURCHASED
                  </p>
                  <p style={{ ...type.small, color: colors.textSecondary }}>
                    Safe product selected. Policy cleared. Payment executed.
                  </p>
                  {result.recovered?.orderId && (
                    <div
                      style={{
                        marginTop: 10,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11,
                        color: "#10D07A",
                        background: "rgba(16,208,122,0.06)",
                        border: "1px solid rgba(16,208,122,0.15)",
                        borderRadius: 4,
                        padding: "8px 12px",
                      }}
                    >
                      ORDER: {result.recovered.orderId}
                    </div>
                  )}
                </div>
              )}
              {beat === "recovering" && (
                <p style={{ ...type.small, color: "#10D07A" }}>Finding safe product…</p>
              )}
            </NarrativeStep>
          )}

          {/* Technical details */}
          {result && beat === "recovered" && (
            <button
              className="btn-link"
              onClick={() => setDrawerOpen(true)}
              style={{ marginTop: 20 }}
            >
              ↳ view technical trace
            </button>
          )}
        </div>

        {/* Right: Policy Engine visualization */}
        <div>
          <div
            style={{
              background: "#0A0E13",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 12,
              padding: 24,
              height: "100%",
            }}
          >
            <div style={{ ...type.label, color: colors.textMuted, marginBottom: 16 }}>
              POLICY ENGINE · DETERMINISTIC
            </div>

            {/* 3D rings */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <Suspense fallback={<div style={{ height: 140 }} />}>
                <PolicyRingsScene
                  statuses={policyStatuses}
                  activeIndex={activeIdx}
                  size={200}
                />
              </Suspense>
            </div>

            {/* Policy rule list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {POLICY_RULES.map((rule, i) => (
                <PolicyCheck
                  key={rule.id}
                  rule={rule}
                  status={policyStatuses[i] || "idle"}
                  delay={i * 40}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Running indicator */}
      {isRunning && beat !== "recovered" && (
        <div
          style={{
            marginTop: 16,
            padding: "10px 16px",
            background: "rgba(16,208,122,0.04)",
            border: "1px solid rgba(16,208,122,0.1)",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#10D07A",
              boxShadow: "0 0 6px rgba(16,208,122,0.8)",
              animation: "softPulse 1.2s ease-in-out infinite",
            }}
          />
          <span style={{ ...type.label, color: "#10D07A" }}>SYSTEM RUNNING</span>
        </div>
      )}

      <TechnicalDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Attack scenario — technical trace"
        explanation="The AI's manipulated proposal, the exact safety rule that fired, and the recovered transaction — the safety check never reads marketing text, only verified structured data."
        data={result?.raw}
      />
    </div>
  );
}

function NarrativeStep({ step, label, status, accent = "#10D07A", children }) {
  const statusColor =
    status === "done" ? "#10D07A"
      : status === "blocked" ? "#FF3B3B"
      : status === "warn" ? "#F59E0B"
      : status === "scanning" ? "#F59E0B"
      : "#2A3040";

  return (
    <div
      className="step-card"
      style={{
        marginBottom: 16,
        padding: "16px 20px",
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${
          status === "blocked"
            ? "rgba(255,59,59,0.15)"
            : status === "warn"
            ? "rgba(245,158,11,0.12)"
            : status === "done"
            ? "rgba(16,208,122,0.1)"
            : "rgba(255,255,255,0.04)"
        }`,
        borderLeft: `3px solid ${accent}`,
        borderRadius: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: children ? 10 : 0,
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: accent,
            fontWeight: 700,
          }}
        >
          {step}
        </div>
        <div style={{ ...type.label, color: accent, fontSize: 10, flex: 1 }}>{label}</div>
      </div>
      {children}
    </div>
  );
}
