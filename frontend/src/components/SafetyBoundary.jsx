import { colors, type } from "../theme";

/**
 * A physical-feeling checkpoint object: two posts + an arch, rendered in CSS
 * (not SVG this time, so it composites cleanly next to a real product photo).
 * `state`: idle | verifying | blocked | verified
 */
export default function SafetyBoundary({ state = "idle", label }) {
  const stateColor = {
    idle: colors.border,
    verifying: colors.verify,
    blocked: colors.blocked,
    verified: colors.forest,
  }[state];

  const stateLabel = label || {
    idle: "",
    verifying: "VERIFYING",
    blocked: "BLOCKED",
    verified: "VERIFIED",
  }[state];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 140 }}>
      {stateLabel && (
        <div style={{
          padding: "6px 16px", borderRadius: 999, background: "#fff",
          border: `1.5px solid ${stateColor}`, color: stateColor,
          fontSize: 11, fontWeight: 700, letterSpacing: 0.5, marginBottom: 14,
          transition: "all 0.3s ease",
        }}>
          {stateLabel}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "flex-end", height: 140, gap: 62, position: "relative" }}>
        <div style={{ width: 10, height: 140, background: stateColor, borderRadius: 5, transition: "background 0.3s ease" }} />
        <div style={{ width: 10, height: 140, background: stateColor, borderRadius: 5, transition: "background 0.3s ease" }} />
        <div style={{
          position: "absolute", top: 0, left: 0, width: 82, height: 40,
          borderTop: `10px solid ${stateColor}`, borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
          transition: "border-color 0.3s ease",
        }} />
      </div>
      <div style={{ ...type.label, color: colors.textMuted, marginTop: 12 }}>SAFETY GATE</div>
    </div>
  );
}
