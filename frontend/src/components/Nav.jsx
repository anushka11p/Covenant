import { colors, type } from "../theme";

const ITEMS = [
  { key: "overview", label: "Overview" },
  { key: "shop", label: "Shop" },
  { key: "buyer", label: "AI Buyer" },
  { key: "protection", label: "Protection" },
  { key: "revenue", label: "Revenue" },
];

export default function Nav({ active, onNavigate }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "20px 48px", borderBottom: `1px solid ${colors.border}`,
    }}>
      <div style={{ ...type.h3, color: colors.textPrimary }}>Bramble &amp; Co.</div>
      <div style={{ display: "flex", gap: 32 }}>
        {ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 14, fontWeight: active === item.key ? 700 : 400,
              color: active === item.key ? colors.textPrimary : colors.textSecondary,
              padding: "4px 0", borderBottom: active === item.key ? `2px solid ${colors.accent}` : "2px solid transparent",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
