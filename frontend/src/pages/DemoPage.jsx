import { useState } from "react";
import Nav from "../components/Nav";
import CatalogStation from "../components/stations/CatalogStation";
import MandateStation from "../components/stations/MandateStation";
import AIDecisionStation from "../components/stations/AIDecisionStation";
import AttackStation from "../components/stations/AttackStation";
import AuditStation from "../components/stations/AuditStation";
import IsolationProofStation from "../components/stations/IsolationProofStation";
import RevenueStation from "../components/stations/RevenueStation";
import { useReveal } from "../hooks/useReveal";
import { colors, type } from "../theme";

const MERCHANT_ID = 1;
const PRINCIPAL_ID = 1;

const STEPS = [
  { id: "catalog", num: "01", label: "THE CATALOG", desc: "Merchant products with one hidden adversarial listing" },
  { id: "mandate", num: "02", label: "THE MANDATE", desc: "Sign the authorization document" },
  { id: "decision", num: "03", label: "AI DECIDES", desc: "Buyer agent proposes a purchase" },
  { id: "attack", num: "04", label: "ATTACK SCENARIO", desc: "AI gets tricked. Policy blocks it. Recovery." },
  { id: "isolation", num: "05", label: "ISOLATION PROOF", desc: "Can the AI pay directly? No." },
  { id: "audit", num: "06", label: "AUDIT TRAIL", desc: "The immutable ledger of everything" },
  { id: "revenue", num: "07", label: "REVENUE IMPACT", desc: "The business case for autonomous commerce" },
];

