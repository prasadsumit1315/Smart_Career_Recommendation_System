import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

function MatchTorusRings({ recommendations }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  const colors = ['#00f2fe', '#7f00ff', '#00f5a0', '#f6d365', '#ff416c'];

  return (
    <group ref={groupRef}>
      {recommendations.slice(0, 5).map((rec, idx) => {
        const radius = 1.3 + idx * 0.45;
        const tubeRadius = 0.045;
        const scoreFraction = Math.max(0.1, rec.match_percent / 100);
        const arc = scoreFraction * Math.PI * 1.8;
        const color = colors[idx % colors.length];

        return (
          <group key={rec.role || idx} rotation={[0, 0, (idx * Math.PI) / 4]}>
            {/* Background Track Ring */}
            <mesh>
              <torusGeometry args={[radius, tubeRadius, 16, 64, Math.PI * 2]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.06} />
            </mesh>
            {/* Active Match Arc */}
            <mesh>
              <torusGeometry args={[radius, tubeRadius + 0.015, 16, 64, arc]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={1.4}
                roughness={0.2}
              />
            </mesh>
          </group>
        );
      })}

      {/* Central Holographic Emblem */}
      <mesh>
        <octahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial
          color="#00f2fe"
          wireframe
          emissive="#00f2fe"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

export default function ThreeMatchRing({ recommendations = [] }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div style={{ width: '100%', height: '280px', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 1.2, 5.5], fov: 45 }}
        dpr={Math.min(window.devicePixelRatio || 1, 2)}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[6, 6, 6]} intensity={2} color="#00f2fe" />
        <pointLight position={[-6, -6, -6]} intensity={2} color="#7f00ff" />
        <MatchTorusRings recommendations={recommendations} />
      </Canvas>
    </div>
  );
}
