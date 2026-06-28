import { Bell, Stethoscope } from "lucide-react";

const formatLongDate = (value) => {
  if (!value) return "Today";

  return new Date(value).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
};

export default function DoctorTopBar({
  doctor,
  today,
  unreadCount,
  onNotifications,
}) {
  return (
    <header className="rounded-[1.7rem] border border-slate-100 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-cyan-50 text-cyan-700">
            {doctor?.profileImage ? (
              <img
                src={doctor.profileImage}
                alt={doctor?.doctorName || "Doctor"}
                className="h-full w-full object-cover"
              />
            ) : (
              <Stethoscope size={24} />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700">
              Doctor Workspace
            </p>

            <h1 className="truncate text-lg font-black text-slate-950">
              Good Morning, Dr. {doctor?.doctorName || "Doctor"}
            </h1>

            <p className="truncate text-xs font-semibold text-slate-500">
              {doctor?.specialization || "Medical Specialist"} •{" "}
              {formatLongDate(today)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNotifications}
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-800 active:scale-95"
        >
          <Bell size={20} />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex min-h-[19px] min-w-[19px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white ring-2 ring-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}