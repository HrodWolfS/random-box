"use client";

import { ThreeElements } from "@react-three/fiber";
import { useMemo } from "react";
import { CanvasTexture, NearestFilter, RepeatWrapping } from "three";

function createPlankTexture(): CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#deb887";
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = "#c89b66";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, size / 2);
  ctx.lineTo(size, size / 2);
  ctx.stroke();
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(45, 45);
  texture.magFilter = NearestFilter;
  return texture;
}

export default function Floor(props: ThreeElements["mesh"]) {
  const plankTexture = useMemo(() => createPlankTexture(), []);

  return (
    <mesh
      {...props}
      receiveShadow
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
    >
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial
        map={plankTexture}
        roughness={0.6}
        metalness={0.1}
      />
    </mesh>
  );
}
