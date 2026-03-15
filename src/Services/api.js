import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('governance_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token added to request:', token.substring(0, 20) + '...');
    } else {
      console.log('⚠️ No token found in localStorage!');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401 errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('🚫 401 Unauthorized - Token expired or invalid');
      localStorage.removeItem('governance_token');
      localStorage.removeItem('governance_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;