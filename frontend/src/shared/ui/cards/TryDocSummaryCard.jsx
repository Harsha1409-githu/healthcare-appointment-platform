export default function TryDocSummaryCard({
  title,
  subtitle,
  items = [],
  footer,
}) {
  return (
    <div className="rounded-[1.6rem] border border-slate-100 bg-white p-4 shadow-sm">
      <div>
        <h3 className="text-base font-black text-slate-950">{title}</h3>

        {subtitle && (
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      {items.length > 0 && (
        <div className="mt-3 space-y-2">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-2"
            >
              <p className="text-xs font-bold text-slate-500">
                {item.label}
              </p>

              <p className="text-sm font-black text-slate-950">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {footer && <div className="mt-3">{footer}</div>}
    </div>
  );
}