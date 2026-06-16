/**
 * Estado global de reportes con Zustand
 */
import { create } from 'zustand';

export const useReportStore = create((set, get) => ({
  // Estado del formulario de reporte
  draftReport: null,
  isSubmitting: false,
  submitError: null,
  
  // Estado del mapa
  mapBounds: null,
  selectedReportId: null,
  activeFilters: {
    category: null,
    alertLevel: null,
    dateFrom: null,
    dateTo: null,
  },

  // Acciones
  setDraftReport: (draft) => set({ draftReport: draft }),
  clearDraftReport: () => set({ draftReport: null }),
  
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setSubmitError: (error) => set({ submitError: error }),
  
  setMapBounds: (bounds) => set({ mapBounds: bounds }),
  setSelectedReportId: (id) => set({ selectedReportId: id }),
  
  setActiveFilters: (filters) => set((state) => ({
    activeFilters: { ...state.activeFilters, ...filters },
  })),
  clearFilters: () => set({
    activeFilters: { category: null, alertLevel: null, dateFrom: null, dateTo: null },
  }),
}));