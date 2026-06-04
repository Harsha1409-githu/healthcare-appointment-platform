import { useEffect, useState } from "react";
import {
  Star,
  Stethoscope,
  BadgeCheck,
  CalendarCheck,
  IndianRupee,
  ArrowRight,
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
        setDoctors((res.data || []).filter((d) => d.isActive).slice(0, 3))
      )
      .catch((err) => console.error("Featured doctors error:", err));
  }, []);

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-blue-50/40 to-white">
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold mb-5">
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
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center border">
            <p className="text-slate-500">No featured doctors available.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {doctors.map((doctor, index) => (
              <div
                key={doctor.id}
                className="group relative"
              >
                <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-60 blur transition duration-500" />

                <div className="relative h-full bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden group-hover:-translate-y-2 transition duration-500">
                  <div className="relative p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl" />

                    <div className="relative flex items-start justify-between">
                      <div className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center shadow-lg">
                        <Stethoscope size={36} className="text-cyan-200" />
                      </div>

                      <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-400 text-slate-950 font-bold text-sm">
                        <Star size={15} className="fill-slate-950" />
                        4.{9 - (index % 2)}
                      </div>
                    </div>

                    <div className="relative mt-5">
                      <h3 className="text-2xl font-black">
                        {doctor.doctorName}
                      </h3>

                      <p className="text-cyan-200 font-semibold mt-1">
                        {doctor.specialization}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-blue-50 p-4">
                        <div className="flex items-center gap-2 text-blue-700 font-bold">
                          <BadgeCheck size={18} />
                          Experience
                        </div>
                        <p className="text-2xl font-black mt-2 text-slate-900">
                          {doctor.experience}+ yrs
                        </p>
                      </div>

                      <div className="rounded-2xl bg-emerald-50 p-4">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold">
                          <IndianRupee size={18} />
                          Fee
                        </div>
                        <p className="text-2xl font-black mt-2 text-slate-900">
                          ₹{doctor.consultationFee}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center gap-3 text-slate-600">
                        <MapPin size={18} className="text-blue-600" />
                        <span>
                          {doctor.city || doctor.hospital?.city || "Available"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-slate-600">
                        <CalendarCheck size={18} className="text-emerald-600" />
                        <span>Instant appointment booking</span>
                      </div>
                    </div>

                    <Link
                      to={`/doctor/${doctor.id}`}
                      className="mt-6 flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg shadow-blue-100 hover:scale-[1.02] transition"
                    >
                      View Profile
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-slate-950 text-white font-bold hover:bg-blue-700 transition shadow-xl"
          >
            Explore All Doctors
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}