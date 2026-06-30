import { CalendarDays, RefreshCw } from "lucide-react";

export default function DoctorAppointmentHeader({
  totalAppointments = 0,
  onRefresh,
  loading = false,
  doctorStatus = "AVAILABLE",
}) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const online = doctorStatus === "AVAILABLE";

  return (
    <section className="rounded-[1.8rem] bg-white p-4 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700">
            Doctor Companion
          </p>

          <h1 className="mt-1 text-2xl font-black text-slate-950">
            Today's Appointments
          </h1>

          <p className="mt-1 text-sm font-semibold text-slate-500">
            {totalAppointments} appointment
            {totalAppointments !== 1 ? "s" : ""} scheduled today
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw
            size={18}
            className={loading ? "animate-spin" : ""}
          />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <CalendarDays size={17} className="text-cyan-600" />

          <span className="text-sm font-bold text-slate-700">
            {today}
          </span>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-black ${
            online
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              online ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />

          {online ? "Available" : "Busy"}
        </span>
      </div>
    </section>
  );
}