import { Loader2, X } from "lucide-react";

export default function FollowUpSheet({
  appointment,
  form,
  setForm,
  saving,
  onClose,
  onSave,
  addDays,
}) {
  if (!appointment) return null;

  return (
    <BottomSheet
      title="Schedule Follow-up"
      subtitle={getPatientName(appointment)}
      onClose={onClose}
    >
      <div className="grid grid-cols-3 gap-2">
        {[7, 15, 30].map((days) => (
          <button
            key={days}
            type="button"
            onClick={() =>
              setForm({
                ...form,
                followUpDate: addDays(days),
              })
            }
            className="rounded-2xl bg-cyan-50 py-3 text-xs font-black text-cyan-700"
          >
            {days} Days
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-3">
        <InputField
          label="Follow-up Date"
          type="date"
          value={form.followUpDate}
          onChange={(e) =>
            setForm({
              ...form,
              followUpDate: e.target.value,
            })
          }
        />

        <TextAreaField
          label="Notes"
          value={form.notes}
          rows={3}
          onChange={(e) =>
            setForm({
              ...form,
              notes: e.target.value,
            })
          }
          placeholder="Review after medicine course"
        />

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
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-violet-600 font-black text-white disabled:bg-slate-300"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Schedule
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