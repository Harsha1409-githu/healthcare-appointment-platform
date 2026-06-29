import { X } from "lucide-react";

export default function TryDocBottomSheet({
  open,
  title,
  subtitle,
  children,
  footer,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 px-3 py-5 backdrop-blur-sm">
      <div className="mx-auto flex max-h-[90vh] max-w-md flex-col rounded-[1.8rem] bg-white shadow-xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-4">
          <div className="min-w-0">
            <h2 className="text-xl font-black text-slate-950">{title}</h2>

            {subtitle && (
              <p className="mt-1 text-xs font-semibold text-slate-500">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 active:scale-95"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">{children}</div>

        {footer && (
          <div className="border-t border-slate-100 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}