"use client";

import { ThreeElements } from "@react-three/fiber";

export default function LeftWall(props: ThreeElements["mesh"]) {
  return (
    <mesh
      {...props}
      receiveShadow
      position={[-3, 2, 1.5]}
      rotation={[0, Math.PI / 2, 0]}
    >
      <planeGeometry args={[9, 4]} />
      <meshStandardMaterial color="#f2f0ed" />
    </mesh>
  );
}
