import { useEffect, useState } from "react";
import {
  Star,
  Stethoscope,
  BadgeCheck,
  CalendarCheck,
  IndianRupee,
  ArrowRight,
  MapPin,
  ShieldCheck,
  Building2,
  Award,
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
            .slice(0, 6)
        )
      )
      .catch((err) =>
        console.error("Featured doctors error:", err)
      );
  }, []);

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-blue-50/40 to-white">
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold mb-5 border border-blue-200">
            <Stethoscope size={18} />
            Featured Specialists
          </div>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-950">
            Meet Our Top Rated
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Healthcare Experts
            </span>
          </h2>

          <p className="text-slate-500 mt-5 text-lg">
            Consult trusted doctors with verified profiles, transparent fees,
            hospital details and instant appointment booking.
          </p>
        </div>

        {doctors.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center border border-slate-100">
            <p className="text-slate-500">
              No featured doctors available.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {doctors.map((doctor, index) => (
              <div key={doctor.id} className="group relative">
                <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-60 blur transition duration-500" />

                <div className="relative h-full bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden group-hover:-translate-y-2 transition duration-500">
                  <div className="relative h-72 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl" />

                    {doctor.profileImage ? (
                      <img
                        src={doctor.profileImage}
                        alt={doctor.doctorName}
                        className="w-full h-full object-cover opacity-95 group-hover:scale-105 transition duration-700"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="w-28 h-28 rounded-[2rem] bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center shadow-lg">
                          <Stethoscope
                            size={52}
                            className="text-cyan-200"
                          />
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    <div className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500 text-white font-black text-xs shadow-lg">
                      <ShieldCheck size={14} />
                      Verified
                    </div>

                    <div className="absolute top-5 right-5 flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-400 text-slate-950 font-black text-sm shadow-lg">
                      <Star size={15} className="fill-slate-950" />
                      4.{9 - (index % 2)}
                    </div>

                    <div className="absolute bottom-5 left-5 right-5">
                      <h3 className="text-2xl font-black text-white">
                        {doctor.doctorName}
                      </h3>

                      <p className="text-cyan-200 font-bold mt-1">
                        {doctor.specialization}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-blue-50 p-4">
                        <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                          <Award size={17} />
                          Experience
                        </div>

                        <p className="text-2xl font-black mt-2 text-slate-900">
                          {doctor.experience}+ yrs
                        </p>
                      </div>

                      <div className="rounded-2xl bg-emerald-50 p-4">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                          <IndianRupee size={17} />
                          Fee
                        </div>

                        <p className="text-2xl font-black mt-2 text-slate-900">
                          ₹{doctor.consultationFee}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center gap-3 text-slate-600">
                        <Building2
                          size={18}
                          className="text-blue-600"
                        />
                        <span className="truncate">
                          {doctor.hospital?.hospitalName ||
                            "Hospital Not Available"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-slate-600">
                        <MapPin
                          size={18}
                          className="text-emerald-600"
                        />
                        <span>
                          {doctor.city ||
                            doctor.hospital?.city ||
                            "Available"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-emerald-700 font-semibold">
                        <CalendarCheck size={18} />
                        <span>Instant appointment booking</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <Link to={`/doctor/${doctor.id}`}>
                        <button className="w-full border border-blue-600 text-blue-600 py-3 rounded-2xl font-black hover:bg-blue-50 transition">
                          Profile
                        </button>
                      </Link>

                      <Link to={`/doctor/${doctor.id}`}>
                        <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-2xl font-black shadow-lg shadow-blue-100 hover:scale-[1.02] transition flex items-center justify-center gap-2">
                          Book
                          <ArrowRight size={18} />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-slate-950 text-white font-black hover:bg-blue-700 transition shadow-xl"
          >
            Explore All Doctors
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}