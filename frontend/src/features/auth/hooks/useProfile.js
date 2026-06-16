import { useQuery } from 'react-query';
import { authApi } from '../../../api/authApi.js';

export const useProfile = () => {
  return useQuery('profile', () => authApi.getMe(), {
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};