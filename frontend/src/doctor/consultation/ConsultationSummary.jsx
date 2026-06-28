export default function ConsultationSummary({
  form,
  patient,
  complete,
  saving,
  onClose,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 px-3 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-t-[2rem] bg-white shadow-2xl">
        <div className="border-b border-slate-100 p-4">
          <h2 className="text-lg font-black text-slate-950">
            Review Consultation
          </h2>

          <p className="text-sm font-semibold text-slate-500">
            {patient?.fullName || "Patient"}
          </p>
        </div>

        <div className="max-h-[65vh] space-y-3 overflow-y-auto p-4">
          <SummaryBlock title="Diagnosis" value={form.diagnosis} />
          <SummaryBlock title="Symptoms" value={form.symptoms} />

          <SummaryBlock
            title="Vitals"
            value={`BP: ${form.vitals.bp || "-"} • Pulse: ${
              form.vitals.pulse || "-"
            } • Temp: ${form.vitals.temperature || "-"} • Weight: ${
              form.vitals.weight || "-"
            }`}
          />

          <SummaryBlock
            title="Medicines"
            value={
              form.medicines.length
                ? form.medicines
                    .map(
                      (m) =>
                        `${m.name} - ${m.dosage || "-"} - ${
                          m.timing || "-"
                        } - ${m.days || "-"} days`
                    )
                    .join("\n")
                : "No medicines added"
            }
          />

          <SummaryBlock
            title="Lab Tests"
            value={
              form.labTests.length ? form.labTests.join(", ") : "No lab tests"
            }
          />

          <SummaryBlock title="Advice" value={form.advice || "No advice"} />

          <SummaryBlock
            title="Follow-up"
            value={
              form.followUpRequired
                ? form.followUpDate || "Required"
                : "Not required"
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-300 py-3 font-black"
          >
            Edit
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={onConfirm}
            className="rounded-2xl bg-cyan-600 py-3 font-black text-white disabled:bg-slate-300"
          >
            {complete ? "Complete" : "Save Draft"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryBlock({ title, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-[10px] font-black uppercase text-slate-500">
        {title}
      </p>

      <p className="mt-1 whitespace-pre-line text-sm font-semibold text-slate-800">
        {value || "-"}
      </p>
    </div>
  );
}