import { colors, type } from "../../theme";

export default function TechnicalDrawer({ open, onClose, title, explanation, data }) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 999,
        }}
      />

      {/* Drawer */}
      <div
        className="sharp-appear"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: 460,
          background: "#0A0E13",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          padding: "32px 28px",
          overflowY: "auto",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
          }}
        >
          <div>
            <div style={{ ...type.label, color: colors.textMuted, marginBottom: 8 }}>
              TECHNICAL DETAILS
            </div>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 18,
                fontWeight: 700,
                color: colors.textPrimary,
                lineHeight: 1.3,
              }}
            >
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 6,
              color: colors.textSecondary,
              width: 32,
              height: 32,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 14,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
          >
            ✕
          </button>
        </div>

        {/* Explanation */}
        {explanation && (
          <div
            style={{
              padding: "14px 16px",
              background: "rgba(16,208,122,0.04)",
              border: "1px solid rgba(16,208,122,0.12)",
              borderRadius: 8,
            }}
          >
            <p style={{ ...type.small, color: colors.textSecondary, lineHeight: 1.65, fontSize: 13 }}>
              {explanation}
            </p>
          </div>
        )}

        {/* JSON data */}
        <div>
          <div style={{ ...type.label, color: colors.textMuted, marginBottom: 10 }}>
            RAW RESPONSE
          </div>
          <pre className="json-viewer">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </>
  );
}
