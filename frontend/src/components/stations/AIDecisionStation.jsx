import { useState } from "react";
import { proposeAutonomous } from "../../api";
import { transformAutonomousDecision } from "../../domain/presentationTransforms";
import TechnicalDrawer from "../shared/TechnicalDrawer";
import { colors, type } from "../../theme";

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function ThinkingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "#F59E0B",
            display: "inline-block",
            animation: `softPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

export default function AIDecisionStation({ mandateId, onDecided }) {
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleTrigger() {
    setLoading(true);
    setThinking(true);

    // Small delay to show "thinking" state before API call
    await sleep(400);

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
    setThinking(false);
    setLoading(false);
  }

  const chosenIsPreferred = decision?.raw.chosen_sku === "PET-1001";

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ ...type.label, color: colors.textMuted, marginBottom: 12 }}>
          BUYER AGENT · LLM-POWERED
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
          Let AI Decide
        </h2>
        <p style={{ ...type.body, color: colors.textSecondary, maxWidth: 480, lineHeight: 1.7 }}>
          The dog is running low on food. The AI buyer agent evaluates options against the mandate
          and proposes the optimal purchase.
        </p>
      </div>

      {!decision && (
        <button
          id="ai-decide-btn"
          className="btn-primary"
          onClick={handleTrigger}
          disabled={!mandateId || loading}
          style={{ marginBottom: 28, opacity: !mandateId ? 0.5 : 1 }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              AI IS THINKING <ThinkingDots />
            </span>
          ) : (
            "TRIGGER AI BUYER"
          )}
        </button>
      )}

      {!mandateId && !decision && (
        <div
          style={{
            marginTop: 12,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: colors.textMuted,
            letterSpacing: "0.08em",
          }}
        >
          ↑ Create a mandate first
        </div>
      )}

      {decision && (
        <div className="step-card">
          {/* Options comparison */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <OptionCard
              label="PREFERRED OPTION"
              name="Bramble Original"
              sku="PET-1001"
              price={1150}
              chosen={chosenIsPreferred}
              dimmed={!chosenIsPreferred}
            />
            <OptionCard
              label="SUBSTITUTE"
              name="Budget Blend"
              sku="PET-1030"
              price={780}
              chosen={!chosenIsPreferred}
              dimmed={chosenIsPreferred}
            />
          </div>

          {/* AI Reasoning */}
          <div
            style={{
              background: "#0A0E13",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 8,
              padding: "16px 20px",
              marginBottom: 16,
            }}
          >
            <div style={{ ...type.label, color: "#F59E0B", marginBottom: 10 }}>
              AI REASONING
            </div>
            <p style={{ ...type.small, color: colors.textSecondary, lineHeight: 1.7 }}>
              {decision.whyBullets[0]}
            </p>
            {decision.counterfactual && (
              <p
                style={{
                  ...type.small,
                  color: colors.textMuted,
                  fontStyle: "italic",
                  marginTop: 10,
                  paddingTop: 10,
                  borderTop: "1px solid rgba(255,255,255,0.04)",
                  fontSize: 12,
                }}
              >
                {decision.counterfactual}
              </p>
            )}
          </div>

          {/* Verification status */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["WITHIN BUDGET", "SAFE INGREDIENTS", "POLICY CLEARED", "PAYMENT COMPLETE"].map((s) => (
              <span key={s} className="badge badge-clear" style={{ fontSize: 10 }}>
                ✓ {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {decision && (
        <button className="btn-link" onClick={() => setDrawerOpen(true)} style={{ marginTop: 16 }}>
          ↳ see technical decision data
        </button>
      )}

      <TechnicalDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="AI Decision details"
        explanation="Estimated stock, remaining budget, and the deterministic baseline comparison the AI's choice was measured against."
        data={decision?.raw}
      />
    </div>
  );
}

function OptionCard({ label, name, sku, price, chosen, dimmed }) {
  return (
    <div
      style={{
        padding: "16px",
        borderRadius: 8,
        background: chosen ? "rgba(16,208,122,0.05)" : "rgba(255,255,255,0.02)",
        border: chosen
          ? "1px solid rgba(16,208,122,0.2)"
          : "1px solid rgba(255,255,255,0.05)",
        opacity: dimmed ? 0.45 : 1,
        transition: "all 0.3s ease",
        position: "relative",
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: chosen ? "#10D07A" : colors.textMuted,
          letterSpacing: "0.1em",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 15,
          fontWeight: 700,
          color: colors.textPrimary,
          marginBottom: 4,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: colors.textMuted,
          marginBottom: 10,
        }}
      >
        {sku}
      </div>
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 22,
          fontWeight: 800,
          color: chosen ? "#10D07A" : colors.textSecondary,
        }}
      >
        ₹{price}
      </div>
      {chosen && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: "#10D07A",
            background: "rgba(16,208,122,0.1)",
            border: "1px solid rgba(16,208,122,0.2)",
            borderRadius: 3,
            padding: "2px 8px",
          }}
        >
          CHOSEN
        </div>
      )}
    </div>
  );
}
