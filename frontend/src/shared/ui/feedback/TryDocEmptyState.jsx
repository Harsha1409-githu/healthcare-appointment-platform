export default function TryDocEmptyState({
  icon: Icon,
  title = "No data found",
  description = "Nothing to show right now.",
  action,
}) {
  return (
    <div className="rounded-[1.6rem] bg-slate-50 p-6 text-center">
      {Icon && <Icon className="mx-auto text-cyan-600" size={34} />}

      <h3 className="mt-2 text-base font-black text-slate-950">
        {title}
      </h3>

      {description && (
        <p className="mt-1 text-sm font-semibold text-slate-500">
          {description}
        </p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}