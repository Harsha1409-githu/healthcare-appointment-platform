import { useEffect, useState } from "react";
import { Info, Video } from "lucide-react";

function getAppointmentDateTime(slot) {
  if (!slot?.date || !slot?.startTime) return null;

  const cleanTime = String(slot.startTime).slice(0, 5);
  return new Date(`${slot.date}T${cleanTime}:00`);
}

function getUrgencyClass(appointment) {
  const start = getAppointmentDateTime(appointment?.slot);

  if (!start || isNaN(start.getTime())) {
    return {
      box: "bg-blue-50 border-blue-100",
      text: "text-blue-700",
      icon: "text-blue-600",
      label: "Video-Consult",
    };
  }

  const diffMinutes = Math.floor((start.getTime() - Date.now()) / 60000);

  if (diffMinutes <= 10) {
    return {
      box: "bg-emerald-50 border-emerald-100",
      text: "text-emerald-700",
      icon: "text-emerald-600",
      label: "Ready Soon",
    };
  }

  if (diffMinutes <= 60) {
    return {
      box: "bg-red-50 border-red-100",
      text: "text-red-700",
      icon: "text-red-600",
      label: "Starting Soon",
    };
  }

  if (diffMinutes <= 1440) {
    return {
      box: "bg-orange-50 border-orange-100",
      text: "text-orange-700",
      icon: "text-orange-600",
      label: "Today / Tomorrow",
    };
  }

  return {
    box: "bg-blue-50 border-blue-100",
    text: "text-blue-700",
    icon: "text-blue-600",
    label: "Video-Consult",
  };
}

function formatCountdown(diff) {
  const totalSeconds = Math.max(Math.floor(diff / 1000), 0);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

if (days > 0) {
  return `${days}D ${hours}H`;
}

if (hours > 0) {
  return `${hours}H ${mins}M`;
}

return `${mins}M`;
}

export default function VideoConsultCountdown({ appointment }) {
  const [timer, setTimer] = useState("");
  

  useEffect(() => {
    const update = () => {
      if (appointment?.appointmentType !== "VIDEO") {
        setTimer("");
        return;
      }

      const start = getAppointmentDateTime(appointment.slot);

      if (!start || isNaN(start.getTime())) {
        setTimer("Time unavailable");
        return;
      }

      const diff = start.getTime() - Date.now();

      if (diff <= 0) {
        setTimer("Consultation Started");
        return;
      }

      setTimer(formatCountdown(diff));
    };

    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [appointment]);

  if (appointment?.appointmentType !== "VIDEO") {
  return null;
}

const urgency = getUrgencyClass(appointment);

return (
  <div className={`w-full rounded-2xl border px-3 py-2.5 ${urgency.box}`}>
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0">
        <p className={`text-[11px] font-black ${urgency.text}`}>
          {urgency.label}
        </p>

        <div className="flex items-center gap-1.5 mt-0.5">
          <Video size={14} className={`${urgency.icon} shrink-0`} />

          <p className={`text-sm font-black truncate ${urgency.text}`}>
            Starts in {timer}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          alert("Join button will be enabled 10 minutes before consultation.");
        }}
        className="shrink-0 w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center"
      >
        <Info size={14} className={urgency.icon} />
      </button>
    </div>
  </div>
);
}