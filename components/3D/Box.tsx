"use client";

import { useStore } from "@/lib/store";
import { RoundedBox } from "@react-three/drei";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Box(props: ThreeElements["group"]) {
  const meshRef = useRef<THREE.Mesh>(null);
  const boxShaking = useStore((state) => state.boxShaking);
  const drawName = useStore((state) => state.drawName);
  const setCameraTarget = useStore((state) => state.setCameraTarget);

  // Animation
  useFrame(() => {
    if (!meshRef.current || !boxShaking) return;

    // Animation simple de tremblement
    meshRef.current.rotation.z = Math.sin(Date.now() * 0.02) * 0.05;
    meshRef.current.rotation.x = Math.cos(Date.now() * 0.02) * 0.03;
  });

  // Gérer le clic sur la boîte
  const handleClick = () => {
    drawName();
    setCameraTarget("box");
  };

  return (
    <group {...props}>
      {/* Boîte principale */}
      <RoundedBox
        ref={meshRef}
        args={[1, 0.8, 1]}
        radius={0.1}
        smoothness={4}
        castShadow
        onClick={handleClick}
      >
        <meshPhysicalMaterial
          color="#111111"
          roughness={0.2}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          reflectivity={1}
        />
      </RoundedBox>

      {/* Fente en haut de la boîte */}
      <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, 0.05]} />
        <meshBasicMaterial color="#222222" />
      </mesh>
    </group>
  );
}
