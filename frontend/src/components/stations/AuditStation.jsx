import { useState } from "react";
import { getAuditTrail } from "../../api";
import { transformAuditTrail } from "../../domain/presentationTransforms";
import TechnicalDrawer from "../shared/TechnicalDrawer";
import { colors, type } from "../../theme";

const ICONS = { check: "✓", warn: "⚠", danger: "⚠️", info: "•" };

export default function AuditStation({ mandateId }) {
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rawEvents, setRawEvents] = useState(null);

  function iconColor(icon) {
    return { check: colors.success, warn: colors.warning, danger: colors.danger, info: colors.textMuted }[icon];
  }

  async function handleLoad() {
    setLoading(true);
    const trail = await getAuditTrail(mandateId);
    setRawEvents(trail.events || []);
    setEvents(transformAuditTrail(trail.events || []));
    setLoading(false);
  }

  return (
    <div>
      <h2 style={{ ...type.h2, color: colors.textPrimary }}>See What Happened</h2>
      <p style={{ ...type.body, color: colors.textSecondary }}>A plain-language timeline of everything the AI and safety system did.</p>
      <button onClick={handleLoad} disabled={!mandateId || loading} className="btn-primary" style={{ opacity: (!mandateId || loading) ? 0.6 : 1 }}>
        {loading ? "Loading…" : "Load Timeline"}
      </button>

      {events && (
        <div style={{ marginTop: 20 }}>
          {events.map((e, i) => (
            <div key={i} className="step-card" style={{
              display: "flex", gap: 12, padding: "10px 0",
              borderBottom: `1px solid ${colors.border}`,
              animationDelay: `${i * 40}ms`,
            }}>
              <div style={{ color: iconColor(e.icon), fontSize: 14, width: 20 }}>{ICONS[e.icon]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ ...type.body, color: colors.textPrimary }}>{e.label}</div>
                {e.detail && <div style={{ ...type.small, color: colors.textSecondary, marginTop: 2 }}>{e.detail}</div>}
              </div>
              <div style={{ ...type.small, color: colors.textMuted }}>{e.time}</div>
            </div>
          ))}
        </div>
      )}

      {events && (
        <button onClick={() => setDrawerOpen(true)} style={linkStyle}>View raw log</button>
      )}

      <TechnicalDrawer
        open={drawerOpen} onClose={() => setDrawerOpen(false)}
        title="Raw audit log"
        explanation="Every logged event, in the exact technical form the Policy Engine wrote it — event type, rule fired, and transaction linkage."
        data={rawEvents}
      />
    </div>
  );
}

const btnStyle = { padding: "10px 18px", borderRadius: 8, border: "none", background: colors.primary, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 };
const linkStyle = { display: "block", marginTop: 14, background: "none", border: "none", color: colors.primary, cursor: "pointer", fontSize: 13, padding: 0 };
