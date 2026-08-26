import { useState } from "react";
import MetricCard from "./shared/MetricCard";
import CatalogStation from "./stations/CatalogStation";
import MandateStation from "./stations/MandateStation";
import AIDecisionStation from "./stations/AIDecisionStation";
import AttackStation from "./stations/AttackStation";
import AuditStation from "./stations/AuditStation";
import RevenueStation from "./stations/RevenueStation";
import IsolationProofStation from "./stations/IsolationProofStation";

const MERCHANT_ID = 1;
const PRINCIPAL_ID = 1;

const STATIONS = [
  { key: "catalog", label: "Catalog" },
  { key: "mandate", label: "Permission" },
  { key: "decision", label: "AI Decision" },
  { key: "attack", label: "Attack Test" },
  { key: "audit", label: "Audit" },
  { key: "revenue", label: "Revenue" },
  { key: "isolation", label: "Safety Lock" },
];

export default function Dashboard() {
  const [activeStation, setActiveStation] = useState("catalog");
  const [mandateId, setMandateId] = useState(null);
  const [attackHappened, setAttackHappened] = useState(false);

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: "#08080b", color: "#f2f2f5", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Ambient glow, Razorpay-hero-inspired but dark-mode */}
      <div style={{
        position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)",
        width: 900, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(80,90,255,0.18) 0%, rgba(80,90,255,0) 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "48px 24px", position: "relative" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#8a8aff", fontSize: 13, letterSpacing: 2, fontWeight: 600 }}>BRAMBLE &amp; CO.</div>
          <h1 style={{ fontSize: 44, fontWeight: 800, margin: "12px 0", lineHeight: 1.1 }}>
            <span style={{ color: "#8a8aff" }}>AI Commerce</span>{" "}
            <span style={{ color: "#f2f2f5" }}>Protection</span>
          </h1>
          <p style={{ color: "#9a9aa5", fontSize: 17, maxWidth: 460, margin: "0 auto" }}>
            Let AI shop for your customers. Keep every rupee under control.
          </p>
        </div>

        {/* Floating pill metric badges, Razorpay-hero-callout style */}
        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", margin: "40px 0" }}>
          <Pill label="AI Revenue" value="₹5,750" accent="#4caf50" />
          <Pill label="Purchases Protected" value="100%" accent="#8a8aff" />
          <Pill label="Attacks Blocked" value={attackHappened ? "1" : "0"} accent="#e05252" />
        </div>

        {/* Station nav — pill buttons, solid active fill like Razorpay's active nav state */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 32 }}>
          {STATIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveStation(s.key)}
              style={{
                padding: "10px 20px", borderRadius: 999, border: "none", cursor: "pointer",
                fontSize: 14, fontWeight: 600, transition: "all 0.2s",
                background: activeStation === s.key ? "#5a5aff" : "#17171d",
                color: activeStation === s.key ? "#fff" : "#8a8a95",
                boxShadow: activeStation === s.key ? "0 4px 16px rgba(90,90,255,0.35)" : "none",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Main content card — larger radius, softer border, subtle depth */}
        <div style={{
          background: "#111116", borderRadius: 24, padding: 36,
          border: "1px solid #1e1e26", boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}>
          {activeStation === "catalog" && <CatalogStation merchantId={MERCHANT_ID} revealCompromised={attackHappened} />}
          {activeStation === "mandate" && (
            <MandateStation principalId={PRINCIPAL_ID} merchantId={MERCHANT_ID} onCreated={(m) => setMandateId(m.mandate_id)} />
          )}
          {activeStation === "decision" && <AIDecisionStation mandateId={mandateId} />}
          {activeStation === "attack" && (
            <AttackStation mandateId={mandateId} onCompleted={() => setAttackHappened(true)} />
          )}
          {activeStation === "audit" && <AuditStation mandateId={mandateId} />}
          {activeStation === "revenue" && <RevenueStation merchantId={MERCHANT_ID} />}
          {activeStation === "isolation" && <IsolationProofStation />}
        </div>

        {!mandateId && activeStation !== "catalog" && activeStation !== "mandate" && activeStation !== "isolation" && (
          <div style={{ color: "#f0a500", fontSize: 13, marginTop: 14, textAlign: "center" }}>
            Create a permission first (see "Permission" tab) before trying this station.
          </div>
        )}

        {/* Trust strip, Razorpay-logo-row-inspired */}
        <div style={{ textAlign: "center", marginTop: 56, paddingTop: 24, borderTop: "1px solid #1a1a20" }}>
          <div style={{ color: "#4a4a55", fontSize: 12, letterSpacing: 1 }}>
            POWERED BY RAZORPAY · TEST MODE · NO REAL PAYMENTS
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ label, value, accent }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: "#15151c", borderRadius: 999, padding: "10px 20px",
      border: "1px solid #26262e", boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
    }}>
      <span style={{ color: accent, fontSize: 18, fontWeight: 800 }}>{value}</span>
      <span style={{ color: "#8a8a95", fontSize: 13 }}>{label}</span>
    </div>
  );
}
