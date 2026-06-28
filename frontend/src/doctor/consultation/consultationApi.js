import api from "../../api/axios";

export async function getPatientProfile(appointmentId) {
  const res = await api.get(`/appointment/${appointmentId}/patient-profile`);
  return res.data;
}

export async function saveConsultationNote(payload) {
  const res = await api.post("/consultation", payload);
  return res.data;
}

export async function createPrescription(payload) {
  const res = await api.post("/prescription", payload);
  return res.data;
}

export async function createFollowUp(payload) {
  const res = await api.post("/follow-up", payload);
  return res.data;
}

export async function completeAppointment(appointmentId) {
  const res = await api.patch(`/appointment/${appointmentId}/complete`);
  return res.data;
}