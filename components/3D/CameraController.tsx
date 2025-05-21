"use client";

import { useStore } from "@/lib/store";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CameraController() {
  const cameraTarget = useStore((state) => state.cameraTarget);
  const cameraZoom = useStore((state) => state.cameraZoom);
  const cameraRef = useRef<THREE.Vector3>(new THREE.Vector3(10, 10, 10));
  const lookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.5, 0));

  useEffect(() => {
    // Définir les positions cibles en fonction de la cible sélectionnée
    switch (cameraTarget) {
      case "desk":
        lookAtRef.current.set(0, 0.5, 0);
        cameraRef.current.set(4, 3, 4);
        break;
      case "board":
        lookAtRef.current.set(0, 1.8, -2);
        cameraRef.current.set(0, 2, 0);
        break;
      case "box":
        lookAtRef.current.set(0, 0.8, 0); // Pointer vers le milieu du chapeau
        cameraRef.current.set(2, 2, 2);
        break;
      default:
        lookAtRef.current.set(0, 0.5, 0);
        cameraRef.current.set(4, 5, 6);
        break;
    }
  }, [cameraTarget]);

  useFrame(({ camera }) => {
    // Animation douce de la caméra vers sa cible
    camera.position.lerp(cameraRef.current, 0.05);

    // Calculer la direction vers laquelle la caméra doit regarder
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);

    // Créer un vecteur temporaire pour la cible
    const targetLookAt = new THREE.Vector3()
      .subVectors(lookAtRef.current, camera.position)
      .normalize();

    // Interpréter la rotation
    const newDirection = new THREE.Vector3()
      .copy(currentLookAt)
      .lerp(targetLookAt, 0.05);

    // Appliquer la nouvelle direction
    camera.lookAt(camera.position.clone().add(newDirection.multiplyScalar(10)));

    // Ajuster le zoom de la caméra (vérifier si c'est une PerspectiveCamera)
    if ("fov" in camera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, cameraZoom, 0.05);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
