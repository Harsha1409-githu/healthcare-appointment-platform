export default function DoctorKPIs({
  todayCount,
  activeCount,
  videoCount,
  completedCount,
}) {
  return (
    <section className="mt-3 grid grid-cols-4 gap-2">
      <MiniStat label="Today" value={todayCount} />
      <MiniStat label="Active" value={activeCount} />
      <MiniStat label="Video" value={videoCount} />
      <MiniStat label="Done" value={completedCount} />
    </section>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-2 py-3 text-center shadow-sm">
      <p className="text-xl font-black leading-none text-slate-950">{value}</p>
      <p className="mt-1 truncate text-[10px] font-black uppercase tracking-wide text-slate-500">
        {label}
      </p>
    </div>
  );
}