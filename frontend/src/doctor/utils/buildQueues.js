import { getAppointmentRules } from "../../utils/appointmentRules";

export function buildQueues({ todayAppointments, futureAppointments }) {
  const queues = {
    attention: [],
    ready: [],
    waiting: [],
    consulting: [],
    documentation: [],
    upcomingToday: [],
    future: [],
    completed: [],
    missed: [],
  };

  todayAppointments.forEach((appointment) => {
    const rules = getAppointmentRules(appointment);

    if (rules.isMissed) {
      queues.missed.push(appointment);
      queues.attention.push(appointment);
      return;
    }

    if (rules.isCompleted) {
      queues.completed.push(appointment);
      return;
    }

    if (appointment.status === "DOCUMENTATION_PENDING") {
      queues.documentation.push(appointment);
      queues.attention.push(appointment);
      return;
    }

    if (appointment.status === "CONSULTATION_ACTIVE") {
      queues.consulting.push(appointment);
      return;
    }

    if (rules.canConsult || rules.canJoinVideo) {
      queues.ready.push(appointment);
      return;
    }

    if (rules.waitingRoomOpen) {
      queues.waiting.push(appointment);
      return;
    }

    queues.upcomingToday.push(appointment);
  });

  futureAppointments.forEach((appointment) => {
    const rules = getAppointmentRules(appointment);

    if (!rules.isCancelled && !rules.isCompleted && !rules.isMissed) {
      queues.future.push(appointment);
    }
  });

  return queues;
}