import { Link, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  CalendarCheck,
  Stethoscope,
  Building2,
  IndianRupee,
  Clock,
  ArrowRight,
  Download,
  UserRound,
  ShieldCheck,
  Home,
  Video,
ExternalLink,
} from "lucide-react";

export default function SuccessPage() {
  const location = useLocation();

  const details =
    location.state ||
    JSON.parse(localStorage.getItem("appointmentSuccess") || "{}");

  return (
    <main className="min-h-screen bg-[#f4f8fb] px-4 pt-6 pb-28">
      <div className="max-w-md mx-auto">
        <section className="bg-emerald-600 rounded-[2rem] p-6 text-white text-center shadow-sm">
          <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center">
            <CheckCircle2 className="text-emerald-600" size={46} />
          </div>

          <h1 className="text-2xl font-black mt-5">
            Appointment Confirmed
          </h1>

          <p className="text-sm text-emerald-50 mt-2 font-semibold">
            Your consultation has been booked successfully.
          </p>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={18} className="text-cyan-600" />
            <h2 className="text-lg font-black text-slate-950">
              Booking Summary
            </h2>
          </div>

          <AppointmentTimeline appointmentType={details.appointmentType} />

          <Detail
            icon={Stethoscope}
            label="Doctor"
            value={details.doctorName || "Doctor"}
            sub={details.specialization || "Specialist"}
          />

          <Detail
            icon={UserRound}
            label="Patient"
            value={details.patientName || "Patient"}
            sub={details.familyMember?.relation || "SELF"}
          />

          <Detail
  icon={details.appointmentType === "VIDEO" ? Video : Building2}
  label="Consultation Type"
  value={
  details.appointmentType === "VIDEO"
    ? "Video-Consult"
    : "In-Person Visit"
}
/>

          <Detail
            icon={Building2}
            label="Hospital"
            value={details.hospital || "Hospital"}
          />

          <div className="grid grid-cols-2 gap-3 mt-3">
            <SmallBox
              icon={CalendarCheck}
              label="Date"
              value={details.slot?.date || "View details"}
            />

            <SmallBox
              icon={Clock}
              label="Time"
              value={
                details.slot
                  ? `${details.slot.startTime} - ${details.slot.endTime}`
                  : "View details"
              }
            />
          </div>

          <div className="mt-3 bg-cyan-50 rounded-2xl border border-cyan-100 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-cyan-700 font-black">
                Amount Paid
              </p>

              <div className="flex items-center text-2xl font-black text-slate-950 mt-1">
                <IndianRupee size={20} />
                {details.fee || 0}
              </div>
            </div>

            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-black">
              Paid
            </span>
          </div>
        </section>

  {details.appointmentType === "VIDEO" && (
  <section className="bg-blue-50 border border-blue-100 rounded-3xl p-4 mt-3">
    <div className="flex gap-3">
      <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
        <Video className="text-blue-600" size={24} />
      </div>

      <div className="flex-1">
        <h3 className="font-black text-slate-950">
          Video-Consult Booked
        </h3>

        <p className="text-sm text-slate-500 mt-1">
          Meeting link generated. Join button becomes active 10 minutes before appointment.
        </p>

        {details.meetingLink && (
          <a
            href={details.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-2xl text-xs font-black active:scale-95 transition"
          >
            Open Meeting Link
            <ExternalLink size={15} />
          </a>
        )}
      </div>
    </div>
  </section>
)}

{details.appointmentType !== "VIDEO" && (
  <section className="bg-emerald-50 border border-emerald-100 rounded-3xl p-4 mt-3">
    <div className="flex gap-3">
      <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
        <Building2 className="text-emerald-600" size={24} />
      </div>

      <div>
        <h3 className="font-black text-slate-950">
          In-Person Visit Booked
        </h3>

        <p className="text-sm text-slate-500 mt-1">
          Please visit the hospital at your selected appointment time.
        </p>
      </div>
    </div>
  </section>
)}

        <section className="grid gap-3 mt-3">
          <Link
            to="/patient/appointments"
            className="bg-cyan-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 active:scale-95 transition"
          >
            View Appointment
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/home"
            className="bg-white border border-slate-100 text-slate-800 py-4 rounded-2xl font-black flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Home size={18} />
            Go Home
          </Link>

          <button
            onClick={() => window.print()}
            className="bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-black flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Download size={18} />
            Print Receipt
          </button>
        </section>
      </div>
    </main>
  );
}

function Detail({ icon: Icon, label, value, sub }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-b-0">
      <div className="w-10 h-10 rounded-2xl bg-cyan-50 flex items-center justify-center shrink-0">
        <Icon className="text-cyan-600" size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-500 font-bold">{label}</p>

        <h3 className="text-sm font-black text-slate-950 truncate">
          {value}
        </h3>

        {sub && <p className="text-xs text-slate-500 truncate">{sub}</p>}
      </div>
    </div>
  );
}

function SmallBox({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
      <Icon className="text-cyan-600 mb-2" size={18} />

      <p className="text-xs text-slate-500 font-bold">{label}</p>

      <p className="text-sm font-black text-slate-950 mt-1 leading-tight">
        {value}
      </p>
    </div>
  );
}

function AppointmentTimeline({ appointmentType }) {
  const steps =
    appointmentType === "VIDEO"
      ? [
          {
            title: "Appointment Booked",
            text: "Your video-consult is confirmed.",
            done: true,
          },
          {
            title: "Payment Successful",
            text: "Consultation fee has been paid.",
            done: true,
          },
          {
            title: "Meeting Link Generated",
            text: "Join button activates 10 minutes before consultation.",
            done: true,
          },
          {
            title: "Video-Consult Pending",
            text: "Doctor will join at the scheduled time.",
            done: false,
          },
        ]
      : [
          {
            title: "Appointment Booked",
            text: "Your in-person visit is confirmed.",
            done: true,
          },
          {
            title: "Payment Successful",
            text: "Consultation fee has been paid.",
            done: true,
          },
          {
            title: "Visit Hospital",
            text: "Reach hospital at your selected appointment time.",
            done: false,
          },
          {
            title: "Consultation Pending",
            text: "Doctor will complete consultation after visit.",
            done: false,
          },
        ];

  return (
    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck size={18} className="text-cyan-600" />
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
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {step.done ? (
                  <CheckCircle2 size={17} />
                ) : (
                  <Clock size={16} />
                )}
              </div>

              {index !== steps.length - 1 && (
                <div
                  className={`w-0.5 h-8 mt-1 ${
                    step.done ? "bg-emerald-200" : "bg-slate-200"
                  }`}
                />
              )}
            </div>

            <div className="pb-2">
              <h3 className="text-sm font-black text-slate-950">
                {step.title}
              </h3>

              <p className="text-xs text-slate-500 mt-0.5">
                {step.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}