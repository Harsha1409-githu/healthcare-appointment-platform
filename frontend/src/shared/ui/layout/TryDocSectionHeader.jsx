export default function TryDocSectionHeader({
  title,
  subtitle,
  action,
  className = "",
}) {
  return (
    <div
      className={`mb-3 flex items-start justify-between gap-3 ${className}`}
    >
      <div className="min-w-0">
        <h2 className="truncate text-lg font-black text-slate-950">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}