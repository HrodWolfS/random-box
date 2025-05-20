"use client";

import { Environment, OrbitControls, SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { Box } from "@/components/3D/Box";

export default function Scene() {
  const [cameraZ, setCameraZ] = useState(5);

  useEffect(() => {
    const updateCamera = () => {
      const width = window.innerWidth;
      const z = width < 768 ? 7.5 : width < 1024 ? 8.5 : 9.5;
      setCameraZ(z);
    };

    updateCamera();
    window.addEventListener("resize", updateCamera);
    return () => window.removeEventListener("resize", updateCamera);
  }, []);

  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [0, 2.5, cameraZ], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <SoftShadows size={10} samples={16} focus={0.5} />

        <Suspense fallback={null}>
          <Environment preset="sunset" />
        </Suspense>

        <Box />
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
