"use client";

import HistoryNote from "@/components/3D/HistoryNote";
import { useStore } from "@/lib/store";
import { RoundedBox, Text } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";

export default function Board(props: ThreeElements["group"]) {
  const history = useStore((state) => state.history);
  const setCameraTarget = useStore((state) => state.setCameraTarget);

  // Gérer le clic sur le tableau
  const handleClick = () => {
    setCameraTarget("board");
  };

  return (
    <group {...props} onClick={handleClick}>
      {/* Tableau en liège */}
      <RoundedBox args={[3, 2, 0.1]} radius={0.05} smoothness={4} castShadow>
        <meshStandardMaterial color="#d4a76a" />
      </RoundedBox>

      {/* Titre du tableau */}
      <Text
        position={[0, 0.8, 0.06]}
        fontSize={0.15}
        color="#111111"
        anchorX="center"
        anchorY="middle"
      >
        Historique des tirages
      </Text>

      {/* Notes d'historique */}
      <group position={[0, 0.1, 0.06]}>
        {history.length === 0 ? (
          <Text
            position={[0, 0, 0]}
            fontSize={0.1}
            color="#555555"
            anchorX="center"
            anchorY="middle"
          >
            Aucun tirage pour le moment
          </Text>
        ) : (
          history.slice(0, 9).map((name, index) => {
            // Calculer la position en grille 3x3
            const row = Math.floor(index / 3);
            const col = index % 3;
            const x = (col - 1) * 0.8;
            const y = 0.4 - row * 0.6;

            return (
              <HistoryNote key={name.id} position={[x, y, 0]} name={name} />
            );
          })
        )}
      </group>
    </group>
  );
}
