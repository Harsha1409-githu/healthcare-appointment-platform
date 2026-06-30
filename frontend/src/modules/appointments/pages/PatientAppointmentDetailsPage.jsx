import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Video,
  Clock,
  Calendar,
  Stethoscope,
  ExternalLink,
  Building2,
  UserRound,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import api from "@/api/axios";
import VideoConsultCountdown from "@/components/VideoConsultCountdown";
import { ClipboardCheck } from "lucide-react";

function getAppointmentDateTime(appointment) {
  if (!appointment?.slot?.date || !appointment?.slot?.startTime) return null;

  const cleanTime = String(appointment.slot.startTime).slice(0, 5);
  return new Date(`${appointment.slot.date}T${cleanTime}:00`);
}

export default function AppointmentDetails() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [checkIn, setCheckIn] = useState(null);

  useEffect(() => {
    loadAppointment();
  }, []);

  const loadAppointment = async () => {
    try {
      const res = await api.get(`/appointment/${id}`);
      setAppointment(res.data);

      try {
  const checkInRes = await api.get(
    `/check-in/appointment/${id}`
  );

  setCheckIn(checkInRes.data);
} catch {
  setCheckIn(null);
}
    } catch (err) {
      console.error("Appointment details error:", err);
    }
  };

  if (!appointment) {
    return (
      <main className="min-h-screen bg-[#f4f8fb] px-4 py-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-5">
          <p className="font-black text-slate-700">Loading appointment...</p>
        </div>
      </main>
    );
  }

  const appointmentTime = getAppointmentDateTime(appointment);
  const now = new Date();

  const joinStart = appointmentTime
    ? new Date(appointmentTime.getTime() - 10 * 60 * 1000)
    : null;

  const joinEnd = appointmentTime
    ? new Date(appointmentTime.getTime() + 30 * 60 * 1000)
    : null;

  const canJoin =
    appointment.appointmentType === "VIDEO" &&
    appointmentTime &&
    now >= joinStart &&
    now <= joinEnd;

  const expired =
    appointment.appointmentType === "VIDEO" &&
    appointmentTime &&
    now > joinEnd;

  return (
    <main className="min-h-screen bg-[#f4f8fb] px-4 py-4 pb-28">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <Link
            to="/patient/appointments"
            className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center"
          >
            <ArrowLeft size={19} className="text-slate-700" />
          </Link>

          <div>
            <p className="text-xs font-black text-cyan-700">
              APPOINTMENT DETAILS
            </p>
            <h1 className="text-xl font-black text-slate-950">
              {appointment.appointmentType === "VIDEO"
                ? "Video-Consult"
                : "In-Person Visit"}
            </h1>
          </div>
        </div>

        <section className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
          <div className="flex gap-3">
            <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center shrink-0">
              <Stethoscope size={28} className="text-cyan-600" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-black text-slate-950 truncate">
                {appointment.doctor?.doctorName || "Doctor"}
              </h2>

              <p className="text-sm text-cyan-700 font-black truncate">
                {appointment.doctor?.specialization || "Specialist"}
              </p>

              <div className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black">
                <ShieldCheck size={11} />
                Verified Consultation
              </div>
            </div>
          </div>
        </section>

        {appointment.appointmentType === "VIDEO" && (
          <section className="mt-3">
            {canJoin && appointment.meetingLink ? (
              <a
                href={appointment.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-green-600 text-white rounded-3xl p-4 font-black flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <ExternalLink size={18} />
                Join Video-Consult
              </a>
            ) : expired ? (
              <div className="bg-red-50 border border-red-100 text-red-700 rounded-3xl p-4 text-center font-black">
                Session Expired
              </div>
            ) : (
              <VideoConsultCountdown appointment={appointment} />
            )}
          </section>
        )}

        <section className="grid grid-cols-2 gap-3 mt-3">
          <InfoBox
            icon={Calendar}
            label="Date"
            value={appointment.slot?.date || "-"}
          />

          <InfoBox
            icon={Clock}
            label="Time"
            value={`${formatTime(appointment.slot?.startTime) || "-"} - ${
              formatTime(appointment.slot?.endTime) || "-"
            }`}
          />
        </section>

       <section className="mt-3">
  {checkIn ? (
    <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-4">
      <div className="flex items-center gap-2">
        <ClipboardCheck size={20} className="text-emerald-600" />

        <div>
          <h3 className="font-black text-emerald-700">
            Check-In Completed
          </h3>

          <p className="text-xs text-emerald-600">
            Your details have been shared with the doctor.
          </p>
        </div>
      </div>

      {checkIn.symptoms && (
        <div className="mt-4">
          <p className="text-xs font-black text-slate-500 mb-2">
            Symptoms
          </p>

          <div className="flex flex-wrap gap-2">
            {checkIn.symptoms.split(",").map((item) => (
              <span
                key={item}
                className="bg-white border border-emerald-100 rounded-full px-3 py-1.5 text-xs font-black text-slate-700"
              >
                {item.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {checkIn.notes && (
        <div className="mt-4 bg-white border border-emerald-100 rounded-2xl p-3">
          <p className="text-xs font-black text-slate-500">
            Notes
          </p>

          <p className="text-sm font-semibold text-slate-800 mt-1">
            {checkIn.notes}
          </p>
        </div>
      )}
    </div>
  ) : (
    <Link
      to={`/patient/appointments/${appointment.id}/checkin`}
      className="block bg-cyan-600 text-white rounded-3xl p-4"
    >
      <div className="flex items-center gap-3">
        <ClipboardCheck size={22} />

        <div>
          <h3 className="font-black">
            Pre-Consultation Check-In
          </h3>

          <p className="text-xs text-cyan-100">
            Share symptoms before consultation
          </p>
        </div>
      </div>
    </Link>
  )}
</section>

        <section className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 mt-3">
          <h2 className="text-lg font-black text-slate-950 mb-3">
            Patient & Hospital
          </h2>

          <DetailRow
            icon={UserRound}
            label="Patient"
            value={
              appointment.familyMember?.fullName ||
              appointment.patientName ||
              "Patient"
            }
          />

          <DetailRow
            icon={Phone}
            label="Phone"
            value={appointment.patientPhone || "Not available"}
          />

          <DetailRow
            icon={Building2}
            label="Hospital"
            value={
              appointment.doctor?.hospital?.hospitalName ||
              "Hospital not available"
            }
          />
        </section>

        <AppointmentTimeline appointment={appointment} />

        <section className="grid grid-cols-2 gap-3 mt-3">
          <Link
            to={`/doctor/${appointment.doctor?.id}`}
            className="bg-white border border-slate-100 rounded-2xl py-3 text-center font-black text-slate-800"
          >
            View Doctor
          </Link>

          <Link
            to="/patient/appointments"
            className="bg-cyan-600 text-white rounded-2xl py-3 text-center font-black"
          >
            My Bookings
          </Link>
        </section>
      </div>
    </main>
  );
}

function InfoBox({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
      <Icon size={20} className="text-cyan-600 mb-2" />
      <p className="text-xs text-slate-500 font-bold">{label}</p>
      <p className="text-sm font-black text-slate-950 mt-1">{value}</p>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-b-0">
      <div className="w-10 h-10 rounded-2xl bg-cyan-50 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-cyan-600" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-bold">{label}</p>
        <p className="text-sm font-black text-slate-950 truncate">{value}</p>
      </div>
    </div>
  );
}

function AppointmentTimeline({ appointment }) {
  const isCompleted = appointment.status === "COMPLETED";
  const isCancelled = appointment.status === "CANCELLED";

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
          title:
            appointment.appointmentType === "VIDEO"
              ? "Video-Consult Pending"
              : "Consultation Pending",
          done: isCompleted,
        },
        { title: "Completed", done: isCompleted },
      ];

  return (
    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 size={18} className="text-cyan-600" />
        <h2 className="text-lg font-black text-slate-950">
          Appointment Timeline
        </h2>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.title} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.done
                    ? step.danger
                      ? "bg-red-500 text-white"
                      : "bg-emerald-500 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {step.done ? <CheckCircle2 size={17} /> : <Clock size={16} />}
              </div>

              {index !== steps.length - 1 && (
                <div
                  className={`w-0.5 h-8 mt-1 ${
                    step.done ? "bg-emerald-200" : "bg-slate-200"
                  }`}
                />
              )}
            </div>

            <div>
              <h3
                className={`text-sm font-black ${
                  step.danger ? "text-red-600" : "text-slate-950"
                }`}
              >
                {step.title}
              </h3>

              <p className="text-xs text-slate-500 mt-0.5">
                {step.done ? "Completed" : "Pending"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}