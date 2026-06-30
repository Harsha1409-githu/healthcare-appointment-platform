import { todayIso, sortAppointments } from "./appointment.utils";
import { APPOINTMENT_VIEW } from "../constants/appointment.constants";
export function filterAppointments(
  appointments,
  search,
  view,
  dateFilter
) {
  return appointments
    .filter((appointment) => {
      const appointmentDate = appointment.slot?.date;

      const text = `
        ${appointment.patientName || ""}
        ${appointment.patientPhone || ""}
        ${appointment.patient?.fullName || ""}
        ${appointment.familyMember?.fullName || ""}
        ${appointment.status || ""}
      `.toLowerCase();

      const matchesSearch = text.includes(
        search.toLowerCase().trim()
      );

      if (view === APPOINTMENT_VIEW.TODAY)
        return matchesSearch && appointmentDate === todayIso();

      if (view === APPOINTMENT_VIEW.UPCOMING)
        return matchesSearch && appointmentDate > todayIso();

      if (view === APPOINTMENT_VIEW.COMPLETED)
        return (
          matchesSearch &&
          appointment.status === "COMPLETED"
        );

      if (view === APPOINTMENT_VIEW.CUSTOM)
        return matchesSearch && appointmentDate === dateFilter;

      return matchesSearch;
    })
    .sort(sortAppointments);
}