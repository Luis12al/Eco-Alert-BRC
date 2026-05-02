/**
 * Estado global de UI (toasts, modals, tema)
 */
import { create } from 'zustand';

export const useUiStore = create((set) => ({
  toasts: [],
  isOffline: !navigator.onLine,
  sidebarOpen: false,

  // Toasts
  addToast: (toast) => {
    const id = Date.now().toString();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    // Auto-remove después de 5 segundos
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 5000);
    return id;
  },

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id),
  })),

  // Offline status
  setOffline: (isOffline) => set({ isOffline }),
  
  // Sidebar
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));