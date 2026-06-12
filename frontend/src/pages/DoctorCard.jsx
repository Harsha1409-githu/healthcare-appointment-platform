import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  BadgeCheck,
  Award,
  IndianRupee,
  MapPin,
  Building2,
  CalendarCheck,
  ArrowRight,
  Video,
  Clock,
} from "lucide-react";

function DoctorCard({ doctor }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition overflow-hidden">
      <div className="p-6">
        <div className="grid xl:grid-cols-[1fr_240px] gap-6">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="relative shrink-0">
              <img
                src={
                  doctor.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    doctor.doctorName || "Doctor"
                  )}&background=0891b2&color=fff&bold=true`
                }
                alt={doctor.doctorName || "Doctor"}
                className="w-28 h-28 rounded-3xl border border-slate-100 shadow-sm object-cover"
              />

              <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-white">
                <BadgeCheck size={17} className="text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs border border-emerald-100 mb-3">
                <BadgeCheck size={14} />
                Verified Doctor
              </div>

              <h2 className="text-2xl font-black text-slate-950">
                {doctor.doctorName}
              </h2>

              <p className="text-cyan-700 font-black mt-1">
                {doctor.specialization || "Specialist"}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <SmallBadge
                  icon={Award}
                  text={`${doctor.experience || 0}+ Years`}
                />

                <SmallBadge
                  icon={Video}
                  text="Video Consult"
                />

                <SmallBadge
                  icon={Clock}
                  text="Available Today"
                  green
                />
              </div>

              <div className="mt-5 grid sm:grid-cols-2 gap-3">
                <InfoLine
                  icon={Building2}
                  text={
                    doctor.hospital?.hospitalName ||
                    "Hospital Not Available"
                  }
                />

                <InfoLine
                  icon={MapPin}
                  text={
                    doctor.city ||
                    doctor.hospital?.city ||
                    "Available"
                  }
                />
              </div>
            </div>
          </div>

          <div className="xl:border-l border-slate-100 xl:pl-6 flex flex-col justify-between">
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
              <p className="text-sm text-slate-500 font-semibold">
                Consultation Fee
              </p>

              <div className="flex items-center text-3xl font-black text-slate-950 mt-2">
                <IndianRupee size={24} />
                {doctor.consultationFee || 0}
              </div>

              <p className="text-sm text-emerald-700 font-black mt-3 flex items-center gap-2">
                <CalendarCheck size={17} />
                Instant appointment booking
              </p>
            </div>

            <div className="grid gap-3 mt-5">
              <button
                onClick={() => navigate(`/doctor/${doctor.id}`)}
                className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black hover:bg-cyan-700 transition flex items-center justify-center gap-2"
              >
                Book Appointment
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => navigate(`/doctor/${doctor.id}`)}
                className="w-full border border-cyan-600 text-cyan-700 py-4 rounded-2xl font-black hover:bg-cyan-50 transition"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SmallBadge({ icon: Icon, text, green }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border ${
        green
          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
          : "bg-cyan-50 text-cyan-700 border-cyan-100"
      }`}
    >
      <Icon size={14} />
      {text}
    </span>
  );
}

function InfoLine({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3 text-slate-600 bg-slate-50 border border-slate-100 rounded-2xl px-3 py-2 min-w-0">
      <Icon size={18} className="text-cyan-600 shrink-0" />
      <span className="truncate">{text}</span>
    </div>
  );
}

export default DoctorCard;