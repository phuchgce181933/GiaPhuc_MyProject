import api from './axios';

export const staffApi = {
  list: (page = 1, limit = 20) => api.get('/api/staff', { params: { page, limit } }),
  get: (id) => api.get(`/api/staff/${id}`),
  create: (payload) => api.post('/api/staff', payload),
  update: (id, payload) => api.put(`/api/staff/${id}`, payload),
  assignRole: (id, roleId) => api.patch(`/api/staff/${id}/role`, { roleId }),
  setActive: (id, isActive) => api.patch(`/api/staff/${id}/status`, { isActive }),
};
