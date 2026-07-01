import { Mic, Square } from "lucide-react";

export default function SoapNotes({
  form,
  setForm,
  listeningField,
  startDictation,
  stopDictation,
}) {
  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-base font-black text-slate-900">
        SOAP Notes
      </h3>

      <div className="space-y-3">
        <DictationTextArea
          label="S — Subjective"
          field="subjective"
          value={form.subjective || form.symptoms || ""}
          onChange={(value) => updateField("subjective", value)}
          placeholder="Patient complaints, symptoms, history..."
          rows={3}
          listeningField={listeningField}
          startDictation={startDictation}
          stopDictation={stopDictation}
        />

        <DictationTextArea
          label="O — Objective"
          field="objective"
          value={form.objective || ""}
          onChange={(value) => updateField("objective", value)}
          placeholder="Vitals, examination findings, observations..."
          rows={3}
          listeningField={listeningField}
          startDictation={startDictation}
          stopDictation={stopDictation}
        />

        <DictationTextArea
          label="A — Assessment"
          field="assessment"
          value={form.assessment || form.diagnosis || ""}
          onChange={(value) => updateField("assessment", value)}
          placeholder="Diagnosis, differential diagnosis..."
          rows={3}
          listeningField={listeningField}
          startDictation={startDictation}
          stopDictation={stopDictation}
        />

        <DictationTextArea
          label="P — Plan"
          field="plan"
          value={form.plan || ""}
          onChange={(value) => updateField("plan", value)}
          placeholder="Treatment plan, medicines, tests, follow-up..."
          rows={3}
          listeningField={listeningField}
          startDictation={startDictation}
          stopDictation={stopDictation}
        />
      </div>
    </section>
  );
}

function DictationTextArea({
  label,
  field,
  value,
  onChange,
  placeholder,
  rows = 3,
  listeningField,
  startDictation,
  stopDictation,
}) {
  const isListening = listeningField === field;

  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <button
          type="button"
          onClick={isListening ? stopDictation : () => startDictation(field)}
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black ${
            isListening
              ? "bg-red-50 text-red-600"
              : "bg-cyan-50 text-cyan-700"
          }`}
        >
          {isListening ? <Square size={12} /> : <Mic size={12} />}
          {isListening ? "Stop" : "Speak"}
        </button>
      </div>

      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold outline-none transition focus:border-cyan-500 focus:bg-white"
      />
    </label>
  );
}