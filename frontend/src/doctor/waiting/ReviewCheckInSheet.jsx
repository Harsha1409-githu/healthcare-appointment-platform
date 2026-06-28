import {
  X,
  Activity,
  Thermometer,
  Weight,
  Heart,
  FileText,
  User,
  Stethoscope,
} from "lucide-react";
import { formatTime } from "../../utils/time";

export default function ReviewCheckInSheet({
  open,
  appointment,
  checkIn,
  onClose,
  onStart,
}) {
  if (!open || !appointment) return null;

  const patient =
    appointment.familyMember ||
    appointment.patient ||
    {};

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[32px] bg-white p-5 max-h-[88vh] overflow-y-auto">

        <div className="mx-auto mb-5 h-1.5 w-14 rounded-full bg-slate-300" />

        <div className="flex items-center justify-between">

          <div>

            <p className="text-[11px] font-black uppercase text-cyan-600">
              Patient Check-In
            </p>

            <h2 className="text-xl font-black">
              {patient.fullName || appointment.patientName}
            </h2>

            <p className="text-sm text-slate-500">
              {formatTime(appointment.slot?.startTime)}
            </p>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 p-2"
          >
            <X size={18}/>
          </button>

        </div>

        <div className="mt-6 space-y-3">

          <Card
            icon={User}
            title="Patient"
            value={`${patient.age || "-"} yrs • ${patient.gender || "-"}`}
          />

          <Card
            icon={FileText}
            title="Symptoms"
            value={checkIn?.symptoms || "Not submitted"}
          />

          <div className="grid grid-cols-2 gap-3">

            <Card
              icon={Activity}
              title="BP"
              value={checkIn?.bloodPressure || "-"}
            />

            <Card
              icon={Thermometer}
              title="Temp"
              value={checkIn?.temperature || "-"}
            />

            <Card
              icon={Heart}
              title="Pulse"
              value={checkIn?.pulse || "-"}
            />

            <Card
              icon={Weight}
              title="Weight"
              value={checkIn?.weight || "-"}
            />

          </div>

          <Card
            icon={FileText}
            title="Uploaded Reports"
            value={`${checkIn?.documents?.length || 0} document(s)`}
          />

        </div>

        <button
          onClick={() => onStart(appointment)}
          className="mt-6 h-12 w-full rounded-2xl bg-cyan-600 text-white font-black"
        >
          <Stethoscope
            size={17}
            className="inline mr-2"
          />

          Start Consultation

        </button>

      </div>
    </>
  );
}

function Card({ icon: Icon, title, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">

      <div className="flex items-center gap-2">

        <Icon
          size={16}
          className="text-cyan-600"
        />

        <span className="text-xs font-black">
          {title}
        </span>

      </div>

      <p className="mt-2 text-sm text-slate-700">
        {value}
      </p>

    </div>
  );
}