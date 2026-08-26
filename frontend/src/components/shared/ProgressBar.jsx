export default function ProgressBar({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 4, borderRadius: 2,
          background: i < current ? "#4caf50" : "#26262e",
          transition: "background 0.3s",
        }} />
      ))}
    </div>
  );
}
