import { Loader2, Sparkles } from "lucide-react";

export default function SlotGenerationCard({
  selectedDate,
  setSelectedDate,
  loading,
  onGenerate,
}) {
  return (
    <section className="mt-3 rounded-[1.7rem] border border-slate-100 bg-white p-3 shadow-sm">
      <SectionHeader
        title="Generate Slots"
        subtitle="Internal slot creation from sessions"
        icon={Sparkles}
      />

      <div className="mt-3 flex items-end gap-2">
        <div className="flex-1">
          <InputField
            label="Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={onGenerate}
          className="flex h-12 w-28 items-center justify-center gap-1.5 rounded-2xl bg-slate-950 text-xs font-black text-white active:scale-95 disabled:bg-slate-300"
        >
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Sparkles size={15} />
          )}
          Generate
        </button>
      </div>
    </section>
  );
}

function SectionHeader({ title, subtitle, icon: Icon }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
        <Icon size={19} />
      </div>

      <div className="min-w-0">
        <h2 className="truncate text-base font-black text-slate-950">
          {title}
        </h2>
        <p className="truncate text-xs font-semibold text-slate-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function InputField({ label, type = "text", value, onChange }) {
  return (
    <label className="block">
      <p className="mb-1 text-[10px] font-black uppercase text-slate-500">
        {label}
      </p>

      <input
        type={type}
        value={value}
        onChange={onChange}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-800 outline-none focus:border-cyan-500"
        required
      />
    </label>
  );
}