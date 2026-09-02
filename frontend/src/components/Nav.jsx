import { colors, type } from "../theme";
import { useScrollDirection } from "../hooks/useScrollDirection";

const ITEMS = [
  { key: "overview", label: "Overview" },
  { key: "demo", label: "Demo" },
  { key: "revenue", label: "Revenue" },
];

export default function Nav({ active, onNavigate }) {
  const direction = useScrollDirection();
  const hidden = direction === "down";
  console.log("scroll direction:", direction);

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 40px", background: "rgba(238,241,255,0.92)",
      backdropFilter: "blur(12px)", borderBottom: `1px solid ${colors.border}`,
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      transform: hidden ? "translateY(-100%)" : "translateY(0)",
      transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          border: `2px solid ${colors.textPrimary}`, borderRadius: 999,
          padding: "6px 14px", fontWeight: 800, fontSize: 14, letterSpacing: 0.5,
        }}>
          COVENANT
        </div>
        <span style={{ ...type.small, color: colors.textMuted, fontWeight: 600 }}>
          AI COMMERCE · TRUST LAYER
        </span>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            style={{
              background: active === item.key ? colors.primary : "transparent",
              color: active === item.key ? "#fff" : colors.textPrimary,
              border: active === item.key ? "none" : `1.5px solid ${colors.border}`,
              borderRadius: 999, padding: "8px 18px", fontSize: 14, fontWeight: 700,
              cursor: "pointer",
              transition: "background 0.15s ease, color 0.15s ease",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
