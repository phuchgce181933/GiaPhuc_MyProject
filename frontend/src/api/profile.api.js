import api from './axios';

export const profileApi = {
  me: () => api.get('/api/profile/me'),
  byId: (id) => api.get(`/api/profile/${id}`),
};
