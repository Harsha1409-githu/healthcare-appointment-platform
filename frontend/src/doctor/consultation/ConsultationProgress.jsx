export default function ConsultationProgress({ items }) {
  const completed = items.filter((item) => item.done).length;
  const percent = Math.round((completed / items.length) * 100);

  return (
    <>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-cyan-600 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
        {items.map((item) => (
          <span
            key={item.label}
            className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-black ${
              item.done
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {item.done ? "✓" : "○"} {item.label}
          </span>
        ))}
      </div>
    </>
  );
}