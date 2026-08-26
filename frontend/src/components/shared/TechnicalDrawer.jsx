export default function TechnicalDrawer({ open, onClose, title, explanation, data }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", top: 0, right: 0, height: "100vh", width: 420,
      background: "#0f0f13", borderLeft: "1px solid #2a2a33", padding: 24,
      overflowY: "auto", boxShadow: "-8px 0 24px rgba(0,0,0,0.4)", zIndex: 1000,
    }}>
      <button onClick={onClose} style={{ float: "right", background: "none", border: "none", color: "#8a8a95", fontSize: 18, cursor: "pointer" }}>✕</button>
      <h3 style={{ color: "#f2f2f5", marginTop: 0 }}>{title}</h3>
      {explanation && <p style={{ color: "#9a9aa5", fontSize: 13, lineHeight: 1.5 }}>{explanation}</p>}
      <pre style={{ background: "#1a1a20", padding: 14, borderRadius: 8, fontSize: 12, color: "#c0c0cc", overflowX: "auto" }}>
{JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
