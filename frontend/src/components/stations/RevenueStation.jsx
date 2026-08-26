import { useState, useEffect } from "react";
import { getRevenue } from "../../api";
import { transformRevenue } from "../../domain/presentationTransforms";

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
      <h2 style={{ color: "#f2f2f5" }}>Check Merchant Impact</h2>
      <p style={{ color: "#9a9aa5", fontSize: 14 }}>Does this actually help Bramble & Co.?</p>
      <button onClick={handleLoad} disabled={loading} style={btnStyle}>
        {loading ? "Loading…" : "Load Revenue Impact"}
      </button>

      {revenue && (
        <div>
          <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
            <div style={{ flex: 1, padding: 20, borderRadius: 12, background: "#15151a", border: "1px solid #26262e", textAlign: "center" }}>
              <div style={{ color: "#7a7a85", fontSize: 13 }}>WITHOUT AI BUYER</div>
              <div style={{ color: "#c0c0cc", fontSize: 28, fontWeight: 700, marginTop: 6 }}>₹{revenue.withoutAI.toFixed(0)}</div>
            </div>
            <div style={{ flex: 1, padding: 20, borderRadius: 12, background: "#132014", border: "1px solid #4caf50", textAlign: "center" }}>
              <div style={{ color: "#7a7a85", fontSize: 13 }}>WITH AI BUYER</div>
              <div style={{ color: "#4caf50", fontSize: 28, fontWeight: 700, marginTop: 6 }}>₹{revenue.withAI.toFixed(0)}</div>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 16, color: "#4caf50", fontSize: 20, fontWeight: 700 }}>
            {animatedDelta >= 0 ? "+" : ""}₹{animatedDelta.toFixed(0)}
          </div>
          <div style={{ textAlign: "center", color: "#7a7a85", fontSize: 13, marginTop: 4 }}>Additional merchant revenue</div>
          <div style={{ textAlign: "center", color: "#9a9aa5", fontSize: 14, marginTop: 16, fontStyle: "italic" }}>
            "The AI keeps customers stocked instead of waiting for them to remember to reorder."
          </div>
          <div style={{ textAlign: "center", color: "#5c5c66", fontSize: 11, marginTop: 8 }}>{revenue.note}</div>
        </div>
      )}
    </div>
  );
}

const btnStyle = { padding: "10px 18px", borderRadius: 8, border: "none", background: "#2c2c34", color: "#f2f2f5", cursor: "pointer", fontSize: 14 };
