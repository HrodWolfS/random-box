import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type Name = {
  id: string;
  text: string;
};

type CameraPosition = [number, number, number];

type State = {
  // Liste des noms à tirer au sort
  names: Name[];
  // Historique des tirages
  history: Name[];
  // Nom actuellement sélectionné/tiré
  selectedName: Name | null;
  // Dernier nom tiré du chapeau
  drawnName: Name | null;
  // État du champ de saisie
  inputActive: boolean;
  // Contrôle de la caméra
  cameraTarget: "room" | "paper" | "board" | "hat" | "default";
  cameraZoom: number;
  cameraPositions: {
    room: CameraPosition;
    paper: CameraPosition;
    board: CameraPosition;
    hat: CameraPosition;
    default: CameraPosition;
  };
  cameraTweening: boolean;
  // Animation states
  boxShaking: boolean;
  paperFlying: boolean;
  paperExiting: boolean;
};

type Actions = {
  // Ajouter un nom à la liste
  addName: (text: string) => void;
  // Ajouter un nom à l'historique
  addToHistory: (name: Name) => void;
  // Tirer un nom au sort
  drawName: () => void;
  // Tirer un nom aléatoire depuis l'historique
  drawRandomName: () => void;
  // Activer/désactiver le champ de saisie
  setInputActive: (active: boolean) => void;
  // Contrôler la caméra
  setCameraTarget: (target: State["cameraTarget"]) => void;
  setCameraZoom: (zoom: number) => void;
  setCameraTweening: (tweening: boolean) => void;
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
    drawnName: null,
    inputActive: false,
    cameraTarget: "room",
    cameraZoom: 45,
    cameraPositions: {
      room: [4.5, 5.5, 4.5], // Vue plongeante latérale plus réaliste
      paper: [2.2, 2.5, 1.8], // Position pour voir la pile de papiers (PaperStack à [1.3, 0.64, 0])
      board: [2, 2, 1.9], // Ajustée pour viser le board précisément
      hat: [1.6, 1.3, 1.3], // Plus proche et centrée sur le chapeau
      default: [3.5, 3.2, 4.5],
    },
    cameraTweening: false,
    boxShaking: false,
    paperFlying: false,
    paperExiting: false,

    // Actions
    addName: (text) => {
      const newName = { id: crypto.randomUUID(), text };
      console.log("addName - Ajout à l'historique:", newName);
      set((state) => ({
        history: [...state.history, newName],
        inputActive: false,
        paperFlying: true,
      }));

      // Réinitialiser l'état d'animation après un délai
      setTimeout(() => {
        get().resetAnimationStates();
      }, 2000);
    },

    addToHistory: (name) => {
      console.log("Ajout à l'historique:", name);
      set((state) => ({
        history: [...state.history, name],
      }));
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

    drawRandomName: () => {
      const { history } = get();
      if (history.length === 0) return;

      // Tirer un nom aléatoire depuis l'historique
      const randomIndex = Math.floor(Math.random() * history.length);
      const drawnName = history[randomIndex];

      // Retirer le nom de l'historique et l'ajouter à la liste
      set((state) => ({
        history: state.history.filter((_, index) => index !== randomIndex),
        names: [drawnName, ...state.names],
        drawnName,
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
    setCameraTweening: (tweening) => set({ cameraTweening: tweening }),
    setBoxShaking: (shaking) => set({ boxShaking: shaking }),
    setPaperFlying: (flying) => set({ paperFlying: flying }),
    setPaperExiting: (exiting) => set({ paperExiting: exiting }),

    resetAnimationStates: () =>
      set({
        boxShaking: false,
        paperFlying: false,
        paperExiting: false,
        drawnName: null, // Réinitialiser le nom tiré
      }),
  }))
);
