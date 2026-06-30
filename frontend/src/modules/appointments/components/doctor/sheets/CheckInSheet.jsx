import { X } from "lucide-react";

export default function CheckInSheet({ appointment, data, onClose }) {
  if (!appointment) return null;

  return (
    <BottomSheet title={`${getPatientName(appointment)} Check-In`} onClose={onClose}>
      {!data ? (
        <p className="rounded-2xl bg-slate-50 p-4 text-center text-sm font-semibold text-slate-500">
          No check-in available.
        </p>
      ) : (
        <div className="space-y-3">
          <Info label="Temperature" value={data.temperature} />
          <Info label="Blood Pressure" value={data.bloodPressure} />
          <Info label="Weight" value={data.weight} />
          <Info label="Symptoms" value={data.symptoms} />
          <Info label="Notes" value={data.notes} />
        </div>
      )}
    </BottomSheet>
  );
}

function BottomSheet({ title, subtitle, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 px-3 backdrop-blur-sm">
      <div className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-4">
          <div>
            <h2 className="text-lg font-black text-slate-950">{title}</h2>
            {subtitle && (
              <p className="text-sm font-semibold text-slate-500">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          {children}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-xs font-black text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
}

function getPatientName(appointment) {
  return (
    appointment?.familyMember?.fullName ||
    appointment?.patient?.fullName ||
    appointment?.patientName ||
    "Patient"
  );
}