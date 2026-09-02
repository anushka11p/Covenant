export const colors = {
  bg: "#EEF1FF",
  surface: "#FFFFFF",
  surfaceRaised: "#E0E7FF",
  border: "#C7D2FE",
  borderSubtle: "#E0E7FF",
  textPrimary: "#0A0A0A",
  textSecondary: "#374151",
  textMuted: "#6B7280",
  primary: "#22C55E",
  primaryHover: "#16A34A",
  success: "#16A34A",
  successSoft: "#DCFCE7",
  danger: "#DC2626",
  dangerSoft: "#FEE2E2",
  warning: "#D97706",
  warningSoft: "#FEF3C7",
  accent: "#4F46E5",
  accentSoft: "#C7D2FE",
  forest: "#0A0A0A",
  forestSoft: "#E0E7FF",
  verify: "#22C55E",
  verifySoft: "#DCFCE7",
  blocked: "#DC2626",
  blockedSoft: "#FEE2E2",
  tan: "#C7D2FE",
};

export const shadow = {
  soft: "0 4px 24px rgba(15, 23, 42, 0.06)",
  raised: "0 16px 48px rgba(15, 23, 42, 0.10)",
};

export const type = {
  sansFamily: "'Public Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  serifFamily: "'Public Sans', sans-serif",
  headline: { fontFamily: "'Public Sans', sans-serif", fontSize: 56, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5 },
  h2: { fontFamily: "'Public Sans', sans-serif", fontSize: 28, fontWeight: 800, lineHeight: 1.15, letterSpacing: -0.5 },
  h3: { fontFamily: "'Public Sans', sans-serif", fontSize: 18, fontWeight: 700, lineHeight: 1.3 },
  body: { fontFamily: "'Public Sans', sans-serif", fontSize: 16, fontWeight: 400, lineHeight: 1.6 },
  small: { fontFamily: "'Public Sans', sans-serif", fontSize: 14, fontWeight: 400, lineHeight: 1.5 },
  label: { fontFamily: "'Public Sans', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase" },
  financial: { fontFamily: "'Public Sans', sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: 800 },
};

export const space = (n) => `${n * 4}px`;
