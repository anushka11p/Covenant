export default function MetricCard({ label, value, sublabel }) {
  return (
    <div style={{
      flex: 1, padding: "20px 16px", borderRadius: 12,
      background: "#15151a", border: "1px solid #26262e", textAlign: "center",
    }}>
      <div style={{ fontSize: 26, fontWeight: 700, color: "#f2f2f5" }}>{value}</div>
      <div style={{ fontSize: 13, color: "#8a8a95", marginTop: 4 }}>{label}</div>
      {sublabel && <div style={{ fontSize: 11, color: "#5c5c66", marginTop: 2 }}>{sublabel}</div>}
    </div>
  );
}
