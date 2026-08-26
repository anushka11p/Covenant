import { colors, type, shadow } from "../theme";

export default function ProductVisual({ name, price, verified }) {
  return (
    <div style={{
      width: 220, padding: 24, borderRadius: 14, background: "#fff",
      border: `1px solid ${colors.border}`, boxShadow: shadow.raised,
      textAlign: "center", position: "relative",
    }}>
      {verified && (
        <div style={{
          position: "absolute", top: -10, right: -10, width: 28, height: 28, borderRadius: "50%",
          background: colors.forest, color: "#fff", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 14, fontWeight: 700, boxShadow: shadow.soft,
        }}>
          ✓
        </div>
      )}
      <div style={{ width: 64, height: 64, margin: "0 auto 16px", borderRadius: 10, background: colors.tan }} />
      <div style={{ ...type.body, fontWeight: 700, color: colors.textPrimary }}>{name}</div>
      <div style={{ ...type.financial, fontSize: 20, color: colors.forest, marginTop: 6 }}>{price}</div>
    </div>
  );
}
