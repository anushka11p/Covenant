import { useState, useEffect } from "react";
import { colors, type, shadow } from "../theme";
import { getCatalog } from "../api";
import Nav from "../components/Nav";
import ProductVisual from "../components/ProductVisual";

export default function OverviewPage({ merchantId, activeNav, onNavigate }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    getCatalog(merchantId).then((raw) => setPreview(raw.products.slice(0, 1)));
  }, [merchantId]);

  return (
    <div>
      <Nav active={activeNav} onNavigate={onNavigate} />

      <div style={{ padding: "72px 56px", display: "flex", gap: 72, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <div style={{ ...type.label, color: colors.textMuted }}>BRAMBLE &amp; CO.</div>
          <h1 style={{ ...type.headline, color: colors.textPrimary, marginTop: 14 }}>
            AI-powered commerce,<br />with money under control.
          </h1>
          <p style={{ ...type.body, color: colors.textSecondary, marginTop: 20, maxWidth: 420 }}>
            Let AI shop for your customers. Every purchase is independently verified before payment.
          </p>
          <button
            onClick={() => onNavigate("shop")}
            style={{
              marginTop: 32, padding: "14px 28px", background: colors.verify, color: "#fff",
              border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer",
              boxShadow: shadow.soft,
            }}
          >
            Start Demo
          </button>
        </div>

        <div>
          {preview ? (
            <ProductVisual name={preview[0].name} price={`₹${(preview[0].price_paise / 100).toFixed(0)}`} verified />
          ) : (
            <div style={{ color: colors.textMuted, fontSize: 13 }}>Loading…</div>
          )}
        </div>
      </div>

      <div style={{
        margin: "0 56px 64px", padding: "24px 32px", background: colors.surface,
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

      <div style={{ padding: "0 56px 80px", display: "flex", gap: 24 }}>
        <MetricBlock value="₹5,750" label="Revenue from autonomous purchasing" />
        <MetricBlock value="100%" label="Purchases independently verified" />
        <MetricBlock value="1" label="Manipulation attempt blocked live" />
      </div>

      <div style={{ padding: "0 56px 56px", borderTop: `1px solid ${colors.border}`, paddingTop: 28, textAlign: "center" }}>
        <div style={{ ...type.small, color: colors.textMuted }}>BUILT ON RAZORPAY · TEST MODE · NO REAL PAYMENTS</div>
      </div>
    </div>
  );
}

function MetricBlock({ value, label }) {
  return (
    <div style={{ flex: 1, padding: 24, background: "#fff", border: `1px solid ${colors.border}`, borderRadius: 12, boxShadow: colors.shadow?.soft }}>
      <div style={{ ...type.headline, fontSize: 32, color: colors.textPrimary }}>{value}</div>
      <div style={{ ...type.small, color: colors.textSecondary, marginTop: 8 }}>{label}</div>
    </div>
  );
}
