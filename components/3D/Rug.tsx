"use client";

import { ThreeElements } from "@react-three/fiber";

export default function Rug(props: ThreeElements["mesh"]) {
  return (
    <group {...props}>
      {/* Base du tapis */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.001, 0]}
        receiveShadow
      >
        <planeGeometry args={[5, 3.5]} />
        <meshStandardMaterial color="#f4a261" />
      </mesh>

      {/* Bordures décoratives */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 1.8]}>
        <planeGeometry args={[5, 0.1]} />
        <meshStandardMaterial color="#e76f51" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, -1.8]}>
        <planeGeometry args={[5, 0.1]} />
        <meshStandardMaterial color="#e76f51" />
      </mesh>
    </group>
  );
}
