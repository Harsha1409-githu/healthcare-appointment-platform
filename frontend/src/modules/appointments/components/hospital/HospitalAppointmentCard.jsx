import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  Phone,
  Stethoscope,
  UserRound,
  Video,
} from "lucide-react";

import { formatTime } from "@/modules/appointments/utils";
import { InfoPill } from "@/modules/appointments/components/hospital";

function HospitalAppointmentCard({
  appointment,
  actionLoading,
  markCompleted,
  cancelAppointment,
  openPrescriptionSheet,
}) {
  const patientName =
    appointment.patient?.fullName || appointment.patientName || "Patient";

  const patientPhone =
    appointment.patientPhone || appointment.patient?.mobile || "Phone";

  const doctorName = appointment.doctor?.doctorName || "Doctor";
  const specialization = appointment.doctor?.specialization || "Specialist";

  const date = appointment.slot?.date || appointment.date || "Date";
  const time = `${formatTime(appointment.slot?.startTime) || ""} - ${
    formatTime(appointment.slot?.endTime) || ""
  }`;

  const status = appointment.status || "BOOKED";

  const statusStyle =
    status === "BOOKED"
      ? "bg-emerald-50 text-emerald-700"
      : status === "COMPLETED"
      ? "bg-cyan-50 text-cyan-700"
      : "bg-red-50 text-red-700";

  return (
    <article className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 active:scale-[0.99] transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0">
            <UserRound className="text-cyan-600" size={24} />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-black text-slate-950 truncate">
              {patientName}
            </h2>

            <p className="text-xs text-slate-500 font-bold flex items-center gap-1.5 mt-1">
              <Phone size={13} className="text-cyan-600" />
              {patientPhone}
            </p>

            {appointment.patient?.email && (
              <p className="text-xs text-slate-400 font-bold flex items-center gap-1.5 mt-1 truncate">
                <Mail size={13} className="text-cyan-600" />
                {appointment.patient.email}
              </p>
            )}
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${statusStyle}`}
        >
          {status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 mt-4">
        <InfoPill icon={Stethoscope} title={doctorName} text={specialization} />
        <InfoPill icon={Clock} title={date} text={time || "Time"} />
        <InfoPill
          icon={CalendarCheck}
          title="Appointment ID"
          text={`#${String(appointment.id).slice(0, 8)}`}
        />
      </div>

      {status === "BOOKED" && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => markCompleted(appointment.id)}
            className="bg-cyan-600 text-white py-3 rounded-2xl text-sm font-black disabled:bg-slate-400 active:scale-95"
          >
            Complete
          </button>

          <button
            type="button"
            disabled={actionLoading}
            onClick={() => cancelAppointment(appointment.id)}
            className="bg-red-600 text-white py-3 rounded-2xl text-sm font-black disabled:bg-slate-400 active:scale-95"
          >
            Cancel
          </button>
        </div>
      )}

      {status === "COMPLETED" && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            type="button"
            onClick={() => openPrescriptionSheet(appointment)}
            className="bg-emerald-600 text-white py-3 rounded-2xl text-sm font-black active:scale-95 flex items-center justify-center gap-1.5"
          >
            <FileText size={16} />
            Prescription
          </button>

          <a
            href={`/video-call/${appointment.id}`}
            className="bg-slate-950 text-white py-3 rounded-2xl text-sm font-black active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Video size={16} />
            Video
          </a>
        </div>
      )}

      {status === "CANCELLED" && (
        <p className="mt-4 text-center bg-slate-50 rounded-2xl py-3 text-sm text-slate-500 font-bold">
          No action available
        </p>
      )}
    </article>
  );
}
export default HospitalAppointmentCard;
