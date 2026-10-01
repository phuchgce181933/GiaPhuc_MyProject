import api from './axios';

export const roleApi = {
  list: () => api.get('/api/roles'),
  get: (id) => api.get(`/api/roles/${id}`),
};
