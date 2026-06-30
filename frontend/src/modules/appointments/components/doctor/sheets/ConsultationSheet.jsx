import { Loader2, X } from "lucide-react";

export default function ConsultationSheet({
  appointment,
  form,
  setForm,
  saving,
  onClose,
  onSave,
}) {
  if (!appointment) return null;

  return (
    <BottomSheet
      title="Consultation Workspace"
      subtitle={getPatientName(appointment)}
      onClose={onClose}
    >
      <div className="space-y-3">
        <InputField
          label="Diagnosis"
          value={form.diagnosis}
          onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
          placeholder="Example: Viral fever"
        />

        <TextAreaField
          label="Doctor Notes"
          value={form.doctorNotes}
          rows={3}
          onChange={(e) => setForm({ ...form, doctorNotes: e.target.value })}
          placeholder="Symptoms, history, vitals"
        />

        <TextAreaField
          label="Advice"
          value={form.advice}
          rows={3}
          onChange={(e) => setForm({ ...form, advice: e.target.value })}
          placeholder="Rest, hydration, red flags"
        />

        <label className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3">
          <input
            type="checkbox"
            checked={form.followUpRequired}
            onChange={(e) =>
              setForm({ ...form, followUpRequired: e.target.checked })
            }
          />
          <span className="text-sm font-black text-slate-800">
            Follow-up Required
          </span>
        </label>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-2xl border border-slate-200 font-black"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-600 font-black text-white disabled:bg-slate-300"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Save
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}

function BottomSheet({ title, subtitle, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 px-3 backdrop-blur-sm">
      <div className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-4">
          <div>
            <h2 className="text-lg font-black text-slate-950">{title}</h2>
            {subtitle && (
              <p className="text-sm font-semibold text-slate-500">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50"
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

function InputField({ label, type = "text", value, onChange, placeholder }) {
  return (
    <label className="block">
      <p className="mb-1.5 text-xs font-black text-slate-700">{label}</p>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold outline-none focus:border-cyan-500"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows }) {
  return (
    <label className="block">
      <p className="mb-1.5 text-xs font-black text-slate-700">{label}</p>

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold outline-none focus:border-cyan-500"
      />
    </label>
  );
}

function getPatientName(appointment) {
  return (
    appointment?.familyMember?.fullName ||
    appointment?.patient?.fullName ||
    appointment?.patientName ||
    "Patient"
  );
}