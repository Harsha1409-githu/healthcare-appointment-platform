import api from "@/api/axios";

export const recommendationService = {
  async getPatientRecommendations(patientId) {
    const res = await api.get(`/recommendation/patient/${patientId}`);
    return res.data || [];
  },

  async getDoctorRecommendations(doctorId) {
    const res = await api.get(`/recommendation/doctor/${doctorId}`);
    return res.data || [];
  },
};
