import {
  Activity,
  Building2,
  CalendarDays,
  CircleDollarSign,
  Stethoscope,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

export default function HospitalDashboardMockup() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="rounded-[2.8rem] bg-white p-5 shadow-[0_35px_90px_rgba(15,23,42,.18)]"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-black text-cyan-700">
            TRYDOC HOSPITAL
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-950">
            Hospital Operations
          </h3>
        </div>

        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-600 text-white">
          <Building2 size={23} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Stat icon={Users} value="2,486" label="Patients" />
        <Stat icon={Stethoscope} value="126" label="Doctors" />
        <Stat icon={CalendarDays} value="348" label="Appointments" />
        <Stat icon={CircleDollarSign} value="₹8.2L" label="Revenue" />
      </div>

      <div className="mt-5 rounded-3xl bg-gradient-to-br from-cyan-600 to-blue-700 p-5 text-white">
        <p className="text-xs font-black text-cyan-100">
          TODAY'S OVERVIEW
        </p>

        <div className="mt-5 grid grid-cols-3 gap-4 text-center">
          <div>
            <h4 className="text-2xl font-black">94%</h4>
            <p className="text-xs text-cyan-100">
              Occupancy
            </p>
          </div>

          <div>
            <h4 className="text-2xl font-black">37</h4>
            <p className="text-xs text-cyan-100">
              Check-ins
            </p>
          </div>

          <div>
            <h4 className="text-2xl font-black">12</h4>
            <p className="text-xs text-cyan-100">
              Surgeries
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <p className="text-[11px] font-black text-slate-400">
          LIVE OPERATIONS
        </p>

        <div className="mt-4 space-y-4">
          <Row text="Doctor approval pending" />
          <Row text="14 appointments waiting" />
          <Row text="Revenue updated" />
          <Row text="Lab reports uploaded" />
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
      <Icon className="text-cyan-600" size={20} />

      <h4 className="mt-4 text-2xl font-black text-slate-950">
        {value}
      </h4>

      <p className="mt-1 text-xs font-black text-slate-500">
        {label}
      </p>
    </div>
  );
}

function Row({ text }) {
  return (
    <div className="flex items-center gap-3">
      <Activity size={16} className="text-cyan-600" />

      <p className="text-sm font-semibold text-slate-700">
        {text}
      </p>
    </div>
  );
}