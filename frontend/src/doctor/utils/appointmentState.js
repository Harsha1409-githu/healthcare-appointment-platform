export function getAppointmentStage(appointment) {
  const status = appointment.status;

  switch (status) {
    case "CHECKED_IN":
      return "READY";

    case "CONSULTATION_ACTIVE":
      return "CONSULTING";

    case "DOCUMENTATION_PENDING":
      return "DOCUMENTATION";

    case "COMPLETED":
      return "COMPLETED";

    case "NO_SHOW_PATIENT":
    case "NO_SHOW_DOCTOR":
    case "EXPIRED":
      return "MISSED";

    case "CANCELLED":
      return "CANCELLED";

    default:
      return "UPCOMING";
  }
}