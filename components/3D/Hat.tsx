import { useStore } from "@/lib/store";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Group, Material, Mesh } from "three";

interface TopHatProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}

interface GLTFResult {
  nodes: {
    "Top_hat_01_Circle003-Mesh": Mesh;
    "Top_hat_01_Circle003-Mesh_1": Mesh;
    "Top_hat_01_Circle003-Mesh_2": Mesh;
  };
  materials: {
    "1A1A1A": Material;
    "383838": Material;
    "282828": Material;
  };
}

export default function TopHat(props: TopHatProps) {
  const group = useRef<Group>(null);
  // @ts-ignore - Ignorer les erreurs de typage pour useGLTF
  const { nodes, materials } = useGLTF("/models/top-hat.glb");
  const setCameraTarget = useStore((state) => state.setCameraTarget);
  const cameraTweening = useStore((state) => state.cameraTweening);
  const [hovered, setHovered] = useState(false);

  // Animation de survolement/tremblement
  useFrame(() => {
    if (hovered && group.current) {
      group.current.rotation.y += 0.01;
    }
  });

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      scale={0.04}
      rotation={[-Math.PI, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        if (!cameraTweening) {
          setCameraTarget("hat");
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!cameraTweening) {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "default";
      }}
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
