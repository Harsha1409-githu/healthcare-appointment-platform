export default function TryDocMetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "cyan",
  trend,
  trendType = "neutral",
  updatedAt,
  footer,
  loading = false,
  onClick,
  className = "",
}) {
  const colors = {
    cyan: "bg-cyan-50 text-cyan-600",
    green: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-violet-50 text-violet-600",
    slate: "bg-slate-100 text-slate-700",
  };

  const trendColors = {
    up: "bg-emerald-50 text-emerald-700",
    down: "bg-red-50 text-red-700",
    neutral: "bg-slate-100 text-slate-600",
  };

  const content = (
    <div
      className={`rounded-[1.5rem] border border-slate-100 bg-white p-3 text-left shadow-sm transition ${
        onClick ? "active:scale-[0.98]" : ""
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">
            {title}
          </p>

          {loading ? (
            <div className="mt-2 h-7 w-20 animate-pulse rounded-xl bg-slate-100" />
          ) : (
            <h3 className="mt-1 text-2xl font-black text-slate-950">
              {value}
            </h3>
          )}

          {subtitle && (
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {subtitle}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {trend && (
              <span
                className={`rounded-full px-2 py-1 text-[10px] font-black ${
                  trendColors[trendType] || trendColors.neutral
                }`}
              >
                {trend}
              </span>
            )}

            {updatedAt && (
              <span className="text-[10px] font-bold text-slate-400">
                {updatedAt}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
              colors[color] || colors.cyan
            }`}
          >
            <Icon size={22} />
          </div>
        )}
      </div>

      {footer && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          {footer}
        </div>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  return content;
}