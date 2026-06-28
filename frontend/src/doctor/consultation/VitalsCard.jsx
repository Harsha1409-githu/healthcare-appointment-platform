export default function VitalsCard({ form, setForm }) {
  const updateVital = (key, value) => {
    setForm({
      ...form,
      vitals: {
        ...form.vitals,
        [key]: value,
      },
    });
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <TextInput
        label="BP"
        value={form.vitals.bp}
        onChange={(value) => updateVital("bp", value)}
        placeholder="120/80"
      />

      <TextInput
        label="Pulse"
        value={form.vitals.pulse}
        onChange={(value) => updateVital("pulse", value)}
        placeholder="78"
      />

      <TextInput
        label="Temp"
        value={form.vitals.temperature}
        onChange={(value) => updateVital("temperature", value)}
        placeholder="98.6"
      />

      <TextInput
        label="Weight"
        value={form.vitals.weight}
        onChange={(value) => updateVital("weight", value)}
        placeholder="70 kg"
      />
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