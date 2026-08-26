import { colors } from "../../theme";

/**
 * The core visual metaphor: AI Buyer -> Safety Gate -> Razorpay -> Merchant.
 */
export default function PipelineScene({ state = "idle", label, gateMessage }) {
  const parcelX = {
    idle: 60,
    moving: 260,
    atGate: 400,
    blocked: 355,
    recovering: 260,
    paid: 680,
  }[state];

  const gateActive = state === "atGate" || state === "paid";
  const gateBlocked = state === "blocked";
  const gateColor = gateBlocked ? colors.blocked : gateActive ? colors.verify : colors.textMuted;
  const gateFill = gateBlocked ? colors.blockedSoft : gateActive ? colors.verifySoft : colors.surface;

  const gateLabel = gateMessage || (gateBlocked ? "BLOCKED" : state === "atGate" ? "VERIFYING" : state === "paid" ? "VERIFIED" : "");

  return (
    <svg viewBox="0 0 820 280" width="100%" height="auto" style={{ overflow: "visible" }}>
      {/* Track */}
      <line x1="60" y1="160" x2="760" y2="160" stroke={colors.border} strokeWidth="2" />

      {/* Node labels — positioned clear of any shape */}
      <text x="30" y="230" fontSize="11" fill={colors.textMuted} fontFamily="Public Sans" letterSpacing="1.5" fontWeight="600">AI BUYER</text>
      <text x="365" y="230" fontSize="11" fill={colors.textMuted} fontFamily="Public Sans" letterSpacing="1.5" fontWeight="600">SAFETY GATE</text>
      <text x="600" y="230" fontSize="11" fill={colors.textMuted} fontFamily="Public Sans" letterSpacing="1.5" fontWeight="600">RAZORPAY</text>
      <text x="700" y="230" fontSize="11" fill={colors.textMuted} fontFamily="Public Sans" letterSpacing="1.5" fontWeight="600">MERCHANT</text>

      {/* Safety Gate — an actual gate shape: two posts + a solid arch connecting them, with its label INSIDE the arch, not overlapping */}
      <g transform="translate(400, 100)" style={{ transition: "all 0.4s ease" }}>
        {/* posts */}
        <rect x="-45" y="0" width="10" height="90" rx="3" fill={gateColor} />
        <rect x="35" y="0" width="10" height="90" rx="3" fill={gateColor} />
        {/* arch connecting them */}
        <path d="M -45 10 Q 0 -20 45 10" fill="none" stroke={gateColor} strokeWidth="10" strokeLinecap="round" />
        {/* label plate, sits ABOVE the arch, never overlapping the posts */}
        {gateLabel && (
          <g transform="translate(0, -46)">
            <rect x="-46" y="-14" width="92" height="26" rx="13" fill={gateFill} stroke={gateColor} strokeWidth="1.5" />
            <text x="0" y="4" fontSize="11" fontWeight="700" fill={gateColor} textAnchor="middle" fontFamily="Public Sans" letterSpacing="0.5">
              {gateLabel}
            </text>
          </g>
        )}
      </g>

      {/* Razorpay + Merchant endpoints — small filled discs, lit up once paid */}
      <circle cx="640" cy="160" r="7" fill={state === "paid" ? colors.forest : "#fff"} stroke={state === "paid" ? colors.forest : colors.border} strokeWidth="2" style={{ transition: "all 0.4s ease" }} />
      <circle cx="720" cy="160" r="7" fill={state === "paid" ? colors.forest : "#fff"} stroke={state === "paid" ? colors.forest : colors.border} strokeWidth="2" style={{ transition: "all 0.4s ease" }} />

      {/* The parcel — a proper package shape: box + fold line + tape strip, not a plain rectangle */}
      <g transform={`translate(${parcelX}, 160)`} style={{ transition: "transform 0.7s cubic-bezier(0.3, 1.15, 0.6, 1)" }}>
        {label && (
          <text x="0" y="-58" fontSize="12" fontWeight="700" fill={colors.textPrimary} textAnchor="middle" fontFamily="Public Sans">
            {label}
          </text>
        )}
        {/* drop shadow ellipse under the parcel for a touch of grounding depth */}
        <ellipse cx="0" cy="34" rx="26" ry="5" fill="rgba(28,27,25,0.08)" />
        <rect x="-26" y="-24" width="52" height="48" rx="5"
          fill={state === "blocked" ? colors.blockedSoft : colors.tan}
          stroke={state === "blocked" ? colors.blocked : colors.forest}
          strokeWidth="2" style={{ transition: "all 0.4s ease" }} />
        {/* tape strip */}
        <rect x="-4" y="-24" width="8" height="48" fill={state === "blocked" ? colors.blocked : colors.forest} opacity="0.5" />
      </g>
    </svg>
  );
}
