"use client";

import { useGLTF } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";

export default function Couch(props: ThreeElements["group"]) {
  const group = useRef<Group>(null);
  const { nodes, materials } = useGLTF("/models/couch.glb") as any;

  return (
    <group ref={group} {...props} dispose={null} scale={0.5}>
      <group {...nodes.Couch_Medium1}>
        <mesh
          geometry={nodes.Couch_Medium1_1.geometry}
          material={materials.Couch_Blue}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={nodes.Couch_Medium1_2.geometry}
          material={materials.Black}
          castShadow
          receiveShadow
        />
      </group>
    </group>
  );
}
