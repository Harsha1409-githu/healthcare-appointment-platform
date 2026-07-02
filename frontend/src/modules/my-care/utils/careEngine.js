export function buildCarePlan({
  medicines = [],
  recommendations = [],
  labOrders = [],
  appointments = [],
  prescriptions = [],
}) {
  const activeMedicines = medicines.filter((item) => item.isActive);

  const pendingRecommendations = recommendations.filter(
    (item) => item.status === "RECOMMENDED"
  );

  const bookedLabOrders = labOrders.filter(
    (item) => item.status === "BOOKED" || item.status === "PAID"
  );

  const upcomingAppointments = appointments.filter(
    (item) => item.status === "BOOKED"
  );

  const tasks = [
    ...activeMedicines.slice(0, 2).map((item) => ({
      type: "MEDICINE",
      title: `Take ${item.medicineName}`,
      subtitle: `${item.dosage} • ${item.reminderTime}`,
      priority: 90,
      to: "/patient/medicine-reminders",
    })),

    ...pendingRecommendations.slice(0, 2).map((item) => ({
      type: item.service || "RECOMMENDATION",
      title: item.title || "Doctor recommendation",
      subtitle: item.clinicalReason || "Recommended by your doctor",
      priority: item.service === "LAB_TEST" ? 100 : 80,
      to: "/patient/recommendations",
      raw: item,
    })),

    ...bookedLabOrders.slice(0, 1).map((item) => ({
      type: "LAB_ORDER",
      title: `${item.items?.length || 0} lab tests booked`,
      subtitle: `${item.preferredDate || "-"} • ${item.status}`,
      priority: 85,
      to: "/patient/lab-tests",
    })),

    ...upcomingAppointments.slice(0, 1).map((item) => ({
      type: "APPOINTMENT",
      title: item.doctor?.doctorName || "Upcoming appointment",
      subtitle: `${item.slot?.date || "-"} • ${item.slot?.startTime || "-"}`,
      priority: 75,
      to: "/patient/appointments",
    })),
  ].sort((a, b) => b.priority - a.priority);

  const heroAction = tasks[0] || {
    type: "COMPLETE",
    title: "You're all caught up",
    subtitle: "No pending care actions right now.",
    priority: 0,
    to: "/home",
  };

  const totalActions = tasks.length;
  const completedCount = Math.min(prescriptions.length, 2);
  const progress =
    totalActions === 0
      ? 100
      : Math.min(100, Math.round((completedCount / totalActions) * 100));

  return {
    heroAction,
    todaysTasks: tasks.slice(0, 4),
    careProgress: progress,
    activeMedicines,
    pendingRecommendations,
    bookedLabOrders,
    upcomingAppointments,
    totalActions,
  };
}
