import { Link, useNavigate } from "react-router-dom";
import { getAppointmentRules } from "../../utils/appointmentRules";
import { formatTime } from "../../utils/time";
import StatusBadge from "./StatusBadge";

const getPatientName = (appointment) =>
  appointment?.familyMember?.fullName ||
  appointment?.patient?.fullName ||
  appointment?.patientName ||
  "Patient";

const getPatientMeta = (appointment) => {
  const age = appointment?.patient?.age || appointment?.familyMember?.age;
  const gender =
    appointment?.patient?.gender || appointment?.familyMember?.gender;
  const relation = appointment?.familyMember?.relation || "Self";

  return [age ? `${age} yrs` : null, gender, relation]
    .filter(Boolean)
    .join(" • ");
};

export default function QueueRow({
  appointment,
  onCheckIn,
  onViewPrescription,
  onFollowUp,
}) {
  const navigate = useNavigate();
  const rules = getAppointmentRules(appointment);

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2.5">
      <div className="grid grid-cols-[48px_1fr_auto] items-center gap-3">
        <div className="text-center">
          <p className="text-sm font-black text-slate-950">
            {formatTime(appointment.slot?.startTime) || "--"}
          </p>

          <span
            className={`mt-1 inline-block h-2.5 w-2.5 rounded-full ${
              rules.isCompleted
                ? "bg-emerald-500"
                : rules.canConsult
                ? "bg-orange-500"
                : rules.waitingRoomOpen
                ? "bg-cyan-500"
                : "bg-slate-300"
            }`}
          />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-black text-slate-950">
            {getPatientName(appointment)}
          </h3>

          <p className="truncate text-[11px] font-semibold text-slate-500">
            {getPatientMeta(appointment) || "Patient"}{" "}
            {rules.isVideo ? "• Video" : "• In-clinic"}
          </p>
        </div>

        <StatusBadge label={rules.label} />
      </div>

      <div className="mt-2">
        {rules.waitingRoomOpen && !rules.canConsult && (
          <button
            type="button"
            onClick={() => onCheckIn(appointment)}
            className="h-11 w-full rounded-xl bg-white px-2 py-2 text-[11px] font-black text-slate-700"
          >
            Review Waiting Room
          </button>
        )}

        {rules.canConsult && !rules.isCompleted && (
          <div className="grid grid-cols-2 gap-2">
            {rules.canJoinVideo && (
              <Link
                to={`/doctor/video-consult/${appointment.id}`}
                className="rounded-xl bg-cyan-600 px-2 py-2 text-center text-[11px] font-black text-white"
              >
                Join Video
              </Link>
            )}

            <button
              type="button"
              onClick={() => navigate(`/doctor/consultation/${appointment.id}`)}
              className="rounded-xl bg-slate-950 px-2 py-2 text-[11px] font-black text-white"
            >
              Consult
            </button>
          </div>
        )}

        {rules.canViewRx && (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onViewPrescription(appointment)}
              className="rounded-xl bg-white px-2 py-2 text-[11px] font-black text-slate-700"
            >
              View Rx
            </button>

            {rules.canFollowUp && (
              <button
                type="button"
                onClick={() => onFollowUp(appointment)}
                className="rounded-xl bg-violet-50 px-2 py-2 text-[11px] font-black text-violet-700"
              >
                Follow-up
              </button>
            )}
          </div>
        )}

        {!rules.waitingRoomOpen && !rules.canConsult && !rules.canViewRx && (
          <button
            type="button"
            onClick={() =>
              navigate(`/doctor/appointment/${appointment.id}/details`)
            }
            className="h-11 w-full rounded-xl bg-white px-2 py-2 text-[11px] font-black text-slate-700"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
}