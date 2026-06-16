import { useAuthStore } from '../../../stores/authStore.js';

export const useAuth = () => {
  return useAuthStore();
};