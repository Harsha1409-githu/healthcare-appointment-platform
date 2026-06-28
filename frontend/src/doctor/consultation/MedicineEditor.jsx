import { Plus, Trash2 } from "lucide-react";
import MedicationSafety from "./MedicationSafety";
import { checkMedicationSafety } from "./medicineUtils";

export default function MedicineEditor({
  medicine,
  setMedicine,
  form,
  setForm,
  commonMedicines,
  medicineSuggestions,
  dosages,
  timings,
  days,
  patient,
}) {
  const addMedicine = () => {
    if (!medicine.name.trim()) return;

    setForm({
      ...form,
      medicines: [...form.medicines, medicine],
    });

    setMedicine({
      name: "",
      dosage: "",
      timing: "BD",
      days: "5",
    });
  };

  const removeMedicine = (index) => {
    setForm({
      ...form,
      medicines: form.medicines.filter((_, i) => i !== index),
    });
  };

  const safetyAlerts = checkMedicationSafety({
  medicineName: medicine.name,
  form,
  patient,
});

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {commonMedicines.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMedicine({ ...medicine, name: item })}
            className={`rounded-2xl px-3 py-2 text-left text-[11px] font-black active:scale-95 ${
              medicine.name === item
                ? "bg-cyan-600 text-white"
                : "bg-slate-50 text-slate-700"
            }`}
          >
            + {item}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-slate-50 p-3">
        <TextInput
          label="Medicine"
          value={medicine.name}
          onChange={(value) => setMedicine({ ...medicine, name: value })}
          placeholder="Search medicine"
        />

        {medicine.name && medicineSuggestions.length > 0 && (
          <div className="mt-2 space-y-1.5 rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
            {medicineSuggestions.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() =>
                  setMedicine({
                    name: item.name,
                    dosage: item.dosage,
                    timing: item.timing,
                    days: item.days,
                  })
                }
                className="w-full rounded-xl px-3 py-2 text-left active:bg-slate-50"
              >
                <p className="text-sm font-black text-slate-950">
                  {item.name}
                </p>
                <p className="text-[11px] font-semibold text-slate-500">
                  {item.dosage} • {item.timing} • {item.days} days
                </p>
              </button>
            ))}
          </div>
        )}

        <ChipGroup
          title="Dosage"
          options={dosages}
          value={medicine.dosage}
          onChange={(value) => setMedicine({ ...medicine, dosage: value })}
        />

        <ChipGroup
          title="Timing"
          options={timings}
          value={medicine.timing}
          onChange={(value) => setMedicine({ ...medicine, timing: value })}
        />

        <ChipGroup
          title="Duration"
          options={days}
          value={medicine.days}
          onChange={(value) => setMedicine({ ...medicine, days: value })}
          suffix=" Days"
        />

        <MedicationSafety alerts={safetyAlerts} />

        <button
          type="button"
          onClick={addMedicine}
          className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-600 text-xs font-black text-white"
        >
          <Plus size={15} />
          Add Medicine
        </button>
      </div>

      {form.medicines.length > 0 && (
        <div className="space-y-2">
          {form.medicines.map((item, index) => (
            <MedicineCard
              key={`${item.name}-${index}`}
              item={item}
              onRemove={() => removeMedicine(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ChipGroup({ title, options, value, onChange, suffix = "" }) {
  return (
    <div className="mt-3">
      <p className="mb-2 text-[10px] font-black uppercase text-slate-500">
        {title}
      </p>

      <div className="flex flex-wrap gap-2">
        {options.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`rounded-full px-3 py-2 text-[11px] font-black ${
              value === item
                ? "bg-cyan-600 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {item}
            {suffix}
          </button>
        ))}
      </div>
    </div>
  );
}

function MedicineCard({ item, onRemove }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl bg-slate-50 p-3">
      <div className="min-w-0">
        <h3 className="truncate text-sm font-black text-slate-950">
          💊 {item.name}
        </h3>

        <p className="mt-1 truncate text-xs font-semibold text-slate-500">
          {item.dosage || "-"} • {item.timing || "-"} • {item.days || "-"} days
        </p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600"
      >
        <Trash2 size={15} />
      </button>
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
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-cyan-500"
      />
    </label>
  );
}