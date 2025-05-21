"use client";

import Board from "@/components/3D/Board";
import CameraController from "@/components/3D/CameraController";
import Desk from "@/components/3D/Desk";
import Floor from "@/components/3D/Floor";
import Hat from "@/components/3D/Hat";
import LeftWall from "@/components/3D/LeftWall";
import PaperStack from "@/components/3D/PaperStack";
import Plant from "@/components/3D/Plant";
import Wall from "@/components/3D/Wall";
import { Environment, SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

export default function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [4, 5, 6], fov: 40, near: 0.1, far: 100 }}
    >
      <SoftShadows size={10} samples={16} />
      <color attach="background" args={["#f3f0eb"]} />
      <fog attach="fog" args={["#f3f0eb", 20, 30]} />

      <ambientLight intensity={0.8} />
      <directionalLight
        position={[5, 8, 3]}
        intensity={1.5}
        castShadow
        shadow-mapSize={1024}
      />

      <CameraController />

      <Suspense fallback={null}>
        {/* Environnement et décor */}
        <Environment preset="apartment" />
        <Floor />
        <Wall position={[0, 2, -3]} />
        <LeftWall />

        {/* Mobilier */}
        <Desk position={[1, 0, -1.7]} />

        {/* Objets interactifs */}
        <Hat position={[0.5, 1, -1.7]} />
        <PaperStack position={[1.8, 0.5, -1.7]} />
        <Board position={[0.5, 1.8, -3]} />

        {/* Décorations */}
        <Plant position={[-2.4, 0, -2.4]} />
      </Suspense>
    </Canvas>
  );
}
