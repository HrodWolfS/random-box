"use client";

import { useGLTF } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";

export default function Desk(props: ThreeElements["group"]) {
  const { nodes, materials } = useGLTF("/models/Table.glb") as any;
  console.log(nodes);

  return (
    <group {...props} dispose={null} scale={[2.6, 2.6, 2.6]}>
      <mesh geometry={nodes.tableCoffee.geometry} castShadow receiveShadow>
        <meshStandardMaterial color="#d9a066" />
      </mesh>
      <mesh geometry={nodes.tableCoffee_1.geometry} castShadow receiveShadow>
        <meshStandardMaterial color="#8f563b" />
      </mesh>
    </group>
  );
}
