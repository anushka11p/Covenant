import { useEffect, useRef, Suspense, lazy } from "react";
import Nav from "../components/Nav";
import Icon from "../components/shared/Icon";
import { useReveal } from "../hooks/useReveal";
import { colors, type } from "../theme";

const ClearanceGateScene = lazy(() => import("../components/3d/ClearanceGateScene"));

const FLOW_STEPS = [
  {
    num: "01",
    title: "AI PROPOSES",
    subtitle: "The buyer agent decides",
    body: "The AI agent reads catalog data, checks inventory, compares options, and proposes the optimal purchase. It acts with intelligence.",
    accent: "#8A8F9E",
  },
  {
    num: "02",
    title: "POLICY CLEARS",
    subtitle: "Deterministic verification",
    body: "Seven independent policy rules run. No marketing text. No LLM inference. Only structured facts checked against your signed Mandate.",
    accent: "#10D07A",
  },
  {
    num: "03",
    title: "RAZORPAY EXECUTES",
    subtitle: "Payment moves only after clearance",
    body: "The payment layer is structurally unreachable by the AI. Only the Policy Engine can authorize. The isolation is enforced at the call-stack level.",
    accent: "#2563EB",
  },
];

const MANDATE_FIELDS = [
  { key: "MERCHANT", val: "Bramble & Co.", color: "#8A8F9E" },
  { key: "CATEGORY", val: "Pet Food · Pet Treats", color: "#8A8F9E" },
  { key: "LIMIT / PURCHASE", val: "₹2,500", color: "#10D07A" },
  { key: "MONTHLY LIMIT", val: "₹6,000", color: "#10D07A" },
  { key: "HARD EXCLUSION", val: "CHICKEN (allergen)", color: "#FF3B3B" },
  { key: "STATUS", val: "ACTIVE", color: "#10D07A" },
  { key: "SIGNATURE", val: "HMAC-SHA256 · verified", color: "#F59E0B" },
];

function Noise() {
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.025,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}

function GridLines() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
        zIndex: 0,
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 100%)",
      }}
    />
  );
}

function FlowDiagram({ onEnterDemo }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        flexWrap: "wrap",
        rowGap: 20,
      }}
    >
      {/* AI */}
      <div style={{ textAlign: "center", padding: "20px 28px" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(138,143,158,0.1)",
            border: "1px solid rgba(138,143,158,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
          }}
        >
          <Icon name="bot" size={22} color="#8A8F9E" strokeWidth={1.5} />
        </div>
        <div style={{ ...type.label, color: "#8A8F9E", marginBottom: 4 }}>BUYER AGENT</div>
        <div style={{ ...type.small, color: colors.textMuted, fontSize: 12 }}>PROPOSES</div>
      </div>

      {/* Arrow */}
      <Arrow />

      {/* Policy */}
      <div style={{ textAlign: "center", padding: "20px 28px" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(16,208,122,0.08)",
            border: "1px solid rgba(16,208,122,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
            boxShadow: "0 0 20px rgba(16,208,122,0.1)",
          }}
        >
          <Icon name="scale" size={22} color="#10D07A" strokeWidth={1.5} />
        </div>
        <div style={{ ...type.label, color: "#10D07A", marginBottom: 4 }}>POLICY ENGINE</div>
        <div style={{ ...type.small, color: colors.textMuted, fontSize: 12 }}>VALIDATES</div>
      </div>

      {/* Arrow */}
      <Arrow />

      {/* Razorpay */}
      <div style={{ textAlign: "center", padding: "20px 28px" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(37,99,235,0.08)",
            border: "1px solid rgba(37,99,235,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
            boxShadow: "0 0 20px rgba(37,99,235,0.1)",
          }}
        >
          <Icon name="card" size={22} color="#4A80E8" strokeWidth={1.5} />
        </div>
        <div style={{ ...type.label, color: "#4A80E8", marginBottom: 4 }}>RAZORPAY</div>
        <div style={{ ...type.small, color: colors.textMuted, fontSize: 12 }}>EXECUTES</div>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 4px",
        color: "rgba(255,255,255,0.15)",
        fontSize: 18,
        letterSpacing: 2,
      }}
    >
      ──→
    </div>
  );
}

