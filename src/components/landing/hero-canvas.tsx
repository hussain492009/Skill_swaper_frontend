"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import UnicornGlass from "./unicorn-glass";

function TwinklingStars() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 250;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute in a spherical region
      const radius = 6 + Math.random() * 12;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi) - 4.0; // Pushed back slightly
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      // Twinkle rotation
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.012;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.006;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);
  const meshesRef = useRef<THREE.Mesh[]>([]);

  const shapes = useMemo(() => {
    return Array.from({ length: 10 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        -3 - Math.random() * 5,
      ] as [number, number, number],
      scale: 0.12 + Math.random() * 0.22,
      type: Math.floor(Math.random() * 3), // 0: octahedron, 1: torus, 2: dodecahedron
      speed: 0.3 + Math.random() * 0.6,
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshesRef.current.forEach((mesh, idx) => {
      if (mesh) {
        mesh.rotation.x += 0.004 * shapes[idx].speed;
        mesh.rotation.y += 0.008 * shapes[idx].speed;
        mesh.position.y += Math.sin(t * shapes[idx].speed + idx) * 0.0015;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, idx) => {
        let geometry;
        if (shape.type === 0) {
          geometry = <octahedronGeometry args={[1, 0]} />;
        } else if (shape.type === 1) {
          geometry = <torusGeometry args={[0.5, 0.15, 8, 24]} />;
        } else {
          geometry = <dodecahedronGeometry args={[0.6, 0]} />;
        }

        return (
          <mesh
            key={idx}
            ref={(el) => {
              if (el) meshesRef.current[idx] = el;
            }}
            position={shape.position}
            scale={[shape.scale, shape.scale, shape.scale]}
          >
            {geometry}
            <meshPhysicalMaterial
              transmission={0.85}
              thickness={0.6}
              roughness={0.15}
              clearcoat={1.0}
              color={idx % 2 === 0 ? "#06b6d4" : "#a855f7"}
              transparent
              opacity={0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        className="pointer-events-auto"
      >
        <ambientLight intensity={0.4} />
        
        {/* Spotlighting for dramatic crystal reflections */}
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#06b6d4" />
        <pointLight position={[-5, 5, 5]} intensity={1.5} color="#a855f7" />
        <directionalLight position={[0, 10, 5]} intensity={1.0} color="#ffffff" />
        
        <Suspense fallback={null}>
          <TwinklingStars />
          <FloatingShapes />
          <UnicornGlass />
        </Suspense>
        
        {/* Orbit controls disabled for natural experience, but can be configured */}
      </Canvas>
    </div>
  );
}
