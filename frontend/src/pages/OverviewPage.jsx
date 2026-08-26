import { useState, useEffect } from "react";
import { colors, type, shadow } from "../theme";
import { getCatalog } from "../api";
import Nav from "../components/Nav";

function FloatingBadge({ text, accent }) {
  return (
    <div style={{
      background: accent ? colors.accentSoft : "#fff",
      border: `1px solid ${colors.border}`, borderRadius: 999,
      padding: "12px 20px", fontSize: 13, fontWeight: 600,
      color: accent ? colors.accent : colors.textPrimary,
      boxShadow: shadow.soft, whiteSpace: "nowrap",
    }}>
      {text}
    </div>
  );
}

export default function OverviewPage({ merchantId, onStartDemo, activeNav, onNavigate }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    getCatalog(merchantId).then((raw) => setPreview(raw.products.slice(0, 3)));
  }, [merchantId]);

  return (
    <div>
      <Nav active={activeNav} onNavigate={onNavigate} />

      <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: -100, right: -200, width: 900, height: 700,
          background: "radial-gradient(ellipse at center, rgba(61,90,254,0.06) 0%, rgba(61,90,254,0) 65%)",
          pointerEvents: "none",
        }} />

        <div style={{ padding: "72px 56px 0", display: "flex", gap: 72, alignItems: "flex-start", position: "relative" }}>
          <div style={{ flex: 1, paddingTop: 40 }}>
            <div style={{ ...type.label, color: colors.textMuted }}>BRAMBLE &amp; CO.</div>
            <h1 style={{ ...type.headline, color: colors.textPrimary, marginTop: 14 }}>
              <span style={{ color: colors.accent }}>AI-powered commerce</span>,<br />
              with money under control.
            </h1>
            <p style={{ ...type.body, color: colors.textSecondary, marginTop: 20, maxWidth: 420 }}>
              Let AI shop for your customers. Every purchase is checked before payment.
            </p>
            <button
              onClick={onStartDemo}
              style={{
                marginTop: 32, padding: "14px 28px", background: colors.accent, color: "#fff",
                border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 8px 24px rgba(61,90,254,0.25)",
              }}
            >
              Start Demo
            </button>
          </div>

          {/* Wider wrapper with generous fixed clearance so badges cannot overlap the card regardless of its rendered height */}
          <div style={{ width: 460, position: "relative", paddingTop: 60, paddingBottom: 40 }}>
            <div style={{ position: "absolute", top: 0, left: -20, zIndex: 2 }}>
              <FloatingBadge text="100% purchases protected" />
            </div>

            <div style={{
              marginTop: 50, background: colors.surfaceRaised, border: `1px solid ${colors.border}`,
              borderRadius: 16, padding: 28, boxShadow: shadow.raised, position: "relative",
            }}>
              <div style={{ ...type.label, color: colors.textMuted, marginBottom: 16 }}>LIVE CATALOG</div>
              {preview ? preview.map((p) => (
                <div key={p.sku} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${colors.border}` }}>
                  <span style={{ ...type.body, color: colors.textPrimary, fontWeight: 600 }}>{p.name}</span>
                  <span style={{ ...type.body, color: colors.textSecondary }}>₹{(p.price_paise / 100).toFixed(0)}</span>
                </div>
              )) : <div style={{ color: colors.textMuted, fontSize: 13 }}>Loading…</div>}
            </div>

            <div style={{ position: "absolute", bottom: 0, right: -20, zIndex: 2 }}>
              <FloatingBadge text="Attacks blocked: 1" accent />
            </div>
          </div>
        </div>

        {/* Flow strip — full width, matches reference's bottom utility bar structurally */}
        <div style={{
          margin: "64px 56px 0", padding: "24px 32px", background: colors.surface,
          border: `1px solid ${colors.border}`, borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ ...type.small, color: colors.textMuted, fontWeight: 600 }}>HOW IT WORKS</span>
          <div style={{ display: "flex", gap: 0 }}>
            {["Catalog", "Permission", "AI Decision", "Verification", "Payment"].map((step, i, arr) => (
              <div key={step} style={{ display: "flex", alignItems: "center" }}>
                <span style={{ ...type.small, color: colors.textPrimary, fontWeight: 600 }}>{step}</span>
                {i < arr.length - 1 && <span style={{ color: colors.border, margin: "0 16px" }}>→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Second content section — three real metric blocks, filling the page like the reference's density */}
        <div style={{ padding: "80px 56px", display: "flex", gap: 24 }}>
          <MetricBlock value="₹5,750" label="Revenue from autonomous purchasing" />
          <MetricBlock value="100%" label="Purchases independently verified" />
          <MetricBlock value="1" label="Manipulation attempt blocked live" />
        </div>

        {/* Trust strip, matching reference's bottom logo row structurally */}
        <div style={{ padding: "0 56px 64px", borderTop: `1px solid ${colors.border}`, paddingTop: 32, textAlign: "center" }}>
          <div style={{ ...type.small, color: colors.textMuted }}>BUILT ON RAZORPAY · TEST MODE · NO REAL PAYMENTS</div>
        </div>
      </div>
    </div>
  );
}

function MetricBlock({ value, label }) {
  return (
    <div style={{ flex: 1, padding: 28, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 12 }}>
      <div style={{ ...type.headline, fontSize: 34, color: colors.textPrimary }}>{value}</div>
      <div style={{ ...type.small, color: colors.textSecondary, marginTop: 8 }}>{label}</div>
    </div>
  );
}
