import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  FileText,
  Stethoscope,
  UserRound,
  Video,
} from "lucide-react";
import { motion } from "framer-motion";

export default function DoctorDashboardMockup() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="rounded-[2.5rem] bg-slate-950 p-4 shadow-[0_45px_120px_rgba(15,23,42,0.35)]"
    >
      <div className="rounded-[2rem] bg-[#f8fbfc] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black text-cyan-700">
              TRYDOC DOCTOR
            </p>
            <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
  Doctor Workspace
</h3>
          </div>

          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-600 text-white">
            <Stethoscope size={23} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <Stat value="12" label="Patients" />
          <Stat value="5" label="Video" />
          <Stat value="7" label="Done" />
        </div>

       <div className="mt-5 rounded-3xl bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-700 p-5 text-white shadow-xl shadow-cyan-500/20">
         <p className="text-[11px] font-black uppercase tracking-wider text-cyan-100">
  NEXT PATIENT
</p>

          <div className="mt-4 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <UserRound size={22} />
            </div>

            <div>
              <h4 className="font-black">Harshavardhan</h4>
              <p className="mt-1 text-sm font-semibold text-cyan-100">
  Cardiology • 4:30 PM
</p>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <FlowRow
            icon={CheckCircle2}
            title="Check-In Reviewed"
            status="Done"
          />
          <FlowRow
            icon={FileText}
            title="Consultation Notes"
            status="Saved"
          />
          <FlowRow
            icon={Video}
            title="Video Control"
            status="Ready"
          />
          <FlowRow
            icon={CalendarCheck}
            title="Follow-Up"
            status="Scheduled"
          />
        </div>

        <div className="mt-5 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-black text-slate-400">
            LIVE ACTIVITY
          </p>

          <div className="mt-4 space-y-3">
            <Activity text="Prescription created" />
            <Activity text="Patient checked in" />
            <Activity text="Video consultation completed" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3 text-center shadow-sm">
      <p className="text-xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-[10px] font-black text-slate-400">{label}</p>
    </div>
  );
}

function FlowRow({ icon: Icon, title, status }) {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-50 text-cyan-600">
          <Icon size={19} />
        </div>

        <p className="text-sm font-black text-slate-800">{title}</p>
      </div>

      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-700">
        {status}
      </span>
    </div>
  );
}

function Activity({ text }) {
  return (
    <div className="flex items-center gap-3">
      <Clock size={15} className="text-cyan-600" />
      <p className="text-sm font-bold text-slate-600">{text}</p>
    </div>
  );
}