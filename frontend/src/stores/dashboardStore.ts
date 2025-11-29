import { create } from "zustand";

interface UIStore {
  activeSection: string;
  collapsed: boolean;
  setActiveSection: (section: string) => void;
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeSection: "dashboard",
  collapsed: true,
  setActiveSection: (section) => set({ activeSection: section }),
  toggleCollapse: () => set((state) => ({ collapsed: !state.collapsed })),
  setCollapsed: (collapsed) => set({ collapsed }),
}));
