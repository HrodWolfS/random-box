"use client";

import { ThreeElements } from "@react-three/fiber";

export default function Wall(props: ThreeElements["mesh"]) {
  return (
    <mesh {...props} receiveShadow position={[0, 2, -3]} rotation={[0, 0, 0]}>
      <planeGeometry args={[12, 4]} />
      <meshStandardMaterial color="#f2f0ed" />
    </mesh>
  );
}
