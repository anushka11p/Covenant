const STEPS = [
  { icon: "🤖", label: "AI Buyer" },
  { icon: "🛡️", label: "Safety Check" },
  { icon: "💳", label: "Razorpay" },
  { icon: "✅", label: "Merchant Paid" },
];

export default function FlowDiagram() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, margin: "28px 0" }}>
      {STEPS.map((s, i) => (
        <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div style={{ fontSize: 12, color: "#9a9aa5", marginTop: 4 }}>{s.label}</div>
          </div>
          {i < STEPS.length - 1 && <div style={{ color: "#3a3a44", fontSize: 20 }}>→</div>}
        </div>
      ))}
    </div>
  );
}
