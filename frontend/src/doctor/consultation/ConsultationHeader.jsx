import { ArrowLeft, Stethoscope } from "lucide-react";
import ConsultationProgress from "./ConsultationProgress";
import { formatTime } from "../../utils/time";

export default function ConsultationHeader({
  appointment,
  progressItems,
  onBack,
}) {
  return (
    <header className="sticky top-0 z-30 -mx-3 bg-[#f6f8fb]/95 px-3 pb-2 backdrop-blur">
      <section className="rounded-[1.7rem] border border-slate-100 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-700"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
            <Stethoscope size={22} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700">
              Consultation Workspace
            </p>

            <h1 className="truncate text-lg font-black text-slate-950">
              Clinical Visit
            </h1>

            <p className="truncate text-xs font-semibold text-slate-500">
              {appointment?.slot?.date || "Today"} •{" "}
              {formatTime(appointment?.slot?.startTime)}
            </p>
          </div>
        </div>

        <ConsultationProgress items={progressItems} />
      </section>
    </header>
  );
}