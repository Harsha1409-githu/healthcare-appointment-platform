export default function TryDocStatusCard({
  title,
  status,
  description,
  icon: Icon,
  color = "green",
  lastUpdated,
  action,
  footer,
  loading = false,
  className = "",
}) {
  const themes = {
    green: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    cyan: {
      bg: "bg-cyan-50",
      text: "text-cyan-700",
      dot: "bg-cyan-500",
    },
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      dot: "bg-orange-500",
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-700",
      dot: "bg-red-500",
    },
    slate: {
      bg: "bg-slate-100",
      text: "text-slate-700",
      dot: "bg-slate-500",
    },
  };

  const theme = themes[color] || themes.green;

  return (
    <div
      className={`rounded-[1.6rem] border border-slate-100 bg-white p-4 shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl ${theme.bg} ${theme.text}`}
            >
              <Icon size={22} />
            </div>
          )}

          <div>
            {title && (
              <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                {title}
              </p>
            )}

            {loading ? (
              <div className="mt-2 h-5 w-28 animate-pulse rounded-xl bg-slate-100" />
            ) : (
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${theme.dot}`}
                />

                <span
                  className={`text-sm font-black ${theme.text}`}
                >
                  {status}
                </span>
              </div>
            )}

            {description && (
              <p className="mt-1 text-xs font-semibold text-slate-500">
                {description}
              </p>
            )}

            {lastUpdated && (
              <p className="mt-2 text-[10px] font-bold text-slate-400">
                Updated {lastUpdated}
              </p>
            )}
          </div>
        </div>

        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>

      {footer && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          {footer}
        </div>
      )}
    </div>
  );
}