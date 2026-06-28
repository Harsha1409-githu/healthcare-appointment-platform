import { Link } from "react-router-dom";
import {
  Activity,
  Clock,
  FileText,
  Stethoscope,
  UserRound,
  Video,
} from "lucide-react";
import { formatTime } from "../../utils/time";
import WaitingTimer from "./WaitingTimer";

export default function WaitingRoomCard({
  appointment,
  checkInData,
  onReview,
}) {
  const patientName =
    appointment?.familyMember?.fullName ||
    appointment?.patient?.fullName ||
    appointment?.patientName ||
    "Patient";

  const isVideo = appointment?.appointmentType === "VIDEO";

  return (
    <article className="rounded-[1.7rem] border border-cyan-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
          <UserRound size={23} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase text-cyan-700">
            Waiting Room
          </p>

          <h2 className="truncate text-lg font-black text-slate-950">
            {patientName}
          </h2>

          <p className="mt-0.5 text-xs font-semibold text-slate-500">
            {formatTime(appointment?.slot?.startTime)} •{" "}
            {isVideo ? "Video consult" : "Clinic visit"}
          </p>
        </div>

        <WaitingTimer appointment={appointment} />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <MiniInfo icon={Activity} label="BP" value={checkInData?.bloodPressure || "-"} />
        <MiniInfo icon={Clock} label="Temp" value={checkInData?.temperature || "-"} />
        <MiniInfo icon={FileText} label="Weight" value={checkInData?.weight || "-"} />
      </div>

      <div className="mt-3 rounded-2xl bg-slate-50 p-3">
        <p className="text-[10px] font-black uppercase text-slate-500">
          Symptoms
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-800">
          {checkInData?.symptoms || "No symptoms submitted yet"}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onReview(appointment)}
          className="h-11 rounded-2xl bg-white text-xs font-black text-slate-800 ring-1 ring-slate-200"
        >
          Review Check-In
        </button>

        {isVideo ? (
          <Link
            to={`/doctor/video-consult/${appointment.id}`}
            className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-cyan-600 text-xs font-black text-white"
          >
            <Video size={15} />
            Join Video
          </Link>
        ) : (
          <Link
            to={`/doctor/consultation/${appointment.id}`}
            className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-cyan-600 text-xs font-black text-white"
          >
            <Stethoscope size={15} />
            Start
          </Link>
        )}
      </div>
    </article>
  );
}

function MiniInfo({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-2 text-center">
      <Icon className="mx-auto text-cyan-600" size={16} />
      <p className="mt-1 text-[9px] font-black uppercase text-slate-400">
        {label}
      </p>
      <p className="text-xs font-black text-slate-900">{value}</p>
    </div>
  );
}