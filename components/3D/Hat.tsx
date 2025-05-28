import { useStore } from "@/lib/store";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import confetti from "canvas-confetti";
import { useRef, useState } from "react";
import { Group, Material, Mesh } from "three";
import Paper from "./Paper";

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
  const drawnName = useStore((state) => state.drawnName);
  const drawRandomName = useStore((state) => state.drawRandomName);
  const history = useStore((state) => state.history);
  const [hovered, setHovered] = useState(false);

  // Animation de survolement/tremblement
  useFrame(() => {
    if (hovered && group.current) {
      group.current.rotation.y += 0.01;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();

    if (history.length === 0) {
      console.log("Aucun nom dans l'historique pour tirer au sort");
      return;
    }

    console.log("Clic sur le chapeau - Tirage aléatoire");
    drawRandomName();

    // Effet confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.4 },
      scalar: 0.8,
      zIndex: 3000,
    });

    // Pas de zoom automatique pour voir l'animation du papier
  };

  return (
    <>
      <group
        ref={group}
        {...props}
        dispose={null}
        scale={0.04}
        rotation={[-Math.PI, 0, 0]}
        onClick={handleClick}
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

      {/* Papier qui sort du chapeau */}
      {drawnName && (
        <Paper
          name={drawnName}
          isExiting
          position={[0.5, 1, 0]} // départ : haut du chapeau
          targetPosition={[0, 1.5, -1.5]} // arrivée : en face de l'utilisateur
        />
      )}
    </>
  );
}

useGLTF.preload("/models/top-hat.glb");
