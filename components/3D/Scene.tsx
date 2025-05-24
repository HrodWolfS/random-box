"use client";

import Board from "@/components/3D/Board";
import CameraController from "@/components/3D/CameraController";
import Couch from "@/components/3D/Couch";
import Desk from "@/components/3D/Desk";
import Floor from "@/components/3D/Floor";
import Hat from "@/components/3D/Hat";
import LeftWall from "@/components/3D/LeftWall";
import PaperStack from "@/components/3D/PaperStack";
import Plant from "@/components/3D/Plant";
import Rug from "@/components/3D/Rug";
import Wall from "@/components/3D/Wall";
import { useStore } from "@/lib/store";
import { Environment, SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

export default function Scene() {
  const setCameraTarget = useStore((state) => state.setCameraTarget);
  const cameraTarget = useStore((state) => state.cameraTarget);
  const cameraTweening = useStore((state) => state.cameraTweening);

  // Gestionnaire pour les clics hors des éléments interactifs
  const handlePointerMissed = () => {
    // Ne rien faire si la caméra est déjà en position "room" ou en cours d'animation
    if (cameraTarget === "room" || cameraTweening) return;

    // Revenir à la vue globale
    setCameraTarget("room");
  };

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [4, 5, 6], fov: 40, near: 0.1, far: 100 }}
      onPointerMissed={handlePointerMissed}
      style={{ cursor: cameraTweening ? "wait" : "default" }}
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
        <Desk position={[0.5, 0, -0.3]} />
        <Couch position={[-1.9, 0, 0.2]} rotation={[0, Math.PI / 2, 0]} />
        <Couch position={[0.8, 0, -2]} />
        {/* Objets interactifs */}
        <Hat position={[0.5, 1, 0]} />
        <PaperStack position={[1.3, 0.64, 0]} />
        <Board position={[0.5, 1.6, -2]} />

        {/* Décorations */}
        <Plant position={[-2.3, 0, -2.4]} />
        <Rug position={[0.8, 0, 0]} />
      </Suspense>
    </Canvas>
  );
}
