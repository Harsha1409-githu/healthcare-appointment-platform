export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="truncate text-base font-black text-slate-950">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}