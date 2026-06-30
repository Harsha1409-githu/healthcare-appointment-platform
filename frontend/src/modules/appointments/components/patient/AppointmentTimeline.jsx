import { CheckCircle2, Clock } from "lucide-react";

function AppointmentTimeline({ appointment }) {
  const isVideo = appointment.appointmentType === "VIDEO";
  const isCancelled = appointment.status === "CANCELLED";
  const isCompleted = appointment.status === "COMPLETED";

  const steps = isCancelled
    ? [
        { title: "Booked", done: true },
        { title: "Payment Done", done: true },
        { title: "Cancelled", done: true, danger: true },
      ]
    : [
        { title: "Booked", done: true },
        { title: "Payment Done", done: true },
        {
          title: isVideo ? "Video-Consult Pending" : "Consultation Pending",
          done: isCompleted,
        },
        {
          title: "Completed",
          done: isCompleted,
        },
      ];

  return (
    <div className="mt-3 bg-slate-50 border border-slate-100 rounded-2xl p-3">
      <p className="text-[11px] font-black text-slate-500 mb-3">
        APPOINTMENT TIMELINE
      </p>

      <div className="grid grid-cols-4 gap-1">
        {steps.map((step, index) => (
          <div key={step.title} className="text-center">
            <div className="flex items-center">
              <div
                className={`h-0.5 flex-1 ${
                  index === 0
                    ? "bg-transparent"
                    : step.done
                    ? step.danger
                      ? "bg-red-300"
                      : "bg-emerald-300"
                    : "bg-slate-200"
                }`}
              />

              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-white mx-1 ${
                  step.done
                    ? step.danger
                      ? "bg-red-500"
                      : "bg-emerald-500"
                    : "bg-slate-300"
                }`}
              >
                {step.done ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <Clock size={14} />
                )}
              </div>

              <div
                className={`h-0.5 flex-1 ${
                  index === steps.length - 1
                    ? "bg-transparent"
                    : steps[index + 1]?.done
                    ? steps[index + 1]?.danger
                      ? "bg-red-300"
                      : "bg-emerald-300"
                    : "bg-slate-200"
                }`}
              />
            </div>

            <p
              className={`text-[9px] font-black mt-1 leading-tight ${
                step.danger
                  ? "text-red-600"
                  : step.done
                  ? "text-slate-800"
                  : "text-slate-400"
              }`}
            >
              {step.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AppointmentTimeline;