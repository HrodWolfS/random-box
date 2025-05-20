"use client";

import { RoundedBox } from "@react-three/drei";
import { useEffect, useState } from "react";

export function Box() {
  const [dimensions, setDimensions] = useState<[number, number, number]>([
    4, 2.5, 2,
  ]);

  useEffect(() => {
    const updateBoxSize = () => {
      const width = window.innerWidth;
      const ratio = width < 768 ? 2.5 : width < 1024 ? 3.5 : 4;

      const height = ratio * 0.6;
      const depth = ratio * 0.5;

      setDimensions([ratio, height, depth]);
    };

    updateBoxSize();
    window.addEventListener("resize", updateBoxSize);
    return () => window.removeEventListener("resize", updateBoxSize);
  }, []);

  const [w, h, d] = dimensions;

  return (
    <RoundedBox
      args={dimensions}
      radius={0.15}
      smoothness={8}
      castShadow
      receiveShadow
      position={[0, h / 2, 0]}
    >
      <meshStandardMaterial color="#F6A5C0" roughness={0.8} metalness={0} />
    </RoundedBox>
  );
}
