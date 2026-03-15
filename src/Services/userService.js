import API from './api';

const userService = {
  getCurrentUser: async () => {
    console.log('📡 Fetching current user');
    const response = await API.get('/users/me');
    return response.data;
  },

  updateProfile: async (userData) => {
    console.log('📡 Updating profile:', userData);
    const response = await API.put('/users/me', userData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    console.log('📡 Changing password');
    const response = await API.post('/users/me/change-password', passwordData);
    return response.data;
  }
};

export default userService;