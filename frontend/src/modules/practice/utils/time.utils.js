export function formatDay(day) {
  return String(day || "")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function buildPreviewSlots(startTime, endTime, duration) {
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);

  if (!startTime || !endTime || !duration || start >= end) {
    return [];
  }

  const slots = [];
  let current = start;

  while (current + duration <= end) {
    slots.push(toTime(current));
    current += duration;
  }

  return slots;
}

export function toMinutes(time) {
  const [h, m] = String(time || "00:00").split(":").map(Number);
  return h * 60 + m;
}

export function toTime(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}