import { useState } from "react";
import { getAuditTrail } from "../../api";
import { transformAuditTrail } from "../../domain/presentationTransforms";
import TechnicalDrawer from "../shared/TechnicalDrawer";

const ICONS = { check: "✓", warn: "⚠", danger: "⚠️", info: "•" };
const COLORS = { check: "#4caf50", warn: "#f0a500", danger: "#e05252", info: "#7a7a85" };

export default function AuditStation({ mandateId }) {
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rawEvents, setRawEvents] = useState(null);

  async function handleLoad() {
    setLoading(true);
    const trail = await getAuditTrail(mandateId);
    setRawEvents(trail.events || []);
    setEvents(transformAuditTrail(trail.events || []));
    setLoading(false);
  }

  return (
    <div>
      <h2 style={{ color: "#f2f2f5" }}>See What Happened</h2>
      <p style={{ color: "#9a9aa5", fontSize: 14 }}>A plain-language timeline of everything the AI and safety system did.</p>
      <button onClick={handleLoad} disabled={!mandateId || loading} style={btnStyle}>
        {loading ? "Loading…" : "Load Timeline"}
      </button>

      {events && (
        <div style={{ marginTop: 20 }}>
          {events.map((e, i) => (
            <div key={i} style={{
              display: "flex", gap: 12, padding: "10px 0",
              borderBottom: "1px solid #1e1e24",
              animation: `fadeIn 0.25s ease ${i * 0.06}s both`,
            }}>
              <div style={{ color: COLORS[e.icon], fontSize: 14, width: 20 }}>{ICONS[e.icon]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#f2f2f5", fontSize: 14 }}>{e.label}</div>
                {e.detail && <div style={{ color: "#7a7a85", fontSize: 12, marginTop: 2 }}>{e.detail}</div>}
              </div>
              <div style={{ color: "#5c5c66", fontSize: 12 }}>{e.time}</div>
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

      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
}

const btnStyle = { padding: "10px 18px", borderRadius: 8, border: "none", background: "#2c2c34", color: "#f2f2f5", cursor: "pointer", fontSize: 14 };
const linkStyle = { display: "block", marginTop: 14, background: "none", border: "none", color: "#7a9eff", cursor: "pointer", fontSize: 13, padding: 0 };
