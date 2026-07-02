import { Inbox } from "lucide-react";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description = "",
  action,
  className = "",
}) {
  return (
    <div
      className={`rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center ${className}`}
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-white shadow-sm">
        <Icon className="text-slate-400" size={26} />
      </div>

      <h3 className="mt-5 text-lg font-black text-slate-900">
        {title}
      </h3>

      {description && (
        <p className="mx-auto mt-2 max-w-xs text-sm font-medium leading-6 text-slate-500">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}
