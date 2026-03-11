import api from './api';

const userService = {

  getCurrentUser: async () => {
    const response = await api.get('/users/me');           // ✅ no /api prefix
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/users/me/profile');   // ✅ no /api prefix
    return response.data;
  },

  createProfile: async (profileData) => {
    const response = await api.post('/users/me/profile', profileData);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/users/me/profile', profileData);
    return response.data;
  },

};

export default userService;