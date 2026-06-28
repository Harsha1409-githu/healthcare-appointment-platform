import { Building2, CalendarDays, Sparkles, Video } from "lucide-react";

export default function SmartSetupCard({ onStart }) {
  return (
    <section className="mb-3 rounded-[1.7rem] border border-slate-100 bg-white p-3 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
          <Sparkles size={21} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700">
            Smart Setup
          </p>

          <h2 className="mt-1 text-lg font-black text-slate-950">
            Set up your weekly practice
          </h2>

          <p className="mt-1 text-xs font-semibold text-slate-500">
            Create clinic/video sessions in less than a minute.
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Preview icon={Building2} label="Clinic" />
        <Preview icon={Video} label="Video" />
        <Preview icon={CalendarDays} label="Weekdays" />
      </div>

      <button
        type="button"
        onClick={onStart}
        className="mt-3 h-12 w-full rounded-2xl bg-slate-950 text-sm font-black text-white active:scale-95"
      >
        Start Smart Setup
      </button>
    </section>
  );
}

function Preview({ icon: Icon, label }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 text-center">
      <Icon size={18} className="mx-auto text-cyan-600" />
      <p className="mt-1 text-[10px] font-black text-slate-700">{label}</p>
    </div>
  );
}