import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Award,
  IndianRupee,
  MapPin,
  Building2,
  CalendarCheck,
  ArrowRight,
  Video,
  Clock,
  Stethoscope,
} from "lucide-react";

function DoctorCard({ doctor }) {
  const navigate = useNavigate();

  const doctorImage =
    doctor.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      doctor.doctorName || "Doctor"
    )}&background=0891b2&color=fff&bold=true`;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden active:scale-[0.99] transition">
      <div className="p-4">
        <div className="flex gap-3">
          <div className="relative shrink-0">
            <img
              src={doctorImage}
              alt={doctor.doctorName || "Doctor"}
              className="w-20 h-20 md:w-28 md:h-28 rounded-3xl border border-slate-100 shadow-sm object-cover"
            />

            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-white">
              <BadgeCheck size={15} className="text-white" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-[10px] border border-emerald-100">
              <BadgeCheck size={12} />
              Verified
            </div>

            <h2 className="text-lg md:text-2xl font-black text-slate-950 truncate mt-2">
              {doctor.doctorName || "Doctor"}
            </h2>

            <p className="text-sm text-cyan-700 font-black truncate">
              {doctor.specialization || "Specialist"}
            </p>

            <p className="text-xs text-slate-500 mt-1 truncate">
              {doctor.qualification || "Qualification not available"}
            </p>

            <div className="flex items-center gap-2 text-emerald-600 font-black text-xs mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Available Today
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <SmallBadge icon={Award} text={`${doctor.experience || 0}+ yrs`} />
          <SmallBadge icon={Video} text="Video" />
          <SmallBadge icon={Clock} text="Today" green />
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2">
          <InfoLine
            icon={Building2}
            text={doctor.hospital?.hospitalName || "Hospital Not Available"}
          />

          <InfoLine
            icon={MapPin}
            text={doctor.city || doctor.hospital?.city || "Available"}
          />
        </div>

        <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-3">
          <p className="text-xs text-emerald-700 font-black">
            Next Available
          </p>

          <p className="text-sm font-black text-slate-900 mt-0.5">
            Today • Instant appointment
          </p>
        </div>

        <div className="mt-3 rounded-2xl bg-slate-50 border border-slate-100 p-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold">
              Consultation Fee
            </p>

            <div className="flex items-center text-xl md:text-3xl font-black text-slate-950 mt-1">
              <IndianRupee size={18} />
              {doctor.consultationFee || 0}
            </div>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center">
            <CalendarCheck className="text-cyan-600" size={23} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={() => navigate(`/doctor/${doctor.id}`)}
            className="w-full border border-cyan-600 text-cyan-700 py-3 rounded-2xl font-black text-sm active:scale-95 transition"
          >
            View Profile
          </button>

          <button
            onClick={() => navigate(`/doctor/${doctor.id}`)}
            className="w-full bg-cyan-600 text-white py-3 rounded-2xl font-black text-sm active:scale-95 transition flex items-center justify-center gap-1.5"
          >
            Book
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SmallBadge({ icon: Icon, text, green }) {
  return (
    <span
      className={`inline-flex items-center justify-center gap-1 px-2 py-2 rounded-2xl text-[11px] font-black border ${
        green
          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
          : "bg-cyan-50 text-cyan-700 border-cyan-100"
      }`}
    >
      <Icon size={13} />
      <span className="truncate">{text}</span>
    </span>
  );
}

function InfoLine({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 text-slate-600 bg-slate-50 border border-slate-100 rounded-2xl px-3 py-2 min-w-0">
      <Icon size={16} className="text-cyan-600 shrink-0" />
      <span className="truncate text-xs font-bold">{text}</span>
    </div>
  );
}

export default DoctorCard;