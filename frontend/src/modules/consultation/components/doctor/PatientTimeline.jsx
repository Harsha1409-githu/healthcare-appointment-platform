
import {
  CalendarDays,
  ChevronDown,
  ClipboardCopy,
  ClipboardList,
  FileText,
  Pill,
} from "lucide-react";

export default function PatientTimeline({
  profile,
  open,
  onToggle,
  onRepeatMedicines,
  onRepeatFullPrescription,
}) {
  

  const prescriptions = profile?.prescriptions || [];
  const consultations = profile?.consultations || [];

  const items = [
    ...consultations.map((item) => ({
      type: "Consultation",
      date: item.createdAt,
      title: item.diagnosis || "Consultation",
      note: item.symptoms || item.advice || "Clinical note recorded",
      icon: ClipboardList,
      raw: item,
    })),
    ...prescriptions.map((item) => ({
      type: "Prescription",
      date: item.createdAt,
      title: item.diagnosis || "Prescription",
      note: item.medicines || item.notes || "Prescription generated",
      icon: Pill,
      raw: item,
      hasPrescription: true,
    })),
  ]
    .filter((item) => item.date || item.title)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 6);

  return (
    <section className="mt-3 rounded-[1.7rem] border border-slate-100 bg-white p-4 shadow-sm">
      <button
        type="button"
       onClick={onToggle}
        className="flex w-full items-center gap-3 text-left"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
          <CalendarDays size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-black text-slate-950">
            Visit Timeline
          </h2>

          <p className="text-xs font-semibold text-slate-500">
            {items.length} previous record{items.length === 1 ? "" : "s"}
          </p>
        </div>

        <ChevronDown
          size={18}
          className={`text-slate-400 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {items.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-500">
              No previous clinical history found.
            </p>
          ) : (
            items.map((item, index) => {
              const Icon = item.icon || FileText;

              return (
                <div
                  key={`${item.type}-${item.date}-${index}`}
                  className="rounded-2xl bg-slate-50 p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                      <Icon size={17} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-black text-cyan-700">
                          {item.type}
                        </p>

                        <p className="shrink-0 text-[10px] font-bold text-slate-400">
                          {formatDate(item.date)}
                        </p>
                      </div>

                      <h3 className="mt-1 text-sm font-black text-slate-950">
                        {item.title}
                      </h3>

                      <p className="mt-1 line-clamp-3 whitespace-pre-line text-xs font-semibold text-slate-500">
                        {item.note}
                      </p>
                    </div>
                  </div>

                  {item.hasPrescription && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onRepeatMedicines?.(item.raw)}
                        className="rounded-xl bg-cyan-600 py-2 text-[11px] font-black text-white"
                      >
                        <ClipboardCopy size={13} className="mr-1 inline" />
                        Repeat Medicines
                      </button>

                      <button
                        type="button"
                        onClick={() => onRepeatFullPrescription?.(item.raw)}
                        className="rounded-xl bg-white py-2 text-[11px] font-black text-slate-700 ring-1 ring-slate-200"
                      >
                        Full Repeat
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </section>
  );
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}