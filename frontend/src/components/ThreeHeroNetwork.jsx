import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';

// Detect WebGL support
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

// Particle Constellation Network
function Constellation({ mouse }) {
  const pointsRef = useRef();
  const count = 120;

  // Generate particle positions
  const { positions, linesData } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const coords = [];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 12;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      coords.push(new THREE.Vector3(x, y, z));
    }

    // Connect particles closer than threshold
    const linePairs = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dist = coords[i].distanceTo(coords[j]);
        if (dist < 3.2) {
          linePairs.push(coords[i].x, coords[i].y, coords[i].z);
          linePairs.push(coords[j].x, coords[j].y, coords[j].z);
        }
      }
    }

    return {
      positions: pos,
      linesData: new Float32Array(linePairs),
    };
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Slow rotation
      pointsRef.current.rotation.y += delta * 0.04;
      pointsRef.current.rotation.x += delta * 0.02;

      // Mouse Parallax lerping
      const targetX = mouse.current.x * 0.8;
      const targetY = mouse.current.y * 0.6;
      pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, targetX, 0.05);
      pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, targetY, 0.05);
    }
  });

  return (
    <group ref={pointsRef}>
      {/* Network Nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          color="#00f2fe"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Network Synapse Lines */}
      {linesData.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={linesData.length / 3}
              array={linesData}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#7f00ff"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      )}
    </group>
  );
}

// Floating Orbiting Career Skill Badges
function OrbitingSkillBadge({ text, radius, speed, yOffset, color }) {
  const badgeRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * speed;
    const x = Math.cos(time) * radius;
    const z = Math.sin(time) * radius;
    if (badgeRef.current) {
      badgeRef.current.position.set(x, yOffset + Math.sin(time * 2) * 0.4, z);
    }
  });

  return (
    <group ref={badgeRef}>
      <mesh>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.2}
        />
      </mesh>
      <Html distanceFactor={14} center>
        <div
          style={{
            background: 'rgba(15, 19, 36, 0.85)',
            border: `1px solid ${color}`,
            borderRadius: '16px',
            padding: '3px 10px',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            boxShadow: `0 0 12px ${color}66`,
            backdropFilter: 'blur(8px)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {text}
        </div>
      </Html>
    </group>
  );
}

export default function ThreeHeroNetwork() {
  const mouse = useRef({ x: 0, y: 0 });
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setWebGLSupported(isWebGLAvailable());
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 2D CSS Fallback for WebGL unsupported or prefers-reduced-motion
  if (!webGLSupported || reducedMotion) {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(127, 0, 255, 0.15) 0%, rgba(10, 12, 22, 1) 70%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 9], fov: 60 }}
        dpr={Math.min(window.devicePixelRatio || 1, 2)}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f2fe" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#7f00ff" />

        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            <Constellation mouse={mouse} />
          </Float>

          {/* Orbiting Career Node Badges */}
          <OrbitingSkillBadge text="Python" radius={5.2} speed={0.4} yOffset={1.2} color="#00f2fe" />
          <OrbitingSkillBadge text="Machine Learning" radius={6.0} speed={0.32} yOffset={-1.4} color="#7f00ff" />
          <OrbitingSkillBadge text="Django" radius={4.5} speed={0.45} yOffset={0.6} color="#00f5a0" />
          <OrbitingSkillBadge text="SQL" radius={5.8} speed={0.38} yOffset={-0.8} color="#f6d365" />
          <OrbitingSkillBadge text="React" radius={4.8} speed={0.5} yOffset={1.8} color="#4facfe" />
          <OrbitingSkillBadge text="Cloud / AWS" radius={6.5} speed={0.28} yOffset={-1.8} color="#ff416c" />
        </Suspense>
      </Canvas>
    </div>
  );
}
