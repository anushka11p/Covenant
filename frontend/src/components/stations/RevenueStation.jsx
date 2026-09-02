import { useState, useEffect, Suspense, lazy } from "react";
import { getRevenue } from "../../api";
import { transformRevenue } from "../../domain/presentationTransforms";
import Icon from "../shared/Icon";
import { colors, type } from "../../theme";

const CoinStackScene = lazy(() => import("../3d/CoinStackScene"));

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const steps = 40;
    const increment = target / steps;
    const delay = duration / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setValue(target);
        clearInterval(interval);
      } else {
        setValue(current);
      }
    }, delay);
    return () => clearInterval(interval);
  }, [target, duration]);

  return value;
}

export default function RevenueStation({ merchantId }) {
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(false);

  const animWithoutAI = useCountUp(revenue?.withoutAI ?? 0, 1000);
  const animWithAI = useCountUp(revenue?.withAI ?? 0, 1200);
  const animDelta = useCountUp(revenue?.delta ?? 0, 1400);

  async function handleLoad() {
    setLoading(true);
    const raw = await getRevenue(merchantId);
    const transformed = transformRevenue(raw);
    setRevenue(transformed);
    setLoading(false);
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ ...type.label, color: colors.textMuted, marginBottom: 12 }}>
          MERCHANT IMPACT · REAL DATA
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
          Revenue Impact
        </h2>
        <p style={{ ...type.body, color: colors.textSecondary, maxWidth: 480, lineHeight: 1.7 }}>
          Does autonomous reordering actually help Bramble &amp; Co.? Here&apos;s the real data
          from backend transactions.
        </p>
      </div>

      {!revenue && (
        <button
          id="revenue-load-btn"
          className="btn-primary"
          onClick={handleLoad}
          disabled={loading}
        >
          {loading ? "LOADING DATA…" : "LOAD REVENUE IMPACT"}
        </button>
      )}

      {revenue && (
        <div className="step-card">
          {/* Main comparison */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              gap: 20,
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            {/* Without */}
            <div
              style={{
                padding: "20px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              <div style={{ ...type.label, color: colors.textMuted, marginBottom: 10, fontSize: 10 }}>
                WITHOUT COVENANT
              </div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 32,
                  fontWeight: 800,
                  color: colors.textSecondary,
                }}
              >
                ₹{animWithoutAI.toFixed(0)}
              </div>
              <div style={{ ...type.small, color: colors.textMuted, marginTop: 6, fontSize: 12 }}>
                Manual orders only
              </div>
            </div>

            {/* Vs */}
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 18,
                fontWeight: 800,
                color: colors.textMuted,
                textAlign: "center",
              }}
            >
              VS
            </div>

            {/* With */}
            <div
              style={{
                padding: "20px",
                background: "rgba(16,208,122,0.05)",
                border: "1px solid rgba(16,208,122,0.2)",
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              <div style={{ ...type.label, color: "#10D07A", marginBottom: 10, fontSize: 10 }}>
                WITH COVENANT
              </div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#10D07A",
                }}
              >
                ₹{animWithAI.toFixed(0)}
              </div>
              <div style={{ ...type.small, color: "rgba(16,208,122,0.7)", marginTop: 6, fontSize: 12 }}>
                Autonomous + manual
              </div>
            </div>
          </div>

          {/* Delta highlight */}
          <div
            style={{
              padding: "20px 24px",
              background: "linear-gradient(135deg, rgba(16,208,122,0.08) 0%, rgba(37,99,235,0.04) 100%)",
              border: "1px solid rgba(16,208,122,0.15)",
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div>
              <div style={{ ...type.label, color: "#10D07A", fontSize: 10, marginBottom: 6 }}>
                ADDITIONAL REVENUE CAPTURED
              </div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 40,
                  fontWeight: 800,
                  color: "#10D07A",
                  lineHeight: 1,
                }}
              >
                +₹{animDelta.toFixed(0)}
              </div>
            </div>
            <Suspense fallback={null}>
              <CoinStackScene coinCount={5} size={100} />
            </Suspense>
          </div>

          {/* Narrative */}
          <div
            style={{
              padding: "16px 20px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.04)",
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <div style={{ ...type.label, color: colors.textMuted, fontSize: 10, marginBottom: 12 }}>
              WHY THIS MATTERS
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <NarrativeRow
                icon="brain"
                before="Customer forgets to reorder"
                after="AI detects low stock, proposes reorder"
              />
              <NarrativeRow
                icon="scale"
                before="Merchant loses the sale"
                after="Policy Engine validates & clears"
              />
              <NarrativeRow
                icon="card"
                before="Revenue never captured"
                after="Razorpay executes payment"
              />
              <NarrativeRow
                icon="trending"
                before="Static revenue ceiling"
                after="Autonomous revenue growth"
              />
            </div>
          </div>

          {revenue.note && (
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: colors.textMuted,
                letterSpacing: "0.06em",
                fontStyle: "italic",
              }}
            >
              {revenue.note}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NarrativeRow({ icon, before, after }) {
  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <Icon name={icon} size={16} color="#10D07A" strokeWidth={1.5} />
      </div>
      <div style={{ ...type.small, fontSize: 11, color: colors.textMuted, marginBottom: 3, textDecoration: "line-through" }}>
        {before}
      </div>
      <div style={{ ...type.small, fontSize: 11, color: "#10D07A" }}>
        {after}
      </div>
    </div>
  );
}
