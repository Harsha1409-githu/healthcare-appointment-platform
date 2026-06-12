import { Link, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  CalendarCheck,
  Stethoscope,
  Building2,
  IndianRupee,
  Clock,
  UserRound,
  ArrowRight,
  Download,
  ShieldCheck,
} from "lucide-react";

export default function SuccessPage() {
  const location = useLocation();
  const details = location.state || {};

  return (
    <div className="min-h-screen bg-[#f4fbff] px-6 py-10">
      <div className="max-w-[1100px] mx-auto">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-8 md:p-10 text-center border-b border-slate-100">
            <div className="w-24 h-24 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-emerald-600" size={54} />
            </div>

            <h1 className="text-4xl md:text-5xl font-black mt-6 text-slate-950">
              Appointment Confirmed
            </h1>

            <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto">
              Your appointment has been booked successfully. You can manage
              this consultation from My Appointments.
            </p>

            <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-black border border-emerald-100">
              <ShieldCheck size={17} />
              Payment verified and appointment secured
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DetailCard
                icon={Stethoscope}
                label="Doctor"
                value={details.doctorName || "Doctor"}
                sub={details.specialization || "Specialist"}
              />

              <DetailCard
                icon={Building2}
                label="Hospital"
                value={details.hospital || "Hospital"}
                sub="Healthcare Partner"
              />

              <DetailCard
                icon={CalendarCheck}
                label="Appointment Date"
                value={details.slot?.date || "View in appointments"}
                sub="Confirmed Slot"
              />

              <DetailCard
                icon={Clock}
                label="Appointment Time"
                value={
                  details.slot
                    ? `${details.slot.startTime} - ${details.slot.endTime}`
                    : "View in appointments"
                }
                sub="Consultation Time"
              />

              <DetailCard
                icon={UserRound}
                label="Patient"
                value={details.patientName || "Patient"}
                sub="Appointment Holder"
              />

              <DetailCard
                icon={IndianRupee}
                label="Consultation Fee"
                value={`₹${details.fee || 0}`}
                sub="Paid Online"
              />
            </div>

            <div className="mt-8 bg-cyan-50 border border-cyan-100 rounded-[1.5rem] p-5">
              <h3 className="font-black text-slate-950 text-lg">
                What happens next?
              </h3>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <NextStep
                  title="Confirmation"
                  desc="Appointment details are saved in your account."
                />

                <NextStep
                  title="Consultation"
                  desc="Join chat or video call from My Appointments."
                />

                <NextStep
                  title="Prescription"
                  desc="Doctor prescription will be available digitally."
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link to="/appointments" className="flex-1">
                <button className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black hover:bg-cyan-700 transition flex items-center justify-center gap-2">
                  View My Appointments
                  <ArrowRight size={18} />
                </button>
              </Link>

              <Link to="/doctors" className="flex-1">
                <button className="w-full border border-cyan-600 text-cyan-700 py-4 rounded-2xl font-black hover:bg-cyan-50 transition">
                  Book Another Appointment
                </button>
              </Link>

              <button
                onClick={() => window.print()}
                className="flex-1 border border-slate-200 text-slate-700 py-4 rounded-2xl font-black hover:bg-slate-50 transition flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-100 mb-4">
        <Icon className="text-cyan-600" size={24} />
      </div>

      <p className="text-sm text-slate-500 font-semibold">
        {label}
      </p>

      <h3 className="text-xl font-black text-slate-950 mt-1">
        {value}
      </h3>

      {sub && (
        <p className="text-sm text-slate-500 mt-1">
          {sub}
        </p>
      )}
    </div>
  );
}

function NextStep({ title, desc }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-cyan-100">
      <h4 className="font-black text-slate-950">
        {title}
      </h4>

      <p className="text-sm text-slate-500 mt-1 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}