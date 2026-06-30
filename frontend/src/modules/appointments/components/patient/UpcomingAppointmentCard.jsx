import VideoConsultCountdown from "@/components/VideoConsultCountdown";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";

function UpcomingAppointmentCard({
  appointment,
  formatTime,
  getVideoConsultStatus,
}) {
  const videoStatus = getVideoConsultStatus(appointment);


  return (
    <section className="bg-slate-950 rounded-3xl p-4 text-white mt-3">
      <p className="text-xs text-cyan-200 font-black">NEXT APPOINTMENT</p>

      <h2 className="text-lg font-black mt-1 truncate">
        {appointment.doctor?.doctorName || "Doctor"}
      </h2>

      <p className="text-sm text-cyan-100 font-bold truncate">
        {appointment.doctor?.specialization || "Specialist"}
      </p>

      <div className="flex items-center gap-2 mt-3 text-sm text-slate-200 font-bold">
        <Clock size={15} className="text-cyan-300" />
        {appointment.slot?.date || "-"} • {formatTime(appointment.slot?.startTime) || "-"}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <Link
          to={`/doctor/${appointment.doctor?.id}`}
          className="bg-white text-slate-950 py-3 rounded-2xl font-black text-sm text-center"
        >
          View Doctor
        </Link>

        {appointment.appointmentType === "VIDEO" ? (
          videoStatus.canJoin ? (
            <a
              href={appointment.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="bg-green-500 text-white py-3 rounded-2xl font-black text-sm text-center animate-pulse"
            >
              🎥 Join Video-Consult
            </a>
          ) : (
            <div className="bg-slate-700 text-white py-3 rounded-2xl font-black text-sm text-center">
              {videoStatus.status === "UPCOMING" ? (
  <VideoConsultCountdown appointment={appointment} />
) : (
  "Expired"
)}
            </div>
          )
        ) : (
         <Link
  to={`/patient/appointments/${appointment.id}`}
  className="bg-cyan-500 text-white py-3 rounded-2xl font-black text-sm text-center"
>
  View Details
</Link>
        )}
      </div>
    </section>
  );
}

export default UpcomingAppointmentCard;