export default function OverviewPage({ activeNav, onNavigate }) {
  useReveal();
  const heroRef = useRef();

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <Nav active={activeNav} onNavigate={onNavigate} />

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 24px 60px",
          overflow: "hidden",
        }}
      >
        <Noise />
        <GridLines />

        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(16,208,122,0.06) 0%, transparent 70%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* 3D Scene — behind text */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: 700,
            zIndex: 1,
            opacity: 0.7,
            pointerEvents: "none",
          }}
        >
          <Suspense fallback={null}>
            <ClearanceGateScene height={420} />
          </Suspense>
        </div>

        {/* Content — above 3D */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: 900 }}>
          <div className="reveal" style={{ marginBottom: 24 }}>
            <span
              style={{
                ...type.label,
                color: "#10D07A",
                background: "rgba(16,208,122,0.08)",
                border: "1px solid rgba(16,208,122,0.2)",
                borderRadius: 4,
                padding: "6px 14px",
                display: "inline-block",
              }}
            >
              RAZORPAY AI BUILDATHON · TRACK 01
            </span>
          </div>

          <h1
            className="reveal"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(52px, 10vw, 100px)",
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: "-3px",
              color: colors.textPrimary,
              marginBottom: 24,
            }}
          >
            THE AI
            <br />
            <span style={{ color: "rgba(255,255,255,0.25)" }}>CAN BE</span>
            <br />
            FOOLED.
          </h1>

          <div
            className="reveal"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(52px, 10vw, 100px)",
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: "-3px",
              color: "#10D07A",
              marginBottom: 48,
            }}
          >
            THE PAYMENT
            <br />
            <span style={{ color: "rgba(16,208,122,0.5)" }}>CAN'T.</span>
          </div>

          <p
            className="reveal"
            style={{
              ...type.body,
              color: colors.textSecondary,
              maxWidth: 500,
              margin: "0 auto 48px",
              fontSize: 17,
              lineHeight: 1.7,
            }}
          >
            A deterministic clearance layer between an AI shopping agent and Razorpay.
            The AI proposes. The Policy Engine independently validates.
            Only then does payment move.
          </p>

          <div
            className="reveal"
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              id="hero-enter-demo"
              className="btn-primary"
              onClick={() => onNavigate("demo")}
              style={{ fontSize: 15, padding: "16px 40px" }}
            >
              ENTER DEMO
            </button>
            <button
              id="hero-view-revenue"
              className="btn-ghost"
              onClick={() => onNavigate("revenue")}
            >
              VIEW REVENUE
            </button>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              ...type.label,
              color: "rgba(255,255,255,0.2)",
              fontSize: 10,
              letterSpacing: "0.2em",
            }}
          >
            SCROLL
          </div>
          <div
            style={{
              width: 1,
              height: 40,
              background: "linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)",
            }}
          />
        </div>
      </section>

      {/* ── FLOW DIAGRAM ── */}
      <section
        style={{
          padding: "100px 24px",
          background: colors.surface,
          borderTop: "1px solid rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div
            className="reveal"
            style={{ ...type.label, color: colors.textMuted, textAlign: "center", marginBottom: 48 }}
          >
            HOW COVENANT WORKS
          </div>
          <div className="reveal">
            <FlowDiagram onEnterDemo={() => onNavigate("demo")} />
          </div>
        </div>
      </section>

      {/* ── EDITORIAL STORY SECTIONS ── */}
      <section style={{ padding: "120px 24px", maxWidth: 1000, margin: "0 auto" }}>
        {FLOW_STEPS.map((step, i) => (
          <div
            key={step.num}
            className="reveal"
            style={{
              display: "grid",
              gridTemplateColumns: i % 2 === 0 ? "1fr 2fr" : "2fr 1fr",
              gap: 60,
              alignItems: "center",
              marginBottom: 100,
              direction: i % 2 === 0 ? "ltr" : "ltr",
            }}
          >
            {i % 2 !== 0 && <div />}
            <div style={{ order: i % 2 !== 0 ? 1 : 0 }}>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 96,
                  fontWeight: 800,
                  color: "rgba(255,255,255,0.04)",
                  lineHeight: 1,
                  marginBottom: -24,
                  userSelect: "none",
                }}
              >
                {step.num}
              </div>
              <div
                style={{
                  ...type.label,
                  color: step.accent,
                  marginBottom: 12,
                }}
              >
                {step.title}
              </div>
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 36,
                  fontWeight: 700,
                  color: colors.textPrimary,
                  letterSpacing: "-1px",
                  marginBottom: 20,
                  lineHeight: 1.1,
                }}
              >
                {step.subtitle}
              </h2>
              <p
                style={{
                  ...type.body,
                  color: colors.textSecondary,
                  lineHeight: 1.75,
                  maxWidth: 440,
                }}
              >
                {step.body}
              </p>
            </div>
            {i % 2 !== 0 && <div />}
          </div>
        ))}
      </section>

      {/* ── MANDATE VISUALIZATION ── */}
      <section
        style={{
          padding: "100px 24px",
          background: colors.surface,
          borderTop: "1px solid rgba(255,255,255,0.04)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div
            className="reveal"
            style={{ ...type.label, color: colors.textMuted, marginBottom: 8 }}
          >
            AUTHORIZATION ARTIFACT
          </div>
          <h2
            className="reveal"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 40,
              fontWeight: 800,
              color: colors.textPrimary,
              letterSpacing: "-1.5px",
              marginBottom: 16,
            }}
          >
            The Mandate
          </h2>
          <p
            className="reveal"
            style={{
              ...type.body,
              color: colors.textSecondary,
              marginBottom: 48,
              maxWidth: 480,
            }}
          >
            A cryptographically signed authorization document. It defines exactly what the AI is allowed to purchase — and what is absolutely forbidden.
          </p>

          {/* Mandate card */}
          <div
            className="reveal"
            style={{
              background: "#0A0E13",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "20px 28px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  color: "#10D07A",
                  letterSpacing: "0.1em",
                }}
              >
                MANDATE · v1 · ACTIVE
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: "#F59E0B",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#F59E0B",
                    boxShadow: "0 0 6px rgba(245,158,11,0.6)",
                  }}
                />
                HMAC-SHA256 · SIGNED
              </div>
            </div>

            {/* Fields */}
            <div style={{ padding: "8px 0" }}>
              {MANDATE_FIELDS.map((field, i) => (
                <div
                  key={field.key}
                  className="stagger-child"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 28px",
                    borderBottom: i < MANDATE_FIELDS.length - 1
                      ? "1px solid rgba(255,255,255,0.03)"
                      : "none",
                    transitionDelay: `${i * 60}ms`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      color: colors.textMuted,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {field.key}
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13,
                      color: field.color,
                      fontWeight: 600,
                    }}
                  >
                    {field.val}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ATTACK PREVIEW ── */}
      <section style={{ padding: "120px 24px", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <div
          className="reveal"
          style={{ ...type.label, color: "#FF3B3B", marginBottom: 20 }}
        >
          ⚠ LIVE ATTACK SCENARIO AVAILABLE
        </div>
        <h2
          className="reveal"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 800,
            color: colors.textPrimary,
            letterSpacing: "-2px",
            marginBottom: 24,
            lineHeight: 1.05,
          }}
        >
          Watch an adversarial attack
          <br />
          get stopped in real time.
        </h2>
        <p
          className="reveal"
          style={{
            ...type.body,
            color: colors.textSecondary,
            maxWidth: 500,
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          A product listing contains malicious merchandising text.
          The AI reads it and gets tricked. The Policy Engine ignores marketing copy and checks structured allergen data.
          It blocks the transaction before Razorpay is touched.
        </p>
        <div className="reveal">
          <button
            id="overview-enter-demo"
            className="btn-primary"
            onClick={() => onNavigate("demo")}
            style={{ fontSize: 15, padding: "18px 48px" }}
          >
            ENTER DEMO
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.04)",
          padding: "32px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1200,
          margin: "0 auto",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: colors.textMuted,
            letterSpacing: "0.1em",
          }}
        >
          COVENANT · AI TRUST LAYER
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: colors.textMuted,
            letterSpacing: "0.1em",
          }}
        >
          BUILT ON RAZORPAY · TEST MODE · NO REAL PAYMENTS
        </div>
      </footer>
    </div>
  );
}
