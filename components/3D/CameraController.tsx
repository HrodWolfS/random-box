"use client";

import { useStore } from "@/lib/store";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CameraController() {
  const cameraTarget = useStore((state) => state.cameraTarget);
  const cameraPositions = useStore((state) => state.cameraPositions);
  const cameraZoom = useStore((state) => state.cameraZoom);
  const setCameraTweening = useStore((state) => state.setCameraTweening);

  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const lookAtTarget = useRef(new THREE.Vector3(0, 0.5, 0));
  const isTweening = useRef(false);

  // Mettre à jour la position cible lorsque cameraTarget change
  useEffect(() => {
    const position = cameraPositions[cameraTarget] ?? cameraPositions.default;
    const [x, y, z] = position;
    targetPosition.current.set(x, y, z);

    // Définir le point de visée en fonction de la cible
    switch (cameraTarget) {
      case "board":
        lookAtTarget.current.set(0, 1.8, -2);
        break;
      case "paper":
        lookAtTarget.current.set(1.3, 0.8, 0);
        break;
      case "hat":
        lookAtTarget.current.set(0.5, 1, 0);
        break;
      default:
        lookAtTarget.current.set(0, 0.5, 0);
        break;
    }

    // Indiquer que l'animation commence
    isTweening.current = true;
    setCameraTweening(true);
  }, [cameraTarget, cameraPositions, setCameraTweening]);

  // Animation fluide vers la nouvelle position
  useFrame(() => {
    if (!isTweening.current) return;

    // Vitesse de transition
    const lerpFactor = 0.05;

    // Animation de la position
    const distanceSquared = camera.position.distanceToSquared(
      targetPosition.current
    );
    camera.position.lerp(targetPosition.current, lerpFactor);

    // Animation du point de visée
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);

    const targetLookAtDir = new THREE.Vector3()
      .subVectors(lookAtTarget.current, camera.position)
      .normalize();

    const newDirection = new THREE.Vector3()
      .copy(currentLookAt)
      .lerp(targetLookAtDir, lerpFactor);

    camera.lookAt(camera.position.clone().add(newDirection.multiplyScalar(10)));

    // Mise à jour du FOV si c'est une caméra perspective
    if ("fov" in camera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, cameraZoom, lerpFactor);
      camera.updateProjectionMatrix();
    }

    // Vérifier si l'animation est terminée (seuil de proximité)
    if (distanceSquared < 0.01) {
      isTweening.current = false;
      setCameraTweening(false);
    }
  });

  return null;
}
