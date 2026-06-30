import { Building2, Clock, Loader2, Pencil, Save, Video, X } from "lucide-react";
import {
  formatDay,
  buildPreviewSlots,
} from "@/modules/practice/utils/time.utils";
import {
  DAYS,
  TEMPLATES,
} from "@/modules/practice/constants/practice.constants";

export default function SessionForm({
  showForm,
  editingId,
  form,
  setForm,
  loading,
  onSubmit,
  onCancel,
}) {
  if (!showForm) return null;

  const applyTemplate = (template) => {
    setForm((prev) => ({
      ...prev,
      startTime: template.startTime,
      endTime: template.endTime,
      slotType: template.slotType,
    }));
  };

  const previewSlots = buildPreviewSlots(
  form.startTime,
  form.endTime,
  Number(form.slotDuration || 30)
);

  return (
    <form
      id="session-form"
      onSubmit={onSubmit}
      className="mt-3 rounded-[1.7rem] border border-slate-100 bg-white p-3 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700">
            {editingId ? "Edit Working Hours" : "Create Working Hours"}
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-950">
            When are you available?
          </h2>

          <p className="mt-1 text-xs font-semibold text-slate-500">
            Choose time, consultation type, and slot duration.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-600"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-[10px] font-black uppercase text-slate-500">
          Quick Templates
        </p>

        <div className="grid grid-cols-3 gap-2">
          {TEMPLATES.map((template) => (
            <button
  key={template.title}
  type="button"
  onClick={() => applyTemplate(template)}
  className={`rounded-2xl border px-2 py-3 text-left active:scale-95 ${
    form.startTime === template.startTime &&
    form.endTime === template.endTime &&
    form.slotType === template.slotType
      ? "border-cyan-600 bg-cyan-600 text-white shadow-sm"
      : "border-slate-100 bg-slate-50 text-slate-800"
  }`}
>
              <p className="text-xs font-black">
                {template.title}
              </p>

              <p
  className={`mt-0.5 text-[10px] font-bold ${
    form.startTime === template.startTime &&
    form.endTime === template.endTime &&
    form.slotType === template.slotType
      ? "text-cyan-50"
      : "text-slate-500"
  }`}
>
                {template.desc}
              </p>

              <p
  className={`mt-1 text-[9px] font-black ${
    form.startTime === template.startTime &&
    form.endTime === template.endTime &&
    form.slotType === template.slotType
      ? "text-white"
      : "text-cyan-700"
  }`}
>
                {template.startTime}-{template.endTime}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 p-3">
        <p className="mb-2 text-[10px] font-black uppercase text-slate-500">
          1. Select Day
        </p>

        <SelectField
          value={form.dayOfWeek}
          onChange={(e) =>
            setForm({
              ...form,
              dayOfWeek: e.target.value,
            })
          }
        >
          {DAYS.map((day) => (
            <option key={day} value={day}>
              {formatDay(day)}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="mt-3 rounded-2xl bg-slate-50 p-3">
        <p className="mb-2 text-[10px] font-black uppercase text-slate-500">
          2. Consultation Type
        </p>

        <div className="grid grid-cols-3 gap-2">
          <TypeButton
            active={form.slotType === "IN_PERSON"}
            icon={Building2}
            title="Clinic"
            subtitle="In-person"
            onClick={() => setForm({ ...form, slotType: "IN_PERSON" })}
          />

          <TypeButton
            active={form.slotType === "VIDEO"}
            icon={Video}
            title="Video"
            subtitle="Online"
            onClick={() => setForm({ ...form, slotType: "VIDEO" })}
          />

          <TypeButton
            active={form.slotType === "BOTH"}
            icon={Clock}
            title="Both"
            subtitle="Flexible"
            onClick={() => setForm({ ...form, slotType: "BOTH" })}
          />
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-slate-50 p-3">
        <p className="mb-2 text-[10px] font-black uppercase text-slate-500">
          3. Session Time
        </p>

        <div className="grid grid-cols-3 gap-2">
          <InputField
            label="Start"
            type="time"
            value={form.startTime}
            onChange={(e) =>
              setForm({
                ...form,
                startTime: e.target.value,
              })
            }
          />

          <InputField
            label="End"
            type="time"
            value={form.endTime}
            onChange={(e) =>
              setForm({
                ...form,
                endTime: e.target.value,
              })
            }
          />

          <InputField
            label="Mins"
            type="number"
            value={form.slotDuration}
            onChange={(e) =>
              setForm({
                ...form,
                slotDuration: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-cyan-50 p-3">
  <div className="flex items-center justify-between gap-3">
    <div>
      <p className="text-[10px] font-black uppercase text-cyan-700">
        Preview Slots
      </p>
      <p className="text-xs font-semibold text-slate-600">
        {previewSlots.length} slots will be created
      </p>
    </div>

    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-cyan-700">
      {form.slotDuration} mins
    </span>
  </div>

  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
    {previewSlots.length === 0 ? (
      <p className="text-xs font-bold text-slate-500">
        Select valid start and end time.
      </p>
    ) : (
      previewSlots.slice(0, 12).map((slot) => (
        <span
          key={slot}
          className="shrink-0 rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-800"
        >
          {slot}
        </span>
      ))
    )}

    {previewSlots.length > 12 && (
      <span className="shrink-0 rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-500">
        +{previewSlots.length - 12} more
      </span>
    )}
  </div>
</div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-600 text-sm font-black text-white active:scale-95 disabled:bg-slate-300"
      >
        {loading ? (
          <Loader2 size={17} className="animate-spin" />
        ) : editingId ? (
          <Pencil size={17} />
        ) : (
          <Save size={17} />
        )}

        {editingId ? "Update Working Hours" : "Save Working Hours"}
      </button>
    </form>
  );
}

function TypeButton({ active, icon: Icon, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-3 text-center active:scale-95 ${
        active
          ? "border-cyan-600 bg-cyan-600 text-white"
          : "border-slate-100 bg-white text-slate-700"
      }`}
    >
      <Icon size={18} className="mx-auto" />

      <p className="mt-1 text-xs font-black">{title}</p>

      <p
        className={`mt-0.5 text-[9px] font-bold ${
          active ? "text-cyan-50" : "text-slate-400"
        }`}
      >
        {subtitle}
      </p>
    </button>
  );
}

function SelectField({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-800 outline-none focus:border-cyan-500"
      required
    >
      {children}
    </select>
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
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-800 outline-none focus:border-cyan-500"
        required
      />
    </label>
  );
}





