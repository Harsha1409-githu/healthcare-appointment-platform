import { APPOINTMENT_STATUS } from "../constants/appointment.constants";
export function groupAppointments(appointments) {
  return {
    booked: appointments.filter(
      (item) => item.status === APPOINTMENT_STATUS.BOOKED
    ),

    prescription: appointments.filter(
      (item) =>
        item.status === APPOINTMENT_STATUS.COMPLETED&&
        !item.prescriptionCompleted
    ),

    followUp: appointments.filter(
      (item) =>
        item.status === "COMPLETED" &&
        item.prescriptionCompleted &&
        !item.followUpScheduled
    ),

    completed: appointments.filter(
      (item) =>
        item.status === "COMPLETED" &&
        item.prescriptionCompleted
    ),

    cancelled: appointments.filter(
      (item) => item.status === APPOINTMENT_STATUS.CANCELLED
    ),
  };
}