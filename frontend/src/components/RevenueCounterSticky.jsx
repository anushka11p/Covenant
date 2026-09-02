import { useState, useEffect } from "react";
import { getRevenue } from "../api";
import { colors, type, shadow } from "../theme";

export default function RevenueCounterSticky({ merchantId, refreshKey }) {
  const [revenue, setRevenue] = useState(null);
  const [justUpdated, setJustUpdated] = useState(false);

  useEffect(() => {
    getRevenue(merchantId).then((r) => {
      setRevenue(r);
      if (refreshKey > 0) {
        setJustUpdated(true);
        setTimeout(() => setJustUpdated(false), 1200);
      }
    });
  }, [merchantId, refreshKey]);

  if (!revenue) return null;

  const deltaRupees = revenue.delta_paise / 100;

  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 100, background: colors.surface,
      borderBottom: `1px solid ${colors.border}`, padding: "14px 48px",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 28,
      boxShadow: shadow.raised,
    }}>
      <span style={{ ...type.small, color: colors.textSecondary }}>
        Human baseline: <span style={{ ...type.financial, fontSize: 15, color: colors.textPrimary }}>₹{(revenue.human_baseline_paise / 100).toFixed(0)}</span>
      </span>
      <span style={{ color: colors.border }}>|</span>
      <span style={{ ...type.small, color: colors.textSecondary }}>
        Autonomous: <span style={{ ...type.financial, fontSize: 15, color: colors.success }}>₹{(revenue.autonomous_revenue_paise / 100).toFixed(0)}</span>
      </span>
      <span
        className={justUpdated ? "active-pulse" : ""}
        style={{
          ...type.financial, fontSize: 16, padding: "2px 10px", borderRadius: 6,
          color: deltaRupees >= 0 ? colors.success : colors.warning,
          background: deltaRupees >= 0 ? colors.successSoft : colors.warningSoft,
        }}
      >
        {deltaRupees >= 0 ? "+" : ""}₹{deltaRupees.toFixed(0)}
      </span>
    </div>
  );
}
