import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type Name = {
  id: string;
  text: string;
};

type State = {
  // Liste des noms à tirer au sort
  names: Name[];
  // Historique des tirages
  history: Name[];
  // Nom actuellement sélectionné/tiré
  selectedName: Name | null;
  // État du champ de saisie
  inputActive: boolean;
  // Contrôle de la caméra
  cameraTarget: "desk" | "board" | "box" | "default";
  cameraZoom: number;
  // Animation states
  boxShaking: boolean;
  paperFlying: boolean;
  paperExiting: boolean;
};

type Actions = {
  // Ajouter un nom à la liste
  addName: (text: string) => void;
  // Tirer un nom au sort
  drawName: () => void;
  // Activer/désactiver le champ de saisie
  setInputActive: (active: boolean) => void;
  // Contrôler la caméra
  setCameraTarget: (target: State["cameraTarget"]) => void;
  setCameraZoom: (zoom: number) => void;
  // Contrôler les animations
  setBoxShaking: (shaking: boolean) => void;
  setPaperFlying: (flying: boolean) => void;
  setPaperExiting: (exiting: boolean) => void;
  // Réinitialiser les états d'animation
  resetAnimationStates: () => void;
};

export const useStore = create<State & Actions>()(
  subscribeWithSelector((set, get) => ({
    // État initial
    names: [],
    history: [],
    selectedName: null,
    inputActive: false,
    cameraTarget: "default",
    cameraZoom: 45,
    boxShaking: false,
    paperFlying: false,
    paperExiting: false,

    // Actions
    addName: (text) => {
      const newName = { id: crypto.randomUUID(), text };
      set((state) => ({
        names: [...state.names, newName],
        inputActive: false,
        paperFlying: true,
      }));

      // Réinitialiser l'état d'animation après un délai
      setTimeout(() => {
        get().resetAnimationStates();
      }, 2000);
    },

    drawName: () => {
      const { names } = get();
      if (names.length === 0) return;

      // Tirer un nom au hasard
      const randomIndex = Math.floor(Math.random() * names.length);
      const selectedName = names[randomIndex];

      // Retirer le nom de la liste et l'ajouter à l'historique
      set((state) => ({
        names: state.names.filter((_, index) => index !== randomIndex),
        history: [selectedName, ...state.history],
        selectedName,
        boxShaking: true,
        paperExiting: true,
      }));

      // Réinitialiser l'état d'animation après un délai
      setTimeout(() => {
        get().resetAnimationStates();
      }, 2000);
    },

    setInputActive: (active) => set({ inputActive: active }),
    setCameraTarget: (target) => set({ cameraTarget: target }),
    setCameraZoom: (zoom) => set({ cameraZoom: zoom }),
    setBoxShaking: (shaking) => set({ boxShaking: shaking }),
    setPaperFlying: (flying) => set({ paperFlying: flying }),
    setPaperExiting: (exiting) => set({ paperExiting: exiting }),

    resetAnimationStates: () =>
      set({
        boxShaking: false,
        paperFlying: false,
        paperExiting: false,
      }),
  }))
);
