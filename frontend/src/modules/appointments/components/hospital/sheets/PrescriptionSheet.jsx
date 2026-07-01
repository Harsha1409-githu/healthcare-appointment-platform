import { Loader2, Save, X } from "lucide-react";
function PrescriptionSheet({
  appointment,
  form,
  setForm,
  actionLoading,
  onSave,
  onClose,
}) {
  const patientName =
    appointment.patient?.fullName || appointment.patientName || "Patient";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end">
      <div className="bg-white w-full max-w-md mx-auto rounded-t-[2rem] max-h-[88vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 p-4 rounded-t-[2rem] z-10">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />

          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                Add Prescription
              </h2>

              <p className="text-sm text-slate-500">
                For {patientName}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3 pb-8">
          <input
            type="text"
            placeholder="Diagnosis"
            value={form.diagnosis}
            onChange={(e) =>
              setForm({
                ...form,
                diagnosis: e.target.value,
              })
            }
            className="w-full border border-slate-200 bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
          />

          <textarea
            placeholder="Medicines"
            rows="5"
            value={form.medicines}
            onChange={(e) =>
              setForm({
                ...form,
                medicines: e.target.value,
              })
            }
            className="w-full border border-slate-200 bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 text-sm resize-none"
          />

          <textarea
            placeholder="Notes"
            rows="3"
            value={form.notes}
            onChange={(e) =>
              setForm({
                ...form,
                notes: e.target.value,
              })
            }
            className="w-full border border-slate-200 bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 text-sm resize-none"
          />

          <button
            type="button"
            disabled={actionLoading}
            onClick={onSave}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 rounded-2xl font-black disabled:bg-slate-400 active:scale-95"
          >
            {actionLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Prescription
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrescriptionSheet;
