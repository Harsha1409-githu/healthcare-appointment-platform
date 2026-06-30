import { CheckCircle2 } from "lucide-react";

export default function RescheduleSheet({
  appointment,
  availableSlots,
  selectedSlotId,
  setSelectedSlotId,
  onClose,
  onConfirm,
}) {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-end justify-center pb-20">
      <div className="bg-white w-full max-w-md rounded-t-3xl p-4 max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-black">Reschedule Appointment</h2>

        <p className="text-sm text-slate-500 mt-1">Select a new slot</p>

        <div className="space-y-2 mt-4">
          {availableSlots.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
              <p className="text-sm font-black text-slate-700">
                No available slots found
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Generate slots for this doctor/date or check slot type.
              </p>
            </div>
          ) : (
            availableSlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedSlotId(slot.id)}
                className={`w-full text-left p-4 rounded-2xl border active:scale-95 transition ${
                  selectedSlotId === slot.id
                    ? "border-cyan-600 bg-cyan-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black text-slate-950">{slot.date}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      {slot.startTime} - {slot.endTime}
                    </p>
                  </div>

                  {selectedSlotId === slot.id && (
                    <CheckCircle2 className="text-cyan-600" size={20} />
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="py-3 rounded-2xl border border-slate-300 font-black"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="py-3 rounded-2xl bg-cyan-600 text-white font-black"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}