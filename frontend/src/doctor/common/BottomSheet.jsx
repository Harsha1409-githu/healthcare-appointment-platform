import { X } from "lucide-react";

export default function BottomSheet({ title, subtitle, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 px-3 backdrop-blur-sm">
      <div className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-100 bg-white p-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-black text-slate-950">
              {title}
            </h2>

            {subtitle && (
              <p className="truncate text-sm font-semibold text-slate-500">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          {children}
        </div>
      </div>
    </div>
  );
}