// Covenant — Premium Dark Fintech Design Tokens

export const colors = {
  // Core
  bg: "#090B0F",
  surface: "#0F1318",
  surfaceRaised: "#161C24",
  surfaceHigh: "#1D2530",
  border: "rgba(255,255,255,0.06)",
  borderMid: "rgba(255,255,255,0.10)",
  borderStrong: "rgba(255,255,255,0.18)",

  // Text
  textPrimary: "#F0EFE9",
  textSecondary: "#8A8F9E",
  textMuted: "#3D4452",
  textDim: "#2A3040",

  // Status
  success: "#10D07A",
  successSoft: "rgba(16,208,122,0.10)",
  successBorder: "rgba(16,208,122,0.25)",
  danger: "#FF3B3B",
  dangerSoft: "rgba(255,59,59,0.10)",
  dangerBorder: "rgba(255,59,59,0.25)",
  warning: "#F59E0B",
  warningSoft: "rgba(245,158,11,0.10)",
  warningBorder: "rgba(245,158,11,0.25)",

  // Accents
  accent: "#2563EB",
  accentSoft: "rgba(37,99,235,0.10)",

  // Aliases (backwards compatibility)
  primary: "#10D07A",
  primaryHover: "#0EBC6D",
  verify: "#10D07A",
  verifySoft: "rgba(16,208,122,0.10)",
  blocked: "#FF3B3B",
  blockedSoft: "rgba(255,59,59,0.10)",
  caution: "#F59E0B",
  cautionSoft: "rgba(245,158,11,0.10)",
  forest: "#10D07A",
  forestSoft: "rgba(16,208,122,0.10)",
  tan: "rgba(255,255,255,0.06)",
};

export const shadow = {
  soft: "0 4px 24px rgba(0,0,0,0.3)",
  raised: "0 16px 64px rgba(0,0,0,0.5)",
  glow: "0 0 40px rgba(16,208,122,0.12)",
  glowRed: "0 0 40px rgba(255,59,59,0.12)",
};

export const type = {
  sansFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  serifFamily: "'Syne', sans-serif",
  monoFamily: "'JetBrains Mono', monospace",

  // Display
  display: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 80,
    fontWeight: 800,
    lineHeight: 0.92,
    letterSpacing: -3,
  },

  // Headlines
  headline: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 56,
    fontWeight: 800,
    lineHeight: 1.0,
    letterSpacing: -2,
  },
  h2: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 32,
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: -0.8,
  },
  h3: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 20,
    fontWeight: 700,
    lineHeight: 1.25,
    letterSpacing: -0.3,
  },

  // Body
  body: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 1.65,
  },
  small: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.5,
  },

  // Label / caps
  label: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
  },

  // Financial numbers
  financial: {
    fontFamily: "'Syne', sans-serif",
    fontVariantNumeric: "tabular-nums",
    fontWeight: 800,
  },

  // Mono / technical
  mono: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    fontWeight: 400,
    lineHeight: 1.6,
  },
};

export const space = (n) => `${n * 4}px`;
