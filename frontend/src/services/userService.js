import api from './api';

const userService = {
  // Get profile
  getProfile: async () => {
    const response = await api.get('/users/me/profile');
    return response.data;
  },

  // Create profile
  createProfile: async (profileData) => {
    const response = await api.post('/users/me/profile', profileData);
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/me/profile', profileData);
    return response.data;
  },
};

export default userService;