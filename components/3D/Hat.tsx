"use client";

import { useStore } from "@/lib/store";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Hat(props: ThreeElements["group"]) {
  const hatRef = useRef<THREE.Group>(null);
  const boxShaking = useStore((state) => state.boxShaking);
  const drawName = useStore((state) => state.drawName);
  const setCameraTarget = useStore((state) => state.setCameraTarget);

  // Animation
  useFrame(() => {
    if (!hatRef.current || !boxShaking) return;

    // Animation simple de tremblement
    hatRef.current.rotation.z = Math.sin(Date.now() * 0.02) * 0.05;
    hatRef.current.rotation.x = Math.cos(Date.now() * 0.02) * 0.03;
  });

  // Gérer le clic sur le chapeau
  const handleClick = () => {
    drawName();
    setCameraTarget("box");
  };

  return (
    <group ref={hatRef} {...props} onClick={handleClick}>
      {/* Rebord du chapeau (disque plat) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.05, 32]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {/* Partie principale du chapeau (cylindre) */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.45, 0.5, 0.8, 32]} />
        <meshPhysicalMaterial
          color="#111111"
          roughness={0.3}
          clearcoat={0.4}
          clearcoatRoughness={0.25}
          reflectivity={1}
        />
      </mesh>

      {/* Bande décorative */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.51, 0.51, 0.1, 32]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Ouverture en haut (pour l'effet de chapeau creux) */}
      <mesh position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.45, 32]} />
        <meshBasicMaterial color="#111111" />
      </mesh>
    </group>
  );
}
