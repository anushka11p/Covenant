import { colors, type } from "../theme";

const VARIANTS = {
  verified: { bg: colors.verifySoft, fg: colors.verify, label: "VERIFIED" },
  blocked: { bg: colors.blockedSoft, fg: colors.blocked, label: "BLOCKED" },
  paid: { bg: colors.forestSoft, fg: colors.forest, label: "PAID" },
  recovered: { bg: colors.forestSoft, fg: colors.forest, label: "RECOVERED" },
};

export default function StatusBadge({ status, children }) {
  const v = VARIANTS[status] ?? VARIANTS.verified;
  return (
    <span style={{
      display: "inline-block", padding: "4px 10px", borderRadius: 6,
      background: v.bg, color: v.fg, ...type.label, letterSpacing: 0.8,
    }}>
      {children || v.label}
    </span>
  );
}
