"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface UnicornProps {
  mouseActive?: boolean;
}

export default function UnicornGlass({ mouseActive = true }: UnicornProps) {
  const unicornGroup = useRef<THREE.Group>(null);
  const leftWing = useRef<THREE.Mesh>(null);
  const rightWing = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Group>(null);

  // Generate trailing particle positions
  const trailCount = 30;
  const particlesRef = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 1. Hover / Flying animation — slow, weighty, elegant drift instead of a fast bob
    if (unicornGroup.current) {
      unicornGroup.current.position.y = Math.sin(t * 0.5) * 0.18;
      // Slight bank and yaw during hover — softer, slower
      unicornGroup.current.rotation.z = Math.sin(t * 0.35) * 0.025;
      unicornGroup.current.rotation.x = Math.cos(t * 0.22) * 0.015;

      // 2. Mouse tracking — smoother, more restrained follow (less puppy-like snap)
      if (mouseActive) {
        const targetX = state.pointer.x * 1.2;
        const targetY = state.pointer.y * 0.8;

        unicornGroup.current.position.x = THREE.MathUtils.lerp(
          unicornGroup.current.position.x,
          targetX,
          0.02
        );
        unicornGroup.current.position.y += THREE.MathUtils.lerp(
          0, // relative to float position
          targetY,
          0.02
        );

        // Yaw towards mouse — subtler
        unicornGroup.current.rotation.y = THREE.MathUtils.lerp(
          unicornGroup.current.rotation.y,
          state.pointer.x * 0.25,
          0.02
        );
      }
    }

    // 3. Wing motion — slow, graceful sway instead of a fast cartoon flap
    const flapSpeed = 1.1;
    const flapAngle = Math.sin(t * flapSpeed) * 0.12;

    if (leftWing.current) {
      leftWing.current.rotation.z = flapAngle;
    }
    if (rightWing.current) {
      rightWing.current.rotation.z = -flapAngle;
    }

    // 4. Head bobbing — reduced to a gentle, barely-there tilt
    if (headRef.current) {
      headRef.current.rotation.x = Math.sin(t * 0.7) * 0.025 - 0.1;
    }

    // 5. Animate trails — slowed to match the calmer body motion
    particlesRef.current.forEach((mesh, idx) => {
      if (mesh) {
        // Move particles backwards
        mesh.position.z += 0.022;
        // Float outwards
        mesh.position.y += Math.sin(t * 0.5 + idx) * 0.003;
        // Fade size out
        const scale = mesh.scale.x * 0.985;
        mesh.scale.set(scale, scale, scale);

        // Reset particle if too far
        if (mesh.position.z > 5 || scale < 0.05) {
          mesh.position.set(
            (unicornGroup.current?.position.x || 0) - 0.5 + (Math.random() - 0.5) * 0.5,
            (unicornGroup.current?.position.y || 0) + (Math.random() - 0.5) * 0.5,
            (unicornGroup.current?.position.z || 0) - 1.5
          );
          mesh.scale.set(1.0, 1.0, 1.0);
        }
      }
    });
  });

  // Share premium glass physical material parameters
  const glassMaterial = (
    <meshPhysicalMaterial
      transmission={0.9}
      thickness={1.2}
      roughness={0.12}
      clearcoat={1.0}
      clearcoatRoughness={0.1}
      ior={1.52}
      iridescence={1.0}
      iridescenceIOR={1.4}
      iridescenceThicknessRange={[100, 400]}
      color="#d8b4fe"
      envMapIntensity={2}
    />
  );

  return (
    <group>
      {/* 3D Flying Trails (Procedural Sparkles) */}
      {Array.from({ length: trailCount }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) particlesRef.current[i] = el;
          }}
          position={[-0.5 + (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, -2 - Math.random() * 3]}
        >
          <sphereGeometry args={[0.04 + Math.random() * 0.04, 8, 8]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#a855f7" : "#06b6d4"}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      {/* Main Unicorn Mesh Group */}
      <group ref={unicornGroup} position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]}>
        {/* Core Body */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.25, 1.4, 8]} />
          {glassMaterial}
        </mesh>

        {/* Neck */}
        <mesh
          position={[0, 0.4, 0.5]}
          rotation={[Math.PI / 6, 0, 0]}
        >
          <cylinderGeometry args={[0.18, 0.22, 0.8, 8]} />
          {glassMaterial}
        </mesh>

        {/* Head Joint */}
        <group ref={headRef} position={[0, 0.8, 0.8]}>
          {/* Head Shape */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.26, 0.26, 0.5]} />
            {glassMaterial}
          </mesh>

          {/* Ears */}
          <mesh position={[0.1, 0.2, -0.1]}>
            <coneGeometry args={[0.06, 0.2, 4]} />
            {glassMaterial}
          </mesh>
          <mesh position={[-0.1, 0.2, -0.1]}>
            <coneGeometry args={[0.06, 0.2, 4]} />
            {glassMaterial}
          </mesh>

          {/* Golden Emissive Horn */}
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <coneGeometry args={[0.04, 0.6, 6]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#06b6d4"
              emissiveIntensity={4.0}
              roughness={0.0}
            />
          </mesh>
        </group>

        {/* Left Wing */}
        <group position={[0.3, 0.2, -0.1]}>
          <mesh ref={leftWing} position={[0.4, 0, 0]}>
            <boxGeometry args={[0.8, 0.02, 0.5]} />
            {glassMaterial}
          </mesh>
        </group>

        {/* Right Wing */}
        <group position={[-0.3, 0.2, -0.1]}>
          <mesh ref={rightWing} position={[-0.4, 0, 0]}>
            <boxGeometry args={[0.8, 0.02, 0.5]} />
            {glassMaterial}
          </mesh>
        </group>

        {/* Dynamic Holographic Tail */}
        <mesh rotation={[-Math.PI / 3, 0, 0]}>
          <coneGeometry args={[0.1, 0.6, 6]} />
          <meshStandardMaterial
            color="#ec4899"
            emissive="#ec4899"
            emissiveIntensity={2.0}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
    </group>
  );
}
