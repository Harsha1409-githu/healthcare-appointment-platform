import { Star, Stethoscope } from "lucide-react";

export default function DoctorCard() {
  return (
    <div className="mt-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-50 text-cyan-600">
          <Stethoscope size={23} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black text-slate-950">
            Dr Rahul Sharma
          </p>

          <p className="text-xs font-bold text-slate-500">
            Cardiologist • Apollo
          </p>

          <div className="mt-1 flex items-center gap-1 text-[11px] font-black text-amber-500">
            <Star size={12} fill="currentColor" />
            4.9
            <span className="text-slate-400">• Today 4:30 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
}