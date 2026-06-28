import { useState } from "react";
import { Building2, CalendarDays, CheckCircle2, Clock, Video, X } from "lucide-react";

const WEEKDAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
const ALL_DAYS = [...WEEKDAYS, "SATURDAY", "SUNDAY"];

const TIME_OPTIONS = {
  morning: { label: "Morning", startTime: "09:00", endTime: "13:00" },
  evening: { label: "Evening", startTime: "17:00", endTime: "20:00" },
  fullday: { label: "Full Day", startTime: "09:00", endTime: "17:00" },
};

export default function SmartSetupWizard({ open, loading, onClose, onCreate }) {
  const [consultType, setConsultType] = useState("IN_PERSON");
  const [timePreference, setTimePreference] = useState("morning");
  const [days, setDays] = useState(WEEKDAYS);
  const [slotDuration, setSlotDuration] = useState(30);

  if (!open) return null;

  const selectedTime = TIME_OPTIONS[timePreference];

  const estimatedSlots =
    days.length *
    Math.floor(
      (toMinutes(selectedTime.endTime) - toMinutes(selectedTime.startTime)) /
        slotDuration
    );

  const handleCreate = () => {
    onCreate({
      days,
      slotType: consultType,
      startTime: selectedTime.startTime,
      endTime: selectedTime.endTime,
      slotDuration,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 px-3 py-5 backdrop-blur-sm">
      <div className="mx-auto max-w-md rounded-[1.8rem] bg-white p-4 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700">
              Smart Setup
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-950">
              Create weekly schedule
            </h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Choose your practice style. TryDoc creates sessions for you.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <StepTitle number="1" title="How do you consult?" />
        <div className="grid grid-cols-3 gap-2">
          <ChoiceButton
            active={consultType === "IN_PERSON"}
            icon={Building2}
            title="Clinic"
            subtitle="In-person"
            onClick={() => setConsultType("IN_PERSON")}
          />
          <ChoiceButton
            active={consultType === "VIDEO"}
            icon={Video}
            title="Video"
            subtitle="Online"
            onClick={() => setConsultType("VIDEO")}
          />
          <ChoiceButton
            active={consultType === "BOTH"}
            icon={CalendarDays}
            title="Both"
            subtitle="Flexible"
            onClick={() => setConsultType("BOTH")}
          />
        </div>

        <StepTitle number="2" title="When do you consult?" />
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(TIME_OPTIONS).map(([key, item]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTimePreference(key)}
              className={`rounded-2xl border p-3 text-left active:scale-95 ${
                timePreference === key
                  ? "border-cyan-600 bg-cyan-600 text-white"
                  : "border-slate-100 bg-slate-50 text-slate-800"
              }`}
            >
              <p className="text-xs font-black">{item.label}</p>
              <p className="mt-1 text-[10px] font-bold opacity-80">
                {item.startTime}-{item.endTime}
              </p>
            </button>
          ))}
        </div>

        <StepTitle number="3" title="Which days?" />
        <div className="grid grid-cols-4 gap-2">
          {ALL_DAYS.map((day) => {
            const active = days.includes(day);

            return (
              <button
                key={day}
                type="button"
                onClick={() =>
                  setDays((prev) =>
                    active ? prev.filter((d) => d !== day) : [...prev, day]
                  )
                }
                className={`rounded-2xl px-2 py-3 text-center text-xs font-black active:scale-95 ${
                  active
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-50 text-slate-500"
                }`}
              >
                {day.slice(0, 3)}
              </button>
            );
          })}
        </div>

        <StepTitle number="4" title="Appointment duration" />
        <div className="grid grid-cols-4 gap-2">
          {[15, 20, 30, 45].map((mins) => (
            <button
              key={mins}
              type="button"
              onClick={() => setSlotDuration(mins)}
              className={`rounded-2xl py-3 text-xs font-black active:scale-95 ${
                slotDuration === mins
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-50 text-slate-700"
              }`}
            >
              {mins} min
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-cyan-50 p-3">
          <div className="flex items-start gap-2">
            <CheckCircle2 size={17} className="mt-0.5 text-cyan-700" />
            <div>
              <p className="text-sm font-black text-slate-950">
                {estimatedSlots} slots will be created
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-600">
                {days.length} day{days.length === 1 ? "" : "s"} •{" "}
                {selectedTime.label} • {slotDuration} min •{" "}
                {formatSlotType(consultType)}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={loading || days.length === 0}
          onClick={handleCreate}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 text-sm font-black text-white active:scale-95 disabled:bg-slate-300"
        >
          <Clock size={17} />
          Create Schedule
        </button>
      </div>
    </div>
  );
}

function StepTitle({ number, title }) {
  return (
    <p className="mb-2 mt-4 text-[10px] font-black uppercase text-slate-500">
      {number}. {title}
    </p>
  );
}

function ChoiceButton({ active, icon: Icon, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-3 text-center active:scale-95 ${
        active
          ? "border-cyan-600 bg-cyan-600 text-white"
          : "border-slate-100 bg-slate-50 text-slate-700"
      }`}
    >
      <Icon size={18} className="mx-auto" />
      <p className="mt-1 text-xs font-black">{title}</p>
      <p className="mt-0.5 text-[9px] font-bold opacity-70">{subtitle}</p>
    </button>
  );
}

function toMinutes(time) {
  const [h, m] = String(time).split(":").map(Number);
  return h * 60 + m;
}

function formatSlotType(type) {
  if (type === "VIDEO") return "Video";
  if (type === "BOTH") return "Both";
  return "Clinic";
}