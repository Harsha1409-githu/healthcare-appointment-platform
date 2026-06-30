import { todayIso } from "./appointment.utils";

export function calculateAppointmentStats(appointments) {
  const todayItems = appointments.filter(
    (item) => item.slot?.date === todayIso()
  );

  return {
    today: todayItems.length,

    waiting: todayItems.filter(
      (item) => item.status === "BOOKED"
    ).length,

    video: todayItems.filter(
      (item) => item.appointmentType === "VIDEO"
    ).length,

    done: todayItems.filter(
      (item) => item.status === "COMPLETED"
    ).length,
  };
}