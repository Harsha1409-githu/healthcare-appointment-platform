import { Link, useNavigate } from "react-router-dom";
import { Stethoscope, Video } from "lucide-react";
import { getAppointmentRules } from "../../utils/appointmentRules";
import { formatTime } from "../../utils/time";

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

export default function NextPatientCard({
  appointment,
  onCheckIn,
  onViewPrescription,
  onFollowUp,
}) {
  const navigate = useNavigate();

  if (!appointment) {
    return (
      <div className="rounded-[1.7rem] border border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-4 shadow-sm">
        <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700">
          Next Patient
        </p>
        <h2 className="mt-1 text-xl font-black text-slate-950">
          No patient waiting now
        </h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Your next active appointment will appear here.
        </p>
      </div>
    );
  }

  const rules = getAppointmentRules(appointment);

  return (
    <div className="overflow-hidden rounded-[1.7rem] border border-cyan-100 bg-gradient-to-br from-cyan-700 via-cyan-600 to-sky-500 p-4 text-white shadow-lg shadow-cyan-900/10">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-cyan-100">
            Next Patient
          </p>

          <h2 className="mt-1 truncate text-2xl font-black">
            {getPatientName(appointment)}
          </h2>

          <p className="mt-1 truncate text-sm font-semibold text-cyan-50/90">
            {formatTime(appointment.slot?.startTime)} •{" "}
            {rules.isVideo ? "Video consultation" : "In-clinic visit"}
          </p>

          <p className="mt-1 truncate text-xs font-semibold text-cyan-50/80">
            {getPatientMeta(appointment) || "Patient details"}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-black text-white">
          {rules.label}
        </span>
      </div>

      <div className="mt-4">
        {rules.waitingRoomOpen && !rules.canConsult && (
          <button
            type="button"
            onClick={() => onCheckIn(appointment)}
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-white text-sm font-black text-cyan-700 active:scale-95"
          >
            Review Waiting Room
          </button>
        )}

        {rules.canConsult && !rules.isCompleted && (
          <div className="grid grid-cols-2 gap-2">
            {rules.canJoinVideo && (
              <Link
                to={`/doctor/video-consult/${appointment.id}`}
                className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-black text-cyan-700 active:scale-95"
              >
                <Video size={17} />
                Join Video
              </Link>
            )}

            <button
              type="button"
              onClick={() => navigate(`/doctor/consultation/${appointment.id}`)}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-black text-cyan-700 active:scale-95"
            >
              <Stethoscope size={17} />
              Consult
            </button>
          </div>
        )}

        {rules.canViewRx && (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onViewPrescription(appointment)}
              className="h-12 rounded-2xl bg-white text-sm font-black text-cyan-700 active:scale-95"
            >
              View Rx
            </button>

            {rules.canFollowUp && (
              <button
                type="button"
                onClick={() => onFollowUp(appointment)}
                className="h-12 rounded-2xl bg-white/15 text-sm font-black text-white active:scale-95"
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
            className="h-12 w-full rounded-2xl bg-white text-sm font-black text-cyan-700 active:scale-95"
          >
            View Appointment Details
          </button>
        )}
      </div>
    </div>
  );
}