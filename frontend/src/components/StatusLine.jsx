import { colors } from "../theme";

const COLOR_MAP = { success: colors.success, danger: colors.danger, caution: colors.caution, neutral: colors.textSecondary };

export default function StatusLine({ status = "neutral", children }) {
  return (
    <span style={{ color: COLOR_MAP[status], fontWeight: 700 }}>{children}</span>
  );
}
