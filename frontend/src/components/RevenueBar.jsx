import { colors, type } from "../theme";

export default function RevenueBar({ human = 4200, autonomous = 5750 }) {
  const delta = autonomous - human;
  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center", gap: 28,
      padding: "14px 24px", background: colors.surface,
      borderBottom: `1px solid ${colors.border}`, fontSize: 14,
    }}>
      <span style={{ color: colors.textSecondary }}>
        Human baseline:{" "}
        <strong style={{ ...type.financial, color: colors.textPrimary, fontSize: 15 }}>
          ₹{Number(human).toLocaleString("en-IN")}
        </strong>
      </span>
      <span style={{ color: colors.border }}>|</span>
      <span style={{ color: colors.textSecondary }}>
        Autonomous:{" "}
        <strong style={{ ...type.financial, color: colors.textPrimary, fontSize: 15 }}>
          ₹{Number(autonomous).toLocaleString("en-IN")}
        </strong>
      </span>
      <span style={{
        ...type.financial, background: colors.successSoft, color: colors.success,
        padding: "5px 12px", borderRadius: 999, fontSize: 14,
      }}>
        +₹{Number(delta).toLocaleString("en-IN")}
      </span>
    </div>
  );
}
