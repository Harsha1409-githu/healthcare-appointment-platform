import { CalendarCheck, ShieldCheck } from "lucide-react";
import RecommendationStatus from "./RecommendationStatus";

export default function RecommendationHeader({
  icon: Icon,
  title,
  date,
  priority,
  status,
}) {
  const dateLabel = date
    ? new Date(date).toLocaleDateString([], {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Today";

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-100 bg-cyan-50">
        <Icon className="text-cyan-600" size={24} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">
          <ShieldCheck size={12} />
          Doctor Recommended
        </div>

        <h2 className="mt-2 text-lg font-black leading-tight text-slate-950">
          {title}
        </h2>

        <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <CalendarCheck size={13} className="text-cyan-600" />
          {dateLabel}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-black text-slate-600">
          {priority || "ROUTINE"}
        </span>
        <RecommendationStatus status={status} />
      </div>
    </div>
  );
}
