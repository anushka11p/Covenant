import { colors, type } from "../theme";

export default function ProductCard({ name, priceRupees, allergens, flagged }) {
  return (
    <div style={{
      padding: 20, background: colors.surface, border: `1px solid ${flagged ? colors.caution : colors.border}`,
    }}>
      <div style={{ width: 40, height: 40, background: colors.border, marginBottom: 16 }} />
      <div style={{ ...type.h3, color: colors.textPrimary }}>{name}</div>
      <div style={{ ...type.small, color: colors.textSecondary, marginTop: 4 }}>
        {allergens.length ? `Contains: ${allergens.join(", ")}` : "No known allergens"}
      </div>
      <div style={{ ...type.h3, color: colors.textPrimary, marginTop: 12 }}>₹{priceRupees}</div>
    </div>
  );
}
