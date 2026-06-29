import api from "@/api/axios";

export const practiceService = {
  // ===== Leaves =====

  async getLeaves(doctorId) {
    const res = await api.get(`/leave/doctor/${doctorId}`);
    return res.data || [];
  },

  async createLeave(payload) {
    return api.post("/leave", payload);
  },

  async deleteLeave(id) {
    return api.delete(`/leave/${id}`);
  },

  // ===== Working Hours =====

  async getAvailability(doctorId) {
    const res = await api.get(`/availability/doctor/${doctorId}`);
    return res.data;
  },

  async saveAvailability(payload) {
    return api.post("/availability", payload);
  },

  // ===== Weekly Schedule =====

  async getWeeklyPractice(doctorId) {
    const res = await api.get(`/weekly-practice/${doctorId}`);
    return res.data;
  },

  // ===== Custom Pause =====

  async getPauses(doctorId) {
    const res = await api.get(`/availability/pause/${doctorId}`);
    return res.data || [];
  },

  async createPause(payload) {
  return api.post("/availability/pause", payload);
},

async deletePause(id) {
  return api.delete(`/availability/pause/${id}`);
},
  
};