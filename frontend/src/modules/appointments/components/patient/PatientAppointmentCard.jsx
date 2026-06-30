import { ReviewSheet } from "@/modules/appointments/components/patient";
import {
    BadgeCheck,
    Building2,
    Clock,
    Phone,
    RefreshCcw,
    Star,
    UserRound,
    Video,
    XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import VideoConsultCountdown from "@/components/VideoConsultCountdown";

import {
    AppointmentTimeline,
    InfoLine,
    StatusBadge,
} from "@/modules/appointments/components/patient";


function PatientAppointmentCard({
  appointment,
  reviewForm,
  openReviewForm,
  closeReviewForm,
  submitReview,
  setReviewForm,
  cancelAppointment,
  openReschedule,
  formatTime,
  getVideoConsultStatus,
  canRescheduleAppointment,
}) {
  const doctorImage =
    appointment.doctor?.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      appointment.doctor?.doctorName || "Doctor"
    )}&background=0891b2&color=fff&bold=true`;

    const videoStatus = getVideoConsultStatus(appointment);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
         <StatusBadge
  status={appointment.status}
  appointmentType={appointment.appointmentType}
/>

          {appointment.doctor?.id && (
            <Link
              to={`/doctor/${appointment.doctor.id}`}
              className="text-xs font-black text-cyan-600"
            >
              View Doctor
            </Link>
          )}
        </div>

        <div className="flex gap-3">
          <div className="relative shrink-0">
            <img
              src={doctorImage}
              alt={appointment.doctor?.doctorName || "Doctor"}
              className="w-20 h-20 rounded-3xl object-cover border border-slate-100"
            />

            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white">
              <BadgeCheck size={13} className="text-white" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-black text-slate-950 truncate">
              {appointment.doctor?.doctorName || "Doctor"}
            </h3>

            <p className="text-sm text-cyan-700 font-black truncate">
              {appointment.doctor?.specialization || "Specialization"}
            </p>

            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-black mt-2 max-w-full">
              <Building2 size={11} />
              <span className="truncate">
                {appointment.doctor?.hospital?.hospitalName ||
                  "Hospital Not Available"}
              </span>
            </div>

            <div className="mt-2 space-y-1">
              <InfoLine
                icon={Clock}
                text={`${appointment.slot?.date || "-"} | ${
                  formatTime(appointment.slot?.startTime) || ""
                } - ${formatTime(appointment.slot?.endTime) || ""}`}
              />

              <InfoLine
                icon={UserRound}
                text={
                  appointment.familyMember?.fullName ||
                  appointment.patientName ||
                  "Patient"
                }
              />

              <InfoLine
                icon={Phone}
                text={appointment.patientPhone || "Phone Not Available"}
              />
            </div>

            {appointment.familyMember && (
              <div className="inline-flex items-center mt-2 px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black">
                {appointment.familyMember.relation}
              </div>
            )}

            <AppointmentTimeline appointment={appointment} />
          </div>
        </div>
      </div>

      {appointment.status === "CANCELLED" && (
        <div className="mx-4 mb-3 text-xs text-red-600 font-semibold bg-red-50 border border-red-100 rounded-2xl p-3">
          Slot released and available again.
        </div>
      )}

      <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
        <div className="grid grid-cols-2 gap-2">

  {appointment.status === "BOOKED" &&
    appointment.appointmentType === "VIDEO" && (
      videoStatus.canJoin ? (
        <Link
          to={`/patient/appointments/${appointment.id}`}
          className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-green-600 px-3 py-3 text-white text-sm font-black animate-pulse"
        >
          <Video size={16} />
          Join Video-Consult
        </Link>
      ) : (
        <div className="col-span-2">
          <VideoConsultCountdown
            appointment={appointment}
          />
        </div>
      )
    )}

  {appointment.status === "BOOKED" && (
    <>
      <button
        disabled={!canRescheduleAppointment(appointment)}
        onClick={() =>
          canRescheduleAppointment(appointment) &&
          openReschedule(appointment)
        }
        className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-black ${
          canRescheduleAppointment(appointment)
            ? "bg-cyan-600 text-white"
            : "bg-slate-200 text-slate-500"
        }`}
      >
        <RefreshCcw size={15} />
        {canRescheduleAppointment(appointment)
          ? "Reschedule"
          : "Closed"}
      </button>

      <button
        onClick={() => cancelAppointment(appointment.id)}
        className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-3 text-white text-xs font-black"
      >
        <XCircle size={15} />
        Cancel
      </button>
    </>
  )}

  {appointment.status === "COMPLETED" && (
    <button
      onClick={() => openReviewForm(appointment)}
      className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-3 py-3 text-white text-xs font-black"
    >
      <Star size={15} />
      Write Review
    </button>
  )}

  {appointment.status === "CANCELLED" &&
    appointment.doctor?.id && (
      <Link
        to={`/doctor/${appointment.doctor.id}`}
        className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-3 py-3 text-white text-xs font-black"
      >
        <RefreshCcw size={15} />
        Book Again
      </Link>
    )}
</div>
      </div>

     {reviewForm.appointmentId === appointment.id && (
  <ReviewSheet
    appointment={appointment}
    reviewForm={reviewForm}
    setReviewForm={setReviewForm}
    onSubmit={submitReview}
    onClose={closeReviewForm}
  />
)}
    </div>
  );
}

export default PatientAppointmentCard;
