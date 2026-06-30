import { CalendarCheck } from "lucide-react";

export default function AppointmentEmptyState() {
  return (
    <div className="rounded-[1.5rem] border border-slate-100 bg-white p-8 text-center shadow-sm">
      <CalendarCheck className="mx-auto text-cyan-600" size={36} />

      <h3 className="mt-2 text-lg font-black text-slate-950">
        No appointments found
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        Try Today, Next, Done, or Date filter.
      </p>
    </div>
  );
}