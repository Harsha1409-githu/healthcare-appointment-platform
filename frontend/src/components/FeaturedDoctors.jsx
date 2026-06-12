import { useEffect, useState } from "react";
import {
  Star,
  Stethoscope,
  CalendarCheck,
  IndianRupee,
  ArrowRight,
  MapPin,
  ShieldCheck,
  Building2,
  Award,
  Clock,
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
    <section className="py-20 bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-5">
              <Stethoscope size={17} />
              TOP DOCTORS
            </div>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-950">
              Book appointments with
              <span className="block text-cyan-600">
                trusted doctors
              </span>
            </h2>

            <p className="text-slate-500 mt-5 text-lg max-w-2xl leading-relaxed">
              Choose verified doctors with transparent fees, hospital details,
              experience and instant appointment booking.
            </p>
          </div>

          <Link
            to="/doctors"
            className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-950 text-white font-black hover:bg-cyan-700 transition"
          >
            View All Doctors
            <ArrowRight size={18} />
          </Link>
        </div>

        {doctors.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-10 text-center border border-slate-100">
            <p className="text-slate-500">
              No featured doctors available.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {doctors.map((doctor, index) => (
              <div
                key={doctor.id}
                className="bg-white rounded-[1.8rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex gap-5">
                    <div className="relative shrink-0">
                      {doctor.profileImage ? (
                        <img
                          src={doctor.profileImage}
                          alt={doctor.doctorName}
                          className="w-28 h-28 rounded-3xl object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="w-28 h-28 rounded-3xl bg-cyan-50 flex items-center justify-center border border-cyan-100">
                          <Stethoscope
                            size={46}
                            className="text-cyan-600"
                          />
                        </div>
                      )}

                      <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-white">
                        <ShieldCheck size={17} className="text-white" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-black text-slate-950 truncate">
                        {doctor.doctorName}
                      </h3>

                      <p className="text-cyan-700 font-bold mt-1">
                        {doctor.specialization}
                      </p>

                      <div className="flex items-center gap-1 mt-3 text-sm">
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-black">
                          <Star size={14} className="fill-emerald-700" />
                          4.{9 - (index % 2)}
                        </span>

                        <span className="text-slate-400">
                          Verified
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-slate-500 text-sm">
                        <Award size={16} className="text-cyan-600" />
                        <span>{doctor.experience}+ years experience</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
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

                    <InfoLine
                      icon={Clock}
                      text="Available Today"
                      active
                    />
                  </div>

                  <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 p-4">
                    <div>
                      <p className="text-xs text-slate-500 font-semibold">
                        Consultation Fee
                      </p>

                      <div className="flex items-center font-black text-slate-950 text-xl">
                        <IndianRupee size={18} />
                        {doctor.consultationFee}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-emerald-700 font-black text-sm">
                      <CalendarCheck size={17} />
                      Instant Booking
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <Link to={`/doctor/${doctor.id}`}>
                      <button className="w-full border border-cyan-600 text-cyan-700 py-3 rounded-2xl font-black hover:bg-cyan-50 transition">
                        Profile
                      </button>
                    </Link>

                    <Link to={`/doctor/${doctor.id}`}>
                      <button className="w-full bg-cyan-600 text-white py-3 rounded-2xl font-black hover:bg-cyan-700 transition flex items-center justify-center gap-2">
                        Book
                        <ArrowRight size={18} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function InfoLine({ icon: Icon, text, active }) {
  return (
    <div
      className={`flex items-center gap-3 text-sm ${
        active ? "text-emerald-700 font-black" : "text-slate-600"
      }`}
    >
      <Icon
        size={18}
        className={active ? "text-emerald-600" : "text-cyan-600"}
      />
      <span className="truncate">{text}</span>
    </div>
  );
}