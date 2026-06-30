export default function DoctorAppointmentStage({ title, count, tone, children }) {
  if (!count) return null;

  const dot =
    tone === "emerald"
      ? "bg-emerald-500"
      : tone === "amber"
      ? "bg-amber-500"
      : tone === "violet"
      ? "bg-violet-500"
      : "bg-cyan-500";

  return (
    <div className="rounded-[1.5rem] border border-slate-100 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
          <h2 className="text-sm font-black text-slate-950">{title}</h2>
        </div>

        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-600">
          {count}
        </span>
      </div>

      <div className="space-y-2">{children}</div>
    </div>
  );
}