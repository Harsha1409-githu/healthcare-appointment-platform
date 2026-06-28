import {
  MapPin,
  IndianRupee,
  Stethoscope,
  Star,
  BadgeCheck,
  Clock,
  ArrowRight,
  Building2,
  Video,
  Award,
} from "lucide-react";

export default function DoctorCard({ doctor, onBook }) {
  const doctorImage =
    doctor.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      doctor.doctorName || "Doctor"
    )}&background=0891b2&color=fff&size=200`;

  return (
    <article className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3 active:scale-[0.99] transition">
      <div className="flex gap-3">
        <div className="relative shrink-0">
          <img
            src={doctorImage}
            alt={doctor.doctorName || "Doctor"}
            className="w-20 h-20 rounded-3xl object-cover border border-slate-100 shadow-sm"
          />

          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-white">
            <BadgeCheck size={14} className="text-white" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-base font-black text-slate-950 truncate">
                {doctor.doctorName || "Doctor"}
              </h2>

              <p className="text-sm text-cyan-700 font-black truncate">
                {doctor.specialization || "Specialist"}
              </p>
            </div>

            <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black">
              <Star size={11} className="fill-emerald-600" />
              4.8
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-1 truncate">
            {doctor.qualification || "Qualification not added"}
          </p>

          <div className="flex items-center gap-1.5 text-slate-600 text-xs font-bold mt-2">
            <Award size={13} className="text-cyan-600" />
            {doctor.experience || 0}+ years experience
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <InfoPill
          icon={Building2}
          text={doctor.hospital?.hospitalName || "Independent Practice"}
        />

        <InfoPill
          icon={MapPin}
          text={doctor.city || doctor.hospital?.city || "Available"}
        />

        <InfoPill icon={Video} text="Video consult" />
        <InfoPill icon={Clock} text="Available today" />
      </div>

      <div className="mt-3 bg-slate-50 rounded-2xl border border-slate-100 p-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 font-bold">
            Consultation Fee
          </p>

          <div className="flex items-center text-xl font-black text-slate-950 mt-0.5">
            <IndianRupee size={17} />
            {doctor.consultationFee || 0}
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black">
          <BadgeCheck size={13} />
          Verified
        </div>
      </div>

      <button
        type="button"
        onClick={() => onBook(doctor)}
        className="w-full mt-3 bg-cyan-600 text-white py-3 rounded-2xl text-sm font-black active:scale-95 transition flex items-center justify-center gap-1.5"
      >
        Book Appointment
        <ArrowRight size={16} />
      </button>
    </article>
  );
}

function InfoPill({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-2xl px-2 py-2 min-w-0">
      <Icon size={13} className="text-cyan-600 shrink-0" />

      <span className="truncate text-[11px] font-bold text-slate-600">
        {text || "-"}
      </span>
    </div>
  );
}