import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const getPatientName = (appointment) =>
  appointment?.familyMember?.fullName ||
  appointment?.patient?.fullName ||
  appointment?.patientName ||
  "Patient";

const getPatientMeta = (appointment) => {
  const age = appointment?.familyMember?.age || appointment?.patient?.age;
  const gender = appointment?.familyMember?.gender || appointment?.patient?.gender;
  const relation = appointment?.familyMember?.relation || "Self";
  return [age ? `${age} yrs` : null, gender, relation].filter(Boolean).join(" • ");
};

function formatTime(time) {
  if (!time) return "";
  return String(time).slice(0, 5);
}

function AppointmentRow({
  appointment,
  actionLoadingId,
  onCheckIn,
  onConsult,
  onPrescription,
  onViewPrescription,
  onFollowUp,
  onComplete,
}) {
  const isBooked = appointment.status === "BOOKED";
  const isCompleted = appointment.status === "COMPLETED";
  const isVideo = appointment.appointmentType === "VIDEO";
  const patientName = getPatientName(appointment);

  return (
    <article className="rounded-2xl border border-slate-100 bg-slate-50 p-2.5">
      <div className="grid grid-cols-[46px_1fr_auto] items-center gap-2">
        <div className="text-center">
          <p className="text-sm font-black text-slate-950">
            {formatTime(appointment.slot?.startTime) || "--"}
          </p>
          <p className="text-[9px] font-black text-slate-400">
            {appointment.slot?.date?.slice(5) || ""}
          </p>
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-black text-slate-950">
            {patientName}
          </h3>
          <p className="truncate text-[11px] font-semibold text-slate-500">
            {getPatientMeta(appointment) || "Patient"} • {isVideo ? "Video" : "Clinic"}
          </p>
        </div>

        <StatusBadge status={appointment.status} />
      </div>

      <div className="mt-2 grid grid-cols-4 gap-1.5">
        <button
          type="button"
          onClick={() => onCheckIn(appointment)}
          className="rounded-xl bg-white py-2 text-[10px] font-black text-slate-700"
        >
          Check
        </button>

        {isVideo && isBooked ? (
          <Link
            to={`/doctor/video-consult/${appointment.id}`}
            className="rounded-xl bg-cyan-600 py-2 text-center text-[10px] font-black text-white"
          >
            Join
          </Link>
        ) : (
          <Link
  to={`/doctor/consultation/${appointment.id}`}
  className={`rounded-xl py-2 text-center text-[10px] font-black ${
    isBooked
      ? "bg-cyan-600 text-white"
      : "pointer-events-none bg-slate-300 text-white"
  }`}
>
  Consult
</Link>
        )}

        <button
          type="button"
          onClick={() =>
            appointment.prescriptionCompleted
              ? onViewPrescription(appointment)
              : onPrescription(appointment)
          }
          className="rounded-xl bg-white py-2 text-[10px] font-black text-slate-700"
        >
          Rx
        </button>

        <button
          type="button"
          disabled={actionLoadingId === appointment.id || !isCompleted}
          onClick={() => onComplete(appointment)}
          className="flex items-center justify-center gap-1 rounded-xl bg-emerald-600 py-2 text-[10px] font-black text-white disabled:bg-slate-300"
        >
          {actionLoadingId === appointment.id ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            "Done"
          )}
        </button>
      </div>

      {isCompleted && (
        <button
          type="button"
          onClick={() => onFollowUp(appointment)}
          className="mt-1.5 w-full rounded-xl bg-violet-50 py-2 text-[10px] font-black text-violet-700"
        >
          Follow-up
        </button>
      )}
    </article>
  );
}

function StatusBadge({ status }) {
  const style =
    status === "COMPLETED"
      ? "bg-emerald-100 text-emerald-700"
      : status === "CANCELLED"
      ? "bg-red-100 text-red-700"
      : "bg-cyan-100 text-cyan-700";

  return (
    <span className={`rounded-full px-2 py-1 text-[9px] font-black ${style}`}>
      {status || "BOOKED"}
    </span>
  );
}

export default AppointmentRow;