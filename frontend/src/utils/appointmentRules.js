export function getAppointmentRules(appointment) {
  const now = new Date();

  const slotDate = appointment?.slot?.date;
  const startTime = appointment?.slot?.startTime;
  const endTime = appointment?.slot?.endTime;

  const status = appointment?.status || "BOOKED";
  const isVideo = appointment?.appointmentType === "VIDEO";

  const startDateTime =
    slotDate && startTime ? new Date(`${slotDate}T${startTime}`) : null;

  const endDateTime =
    slotDate && endTime ? new Date(`${slotDate}T${endTime}`) : null;

  const minutesToStart = startDateTime
    ? Math.round((startDateTime - now) / 60000)
    : 9999;

  const minutesAfterEnd = endDateTime
    ? Math.round((now - endDateTime) / 60000)
    : 0;

  const isCompleted =
    status === "COMPLETED" || appointment?.consultationCompleted;

  const isCancelled =
    status === "CANCELLED" ||
    status === "CANCELLED_BY_PATIENT" ||
    status === "CANCELLED_BY_DOCTOR";

  const isMissedPatient = status === "NO_SHOW_PATIENT";
  const isMissedDoctor = status === "NO_SHOW_DOCTOR";
  const isExpired = status === "EXPIRED";
  const isDocumentationPending = status === "DOCUMENTATION_PENDING";

  const isCheckedIn =
    status === "CHECKED_IN" ||
    appointment?.checkInCompleted ||
    appointment?.patientCheckedIn;

  const waitingRoomOpen =
    minutesToStart <= 30 && minutesAfterEnd <= 30 && !isCompleted;

  const canStartConsult =
    minutesToStart <= 10 && minutesAfterEnd <= 30 && !isCompleted;

  const slotEnded = minutesAfterEnd > 30;

  const isMissed =
    isMissedPatient ||
    isMissedDoctor ||
    isExpired ||
    (slotEnded && !isCompleted && !isCheckedIn && !isCancelled);

  const canMarkPatientNoShow =
    slotEnded && !isCompleted && !isCheckedIn && !isCancelled;

  const canMarkDoctorNoShow =
    slotEnded && isCheckedIn && !isCompleted && !isCancelled;

  return {
    status,
    isVideo,
    isCompleted,
    isCancelled,
    isCheckedIn,
    waitingRoomOpen,
    canStartConsult,
    isDocumentationPending,
    isMissed,
    canMarkPatientNoShow,
    canMarkDoctorNoShow,

    label: isCompleted
      ? "Completed"
      : isDocumentationPending
      ? "Documentation Pending"
      : isMissedPatient
      ? "Patient No-Show"
      : isMissedDoctor
      ? "Doctor No-Show"
      : isExpired || isMissed
      ? "Missed"
      : isCancelled
      ? "Cancelled"
      : isCheckedIn && canStartConsult
      ? "Ready"
      : waitingRoomOpen
      ? "Waiting Room"
      : "Upcoming",

    canViewCheckIn: waitingRoomOpen || isCheckedIn,
    canJoinVideo: isVideo && isCheckedIn && canStartConsult && !isCompleted,
    canConsult: isCheckedIn && canStartConsult && !isCompleted,
    canViewRx: isCompleted || appointment?.prescriptionCompleted,
    canFollowUp: isCompleted,
  };
}