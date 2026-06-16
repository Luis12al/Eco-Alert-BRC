import api from './axiosConfig.js';

export const reportsApi = {
  create: (formData) => api.post('/reports', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  getNearby: (params) => api.get('/reports/nearby', { params }),
  
  getById: (id) => api.get(`/reports/${id}`),
  
  getStats: () => api.get('/reports/stats'),
  
  moderate: (id, status) => api.patch(`/reports/${id}/moderate`, { status }),
};