"use client";

import { useStore } from "@/lib/store";
import { Html } from "@react-three/drei";
import { ThreeElements } from "@react-three/fiber";
import { useEffect, useState } from "react";
import Paper from "./Paper";

export default function PaperStack(props: ThreeElements["group"]) {
  const [inputValue, setInputValue] = useState("");
  const [hovered, setHovered] = useState(false);
  const addName = useStore((state) => state.addName);
  const addToHistory = useStore((state) => state.addToHistory);
  const inputActive = useStore((state) => state.inputActive);
  const setInputActive = useStore((state) => state.setInputActive);
  const paperFlying = useStore((state) => state.paperFlying);
  const setPaperFlying = useStore((state) => state.setPaperFlying);
  const setCameraTarget = useStore((state) => state.setCameraTarget);
  const cameraTweening = useStore((state) => state.cameraTweening);

  // Gérer le clic sur la pile de papiers
  const handlePaperClick = () => {
    if (!cameraTweening) {
      setInputActive(true);
      setCameraTarget("paper");
    }
  };

  // Gérer la soumission du nom
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      console.log("Soumission du nom:", inputValue.trim());
      addName(inputValue.trim());
      setInputValue("");
    }
  };

  // Gérer la touche Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault(); // Empêcher la soumission du formulaire
      console.log("Touche Enter pressée avec:", inputValue.trim());
      addName(inputValue.trim());
      setInputValue("");
    }
  };

  // Focus sur l'input quand il devient actif
  useEffect(() => {
    if (inputActive) {
      const inputElement = document.getElementById("name-input");
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [inputActive]);

  // Calculer la position absolue du chapeau
  // PaperStack est à [1.3, 0.64, 0] et Hat est à [0.5, 1, 0]
  // Donc position relative du chapeau par rapport à la pile : [0.5 - 1.3, 1 - 0.64, 0 - 0] = [-0.8, 0.36, 0]
  const hatTargetPosition: [number, number, number] = [-0.8, 0.36, 0];

  return (
    <group
      {...props}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!cameraTweening) {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "default";
      }}
    >
      {/* Pile de 3 feuilles légèrement décalées */}
      <Paper position={[0, 0, 0]} />
      <Paper position={[0.05, 0.01, 0.03]} />
      <Paper
        position={[0, 0.02, 0]}
        rotation={[0, 0.4, 0]}
        onClick={handlePaperClick}
        isFlying={paperFlying}
        targetPosition={hatTargetPosition}
      />

      {/* Formulaire d'input pour ajouter un nom */}
      {inputActive && (
        <Html position={[0, 0.5, 0]} center>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded-lg shadow-md"
            style={{ width: "200px" }}
          >
            <input
              id="name-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Entrez un nom..."
              className="w-full p-2 mb-2 border rounded"
              autoFocus
            />
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setInputActive(false)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Ajouter
              </button>
            </div>
          </form>
        </Html>
      )}
    </group>
  );
}
