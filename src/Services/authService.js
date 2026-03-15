import API from './api';

const authService = {
  login: async (email, password) => {
    console.log('🔐 authService.login called with:', email);
    const response = await API.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    console.log('📝 authService.register called');
    const response = await API.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    console.log('👋 authService.logout called');
    localStorage.removeItem('governance_token');
    localStorage.removeItem('governance_user');
  }
};

// ✅ Export both default and named exports
export default authService;
export const login = authService.login;
export const register = authService.register;
export const logout = authService.logout;