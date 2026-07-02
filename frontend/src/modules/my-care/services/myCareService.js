import api from "@/api/axios";

export const myCareService = {
  async getMedicineReminders(patientId) {
    const res = await api.get(`/medicine-reminder/patient/${patientId}`);
    return res.data || [];
  },

  async getRecommendations(patientId) {
    const res = await api.get(`/recommendation/patient/${patientId}`);
    return res.data || [];
  },

  async getLabOrders(patientId) {
    const res = await api.get(`/lab-test/orders/patient/${patientId}`);
    return res.data || [];
  },

  async getAppointments() {
    const res = await api.get("/appointment/my");
    return res.data || [];
  },

  async getPrescriptions() {
    const res = await api.get("/prescription/my");
    return res.data || [];
  },
};
