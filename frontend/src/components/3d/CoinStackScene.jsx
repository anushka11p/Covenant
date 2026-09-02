import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

// Individual coin
function Coin({ position, delay = 0, index = 0 }) {
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.8 + delay;
    ref.current.position.y = position[1] + Math.sin(t * 0.6 + delay) * 0.08;
  });

  return (
    <mesh ref={ref} position={position}>
      <cylinderGeometry args={[0.38, 0.38, 0.06, 32]} />
      <meshStandardMaterial
        color="#D4A843"
        emissive="#8B6820"
        emissiveIntensity={0.3}
        metalness={0.95}
        roughness={0.15}
      />
    </mesh>
  );
}

function CoinStack({ count = 5 }) {
  const coins = Array.from({ length: count }, (_, i) => ({
    id: i,
    position: [0, i * 0.14 - (count * 0.14) / 2, 0],
    delay: i * 0.3,
  }));

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
      <group rotation={[0.3, 0.5, 0]}>
        {coins.map((c) => (
          <Coin key={c.id} position={c.position} delay={c.delay} index={c.id} />
        ))}
      </group>
    </Float>
  );
}

export default function CoinStackScene({ coinCount = 5, size = 200 }) {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.1} />
        <pointLight position={[3, 3, 3]} intensity={2} color="#FFD700" />
        <pointLight position={[-2, -2, 2]} intensity={0.8} color="#10D07A" />
        <CoinStack count={coinCount} />
      </Canvas>
    </div>
  );
}
