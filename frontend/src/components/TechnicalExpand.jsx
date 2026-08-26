import { useState } from "react";
import { colors } from "../theme";

export default function TechnicalExpand({ label = "Details", data }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 8 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: colors.textMuted, fontSize: 12, textDecoration: "underline", padding: 0,
        }}
      >
        {open ? "Hide" : label}
      </button>
      {open && (
        <pre style={{
          marginTop: 8, padding: 12, background: "#0E1015", border: `1px solid ${colors.border}`,
          borderRadius: 4, fontSize: 12, color: colors.textSecondary, overflowX: "auto",
        }}>
{JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
