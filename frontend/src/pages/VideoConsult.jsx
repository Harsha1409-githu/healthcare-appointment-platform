import { useEffect, useState } from "react";
import {
  Video,
  ArrowRight,
  HeartPulse,
  Baby,
  Ear,
  Brain,
  Eye,
  Bone,
  Smile,
  Activity,
  ShieldCheck,
  Clock,
  FileText,
  Star,
  IndianRupee,
  Search,
  BadgeCheck,
  Stethoscope,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const specialties = [
  { name: "General Physician", icon: Activity, color: "bg-blue-50 text-blue-600" },
  { name: "Cardiology", icon: HeartPulse, color: "bg-red-50 text-red-600" },
  { name: "Pediatrics", icon: Baby, color: "bg-pink-50 text-pink-600" },
  { name: "ENT", icon: Ear, color: "bg-cyan-50 text-cyan-600" },
  { name: "Neurology", icon: Brain, color: "bg-purple-50 text-purple-600" },
  { name: "Ophthalmology", icon: Eye, color: "bg-emerald-50 text-emerald-600" },
  { name: "Orthopedics", icon: Bone, color: "bg-orange-50 text-orange-600" },
  { name: "Dental", icon: Smile, color: "bg-yellow-50 text-yellow-600" },
];

export default function VideoConsult() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/doctor");
      setDoctors((res.data || []).filter((doctor) => doctor.isActive));
    } catch (error) {
      console.error("Video consult doctors error:", error);
    }
  };

  const filteredDoctors = doctors.filter((doctor) =>
    `${doctor.doctorName || ""} ${doctor.specialization || ""} ${
      doctor.hospital?.hospitalName || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4fbff] py-10">
      <div className="max-w-7xl mx-auto px-6">
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 rounded-[2rem] p-8 md:p-10 text-white mb-8 shadow-xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative grid lg:grid-cols-[1.25fr_0.75fr] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-5">
                <Video size={18} className="text-cyan-300" />
                <span className="font-black text-sm">
                  Online Doctor Consultation
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black leading-tight">
                Consult Top Doctors
                <span className="block text-cyan-300">Online</span>
              </h1>

              <p className="text-blue-100 mt-5 max-w-2xl text-lg leading-relaxed">
                Choose a specialty, find the right doctor, book an appointment
                and join a secure video consultation from anywhere.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mt-7 max-w-3xl">
                <Feature icon={Clock} title="Quick Booking" />
                <Feature icon={ShieldCheck} title="Secure Video" />
                <Feature icon={FileText} title="Digital Prescription" />
              </div>
            </div>

            <div className="hidden lg:block bg-white/10 border border-white/20 backdrop-blur-xl rounded-[2rem] p-6">
              <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center mb-5">
                <Video className="text-cyan-300" size={34} />
              </div>

              <h3 className="text-2xl font-black">Start consultation</h3>

              <p className="text-blue-100 mt-3 leading-relaxed">
                Select a specialty below and connect through your booked video
                appointment.
              </p>

              <Link
                to="/ai-doctor-match"
                className="mt-6 inline-flex items-center gap-2 bg-white text-cyan-700 px-5 py-3 rounded-2xl font-black hover:bg-cyan-50 transition"
              >
                Find Doctor With AI
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>


        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 mb-8">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
            <Search className="text-cyan-600" size={20} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctors, specialties or hospital..."
              className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </section>

        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                <Sparkles size={17} />
                Care Categories
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-slate-950">
                Choose Specialty
              </h2>

              <p className="text-slate-500 mt-1">
                Pick the care category you want to consult online.
              </p>
            </div>

            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 text-cyan-600 font-black hover:text-cyan-700"
            >
              View all doctors
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {specialties.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  to={`/doctors?specialization=${encodeURIComponent(item.name)}`}
                  className="group bg-slate-50 rounded-[2rem] border border-slate-100 p-6 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${item.color}`}
                  >
                    <Icon size={28} />
                  </div>

                  <h3 className="text-xl font-black text-slate-950">
                    {item.name}
                  </h3>

                  <p className="text-slate-500 mt-2">
                    Online consultation available
                  </p>

                  <div className="mt-5 text-cyan-600 font-black flex items-center gap-2">
                    Consult Now
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-950">
                Available Online Doctors
              </h2>

              <p className="text-slate-500 mt-1">
                Consult experienced specialists instantly.
              </p>
            </div>

            <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full font-black text-sm">
              ● Online Now
            </span>
          </div>

          {filteredDoctors.length === 0 ? (
            <div className="text-center text-slate-500 py-12 bg-slate-50 rounded-2xl border border-slate-100">
              No online doctors found.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredDoctors.slice(0, 6).map((doctor, index) => (
                <Link
                  key={doctor.id}
                  to={`/doctor/${doctor.id}`}
                  className="bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm hover:bg-white hover:shadow-xl hover:-translate-y-1 transition overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={
                            doctor.profileImage ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              doctor.doctorName || "Doctor"
                            )}&background=0891b2&color=fff&bold=true`
                          }
                          alt={doctor.doctorName}
                          className="w-16 h-16 rounded-2xl object-cover shrink-0"
                        />

                        <div className="min-w-0">
                          <h3 className="font-black text-slate-950 truncate">
                            {doctor.doctorName}
                          </h3>

                          <p className="text-cyan-600 font-semibold truncate">
                            {doctor.specialization}
                          </p>
                        </div>
                      </div>

                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black shrink-0">
                        ● Online
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-slate-500">
                      <p>🏥 {doctor.hospital?.hospitalName || "Hospital"}</p>

                      <p className="flex items-center gap-1">
                        <Star
                          size={15}
                          className="text-yellow-500 fill-yellow-500"
                        />
                        4.{9 - (index % 2)} Rating
                      </p>

                      <p>🩺 {doctor.experience || 0} Years Experience</p>

                      <p className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full font-black text-xs">
                        <BadgeCheck size={13} />
                        Available Today 06:00 PM
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-5">
                      <div>
                        <p className="text-xs text-slate-400">
                          Consultation Fee
                        </p>

                        <p className="text-2xl font-black text-slate-950 flex items-center">
                          <IndianRupee size={20} />
                          {doctor.consultationFee}
                        </p>
                      </div>

                      <div className="bg-cyan-600 text-white px-4 py-3 rounded-2xl font-black hover:bg-cyan-700 transition">
                        Consult Now
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
          <h2 className="text-3xl font-black text-slate-950 mb-6">
            Why Choose Video Consultation?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Benefit
              icon={Clock}
              title="24x7 Access"
              text="Consult doctors from anywhere without travelling."
            />

            <Benefit
              icon={FileText}
              title="Digital Prescription"
              text="Receive prescriptions instantly after consultation."
            />

            <Benefit
              icon={ShieldCheck}
              title="Secure Video"
              text="Private and secure consultation experience."
            />
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link
            to="/ai-doctor-match"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-4 rounded-full font-black hover:scale-105 transition"
          >
            Not sure which doctor to choose?
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title }) {
  return (
    <div className="bg-white/10 border border-white/20 rounded-2xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
        <Icon className="text-cyan-300" size={20} />
      </div>

      <p className="font-black text-sm">{title}</p>
    </div>
  );
}


function Benefit({ icon: Icon, title, text }) {
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
      <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center mb-4">
        <Icon className="text-cyan-600" size={24} />
      </div>

      <h3 className="font-black text-xl text-slate-950">
        {title}
      </h3>

      <p className="text-slate-500 mt-2 leading-relaxed">
        {text}
      </p>
    </div>
  );
}