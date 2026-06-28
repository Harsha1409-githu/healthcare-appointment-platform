const items = [
  "Appointment booked",
  "Consultation complete",
  "Prescription ready",
  "Follow-up tomorrow",
];

export default function TimelineCard() {
  return (
    <div className="mt-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-black text-slate-400">
        HEALTH TIMELINE
      </p>

      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <div key={item} className="flex items-center gap-3">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                index < 3 ? "bg-cyan-600" : "bg-slate-200"
              }`}
            />

            <p
              className={`text-sm font-bold ${
                index < 3 ? "text-slate-700" : "text-slate-400"
              }`}
            >
              {index < 3 ? "✓ " : "○ "}
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}