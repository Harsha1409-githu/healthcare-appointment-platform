import { Stethoscope } from "lucide-react";

export default function SoapNotes({
  form,
  setForm,
  listeningField,
  startDictation,
  stopDictation,
}) {
  return (
    <div className="space-y-3">
      <DictationTextArea
        label="Subjective / Symptoms"
        field="symptoms"
        value={form.symptoms}
        onChange={(value) => setForm({ ...form, symptoms: value })}
        placeholder="Patient complaints, symptoms, history..."
        rows={3}
        listeningField={listeningField}
        startDictation={startDictation}
        stopDictation={stopDictation}
      />

      <DictationTextArea
        label="Assessment / Diagnosis"
        field="diagnosis"
        value={form.diagnosis}
        onChange={(value) => setForm({ ...form, diagnosis: value })}
        placeholder="Example: Viral fever"
        rows={2}
        listeningField={listeningField}
        startDictation={startDictation}
        stopDictation={stopDictation}
      />
    </div>
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
      <div className="mb-1 flex items-center justify-between">
        <p className="text-[10px] font-black uppercase text-slate-500">
          {label}
        </p>

        <button
          type="button"
          onClick={isListening ? stopDictation : () => startDictation(field)}
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black ${
            isListening
              ? "bg-red-50 text-red-600"
              : "bg-cyan-50 text-cyan-700"
          }`}
        >
          <Stethoscope size={13} />
          {isListening ? "Stop" : "Speak"}
        </button>
      </div>

      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold outline-none focus:border-cyan-500"
      />
    </label>
  );
}