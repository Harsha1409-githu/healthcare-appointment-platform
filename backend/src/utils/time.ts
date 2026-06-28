export function formatTime(time?: string | null) {
  if (!time) return '-';

  const [hourRaw, minuteRaw] = String(time).split(':');

  const hour = Number(hourRaw);
  const minute = Number(minuteRaw || 0);

  if (Number.isNaN(hour)) return time;

  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minute);

  return date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}