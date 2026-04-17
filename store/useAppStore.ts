import { create } from "zustand";

interface AppState {
  isLoading: boolean;
  isNavOpen: boolean;
  isTransitioning: boolean;
  activeProject: string | null;
  setIsLoading: (v: boolean) => void;
  setIsNavOpen: (v: boolean) => void;
  setIsTransitioning: (v: boolean) => void;
  setActiveProject: (slug: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: false,
  isNavOpen: false,
  isTransitioning: false,
  activeProject: null,
  setIsLoading: (v) => set({ isLoading: v }),
  setIsNavOpen: (v) => set({ isNavOpen: v }),
  setIsTransitioning: (v) => set({ isTransitioning: v }),
  setActiveProject: (slug) => set({ activeProject: slug }),
}));
