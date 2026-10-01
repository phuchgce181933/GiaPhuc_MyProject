import api from './axios';

export const authApi = {
  login: (payload) => api.post('/api/auth/login', payload),
  refresh: (refreshToken) => api.post('/api/auth/refresh', { refreshToken }),
};
