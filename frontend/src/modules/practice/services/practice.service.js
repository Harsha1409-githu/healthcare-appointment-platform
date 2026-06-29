import api from "../../../api/axios";

export const practiceService = {
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
};