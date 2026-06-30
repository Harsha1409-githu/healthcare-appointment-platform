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