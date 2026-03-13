import API from './api';

export const login = (credentials) => {
  console.log('🔐 authService.login called with:', credentials.email);
  return API.post('/auth/login', credentials);
};

export const register = (userData) => {
  console.log('📝 authService.register called');
  return API.post('/auth/register', userData);
};

export const logout = () => {
  console.log('👋 authService.logout called');
  localStorage.removeItem('governance_token');
  localStorage.removeItem('governance_user');
};
