export const todayIso = () =>
  new Date().toISOString().split("T")[0];

export function sortAppointments(a, b) {
  const dateCompare = String(a.slot?.date || "").localeCompare(
    String(b.slot?.date || "")
  );

  if (dateCompare !== 0) return dateCompare;

  return String(a.slot?.startTime || "").localeCompare(
    String(b.slot?.startTime || "")
  );
}

export function formatTime(time) {
  if (!time) return "";
  return String(time).slice(0, 5);
}

export function getVideoConsultStatus(appointment) {
  if (
    appointment.appointmentType !== "VIDEO" ||
    !appointment.slot?.date ||
    !formatTime(appointment.slot?.startTime)
  ) {
    return {
      canJoin: false,
      status: "NONE",
    };
  }

  const start = new Date(
    `${appointment.slot.date}T${appointment.slot.startTime}`
  );

  const now = new Date();
  const joinTime = new Date(start.getTime() - 10 * 60 * 1000);
  const expiryTime = new Date(start.getTime() + 30 * 60 * 1000);

  if (now < joinTime) {
    return { canJoin: false, status: "UPCOMING" };
  }

  if (now >= joinTime && now <= expiryTime) {
    return { canJoin: true, status: "LIVE" };
  }

  return { canJoin: false, status: "EXPIRED" };
}

export function canRescheduleAppointment(appointment) {
  if (
    appointment.status !== "BOOKED" ||
    !appointment.slot?.date ||
    !formatTime(appointment.slot?.startTime)
  ) {
    return false;
  }

  const appointmentDateTime = new Date(
    `${appointment.slot.date}T${appointment.slot.startTime}`
  );

  const now = new Date();
  const cutoffTime = new Date(
    appointmentDateTime.getTime() - 2 * 60 * 60 * 1000
  );

  return now <= cutoffTime;
}