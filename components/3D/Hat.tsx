import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function TopHat(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/models/top-hat.glb");

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      scale={0.04}
      rotation={[-Math.PI, 0, 0]}
    >
      <mesh
        geometry={nodes["Top_hat_01_Circle003-Mesh"].geometry}
        material={materials["1A1A1A"]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={nodes["Top_hat_01_Circle003-Mesh_1"].geometry}
        material={materials["383838"]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={nodes["Top_hat_01_Circle003-Mesh_2"].geometry}
        material={materials["282828"]}
        castShadow
        receiveShadow
      />
    </group>
  );
}

useGLTF.preload("/models/top-hat.glb");
