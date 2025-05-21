"use client";

import { Name } from "@/lib/store";
import { RoundedBox, Text } from "@react-three/drei";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type PaperProps = ThreeElements["group"] & {
  name?: Name;
  isFlying?: boolean;
  isExiting?: boolean;
  targetPosition?: [number, number, number];
  onClick?: () => void;
};

export default function Paper({
  name,
  isFlying = false,
  isExiting = false,
  targetPosition = [0, 0.5, 0],
  onClick,
  ...props
}: PaperProps) {
  const paperRef = useRef<THREE.Group>(null);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [flying, setFlying] = useState(isFlying);
  const [exiting, setExiting] = useState(isExiting);
  const [progress, setProgress] = useState(0);

  // Mettre à jour les états en fonction des props
  useEffect(() => {
    setFlying(isFlying);
    setExiting(isExiting);
    setProgress(0);
  }, [isFlying, isExiting]);

  // Animation
  useFrame(() => {
    if (!paperRef.current) return;

    if (flying || exiting) {
      // Augmenter la progression de l'animation
      setProgress((prev) => {
        const newProgress = prev + 0.02;
        if (newProgress >= 1) {
          setFlying(false);
          setExiting(false);
          return 1;
        }
        return newProgress;
      });

      // Animation de vol
      if (flying) {
        // S'assurer que props.position est défini et de type [number, number, number]
        const defaultPos: [number, number, number] = [1.5, 0.5, 0];
        let startPos: [number, number, number];

        if (props.position) {
          const pos = props.position;
          if (Array.isArray(pos) && pos.length === 3) {
            startPos = [pos[0], pos[1], pos[2]];
          } else if (
            typeof pos === "object" &&
            "x" in pos &&
            "y" in pos &&
            "z" in pos
          ) {
            startPos = [pos.x, pos.y, pos.z];
          } else {
            startPos = defaultPos;
          }
        } else {
          startPos = defaultPos;
        }

        const midPos: [number, number, number] = [
          (startPos[0] + targetPosition[0]) / 2,
          Math.max(startPos[1], targetPosition[1]) + 1,
          (startPos[2] + targetPosition[2]) / 2,
        ];

        // Interpolation quadratique pour créer un arc
        const t = progress;
        const pos: [number, number, number] = [
          (1 - t) * (1 - t) * startPos[0] +
            2 * (1 - t) * t * midPos[0] +
            t * t * targetPosition[0],
          (1 - t) * (1 - t) * startPos[1] +
            2 * (1 - t) * t * midPos[1] +
            t * t * targetPosition[1],
          (1 - t) * (1 - t) * startPos[2] +
            2 * (1 - t) * t * midPos[2] +
            t * t * targetPosition[2],
        ];

        setPosition(pos);

        // Rotation pendant le vol
        setRotation([
          t * Math.PI * 2,
          t * Math.PI,
          Math.sin(t * Math.PI * 2) * 0.3,
        ]);
      }

      // Animation de sortie de la boîte
      if (exiting) {
        const startPos: [number, number, number] = [0, 0.8, 0];
        const endPos: [number, number, number] = [0, 1.5, -1.5];

        // Position linéaire entre départ et arrivée
        const pos: [number, number, number] = [
          startPos[0] + (endPos[0] - startPos[0]) * progress,
          startPos[1] + (endPos[1] - startPos[1]) * progress,
          startPos[2] + (endPos[2] - startPos[2]) * progress,
        ];

        setPosition(pos);

        // Rotation pendant la sortie
        setRotation([
          progress * Math.PI * 0.5,
          0,
          Math.sin(progress * Math.PI * 4) * 0.2,
        ]);
      }
    }
  });

  return (
    <group
      ref={paperRef}
      {...props}
      position={flying || exiting ? position : props.position}
      rotation={flying || exiting ? rotation : props.rotation}
      onClick={onClick}
    >
      {/* Feuille de papier */}
      <RoundedBox
        args={[0.7, 0.01, 0.5]}
        rotation={[0, 1.4, 0]}
        radius={0.02}
        smoothness={4}
        castShadow
      >
        <meshStandardMaterial color="#ffffff" />
      </RoundedBox>

      {/* Texte sur la feuille si un nom est fourni */}
      {name && (
        <Text
          position={[0, 0.02, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.12}
          color="#111111"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.6}
          textAlign="center"
        >
          {name.text}
        </Text>
      )}
    </group>
  );
}
