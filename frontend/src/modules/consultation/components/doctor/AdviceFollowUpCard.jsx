import { Mic, MicOff } from "lucide-react";

export default function AdviceFollowUpCard({
  form,
  setForm,
  listeningField,
  startDictation,
  stopDictation,
}) {
  return (
    <div className="space-y-3">
      <DictationTextArea
        label="Advice"
        field="advice"
        value={form.advice}
        onChange={(value) => setForm({ ...form, advice: value })}
        placeholder="Rest, hydration, red flags..."
        rows={3}
        listeningField={listeningField}
        startDictation={startDictation}
        stopDictation={stopDictation}
      />

      <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
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

      {form.followUpRequired && (
        <TextInput
          label="Follow-up Date"
          type="date"
          value={form.followUpDate}
          onChange={(value) => setForm({ ...form, followUpDate: value })}
        />
      )}
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block">
      <p className="mb-1 text-[10px] font-black uppercase text-slate-500">
        {label}
      </p>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-cyan-500"
      />
    </label>
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
          {isListening ? <MicOff size={13} /> : <Mic size={13} />}
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