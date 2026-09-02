import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const POLICY_RULES = [
  { label: "MANDATE STATUS", color: "#10D07A" },
  { label: "HARD CONSTRAINTS", color: "#10D07A" },
  { label: "MERCHANT ALLOWLIST", color: "#10D07A" },
  { label: "AMOUNT LIMIT", color: "#10D07A" },
  { label: "PRICE / STOCK", color: "#10D07A" },
  { label: "PROMO VALIDATION", color: "#10D07A" },
  { label: "IDEMPOTENCY", color: "#10D07A" },
];

function PolicyRing({ index, total, status, active }) {
  const ref = useRef();
  const radius = 0.5 + index * 0.35;
  const speed = 0.4 + index * 0.08;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.rotation.z = t * speed * (index % 2 === 0 ? 1 : -1);
    ref.current.rotation.x = Math.sin(t * 0.3 + index) * 0.15;
  });

  const color = status === "blocked"
    ? "#FF3B3B"
    : status === "clear"
    ? "#10D07A"
    : active ? "#F59E0B" : "#1D2530";

  const emissive = status === "blocked"
    ? "#FF1010"
    : status === "clear"
    ? "#05A850"
    : active ? "#C07000" : "#000000";

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.025, 8, 48 + index * 8]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={status === "clear" || status === "blocked" ? 1.0 : active ? 0.6 : 0.0}
        metalness={0.95}
        roughness={0.05}
        transparent
        opacity={status === "idle" && !active ? 0.3 : 1}
      />
    </mesh>
  );
}

function PolicyScene({ statuses, activeIndex }) {
  return (
    <>
      <ambientLight intensity={0.05} />
      <pointLight position={[3, 3, 3]} intensity={1} color="#10D07A" />
      <pointLight position={[-3, -3, 3]} intensity={0.5} color="#2563EB" />
      <pointLight position={[0, 0, 5]} intensity={0.3} color="#ffffff" />

      <group>
        {POLICY_RULES.map((_, i) => (
          <PolicyRing
            key={i}
            index={i}
            total={POLICY_RULES.length}
            status={statuses[i] || "idle"}
            active={i === activeIndex}
          />
        ))}
      </group>
    </>
  );
}

export default function PolicyRingsScene({ statuses = [], activeIndex = -1, size = 280 }) {
  return (
    <div style={{ width: size, height: size, flexShrink: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <PolicyScene statuses={statuses} activeIndex={activeIndex} />
      </Canvas>
    </div>
  );
}
