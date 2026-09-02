import { useState } from "react";
import { getAuditTrail } from "../../api";
import { transformAuditTrail } from "../../domain/presentationTransforms";
import TechnicalDrawer from "../shared/TechnicalDrawer";
import { colors, type } from "../../theme";

const EVENT_CONFIG = {
  check: { color: "#10D07A", label: "CLEARED", bg: "rgba(16,208,122,0.06)", border: "rgba(16,208,122,0.12)" },
  warn: { color: "#F59E0B", label: "WARNING", bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.12)" },
  danger: { color: "#FF3B3B", label: "BLOCKED", bg: "rgba(255,59,59,0.06)", border: "rgba(255,59,59,0.12)" },
  info: { color: "#8A8F9E", label: "EVENT", bg: "rgba(138,143,158,0.04)", border: "rgba(138,143,158,0.08)" },
};

function AuditEvent({ event, index }) {
  const cfg = EVENT_CONFIG[event.icon] || EVENT_CONFIG.info;

  return (
    <div
      className="step-card"
      style={{
        display: "flex",
        gap: 16,
        padding: "14px 0",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Timeline line */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 20 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: cfg.color,
            boxShadow: `0 0 8px ${cfg.color}60`,
            flexShrink: 0,
            marginTop: 3,
          }}
        />
        <div
          style={{
            width: 1,
            flex: 1,
            background: "rgba(255,255,255,0.04)",
            marginTop: 4,
          }}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1, paddingBottom: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 4 }}>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: colors.textPrimary,
              lineHeight: 1.3,
            }}
          >
            {event.label}
          </div>
          <span
            className="badge"
            style={{
              background: cfg.bg,
              color: cfg.color,
              border: `1px solid ${cfg.border}`,
              fontSize: 9,
              flexShrink: 0,
            }}
          >
            {cfg.label}
          </span>
        </div>
        {event.detail && (
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              color: colors.textSecondary,
              lineHeight: 1.5,
            }}
          >
            {event.detail}
          </p>
        )}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: colors.textMuted,
            marginTop: 6,
            letterSpacing: "0.06em",
          }}
        >
          {event.time}
        </div>
      </div>
    </div>
  );
}

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

  const blockedCount = events?.filter((e) => e.icon === "danger").length ?? 0;
  const clearedCount = events?.filter((e) => e.icon === "check").length ?? 0;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ ...type.label, color: colors.textMuted, marginBottom: 12 }}>
          IMMUTABLE LEDGER
        </div>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 28,
            fontWeight: 800,
            color: colors.textPrimary,
            letterSpacing: "-0.5px",
            marginBottom: 12,
          }}
        >
          Audit Trail
        </h2>
        <p style={{ ...type.body, color: colors.textSecondary, maxWidth: 480, lineHeight: 1.7 }}>
          Every action taken by the AI, the Policy Engine, and Razorpay — in chronological order.
          This log is written by the Policy Engine and cannot be altered.
        </p>
      </div>

      {!events && (
        <button
          id="audit-load-btn"
          className="btn-primary"
          onClick={handleLoad}
          disabled={!mandateId || loading}
          style={{ opacity: !mandateId ? 0.5 : 1 }}
        >
          {loading ? "LOADING LEDGER…" : "LOAD AUDIT TRAIL"}
        </button>
      )}

      {!mandateId && !events && (
        <div
          style={{
            marginTop: 12,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: colors.textMuted,
          }}
        >
          ↑ Complete the demo steps first
        </div>
      )}

      {events && (
        <div>
          {/* Summary stats */}
          <div
            style={{
              display: "flex",
              gap: 16,
              marginBottom: 28,
              flexWrap: "wrap",
            }}
          >
            <StatBadge value={events.length} label="TOTAL EVENTS" color="#8A8F9E" />
            <StatBadge value={clearedCount} label="CLEARED" color="#10D07A" />
            <StatBadge value={blockedCount} label="BLOCKED" color="#FF3B3B" />
          </div>

          {/* Timeline */}
          <div
            style={{
              background: "#0A0E13",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 12,
              padding: "20px 24px",
            }}
          >
            <div style={{ ...type.label, color: colors.textMuted, marginBottom: 20 }}>
              CHRONOLOGICAL TIMELINE
            </div>
            {events.map((e, i) => (
              <AuditEvent key={i} event={e} index={i} />
            ))}
          </div>

          <button className="btn-link" onClick={() => setDrawerOpen(true)} style={{ marginTop: 16 }}>
            ↳ view raw audit log
          </button>
        </div>
      )}

      <TechnicalDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Raw audit log"
        explanation="Every logged event, in the exact technical form the Policy Engine wrote it — event type, rule fired, and transaction linkage."
        data={rawEvents}
      />
    </div>
  );
}

function StatBadge({ value, label, color }) {
  return (
    <div
      style={{
        padding: "10px 16px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 8,
      }}
    >
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 24,
          fontWeight: 800,
          color,
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: colors.textMuted,
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </div>
    </div>
  );
}
