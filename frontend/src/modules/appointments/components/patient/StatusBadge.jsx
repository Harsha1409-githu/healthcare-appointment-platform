import { Building2, CalendarX, ShieldCheck, Video } from "lucide-react";
function StatusBadge({ status, appointmentType }) {
  let config;

  if (status === "BOOKED") {
    config =
      appointmentType === "VIDEO"
        ? {
            icon: Video,
            text: "Video Appointment",
            className: "bg-blue-50 text-blue-700 border-blue-100",
          }
        : {
            icon: Building2,
            text: "In-Person Appointment",
            className: "bg-emerald-50 text-emerald-700 border-emerald-100",
          };
  } else if (status === "COMPLETED") {
    config = {
      icon: ShieldCheck,
      text: "Completed",
      className: "bg-cyan-50 text-cyan-700 border-cyan-100",
    };
  } else {
    config = {
      icon: CalendarX,
      text: "Cancelled",
      className: "bg-red-50 text-red-700 border-red-100",
    };
  }

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black ${config.className}`}
    >
      <Icon size={13} />
      {config.text}
    </span>
  );
}

export default StatusBadge;