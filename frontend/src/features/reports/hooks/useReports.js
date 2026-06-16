import { useQuery } from 'react-query';
import { reportsApi } from '../../../api/reportsApi.js';

export const useNearbyReports = (params, options = {}) => {
  return useQuery(
    ['nearbyReports', params],
    () => reportsApi.getNearby(params).then(res => res.data.data),
    {
      enabled: !!params.lat && !!params.lng,
      staleTime: 2 * 60 * 1000, // 2 minutos
      ...options,
    }
  );
};

export const useReportStats = () => {
  return useQuery(
    'reportStats',
    () => reportsApi.getStats().then(res => res.data.data),
    {
      staleTime: 5 * 60 * 1000,
    }
  );
};