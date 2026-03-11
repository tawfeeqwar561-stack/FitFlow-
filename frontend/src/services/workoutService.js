import api from './api';

const workoutService = {

  getSessions: async () => {
    const response = await api.get('/workouts/sessions');   // ✅ no /api prefix
    return response.data;
  },

  createSession: async (sessionData) => {
    const response = await api.post('/workouts/sessions', sessionData);
    return response.data;
  },

  getSession: async (sessionId) => {
    const response = await api.get(`/workouts/sessions/${sessionId}`);
    return response.data;
  },

  updateSession: async (sessionId, sessionData) => {
    const response = await api.put(`/workouts/sessions/${sessionId}`, sessionData);
    return response.data;
  },

  deleteSession: async (sessionId) => {
    const response = await api.delete(`/workouts/sessions/${sessionId}`);
    return response.data;
  },

  getExercises: async (level = null) => {
    const params = level ? { level } : {};
    const response = await api.get('/workouts/exercises', { params });
    return response.data;
  },

};

export default workoutService;