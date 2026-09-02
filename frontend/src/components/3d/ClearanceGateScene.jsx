import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// The clearance gate — a metallic torus representing the policy boundary
function ClearanceGate({ blocked = false }) {
  const ref = useRef();
  const innerRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.3;
    ref.current.rotation.z = Math.sin(t * 0.2) * 0.08;
    innerRef.current.rotation.y = -t * 0.5;
    innerRef.current.rotation.x = t * 0.2;
  });

  const color = blocked ? "#FF3B3B" : "#10D07A";
  const emissive = blocked ? "#FF1010" : "#05A850";

  return (
    <group>
      {/* Outer gate ring */}
      <mesh ref={ref}>
        <torusGeometry args={[2.2, 0.06, 16, 80]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Inner spinning element */}
      <mesh ref={innerRef}>
        <torusGeometry args={[1.4, 0.04, 16, 60]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.6}
          metalness={0.95}
          roughness={0.05}
          opacity={0.7}
          transparent
        />
      </mesh>

      {/* Center sphere */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.35, 32, 32]} />
          <MeshDistortMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={1.2}
            metalness={0.8}
            roughness={0.15}
            distort={0.25}
            speed={2}
          />
        </mesh>
      </Float>
    </group>
  );
}

// Particle flow representing transactions
function TransactionParticles({ count = 80, blocked = false }) {
  const ref = useRef();

  const [positions, speeds, offsets] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const off = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.8 + (Math.random() - 0.5) * 2.5;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 2] = Math.sin(angle) * radius * 0.3;
      spd[i] = 0.2 + Math.random() * 0.6;
      off[i] = Math.random() * Math.PI * 2;
    }
    return [pos, spd, off];
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const geo = ref.current.geometry;
    const arr = geo.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + t * speeds[i] * 0.15;
      const radius = 2.8 + Math.sin(t * speeds[i] + offsets[i]) * 0.8;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = positions[i * 3 + 1] + Math.sin(t * speeds[i] * 0.5 + offsets[i]) * 0.3;
      arr[i * 3 + 2] = Math.sin(angle) * radius * 0.3;
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={blocked ? "#FF3B3B" : "#10D07A"}
        size={0.025}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Ambient floating geometry
function AmbientGeometry() {
  const ref1 = useRef();
  const ref2 = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref1.current.rotation.x = t * 0.2;
    ref1.current.rotation.y = t * 0.15;
    ref2.current.rotation.x = -t * 0.18;
    ref2.current.rotation.z = t * 0.22;
  });

  return (
    <>
      <mesh ref={ref1} position={[-5, 1.5, -3]}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color="#2563EB"
          emissive="#1040C0"
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.1}
          wireframe
          opacity={0.3}
          transparent
        />
      </mesh>
      <mesh ref={ref2} position={[5, -1.5, -4]}>
        <icosahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#D07A00"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
          wireframe
          opacity={0.25}
          transparent
        />
      </mesh>
    </>
  );
}

export default function ClearanceGateScene({ blocked = false, height = 400 }) {
  return (
    <div style={{ width: "100%", height, position: "relative" }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.05} />
        <pointLight position={[5, 5, 5]} intensity={blocked ? 0 : 1.5} color="#10D07A" />
        <pointLight position={[-5, -5, 5]} intensity={blocked ? 1.5 : 0} color="#FF3B3B" />
        <pointLight position={[0, 0, 8]} intensity={0.3} color="#2563EB" />

        <ClearanceGate blocked={blocked} />
        <TransactionParticles count={80} blocked={blocked} />
        <AmbientGeometry />
      </Canvas>
    </div>
  );
}
