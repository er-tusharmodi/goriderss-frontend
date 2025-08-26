// app/(app)/dashboard/_store/ui.store.ts
import { create } from 'zustand';

type UIState = {
  /* mobile drawer */
  sidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;

  /* desktop compact (shrink) */
  sidebarCompact: boolean;
  toggleSidebarCompact: () => void;
  setSidebarCompact: (v: boolean) => void;

  messagesOpen: boolean;
  openMessages: () => void;
  closeMessages: () => void;

  createOpen: boolean;
  openCreate: () => void;
  closeCreate: () => void;

  lightboxSrc: string | null;
  openLightbox: (src: string) => void;
  closeLightbox: () => void;
};

export const useUI = create<UIState>((set, get) => ({
  sidebarOpen: false,
  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),

  sidebarCompact: false,
  toggleSidebarCompact: () => set({ sidebarCompact: !get().sidebarCompact }),
  setSidebarCompact: (v) => set({ sidebarCompact: v }),

  messagesOpen: false,
  openMessages: () => set({ messagesOpen: true }),
  closeMessages: () => set({ messagesOpen: false }),

  createOpen: false,
  openCreate: () => set({ createOpen: true }),
  closeCreate: () => set({ createOpen: false }),

  lightboxSrc: null,
  openLightbox: (src) => set({ lightboxSrc: src }),
  closeLightbox: () => set({ lightboxSrc: null }),
}));