export default function DemoPage({ activeNav, onNavigate }) {
  useReveal();
  const [mandateId, setMandateId] = useState(null);
  const [attackHappened, setAttackHappened] = useState(false);
  const [activeStep, setActiveStep] = useState("catalog");

  function handleAttackCompleted() {
    setAttackHappened(true);
  }

  function scrollTo(id) {
    setActiveStep(id);
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div style={{ background: colors.bg, minHeight: "100vh" }}>
      <Nav active={activeNav} onNavigate={onNavigate} />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: 0,
          minHeight: "100vh",
          paddingTop: 68,
        }}
      >
        {/* ── Sidebar navigation ── */}
        <div
          style={{
            position: "sticky",
            top: 68,
            height: "calc(100vh - 68px)",
            overflowY: "auto",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            padding: "40px 24px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ ...type.label, color: colors.textMuted, marginBottom: 24 }}>
            DEMO SEQUENCE
          </div>

          {STEPS.map((step, i) => {
            const isActive = activeStep === step.id;
            const isPast = STEPS.findIndex((s) => s.id === activeStep) > i;

            return (
              <button
                key={step.id}
                onClick={() => scrollTo(step.id)}
                style={{
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  padding: "12px 0",
                  borderBottom: i < STEPS.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  opacity: isActive ? 1 : 0.6,
                  transition: "opacity 0.15s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.opacity = "0.6"; }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: isActive ? "#10D07A" : isPast ? "#3D4452" : colors.textMuted,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {step.num}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                      color: isActive ? colors.textPrimary : colors.textSecondary,
                      letterSpacing: "0.05em",
                      marginBottom: 2,
                    }}
                  >
                    {step.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 11,
                      color: colors.textMuted,
                      lineHeight: 1.4,
                    }}
                  >
                    {step.desc}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Mandate status */}
          <div style={{ marginTop: "auto", paddingTop: 24 }}>
            <div
              style={{
                padding: "12px 14px",
                background: mandateId ? "rgba(16,208,122,0.06)" : "rgba(255,255,255,0.02)",
                border: mandateId ? "1px solid rgba(16,208,122,0.15)" : "1px solid rgba(255,255,255,0.05)",
                borderRadius: 8,
              }}
            >
              <div style={{ ...type.label, fontSize: 9, color: mandateId ? "#10D07A" : colors.textMuted, marginBottom: 4 }}>
                MANDATE
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: mandateId ? "#10D07A" : colors.textMuted,
                }}
              >
                {mandateId ? `ID: ${mandateId}` : "Not created"}
              </div>
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{ padding: "40px 48px 100px" }}>

          {/* Page header */}
          <div className="reveal" style={{ marginBottom: 60 }}>
            <div style={{ ...type.label, color: "#10D07A", marginBottom: 16 }}>
              LIVE SYSTEM DEMONSTRATION
            </div>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 800,
                color: colors.textPrimary,
                letterSpacing: "-2px",
                lineHeight: 1.0,
                marginBottom: 20,
              }}
            >
              Covenant Demo
            </h1>
            <p
              style={{
                ...type.body,
                color: colors.textSecondary,
                maxWidth: 500,
                lineHeight: 1.75,
              }}
            >
              Follow the sequence. Create a mandate, let the AI propose, watch an adversarial attack get blocked,
              verify the isolation boundary, and inspect the audit trail.
            </p>
          </div>

          {/* Sections */}
          <DemoSection
            id="catalog"
            step="01"
            label="THE CATALOG"
            onView={() => setActiveStep("catalog")}
          >
            <CatalogStation merchantId={MERCHANT_ID} revealCompromised={attackHappened} />
          </DemoSection>

          <DemoSection
            id="mandate"
            step="02"
            label="THE MANDATE"
            onView={() => setActiveStep("mandate")}
          >
            <MandateStation
              principalId={PRINCIPAL_ID}
              merchantId={MERCHANT_ID}
              onCreated={(m) => setMandateId(m.mandate_id)}
            />
          </DemoSection>

          <DemoSection
            id="decision"
            step="03"
            label="AI DECIDES"
            onView={() => setActiveStep("decision")}
          >
            <AIDecisionStation mandateId={mandateId} />
          </DemoSection>

          <DemoSection
            id="attack"
            step="04"
            label="ATTACK SCENARIO"
            highlight
            onView={() => setActiveStep("attack")}
          >
            <AttackStation mandateId={mandateId} onCompleted={handleAttackCompleted} />
          </DemoSection>

          <DemoSection
            id="isolation"
            step="05"
            label="ISOLATION PROOF"
            onView={() => setActiveStep("isolation")}
          >
            <IsolationProofStation />
          </DemoSection>

          <DemoSection
            id="audit"
            step="06"
            label="AUDIT TRAIL"
            onView={() => setActiveStep("audit")}
          >
            <AuditStation mandateId={mandateId} />
          </DemoSection>

          <DemoSection
            id="revenue"
            step="07"
            label="REVENUE IMPACT"
            onView={() => setActiveStep("revenue")}
          >
            <RevenueStation merchantId={MERCHANT_ID} />
          </DemoSection>

          {/* Footer prompt */}
          <div
            style={{
              marginTop: 60,
              padding: "28px 32px",
              background: "rgba(16,208,122,0.04)",
              border: "1px solid rgba(16,208,122,0.12)",
              borderRadius: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ ...type.label, color: "#10D07A", fontSize: 10, marginBottom: 6 }}>
                DEMONSTRATION COMPLETE
              </div>
              <p style={{ ...type.body, color: colors.textSecondary, fontSize: 15 }}>
                Security enables autonomous commerce. That&apos;s the Covenant thesis.
              </p>
            </div>
            <button
              className="btn-primary"
              onClick={() => onNavigate("revenue")}
            >
              VIEW REVENUE PAGE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoSection({ id, step, label, children, highlight, onView }) {
  return (
    <div
      id={`section-${id}`}
      className="reveal"
      style={{
        scrollMarginTop: 100,
        marginBottom: 60,
      }}
    >
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: highlight ? "#FF3B3B" : "#10D07A",
            fontWeight: 700,
            letterSpacing: "0.12em",
            background: highlight ? "rgba(255,59,59,0.06)" : "rgba(16,208,122,0.06)",
            border: highlight ? "1px solid rgba(255,59,59,0.15)" : "1px solid rgba(16,208,122,0.12)",
            borderRadius: 4,
            padding: "4px 10px",
          }}
        >
          {step}
        </div>
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: colors.textSecondary,
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </div>
        {highlight && (
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "#FF3B3B",
              background: "rgba(255,59,59,0.06)",
              border: "1px solid rgba(255,59,59,0.15)",
              borderRadius: 4,
              padding: "3px 8px",
              letterSpacing: "0.1em",
            }}
          >
            ⚠ CENTERPIECE
          </div>
        )}
      </div>

      {/* Card */}
      <div
        className="station-card"
        style={{
          borderColor: highlight ? "rgba(255,59,59,0.1)" : "rgba(255,255,255,0.06)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
