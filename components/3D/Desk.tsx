"use client";

import { RoundedBox } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";

type DeskProps = ThreeElements["group"] & {
  width?: number;
  depth?: number;
  height?: number;
};

export default function Desk({
  width = 3,
  depth = 1.5,
  height = 0.5,
  ...props
}: DeskProps) {
  // Épaisseur du plateau
  const tableTopThickness = 0.08;
  // Diamètre des pieds
  const legDiameter = 0.08;
  // Hauteur des pieds
  const legHeight = height - tableTopThickness;
  // Positionnement des pieds par rapport au centre
  const legPositionX = width / 2 - legDiameter;
  const legPositionZ = depth / 2 - legDiameter;

  // Positions des pieds
  const legPositions: [number, number, number][] = [
    [-legPositionX, legHeight / 2, -legPositionZ],
    [legPositionX, legHeight / 2, -legPositionZ],
    [-legPositionX, legHeight / 2, legPositionZ],
    [legPositionX, legHeight / 2, legPositionZ],
  ];

  return (
    <group {...props}>
      {/* Plateau du bureau */}
      <RoundedBox
        args={[width, tableTopThickness, depth]}
        radius={0.05}
        smoothness={4}
        position={[0, height - tableTopThickness / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#e3d4b4" />
      </RoundedBox>

      {/* Pieds du bureau cylindriques */}
      {legPositions.map((position, index) => (
        <mesh key={index} position={position} castShadow>
          <cylinderGeometry
            args={[legDiameter / 2, legDiameter / 2, legHeight, 20]}
          />
          <meshStandardMaterial color="#333333" />
        </mesh>
      ))}
    </group>
  );
}
