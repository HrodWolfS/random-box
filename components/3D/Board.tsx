"use client";

import HistoryNote from "@/components/3D/HistoryNote";
import { useStore } from "@/lib/store";
import { Text, useGLTF } from "@react-three/drei";
import { ThreeElements, ThreeEvent } from "@react-three/fiber";
import { useState } from "react";

export default function Board(props: ThreeElements["group"]) {
  const setCameraTarget = useStore((state) => state.setCameraTarget);
  const cameraTweening = useStore((state) => state.cameraTweening);
  const history = useStore((state) => state.history);
  const [hovered, setHovered] = useState(false);

  console.log("Board - Historique actuel:", history);

  const { nodes, materials } = useGLTF("/models/board.glb") as any;

  // Gérer le clic sur le tableau
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!cameraTweening) {
      setCameraTarget("board");
    }
  };

  return (
    <group
      {...props}
      onClick={handleClick}
      onPointerOver={(e: ThreeEvent<MouseEvent>) => {
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
      <primitive
        object={nodes.Message_Board}
        scale={[0.02, 0.02, 0.02]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      {/* Paper background behind the title */}
      <mesh position={[0.2, 1.45, 0]} rotation={[0, 0, 0.1]}>
        <planeGeometry args={[1.2, 0.2]} />
        <meshStandardMaterial color="#52a9ff" toneMapped={false} />
      </mesh>
      {/* Long note at the top with "historique" */}
      <Text
        position={[0.2, 1.45, 0.01]}
        rotation={[0, 0, 0.1]}
        fontSize={0.1}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        historique des tirages
      </Text>

      {/* Notes d'historique affichées dans le tableau */}
      <group position={[0, 0.4, 0.1]}>
        {!Array.isArray(history) || history.length === 0 ? (
          <Text
            position={[0, 0, 0]}
            fontSize={0.08}
            color="#444444"
            anchorX="center"
            anchorY="middle"
          >
            Aucun tirage pour le moment
          </Text>
        ) : (
          history?.slice?.(0, 9)?.map((name, index) => {
            console.log(`Affichage note ${index}:`, name);
            const row = Math.floor(index / 3);
            const col = index % 3;
            const x = (col - 1) * 0.4;
            const y = 0.2 - row * 0.3;

            return (
              <HistoryNote key={name.id} position={[x, y, 0]} name={name} />
            );
          })
        )}
      </group>
    </group>
  );
}
