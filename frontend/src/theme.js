export const colors = {
  bg: "#FBF9F4",
  surface: "#F3EFE6",
  border: "#E3DCCB",
  textPrimary: "#1C1B19",
  textSecondary: "#5C5A52",
  textMuted: "#948F80",
  forest: "#2F4A3C",
  forestSoft: "#E7EEE9",
  verify: "#3355CC",
  verifySoft: "#E9EDFA",
  blocked: "#A6432E",
  blockedSoft: "#F7E9E5",
  tan: "#D8CBB5",
};

export const shadow = {
  soft: "0 4px 20px rgba(28, 27, 25, 0.06)",
  raised: "0 10px 32px rgba(28, 27, 25, 0.10)",
};

export const type = {
  serifFamily: "'Fraunces', Georgia, serif",
  sansFamily: "'Public Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  headline: { fontFamily: "'Fraunces', Georgia, serif", fontSize: 56, fontWeight: 600, lineHeight: 1.08, letterSpacing: -0.5 },
  h2: { fontFamily: "'Fraunces', Georgia, serif", fontSize: 30, fontWeight: 600, lineHeight: 1.15 },
  h3: { fontFamily: "'Public Sans', sans-serif", fontSize: 17, fontWeight: 700, lineHeight: 1.3 },
  body: { fontFamily: "'Public Sans', sans-serif", fontSize: 15, fontWeight: 400, lineHeight: 1.6 },
  small: { fontFamily: "'Public Sans', sans-serif", fontSize: 13, fontWeight: 400, lineHeight: 1.5 },
  label: { fontFamily: "'Public Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 1.2 },
  financial: { fontFamily: "'Public Sans', sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: 700 },
};

export const space = (n) => `${n * 4}px`;
