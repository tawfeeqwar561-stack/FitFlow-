import api from './api';

const mindfulnessService = {

  getSessions: async () => {
    const response = await api.get('/mindfulness/sessions');  // ✅ no /api prefix
    return response.data;
  },

  createSession: async (sessionData) => {
    const response = await api.post('/mindfulness/sessions', sessionData);
    return response.data;
  },

  getMeditations: async () => {
    const response = await api.get('/mindfulness/meditations');
    return response.data;
  },

  getQuotes: async () => {
    const response = await api.get('/mindfulness/quotes');
    return response.data;
  },

};

export default mindfulnessService;