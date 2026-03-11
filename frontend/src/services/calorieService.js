import api from './api';

const calorieService = {

  // ==================== GOALS ====================

  getGoals: async () => {
    const response = await api.get('/calorie/goals');          // ✅ singular
    return response.data;
  },

  createGoal: async (goalData) => {
    const response = await api.post('/calorie/goals', goalData);
    return response.data;
  },

  updateGoal: async (goalData) => {
    const response = await api.put('/calorie/goals', goalData);
    return response.data;
  },

  // ==================== FOOD DETECTION ====================

  detectFood: async (imageBase64) => {
    const response = await api.post('/calorie/detect-food', {
      image_base64: imageBase64
    });
    return response.data;
  },

  detectFoodUpload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/calorie/detect-food/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // ==================== NUTRITION ====================

  getNutrition: async (foodName, servingSize = null) => {
    const response = await api.post('/calorie/nutrition', {    // ✅ singular
      food_name: foodName,
      serving_size: servingSize
    });
    return response.data;
  },

  searchNutrition: async (query) => {
    const response = await api.get('/calorie/nutrition/search', {
      params: { query }                  // ✅ use params object (not string concat)
    });
    return response.data;
  },

  // ==================== QUICK ANALYZE ====================

  quickAnalyze: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/calorie/quick-analyze', formData, { // ✅ singular
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // ==================== MEAL LOGGING ====================

  logMeal: async (mealData) => {
    const response = await api.post('/calorie/meals', mealData);
    return response.data;
  },

  getMeals: async (date = null) => {
    const response = await api.get('/calorie/meals', {         // ✅ params object
      params: date ? { meal_date: date } : {}
    });
    return response.data;
  },

  deleteMeal: async (mealId) => {
    const response = await api.delete(`/calorie/meals/${mealId}`);
    return response.data;
  },

  // ==================== DAILY PROGRESS ====================

  getDailyIntake: async (date = null) => {
    const response = await api.get('/calorie/daily-intake', {  // ✅ params object
      params: date ? { intake_date: date } : {}
    });
    return response.data;
  },

  getDailyProgress: async (date = null) => {
    const response = await api.get('/calorie/progress', {      // ✅ params object
      params: date ? { progress_date: date } : {}
    });
    return response.data;
  },

  // ==================== WATER TRACKING ====================

  logWater: async (amountMl) => {
    const response = await api.post('/calorie/water', {
      amount: amountMl
    });
    return response.data;
  },

  // ==================== CALORIE BALANCE ====================

  getCalorieBalance: async () => {
    const response = await api.get('/calorie/balance');
    return response.data;
  }

};

export default calorieService;