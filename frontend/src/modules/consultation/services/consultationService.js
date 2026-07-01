import api from "@/api/axios";

export const consultationService = {
  async getPatientProfile(appointmentId) {
    const res = await api.get(`/appointment/${appointmentId}/patient-profile`);
    return res.data;
  },

  async saveConsultationNote(payload) {
    const res = await api.post("/consultation", payload);
    return res.data;
  },

  async createPrescription(payload) {
    const res = await api.post("/prescription", payload);
    return res.data;
  },

  async completeAppointment(appointmentId) {
    const res = await api.patch(`/appointment/${appointmentId}/complete`);
    return res.data;
  },

  async getPreviousPrescriptions(patientId) {
    try {
      const res = await api.get(`/prescription/patient/${patientId}`);
      return res.data || [];
    } catch {
      return [];
    }
  },
};