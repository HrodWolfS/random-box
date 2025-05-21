"use client";

import { ThreeElements, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Plant(props: ThreeElements["group"]) {
  const leavesRef = useRef<THREE.Group>(null);

  // Animation douce du feuillage
  useFrame(({ clock }) => {
    if (leavesRef.current) {
      leavesRef.current.rotation.y =
        Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
      leavesRef.current.position.y =
        Math.sin(clock.getElapsedTime() * 0.5) * 0.02 + 0.9;
    }
  });

  return (
    <group {...props}>
      {/* Pot de la plante - cylindre terre cuite */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.15, 0.5, 16]} />
        <meshStandardMaterial color="#d7a088" />
      </mesh>

      {/* Dessus du pot - terre */}
      <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.18, 16]} />
        <meshStandardMaterial color="#5e4b3e" />
      </mesh>

      {/* Tige principale */}
      <mesh position={[0, 0.7, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.015, 0.4, 8]} />
        <meshStandardMaterial color="#2d4f1e" />
      </mesh>

      {/* Feuillage */}
      <group ref={leavesRef} position={[0, 0.9, 0]}>
        {/* Créer plusieurs groupes de feuilles à différentes hauteurs */}
        {[0, 0.1, 0.2].map((height, heightIndex) => (
          <group key={heightIndex} position={[0, height, 0]}>
            {/* Créer feuilles autour de la tige */}
            {[
              0,
              Math.PI / 3,
              (2 * Math.PI) / 3,
              Math.PI,
              (4 * Math.PI) / 3,
              (5 * Math.PI) / 3,
            ].map((angle, angleIndex) => {
              const scale = 0.2 - height * 0.15;
              const color = `rgb(${70 + height * 70}, ${
                180 - height * 30
              }, ${90})`;
              return (
                <group
                  key={angleIndex}
                  position={[Math.sin(angle) * 0.15, 0, Math.cos(angle) * 0.15]}
                  rotation={[(Math.random() - 0.5) * 0.7, angle, Math.PI / 3]}
                >
                  <mesh>
                    <sphereGeometry
                      args={[scale, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]}
                    />
                    <meshStandardMaterial color={color} />
                  </mesh>
                </group>
              );
            })}
          </group>
        ))}
      </group>
    </group>
  );
}
