"use client";

import { ThreeElements } from "@react-three/fiber";

export default function Floor(props: ThreeElements["mesh"]) {
  return (
    <mesh
      {...props}
      receiveShadow
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
    >
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#ff4" />
    </mesh>
  );
}
