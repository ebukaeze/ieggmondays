import { create } from "zustand";

interface AppState {
  navOpen: boolean;
  loading: boolean;
  setNavOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  navOpen: false,
  loading: false,
  setNavOpen: (open) => set({ navOpen: open }),
  setLoading: (loading) => set({ loading }),
}));
