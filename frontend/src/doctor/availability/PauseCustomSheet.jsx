import { Loader2, X } from "lucide-react";

export default function PauseCustomSheet({
  open,
  loading,
  pauseUntil,
  setPauseUntil,
  reason,
  setReason,
  onClose,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 px-3 py-5 backdrop-blur-sm">
      <div className="mx-auto max-w-md rounded-[1.8rem] bg-white p-4 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700">
              Pause Bookings
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-950">
              Pause until specific time
            </h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Patients cannot book slots before this time.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <label className="mt-4 block">
          <p className="mb-1 text-[10px] font-black uppercase text-slate-500">
            Pause Until
          </p>
          <input
            type="time"
            value={pauseUntil}
            onChange={(e) => setPauseUntil(e.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-800 outline-none focus:border-cyan-500"
          />
        </label>

        <label className="mt-3 block">
          <p className="mb-1 text-[10px] font-black uppercase text-slate-500">
            Reason Optional
          </p>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-800 outline-none focus:border-cyan-500"
          >
            <option value="Lunch">Lunch</option>
            <option value="Meeting">Meeting</option>
            <option value="Emergency">Emergency</option>
            <option value="Personal">Personal</option>
          </select>
        </label>

        <button
          type="button"
          disabled={loading || !pauseUntil}
          onClick={onConfirm}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 text-sm font-black text-white active:scale-95 disabled:bg-slate-300"
        >
          {loading && <Loader2 size={17} className="animate-spin" />}
          Pause Bookings
        </button>
      </div>
    </div>
  );
}