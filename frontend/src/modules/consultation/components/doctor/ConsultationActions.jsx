import {
  CheckCircle2,
  Loader2,
  Save,
  FlaskConical,
  Pill,
} from "lucide-react";

export default function ConsultationActions({
  saving,
  onSaveDraft,
  onPrescription,
  onLabTests,
  onComplete,
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-md px-3 py-3 space-y-2">

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onPrescription}
            className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-cyan-50 text-cyan-700 font-black text-xs"
          >
            <Pill size={15} />
            Prescription
          </button>

          <button
            type="button"
            onClick={onLabTests}
            className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-amber-50 text-amber-700 font-black text-xs"
          >
            <FlaskConical size={15} />
            Lab Tests
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={saving}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-900 text-white text-xs font-black disabled:bg-slate-300"
          >
            <Save size={16} />
            Save Draft
          </button>

          <button
            type="button"
            onClick={onComplete}
            disabled={saving}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-600 text-white text-xs font-black disabled:bg-slate-300"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCircle2 size={16} />
            )}

            Complete Visit
          </button>
        </div>

      </div>
    </div>
  );
}