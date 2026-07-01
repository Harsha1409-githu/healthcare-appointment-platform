import { CalendarCheck } from "lucide-react";
function EmptyState() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
      <CalendarCheck className="text-cyan-600 mx-auto mb-3" size={36} />

      <h3 className="text-lg font-black text-slate-950">
        No appointments found
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        Appointments will appear here after patients book with your hospital
        doctors.
      </p>
    </div>
  );
}

export default EmptyState;