import { useNavigate } from "react-router-dom";
import {
  MapPin,
  IndianRupee,
  Stethoscope,
  Star,
  BadgeCheck,
  ArrowRight,
  Clock,
} from "lucide-react";

export default function DoctorCard({ doctor }) {
  const navigate = useNavigate();

  return (
    <div className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <img
            src={
              doctor.profileImage ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                doctor.doctorName
              )}&background=0891b2&color=fff&size=200`
            }
            alt={doctor.doctorName}
            className="w-20 h-20 rounded-3xl object-cover border-4 border-white/20"
          />

          <div className="flex-1">
            <h2 className="text-2xl font-black">
              {doctor.doctorName}
            </h2>

            <p className="text-cyan-100 font-semibold">
              {doctor.specialization}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-xs font-black">
                <BadgeCheck size={13} />
                Verified
              </span>

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500 text-xs font-black text-white">
                <Star size={13} />
                4.8
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <InfoRow
            icon={Stethoscope}
            text={`${doctor.experience} Years Experience`}
            color="text-cyan-600"
          />

          <InfoRow
            icon={IndianRupee}
            text={`Consultation Fee ₹${doctor.consultationFee}`}
            color="text-emerald-600"
          />

          <InfoRow
            icon={MapPin}
            text={doctor.city || doctor.hospital?.city || "Location Not Available"}
            color="text-orange-500"
          />

          <InfoRow
            icon={Clock}
            text="Available Today"
            color="text-purple-600"
          />
        </div>

        <div className="mt-6 bg-slate-50 rounded-2xl p-4">
          <p className="text-xs font-black text-slate-400 uppercase">
            Hospital
          </p>

          <p className="font-bold text-slate-800 mt-1">
            {doctor.hospital?.hospitalName || "Independent Practice"}
          </p>
        </div>

        <button
          onClick={() => navigate(`/doctor/${doctor.id}`)}
          className="
            w-full mt-6
            bg-gradient-to-r from-cyan-600 to-blue-600
            text-white
            py-4
            rounded-2xl
            font-black
            flex items-center justify-center gap-2
            hover:from-cyan-700 hover:to-blue-700
            transition
          "
        >
          View Profile & Book
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, text, color }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={18} className={color} />
      <span className="text-slate-700 font-medium">
        {text}
      </span>
    </div>
  );
}