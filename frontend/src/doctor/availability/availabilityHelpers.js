export const todayIso = () => new Date().toISOString().split("T")[0];

export function formatDay(day) {
  return String(day || "")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function getStatusConfig(status) {
  return status === "AVAILABLE"
    ? {
        title: "Available",
        badge: "Live",
        bg: "from-emerald-500 to-cyan-600",
      }
    : {
        title: "On Break",
        badge: "Paused",
        bg: "from-amber-500 to-orange-500",
      };
}