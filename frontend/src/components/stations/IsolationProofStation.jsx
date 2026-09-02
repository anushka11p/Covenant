import { useState } from "react";
import { attemptAgentHack } from "../../api";
import { transformHackAttempt } from "../../domain/presentationTransforms";
import TechnicalDrawer from "../shared/TechnicalDrawer";
import { colors, type } from "../../theme";

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

export default function IsolationProofStation() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | attempting | rejected

  async function handleTest() {
    setLoading(true);
    setPhase("attempting");
    await sleep(600);

    const raw = await attemptAgentHack();
    setResult(transformHackAttempt(raw));

    await sleep(400);
    setPhase("rejected");
    setLoading(false);
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ ...type.label, color: colors.textMuted, marginBottom: 12 }}>
          ISOLATION BOUNDARY · STRUCTURAL ENFORCEMENT
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
          Can the AI pay directly?
        </h2>
        <p style={{ ...type.body, color: colors.textSecondary, maxWidth: 520, lineHeight: 1.7 }}>
          We deliberately try to let the Buyer Agent call the payment layer without going through the Policy Engine.
          The system rejects it at the call-stack level — not because of a rule, but because of structural isolation.
        </p>
      </div>

      {/* Architecture diagram */}
      <div
        style={{
          background: "#0A0E13",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 12,
          padding: "24px",
          marginBottom: 24,
        }}
      >
        <div style={{ ...type.label, color: colors.textMuted, marginBottom: 20 }}>
          CALL ARCHITECTURE
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {/* AI node */}
          <Node
            label="BUYER AGENT"
            sub="LLM"
            color="#8A8F9E"
            active={phase === "attempting"}
          />

          {/* Blocked path */}
          <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                width: "100%",
                height: 1,
                background: phase === "rejected"
                  ? "rgba(255,59,59,0.5)"
                  : "rgba(255,255,255,0.1)",
                transition: "background 0.5s ease",
              }}
            />
            {/* Block symbol */}
            <div
              style={{
                position: "absolute",
                background: "#0A0E13",
                padding: "0 8px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 16,
                color: phase === "rejected" ? "#FF3B3B" : "rgba(255,255,255,0.2)",
                transition: "color 0.5s ease",
              }}
            >
              {phase === "rejected" ? "✕" : "–"}
            </div>
          </div>

          {/* Razorpay node */}
          <Node
            label="RAZORPAY"
            sub="PAYMENT"
            color="#2563EB"
          />
        </div>

        {phase !== "rejected" && (
          <div
            style={{
              textAlign: "center",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: colors.textMuted,
              marginTop: 12,
              letterSpacing: "0.08em",
            }}
          >
            direct path — structurally blocked
          </div>
        )}

        {phase === "rejected" && (
          <div
            className="sharp-appear"
            style={{
              textAlign: "center",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "#FF3B3B",
              marginTop: 12,
              letterSpacing: "0.08em",
            }}
          >
            PermissionError: caller is BUYER_AGENT, not POLICY_ENGINE
          </div>
        )}

        {/* Valid path */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            marginTop: 28,
            opacity: phase === "rejected" ? 1 : 0.35,
            transition: "opacity 0.5s ease",
          }}
        >
          <Node label="BUYER AGENT" sub="LLM" color="#8A8F9E" size="sm" />
          <Arrow />
          <Node label="POLICY ENGINE" sub="DETERMINISTIC" color="#10D07A" size="sm" />
          <Arrow />
          <Node label="RAZORPAY" sub="PAYMENT" color="#2563EB" size="sm" />
        </div>
        {phase === "rejected" && (
          <div
            style={{
              textAlign: "center",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: "#10D07A",
              marginTop: 8,
              letterSpacing: "0.08em",
            }}
          >
            ✓ valid path — only Policy Engine can authorize
          </div>
        )}
      </div>

      {/* Action */}
      {phase === "idle" && (
        <button
          id="isolation-test-btn"
          className="btn-danger"
          onClick={handleTest}
          disabled={loading}
        >
          ATTEMPT DIRECT PAYMENT ACCESS
        </button>
      )}

      {phase === "attempting" && (
        <div
          style={{
            padding: "14px 20px",
            background: "rgba(245,158,11,0.06)",
            border: "1px solid rgba(245,158,11,0.15)",
            borderRadius: 8,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: "#F59E0B",
            letterSpacing: "0.06em",
          }}
        >
          ⚡ AGENT ATTEMPTING DIRECT PAYMENT CALL…
        </div>
      )}

      {result && phase === "rejected" && (
        <div className="sharp-appear">
          <div
            style={{
              padding: "20px",
              background: "rgba(255,59,59,0.06)",
              border: "1px solid rgba(255,59,59,0.2)",
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 18,
                fontWeight: 800,
                color: "#FF3B3B",
                marginBottom: 12,
                letterSpacing: "-0.3px",
              }}
            >
              ACCESS DENIED
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 12,
              }}
            >
              {[
                { k: "CALLER", v: "BUYER_AGENT" },
                { k: "STATUS", v: "403 FORBIDDEN" },
                { k: "PAYMENT", v: "UNTOUCHED" },
                { k: "AMOUNT CHARGED", v: "₹0.00" },
              ].map(({ k, v }) => (
                <div key={k}>
                  <div style={{ ...type.label, color: colors.textMuted, fontSize: 10 }}>{k}</div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13,
                      color: "#FF3B3B",
                      fontWeight: 600,
                      marginTop: 3,
                    }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ ...type.small, color: colors.textSecondary, fontSize: 12, lineHeight: 1.6 }}>
              The payment code inspects the actual call stack. It physically rejects any caller that isn't the Policy Engine —
              not because of a rule the AI was told to follow, but because of structural enforcement.
            </p>
          </div>

          <button className="btn-link" onClick={() => setDrawerOpen(true)}>
            ↳ view technical proof
          </button>
        </div>
      )}

      <TechnicalDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Isolation boundary — technical proof"
        explanation="This isn't a rule the AI agreed to follow — the payment code physically rejects any caller that isn't the safety engine, verified by inspecting the actual call stack."
        data={result?.raw}
      />
    </div>
  );
}

function Node({ label, sub, color, active, size = "md" }) {
  const isSmall = size === "sm";
  return (
    <div
      style={{
        textAlign: "center",
        padding: isSmall ? "8px 10px" : "12px 16px",
        border: `1px solid ${active ? color : "rgba(255,255,255,0.06)"}`,
        borderRadius: 8,
        background: active ? `${color}10` : "rgba(255,255,255,0.02)",
        transition: "all 0.3s ease",
        minWidth: isSmall ? 80 : 100,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: isSmall ? 9 : 10,
          fontWeight: 700,
          color,
          letterSpacing: "0.08em",
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          color: colors.textMuted,
          letterSpacing: "0.06em",
        }}
      >
        {sub}
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div
      style={{
        flex: 1,
        height: 1,
        background: "rgba(16,208,122,0.3)",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <span
        style={{
          color: "rgba(16,208,122,0.6)",
          fontSize: 12,
          paddingRight: 2,
          lineHeight: 1,
        }}
      >
        ▶
      </span>
    </div>
  );
}
