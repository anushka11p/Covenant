import { useEffect } from "react";
import { colors, type, shadow } from "../theme";
import Nav from "../components/Nav";
import { useReveal } from "../hooks/useReveal";

export default function OverviewPage({ activeNav, onNavigate }) {
  useReveal();

  return (
    <div style={{ background: colors.bg, minHeight: "100vh" }}>
      <Nav active={activeNav} onNavigate={onNavigate} />

      {/* HERO */}
      <section style={{
        padding: "100px 24px 80px", textAlign: "center", maxWidth: 900, margin: "0 auto",
      }}>
        <div className="reveal" style={{ ...type.label, color: colors.textMuted, marginBottom: 20 }}>
          BRAMBLE & CO. · POWERED BY COVENANT
        </div>
        <h1 className="reveal" style={{ ...type.headline, color: colors.textPrimary, marginBottom: 24 }}>
          AI-powered commerce,<br />with money under control.
        </h1>
        <p className="reveal" style={{
          ...type.body, color: colors.textSecondary, maxWidth: 520, margin: "0 auto 36px", fontSize: 18,
        }}>
          Let AI reorder for your customers. Every rupee is independently verified before payment moves.
        </p>
        <div className="reveal" style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center" }}>
          <button className="btn-primary" onClick={() => onNavigate("demo")}>
            Start Demo
          </button>
          <button className="btn-ghost" onClick={() => onNavigate("revenue")}>
            See revenue impact
          </button>
        </div>
      </section>

      {/* BIG METRIC CARD — RothFinder style */}
      <section className="reveal" style={{ padding: "80px 24px 80px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{
          background: colors.accentSoft, borderRadius: 20, padding: "36px 40px",
          border: `1px solid ${colors.border}`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
            <div style={{ ...type.financial, fontSize: 48, color: colors.textPrimary, letterSpacing: -1 }}>
              ₹5,750
            </div>
            <div style={{ ...type.small, color: colors.textSecondary, fontWeight: 600, textAlign: "right" }}>
              With Covenant<br />autonomous agent
            </div>
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16,
            borderTop: `1px solid ${colors.border}`, paddingTop: 20,
          }}>
            <div>
              <div style={{ ...type.financial, fontSize: 20, color: colors.textPrimary }}>+₹1,550</div>
              <div style={{ ...type.small, color: colors.textMuted }}>Extra revenue</div>
            </div>
            <div>
              <div style={{ ...type.financial, fontSize: 20, color: colors.textPrimary }}>100%</div>
              <div style={{ ...type.small, color: colors.textMuted }}>Verified purchases</div>
            </div>
            <div>
              <div style={{ ...type.financial, fontSize: 20, color: colors.textPrimary }}>1</div>
              <div style={{ ...type.small, color: colors.textMuted }}>Attack blocked live</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="reveal" style={{ padding: "0 24px 100px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ ...type.label, color: colors.textMuted, marginBottom: 16, textAlign: "center" }}>
          HOW IT WORKS
        </div>
        <div style={{
          display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8, alignItems: "center",
          background: colors.surface, borderRadius: 999, padding: "14px 28px",
          border: `1px solid ${colors.border}`,
        }}>
          {["Catalog", "Permission", "AI Decision", "Verification", "Payment"].map((s, i, arr) => (
            <span key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: colors.textPrimary }}>{s}</span>
              {i < arr.length - 1 && <span style={{ color: colors.textMuted }}>→</span>}
            </span>
          ))}
        </div>
      </section>

      <div style={{
        padding: "28px", borderTop: `1px solid ${colors.border}`, textAlign: "center",
      }}>
        <div style={{ ...type.small, color: colors.textMuted, fontWeight: 600 }}>
          BUILT ON RAZORPAY · TEST MODE · NO REAL PAYMENTS
        </div>
      </div>
    </div>
  );
}
