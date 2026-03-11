import api from './api';

const medicalService = {

  // ── Chatbot ───────────────────────────────────────────────────────────────
  sendChat: async (message, context = null, history = []) => {
    const response = await api.post('/medical/chat', {
      message,
      context,
      history   // ← send chat history for Gemini memory
    });
    return response.data;
  },

  // ── Symptoms ──────────────────────────────────────────────────────────────
  reportSymptom: async (data) => {
    const response = await api.post('/medical/symptoms', data);
    return response.data;
  },

  getSymptoms: async () => {
    const response = await api.get('/medical/symptoms');
    return response.data;
  },

  // ── Medications ───────────────────────────────────────────────────────────
  getMedications: async (activeOnly = false) => {
    const response = await api.get(`/medical/medications?active_only=${activeOnly}`);
    return response.data;
  },

  addMedication: async (data) => {
    const response = await api.post('/medical/medications', data);
    return response.data;
  },

  updateMedication: async (id, data) => {
    const response = await api.put(`/medical/medications/${id}`, data);
    return response.data;
  },

  deleteMedication: async (id) => {
    const response = await api.delete(`/medical/medications/${id}`);
    return response.data;
  },

  // ── Reminders ─────────────────────────────────────────────────────────────
  getReminders: async () => {
    const response = await api.get('/medical/reminders');
    return response.data;
  },

  addReminder: async (data) => {
    const response = await api.post('/medical/reminders', data);
    return response.data;
  },

  deleteReminder: async (id) => {
    const response = await api.delete(`/medical/reminders/${id}`);
    return response.data;
  },

  // ── Doctor Visits ─────────────────────────────────────────────────────────
  getDoctorVisits: async () => {
    const response = await api.get('/medical/doctor-visits');
    return response.data;
  },

  logDoctorVisit: async (data) => {
    const response = await api.post('/medical/doctor-visits', data);
    return response.data;
  },
};

export default medicalService;