import { create } from 'zustand';

interface SidebarStore {
  sidebarActiveItem: string;
  setSidebarActiveItem: (item: string) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  sidebarActiveItem: '',
  setSidebarActiveItem: (item) => set({ sidebarActiveItem: item })
}));
