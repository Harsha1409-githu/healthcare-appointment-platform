export function getDoctorIdFromAppointment(appointment) {
  const doctor = JSON.parse(localStorage.getItem("doctorUser") || "null");

  return (
    appointment?.doctor?.id ||
    doctor?.id ||
    doctor?.doctorId ||
    doctor?._id ||
    doctor?.userId ||
    doctor?.doctor?.id ||
    ""
  );
}