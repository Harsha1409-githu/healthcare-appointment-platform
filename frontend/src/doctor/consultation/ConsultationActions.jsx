import { CheckCircle2, Loader2, Save } from "lucide-react";

export default function ConsultationActions({
  saving,
  onSaveDraft,
  onComplete,
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-100 bg-white/95 px-3 py-3 backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={saving}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 text-xs font-black text-white active:scale-95 disabled:bg-slate-300"
        >
          <Save size={16} />
          Save Draft
        </button>

        <button
          type="button"
          onClick={onComplete}
          disabled={saving}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-600 text-xs font-black text-white active:scale-95 disabled:bg-slate-300"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <CheckCircle2 size={16} />
          )}
          Complete
        </button>
      </div>
    </div>
  );
}