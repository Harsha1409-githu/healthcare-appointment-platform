import api from "@/api/axios";

export const appointmentService = {
  // Patient
  async getMyAppointments() {
    const res = await api.get("/appointment/my");
    return res.data || [];
  },

  async getAppointmentById(id) {
    const res = await api.get(`/appointment/${id}`);
    return res.data;
  },

  async cancelAppointment(id) {
    return api.patch(`/appointment/${id}/cancel`);
  },

  async rescheduleAppointment(id, newSlotId) {
    return api.patch(`/appointment/${id}/reschedule`, { newSlotId });
  },

  // Doctor
  async getDoctorAppointments(doctorId) {
    const res = await api.get(`/appointment/doctor/${doctorId}`);
    return res.data || [];
  },

  async completeAppointment(id) {
    return api.patch(`/appointment/${id}/complete`);
  },

  // Hospital
  async getHospitalAppointments() {
    const res = await api.get("/appointment/hospital/my");
    return res.data || [];
  },

  // Booking
  async createAppointment(payload) {
    const res = await api.post("/appointment", payload);
    return res.data;
  },

  // Slots
  async getDoctorAvailableSlots(doctorId, type) {
    const url = type
      ? `/slot/doctor/${doctorId}/available?type=${type}`
      : `/slot/doctor/${doctorId}/available`;

    const res = await api.get(url);
    return res.data || [];
  },

  async getDoctorSlots(doctorId) {
    const res = await api.get(`/slot/doctor/${doctorId}`);
    return res.data || [];
  },

  async getSlotById(slotId) {
    const res = await api.get(`/slot/${slotId}`);
    return res.data;
  },
};