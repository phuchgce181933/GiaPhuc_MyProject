import axios from 'axios';

/**
 * Single shared axios instance.
 *
 * VITE_API_URL MUST be set in `.env` (e.g. `https://api.example.com`).
 * No localhost fallback is provided on purpose — the spec forbids any class /
 * service / component from hard-coding localhost.
 */
const baseURL = import.meta.env.VITE_API_URL;
if (!baseURL) {
  // Throwing here surfaces a config mistake immediately instead of letting
  // every request silently fail against an undefined host.
  throw new Error('VITE_API_URL is not configured. Set it in your .env file.');
}

const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response && err.response.status === 401) {
      // Token invalid or expired.  Caller decides what to do.
    }
    return Promise.reject(err);
  }
);

export default api;
