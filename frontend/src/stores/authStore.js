/**
 * Estado global de autenticación con Zustand
 * Persistencia automática en localStorage
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/authApi.js';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // CAMBIA ESTO TEMPORALMENTE:
      user: {
        id: 1,
        name: "Usuario Test",
        email: "test@test.com",
        avatar: null,
        reputation: 150,
        role: "user"
      },
      isAuthenticated: false,  // ← true en lugar de false
      isLoading: false,
      error: null,

      // REEMPLAZA ESTO:
initializeAuth: () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    get().fetchProfile();
  }
},

// POR ESTO (modo diseño):
initializeAuth: () => {
  // MODO DISEÑO: Si no hay backend, usa datos falsos
  const isDevMode = false; // ← Cambia a false cuando tu amigo conecte el backend
  
  if (isDevMode) {
    set({
      user: {
        id: 1,
        name: "Usuario Test",
        email: "test@test.com",
        avatar: null,
        reputation: 150,
        role: "user"
      },
      isAuthenticated: true,
      error: null
    });
    return;
  }
  
  // Lógica original
  const token = localStorage.getItem('accessToken');
  if (token) {
    get().fetchProfile();
  }
},

      fetchProfile: async () => {
        try {
          const response = await authApi.getMe();
          set({ user: response.data.data, isAuthenticated: true, error: null });
        } catch (error) {
          get().logout();
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login({ email, password });
          const { user, accessToken, refreshToken } = response.data.data;
          
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Error al iniciar sesión',
            isLoading: false,
          });
          return false;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register(data);
          const { user, accessToken, refreshToken } = response.data.data;
          
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Error al registrarse',
            isLoading: false,
          });
          return false;
        }
      },

      logout: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            await authApi.logout(refreshToken);
          } catch (e) {
            // Ignorar error en logout
          }
        }
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),
      
      updateReputation: (delta) => {
        set((state) => ({
          user: state.user ? { ...state.user, reputation: state.user.reputation + delta } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);