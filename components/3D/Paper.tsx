"use client";

import { Name } from "@/lib/store";
import { Text } from "@react-three/drei";
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
  targetPosition = [0.5, 1, 0],
  onClick,
  ...props
}: PaperProps) {
  const paperRef = useRef<THREE.Group>(null);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [scale, setScale] = useState<[number, number, number]>([1, 1, 1]);
  const [flying, setFlying] = useState(isFlying);
  const [exiting, setExiting] = useState(isExiting);
  const [progress, setProgress] = useState(0);

  // Mettre à jour les états en fonction des props
  useEffect(() => {
    setFlying(isFlying);
    setExiting(isExiting);
    setProgress(0);
    setScale([1, 1, 1]); // Réinitialiser le scale
    if (paperRef.current) {
      paperRef.current.visible = true;
    }
  }, [isFlying, isExiting]);

  // Animation
  useFrame(() => {
    if (!paperRef.current) return;

    if (flying || exiting) {
      // Augmenter la progression de l'animation
      setProgress((prev) => {
        const newProgress = prev + 0.01; // Animation plus lente
        if (newProgress >= 1) {
          setFlying(false);
          setExiting(false);
          if (paperRef.current) {
            paperRef.current.visible = false;
          }
          return 1;
        }
        return newProgress;
      });

      // Animation de vol vers le chapeau
      if (flying) {
        // Position de départ
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

        const t = progress;

        // Point de contrôle pour créer un arc qui monte puis descend vers le chapeau
        const controlPoint: [number, number, number] = [
          (startPos[0] + targetPosition[0]) / 2,
          Math.max(startPos[1], targetPosition[1]) + 2, // Point haut de l'arc
          (startPos[2] + targetPosition[2]) / 2,
        ];

        // Courbe de Bézier quadratique pour un mouvement fluide
        const pos: [number, number, number] = [
          (1 - t) * (1 - t) * startPos[0] +
            2 * (1 - t) * t * controlPoint[0] +
            t * t * targetPosition[0],

          (1 - t) * (1 - t) * startPos[1] +
            2 * (1 - t) * t * controlPoint[1] +
            t * t * targetPosition[1],

          (1 - t) * (1 - t) * startPos[2] +
            2 * (1 - t) * t * controlPoint[2] +
            t * t * targetPosition[2],
        ];

        setPosition(pos);

        // Rotation qui s'accélère vers la fin (effet d'aspiration)
        const rotationSpeed = 1 + t * 4; // Accélération de la rotation
        setRotation([
          t * Math.PI * 2 * rotationSpeed,
          t * Math.PI * 1.5 * rotationSpeed,
          Math.sin(t * Math.PI * 3) * 0.3,
        ]);

        // Effet de scale : rétrécissement progressif dans les 30% finaux de l'animation
        let scaleValue = 1;
        if (t > 0.7) {
          // Commencer à rétrécir à partir de 70% de l'animation
          const shrinkProgress = (t - 0.7) / 0.3; // Normaliser entre 0 et 1
          scaleValue = 1 - shrinkProgress * 0.8; // Rétrécir jusqu'à 20% de la taille originale
        }
        setScale([scaleValue, scaleValue, scaleValue]);
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
      scale={flying || exiting ? scale : [1, 1, 1]}
      onClick={onClick}
    >
      {/* Feuille de papier */}
      <mesh rotation={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[0.7, 0.002, 0.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

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
