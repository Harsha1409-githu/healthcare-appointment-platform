export function formatVacationDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

export function getVacationDays(start, end) {
  if (!start || !end) return 0;

  const diff = new Date(end) - new Date(start);

  return Math.max(
    1,
    Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
  );
}

export function getUpcomingVacations(leaves = []) {
  const today = new Date().toISOString().split("T")[0];

  return leaves
    .filter((leave) => String(leave.endDate) >= today)
    .sort((a, b) =>
      String(a.startDate).localeCompare(String(b.startDate))
    );
}