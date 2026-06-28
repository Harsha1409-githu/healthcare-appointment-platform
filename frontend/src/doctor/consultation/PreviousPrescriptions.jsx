import { useState } from "react";
import {
  ChevronDown,
  ClipboardCopy,
  Pill,
  CalendarDays,
} from "lucide-react";
import toast from "react-hot-toast";

export default function PreviousPrescriptions({
  prescriptions = [],
  onCopyMedicines,
  onCopyFullPrescription,
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-3 rounded-[1.7rem] border border-slate-100 bg-white p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
          <Pill size={18} />
        </div>

        <div className="flex-1 text-left">
          <h2 className="text-base font-black text-slate-950">
            Previous Prescriptions
          </h2>

          <p className="text-xs font-semibold text-slate-500">
            {prescriptions.length} Previous Visit
            {prescriptions.length !== 1 ? "s" : ""}
          </p>
        </div>

        <ChevronDown
          size={18}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          {prescriptions.length === 0 ? (
            <div className="mt-3 rounded-2xl bg-slate-50 p-3">
              <p className="text-sm text-slate-500">
                No previous prescriptions.
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {prescriptions.map((item, index) => (
                <PrescriptionCard
                  key={item.id || index}
                  item={item}
                  onCopyMedicines={() => {
                    onCopyMedicines(item);
                    toast.success("Medicines copied");
                  }}
                  onCopyFull={() => {
                    onCopyFullPrescription(item);
                    toast.success("Prescription copied");
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

function PrescriptionCard({
  item,
  onCopyMedicines,
  onCopyFull,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900">
            {item.diagnosis || "Diagnosis"}
          </h3>

          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
            <CalendarDays size={12} />
            {formatDate(item.createdAt)}
          </div>
        </div>

        <button
          type="button"
          onClick={onCopyMedicines}
          className="rounded-xl bg-cyan-600 px-3 py-2 text-[11px] font-black text-white"
        >
          Copy Medicines
        </button>
      </div>

      {item.medicines && (
        <div className="mt-3 rounded-xl bg-white p-3">
          <pre className="whitespace-pre-wrap text-xs text-slate-600">
            {item.medicines}
          </pre>
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onCopyMedicines}
          className="rounded-xl border border-cyan-200 bg-cyan-50 py-2 text-xs font-black text-cyan-700"
        >
          <ClipboardCopy
            size={14}
            className="mr-1 inline"
          />
          Medicines
        </button>

        <button
          type="button"
          onClick={onCopyFull}
          className="rounded-xl border border-slate-200 bg-white py-2 text-xs font-black text-slate-700"
        >
          <ClipboardCopy
            size={14}
            className="mr-1 inline"
          />
          Full Copy
        </button>
      </div>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}