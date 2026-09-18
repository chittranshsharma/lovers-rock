"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

export interface StarPoint {
  id: string;
  x: number;
  y: number;
  z: number;
  color: string;
  glowColor: string;
  size: number;
  mood: string;
}

interface StarfieldContentProps {
  userStars: StarPoint[];
  isBloomActive: boolean;
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
}

function StarParticles({ userStars, isBloomActive, mousePos }: StarfieldContentProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const userGroupRef = useRef<THREE.Group>(null);

  // TV Girl ambient silver-halide film dust — small, faint, NO additive blowout
  const { ambientPositions, ambientColors } = useMemo(() => {
    const count = 380;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const baseColors = [
      new THREE.Color("#4a4a52"), // dark silver dust
      new THREE.Color("#6e6a72"), // muted film grain
      new THREE.Color("#8a3055"), // deep dim magenta
      new THREE.Color("#1a3575"), // deep dim blue
      new THREE.Color("#555048"), // vintage paper ash
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22 - 6;
      const c = baseColors[Math.floor(Math.random() * baseColors.length)];
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }
    return { ambientPositions: pos, ambientColors: cols };
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.01;
      pointsRef.current.rotation.x += delta * 0.002;
      // Smooth subtle mouse parallax
      pointsRef.current.rotation.y += (mousePos.current.x * 0.4 - pointsRef.current.rotation.y) * 0.02;
      pointsRef.current.rotation.x += (-mousePos.current.y * 0.25 - pointsRef.current.rotation.x) * 0.02;
    }
    if (userGroupRef.current) {
      userGroupRef.current.rotation.z += delta * (isBloomActive ? 0.04 : 0.01);
    }
  });

  return (
    <>
      {/* Ambient dust — NormalBlending prevents white center wash */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ambientPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[ambientColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          vertexColors
          transparent
          opacity={0.35}
          sizeAttenuation
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </points>

      {/* User generated constellation stars */}
      <group ref={userGroupRef}>
        {userStars.map((star) => (
          <group key={star.id} position={[star.x, star.y, star.z]}>
            <mesh>
              <sphereGeometry args={[isBloomActive ? star.size * 1.5 : star.size, 16, 16]} />
              <meshBasicMaterial color={star.color} />
            </mesh>
            <mesh>
              <sphereGeometry args={[isBloomActive ? star.size * 3.5 : star.size * 2.2, 16, 16]} />
              <meshBasicMaterial
                color={star.glowColor}
                transparent
                opacity={isBloomActive ? 0.4 : 0.18}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        ))}
      </group>
    </>
  );
}

interface StarfieldProps {
  userStars: StarPoint[];
  isBloomActive: boolean;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export default function Starfield({ userStars, isBloomActive, onCanvasReady }: StarfieldProps) {
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2 }}>
      <Canvas
        gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
        camera={{ position: [0, 0, 15], fov: 60 }}
        onCreated={({ gl }) => {
          if (onCanvasReady) onCanvasReady(gl.domElement);
        }}
      >
        <StarParticles
          userStars={userStars}
          isBloomActive={isBloomActive}
          mousePos={mouseRef}
        />
        {/* Calibrated Bloom: high threshold (0.75) ensures only actual stars bloom, never background */}
        <EffectComposer>
          <Bloom
            intensity={isBloomActive ? 1.0 : 0.3}
            luminanceThreshold={0.75}
            luminanceSmoothing={0.3}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
