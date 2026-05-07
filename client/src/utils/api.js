import axios from 'axios';

// In dev, prefer same-origin `/api` (Vite proxy → Express) to avoid CORS when
// using 127.0.0.1 vs localhost or a non-5173 Vite port. Override with VITE_API_URL if needed.
const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "/api" : "http://localhost:5000/api");

const api = axios.create({
  baseURL,
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use((config) => {
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
    if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
});

/**
 * Human-readable message from failed axios calls (network, 4xx/5xx, non-JSON body).
 */
export function getApiErrorMessage(error, fallback = "Something went wrong.") {
  if (!error) return fallback;
  const data = error.response?.data;
  if (data && typeof data.message === "string" && data.message.trim()) {
    return data.message.trim();
  }
  if (typeof data === "string") {
    const raw = data.trim();
    if (raw && (/<!DOCTYPE html>/i.test(raw) || /<html[\s>]/.test(raw))) {
      if (error.response.status === 403 || /cors/i.test(raw)) {
        return "Browser blocked the request (CORS). Restart the API after pulling the latest server code, or use the Vite dev server URL (usually http://localhost:5173).";
      }
      return "The server returned an error page instead of JSON. Check the API logs and restart the backend.";
    }
    if (raw) {
      return raw;
    }
  }
  if (error.code === "ECONNABORTED" || error.code === "ERR_NETWORK") {
    return "Cannot reach the server. Make sure the API is running (usually port 5000) and restart the dev app if you just changed settings.";
  }
  if (!error.response) {
    return "Network error: could not connect to the API. Check that the backend is running.";
  }
  if (error.response.status === 413) {
    return "Request too large. Try again with smaller attachments.";
  }
  return fallback;
}

export default api;
