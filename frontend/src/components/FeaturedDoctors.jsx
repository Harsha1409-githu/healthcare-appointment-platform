import { useEffect, useState } from "react";
import {
  Stethoscope,
  IndianRupee,
  Building2,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function FeaturedDoctors() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    api
      .get("/doctor")
      .then((res) =>
        setDoctors(
          (res.data || [])
            .filter((doctor) => doctor.isActive)
            .slice(0, 4)
        )
      )
      .catch((err) =>
        console.error("Featured doctors error:", err)
      );
  }, []);

  return (
    <section className="py-5 bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl md:text-2xl font-black text-slate-900">
            Top Doctors
          </h2>

          <Link
            to="/doctors"
            className="text-cyan-600 font-black text-sm"
          >
            View All
          </Link>
        </div>

        {doctors.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-5 text-center border border-slate-100">
            <p className="text-slate-500 text-sm">
              No doctors available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {doctors.map((doctor) => (
              <Link
                key={doctor.id}
                to={`/doctor/${doctor.id}`}
                className="bg-white border border-slate-100 rounded-2xl p-3 text-center shadow-sm active:scale-95 transition"
              >
                {doctor.profileImage ? (
                  <img
                    src={doctor.profileImage}
                    alt={doctor.doctorName}
                    className="w-14 h-14 mx-auto rounded-2xl object-cover border border-slate-100"
                  />
                ) : (
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-50 flex items-center justify-center border border-cyan-100">
                    <Stethoscope
                      size={24}
                      className="text-cyan-600"
                    />
                  </div>
                )}

                <h3 className="mt-2 text-xs md:text-sm font-black text-slate-900 line-clamp-2 min-h-[32px]">
                  {doctor.doctorName}
                </h3>

                <p className="text-[11px] text-cyan-700 font-bold mt-1 line-clamp-1">
                  {doctor.specialization || "Specialist"}
                </p>

                <div className="mt-2 space-y-1 text-left">
                  <Info icon={Building2}>
                    {doctor.hospital?.hospitalName || "Hospital"}
                  </Info>

                  <Info icon={MapPin}>
                    {doctor.city ||
                      doctor.hospital?.city ||
                      "Available"}
                  </Info>
                </div>

                <div className="mt-2 flex items-center justify-center text-xs font-black text-slate-900">
                  <IndianRupee size={12} />
                  {doctor.consultationFee || 0}
                </div>

                <div className="mt-2 bg-cyan-600 text-white rounded-xl py-1.5 text-xs font-black">
                  Book
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Info({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 min-w-0">
      <Icon size={12} className="text-cyan-600 shrink-0" />
      <span className="truncate">{children}</span>
    </div>
  );
}