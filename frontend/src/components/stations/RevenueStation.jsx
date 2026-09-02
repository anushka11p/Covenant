import { useState, useEffect } from "react";
import { getRevenue } from "../../api";
import { transformRevenue } from "../../domain/presentationTransforms";
import { colors, type, shadow } from "../../theme";

export default function RevenueStation({ merchantId }) {
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animatedDelta, setAnimatedDelta] = useState(0);

  async function handleLoad() {
    setLoading(true);
    const raw = await getRevenue(merchantId);
    const transformed = transformRevenue(raw);
    setRevenue(transformed);
    setLoading(false);
  }

  useEffect(() => {
    if (!revenue) return;
    const target = revenue.delta;
    const duration = 800;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
        setAnimatedDelta(target);
        clearInterval(interval);
      } else {
        setAnimatedDelta(current);
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [revenue]);

  return (
    <div>
      <h2 style={{ ...type.h2, color: colors.textPrimary }}>Check Merchant Impact</h2>
      <p style={{ ...type.body, color: colors.textSecondary }}>Does this actually help Bramble & Co.?</p>
      <button onClick={handleLoad} disabled={loading} className="btn-primary">
        {loading ? "Loading…" : "Load Revenue Impact"}
      </button>

      {revenue && (
        <div className="step-card">
          <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
            <div style={{ flex: 1, padding: 20, borderRadius: 12, background: colors.surface, border: `1px solid ${colors.border}`, textAlign: "center", boxShadow: shadow.soft }}>
              <div style={{ ...type.label, color: colors.textMuted }}>WITHOUT AI BUYER</div>
              <div style={{ ...type.financial, fontSize: 28, color: colors.textPrimary, marginTop: 6 }}>₹{revenue.withoutAI.toFixed(0)}</div>
            </div>
            <div style={{ flex: 1, padding: 20, borderRadius: 12, background: colors.successSoft, border: `1px solid ${colors.success}`, textAlign: "center", boxShadow: shadow.soft }}>
              <div style={{ ...type.label, color: colors.success }}>WITH AI BUYER</div>
              <div style={{ ...type.financial, fontSize: 28, color: colors.success, marginTop: 6 }}>₹{revenue.withAI.toFixed(0)}</div>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 16, ...type.financial, fontSize: 22, color: colors.success }}>
            {animatedDelta >= 0 ? "+" : ""}₹{animatedDelta.toFixed(0)}
          </div>
          <div style={{ textAlign: "center", ...type.small, color: colors.textSecondary, marginTop: 4 }}>Additional merchant revenue</div>
          <div style={{ textAlign: "center", ...type.body, color: colors.textSecondary, marginTop: 16, fontStyle: "italic" }}>
            "The AI keeps customers stocked instead of waiting for them to remember to reorder."
          </div>
          <div style={{ textAlign: "center", ...type.small, fontSize: 11, color: colors.textMuted, marginTop: 8 }}>{revenue.note}</div>
        </div>
      )}
    </div>
  );
}

const btnStyle = { padding: "10px 18px", borderRadius: 8, border: "none", background: colors.primary, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 };
