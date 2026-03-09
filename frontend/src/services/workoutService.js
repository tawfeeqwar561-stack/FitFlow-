import api from './api';

const workoutService = {
  // Get all categories
  getCategories: async () => {
    const response = await api.get('/workouts/categories');
    return response.data;
  },

  // Get exercises by category
  getExercisesByCategory: async (categoryId, difficulty = null) => {
    let url = `/workouts/categories/${categoryId}/exercises`;
    if (difficulty) {
      url += `?difficulty=${difficulty}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  // Get exercises by difficulty
  getExercisesByDifficulty: async (level) => {
    const response = await api.get(`/workouts/difficulty/${level}`);
    return response.data;
  },

  // Start workout session
  startSession: async (exerciseId) => {
    const response = await api.post('/workouts/sessions/start', {
      exercise_id: exerciseId,
    });
    return response.data;
  },

  // End workout session
  endSession: async (sessionId, durationSeconds, completed = true) => {
    const response = await api.post(`/workouts/sessions/${sessionId}/end`, {
      duration_seconds: durationSeconds,
      completed: completed,
    });
    return response.data;
  },

  // Get workout history
  getHistory: async (limit = 20) => {
    const response = await api.get(`/workouts/history?limit=${limit}`);
    return response.data;
  },
};

export default workoutService;