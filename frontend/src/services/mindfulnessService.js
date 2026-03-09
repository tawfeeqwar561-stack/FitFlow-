import api from './api';

const mindfulnessService = {
  // Start meditation session
  startSession: async (sessionType) => {
    const response = await api.post('/mindfulness/sessions/start', {
      session_type: sessionType,
    });
    return response.data;
  },

  // End meditation session
  endSession: async (sessionId, durationSeconds, completed = true) => {
    const response = await api.post(`/mindfulness/sessions/${sessionId}/end`, {
      duration_seconds: durationSeconds,
      completed: completed,
    });
    return response.data;
  },

  // Get session history
  getSessions: async (limit = 20) => {
    const response = await api.get(`/mindfulness/sessions?limit=${limit}`);
    return response.data;
  },

  // Get stats
  getStats: async () => {
    const response = await api.get('/mindfulness/stats');
    return response.data;
  },
};

export default mindfulnessService;