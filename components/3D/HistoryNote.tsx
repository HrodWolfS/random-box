"use client";

import { Name } from "@/lib/store";
import { RoundedBox, Text } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";
import { useState } from "react";

type HistoryNoteProps = Omit<ThreeElements["group"], "name"> & {
  name: Name;
};

export default function HistoryNote({ name, ...props }: HistoryNoteProps) {
  const [hovered, setHovered] = useState(false);

  // Rotation aléatoire légèrement inclinée pour un effet plus naturel
  const randomRotation = [
    (Math.random() - 0.5) * 0.2,
    (Math.random() - 0.5) * 0.2,
    (Math.random() - 0.5) * 0.2,
  ];

  // Couleur aléatoire pastel
  const colors = ["#ffcccb", "#ffffcc", "#ccffcc", "#cce0ff", "#e0ccff"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  // Agrandissement au survol
  const scale = hovered ? 1.1 : 1;

  return (
    <group
      {...props}
      rotation={randomRotation as [number, number, number]}
      scale={[scale, scale, scale]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Post-it ou note */}
      <RoundedBox
        args={[0.6, 0.4, 0.01]}
        radius={0.02}
        smoothness={4}
        castShadow
      >
        <meshStandardMaterial color={randomColor} />
      </RoundedBox>

      {/* Texte du nom */}
      <Text
        position={[0, 0, 0.02]}
        fontSize={0.1}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.5}
        textAlign="center"
      >
        {name.text}
      </Text>
    </group>
  );
}
