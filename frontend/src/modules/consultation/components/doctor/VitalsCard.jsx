export default function VitalsCard({ form, setForm }) {
  const updateVital = (key, value) => {
    setForm((prev) => ({
      ...prev,
      vitals: {
        ...prev.vitals,
        [key]: value,
      },
    }));
  };

  const fields = [
    { key: "bp", label: "BP", placeholder: "120/80" },
    { key: "pulse", label: "Pulse", placeholder: "78 bpm" },
    { key: "temperature", label: "Temp", placeholder: "98.6°F" },
    { key: "spo2", label: "SpO₂", placeholder: "99%" },
    { key: "weight", label: "Weight", placeholder: "70 kg" },
    { key: "height", label: "Height", placeholder: "170 cm" },
    { key: "respiration", label: "Resp.", placeholder: "18/min" },
    { key: "bloodSugar", label: "Sugar", placeholder: "110 mg/dL" },
  ];

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-base font-black text-slate-900">
        Patient Vitals
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {fields.map((field) => (
          <TextInput
            key={field.key}
            label={field.label}
            value={form.vitals?.[field.key] || ""}
            placeholder={field.placeholder}
            onChange={(value) => updateVital(field.key, value)}
          />
        ))}
      </div>
    </section>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <label>
      <p className="mb-1 text-[10px] font-black uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none transition focus:border-cyan-500 focus:bg-white"
      />
    </label>
  );
}