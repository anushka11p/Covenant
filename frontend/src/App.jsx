import { useState } from "react";
import PipelineScene from "./components/Pipeline/PipelineScene";

const STATES = ["idle", "moving", "atGate", "blocked", "recovering", "paid"];

export default function App() {
  const [state, setState] = useState("idle");
  return (
    <div style={{ padding: 60, background: "#FBF9F4", minHeight: "100vh" }}>
      <PipelineScene state={state} label="Classic Formula ₹1,150" />
      <div style={{ marginTop: 40, display: "flex", gap: 8 }}>
        {STATES.map((s) => (
          <button key={s} onClick={() => setState(s)} style={{ padding: "8px 14px" }}>{s}</button>
        ))}
      </div>
    </div>
  );
}
