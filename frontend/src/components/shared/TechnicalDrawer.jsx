import { colors, type, shadow } from "../../theme";

export default function TechnicalDrawer({ open, onClose, title, explanation, data }) {
  if (!open) return null;
  return (
    <div className="sharp-appear" style={{
      position: "fixed", top: 0, right: 0, height: "100vh", width: 420,
      background: colors.surface, borderLeft: `1px solid ${colors.border}`, padding: 24,
      overflowY: "auto", boxShadow: shadow.raised, zIndex: 1000,
    }}>
      <button onClick={onClose} style={{ float: "right", background: "none", border: "none", color: colors.textMuted, fontSize: 18, cursor: "pointer" }}>✕</button>
      <h3 style={{ ...type.h3, color: colors.textPrimary, marginTop: 0 }}>{title}</h3>
      {explanation && <p style={{ ...type.small, color: colors.textSecondary, lineHeight: 1.5 }}>{explanation}</p>}
      <pre style={{ background: colors.bg, border: `1px solid ${colors.border}`, padding: 14, borderRadius: 8, fontSize: 12, color: colors.textSecondary, overflowX: "auto" }}>
{JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
