import axios from "axios";
import { STORAGE_KEYS } from "../utils/constants";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Add token to EVERY request
API.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token added to request:', token.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ No token found in localStorage!');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401/403 errors (token expired or invalid)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('❌ Authentication failed! Logging out...');
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;