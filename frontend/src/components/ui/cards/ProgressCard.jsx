export default function ProgressCard({
  label = "Progress",
  title,
  subtitle,
  value = 0,
  icon: Icon,
  className = "",
}) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <section
      className={`rounded-[2rem] bg-gradient-to-br from-cyan-600 to-blue-700 p-5 text-white shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase text-cyan-100">{label}</p>

          {title && (
            <h2 className="mt-1 text-2xl font-black leading-tight">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="mt-1 text-sm font-semibold text-cyan-100">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-white text-cyan-700">
            <Icon size={27} />
          </div>
        )}
      </div>

      <div className="mt-5 rounded-3xl bg-white/15 p-4 backdrop-blur">
        <div className="flex items-end justify-between">
          <p className="text-3xl font-black">{safeValue}%</p>
          <p className="text-xs font-black text-cyan-100">Completed</p>
        </div>

        <div className="mt-4 h-3 rounded-full bg-white/20">
          <div
            className="h-3 rounded-full bg-white transition-all"
            style={{ width: `${safeValue}%` }}
          />
        </div>
      </div>
    </section>
  );
}
