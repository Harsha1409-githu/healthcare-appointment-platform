import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
  XCircle,
} from "lucide-react";

import { MiniStat } from "@/modules/appointments/components/hospital";
export default function HospitalAppointmentHeader({
    hospital,
    stats,
    loading,
    onRefresh,
}) {
   
 <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-cyan-700 font-black">
                HOSPITAL CENTER
              </p>

              <h1 className="text-xl font-black text-slate-950">
                Appointment Manager
              </h1>

              <p className="text-sm text-slate-500">
                Manage bookings and prescriptions
              </p>
            </div>

            <button
  type="button"
  onClick={onRefresh}
  disabled={loading}
  className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 active:scale-95 disabled:opacity-50"
>
  <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
</button>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4">
            <MiniStat icon={CalendarCheck} label="Total" value={stats.total} />
            <MiniStat icon={Clock} label="Booked" value={stats.booked} />
            <MiniStat
              icon={CheckCircle2}
              label="Done"
              value={stats.completed}
            />
            <MiniStat icon={XCircle} label="Cancel" value={stats.cancelled} />
          </div>
        </section>

        }