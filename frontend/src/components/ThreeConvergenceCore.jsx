import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function CoreSphere() {
  const meshRef = useRef();
  const wireRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.8;
      // Pulsing scale
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 4) * 0.08;
      meshRef.current.scale.set(scale, scale, scale);
    }
    if (wireRef.current) {
      wireRef.current.rotation.x += delta * 0.6;
      wireRef.current.rotation.z += delta * 0.4;
    }
  });

  return (
    <group>
      {/* Dense Glowing Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#00f2fe"
          emissive="#7f00ff"
          emissiveIntensity={1.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Wireframe Gyro Rings */}
      <mesh ref={wireRef}>
        <sphereGeometry args={[1.8, 16, 16]} />
        <meshBasicMaterial
          color="#00f2fe"
          wireframe
          transparent
          opacity={0.45}
        />
      </mesh>
    </group>
  );
}

function ConvergingParticles() {
  const count = 300;
  const particlesRef = useRef();

  // Initial random positions far away
  const [positions, initialDistances] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const dists = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 3.5 + Math.random() * 5.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
      dists[i] = radius;
    }
    return [pos, dists];
  }, [count]);

  useFrame((state, delta) => {
    if (!particlesRef.current) return;
    const array = particlesRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      let x = array[i * 3];
      let y = array[i * 3 + 1];
      let z = array[i * 3 + 2];

      const currentDist = Math.sqrt(x * x + y * y + z * z);
      // Move inward toward center
      if (currentDist < 1.1) {
        // Reset to outer shell
        const radius = 4.5 + Math.random() * 4.0;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        array[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        array[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        array[i * 3 + 2] = radius * Math.cos(phi);
      } else {
        const speed = 2.4 * delta;
        array[i * 3] -= (x / currentDist) * speed;
        array[i * 3 + 1] -= (y / currentDist) * speed;
        array[i * 3 + 2] -= (z / currentDist) * speed;
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#00f5a0"
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ThreeConvergenceCore() {
  return (
    <div style={{ width: '100%', height: '320px', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={Math.min(window.devicePixelRatio || 1, 2)}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={2.5} color="#00f2fe" />
        <pointLight position={[-5, -5, -5]} intensity={2} color="#7f00ff" />
        <CoreSphere />
        <ConvergingParticles />
      </Canvas>
    </div>
  );
}
