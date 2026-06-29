import TryDocLoading from "../feedback/TryDocLoading";

export default function TryDocActionCard({
  title,
  description,
  icon: Icon,
  badge,
  action,
  footer,
  loading = false,
  disabled = false,
  onClick,
  className = "",
  children,
}) {
  const card = (
    <div
      className={`rounded-[1.6rem] border border-slate-100 bg-white p-4 shadow-sm transition ${
        disabled ? "opacity-60" : ""
      } ${className}`}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
            <Icon size={22} />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {title && (
                <h3 className="truncate text-sm font-black text-slate-950">
                  {title}
                </h3>
              )}

              {description && (
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {badge && (
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-600">
                  {badge}
                </span>
              )}

              {action}
            </div>
          </div>

          {children && (
            <div className="mt-3">
              {children}
            </div>
          )}

          {footer && (
            <div className="mt-3 border-t border-slate-100 pt-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <TryDocLoading
        title="Loading..."
        description="Please wait"
      />
    );
  }

  if (onClick && !disabled) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left active:scale-[0.99]"
      >
        {card}
      </button>
    );
  }

  return card;
}