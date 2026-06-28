import { useEffect, useMemo, useState } from "react";
import {
  Video,
  HeartPulse,
  Baby,
  Ear,
  Brain,
  Eye,
  Bone,
  Smile,
  Activity,
  Search,
  IndianRupee,
  BadgeCheck,
  Building2,
  MapPin,
  ShieldCheck,
  Clock,
  Stethoscope,
  ChevronRight,
  Loader2,
  X,
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
  const [activeSpeciality, setActiveSpeciality] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);

      const res = await api.get("/doctor");

      const activeDoctors = (res.data || []).filter(
        (doctor) => doctor.isActive
      );

      setDoctors(activeDoctors);
    } catch (error) {
      console.error("Video consult doctors error:", error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const keyword = `${doctor.doctorName || ""} ${
        doctor.specialization || ""
      } ${doctor.hospital?.hospitalName || ""}`
        .toLowerCase()
        .trim();

      const matchesSearch = keyword.includes(search.toLowerCase().trim());

      const matchesSpeciality =
        activeSpeciality === "All" ||
        doctor.specialization === activeSpeciality;

      return matchesSearch && matchesSpeciality;
    });
  }, [doctors, search, activeSpeciality]);

  return (
    <main className="min-h-screen bg-[#f4f8fb] px-4 pt-4 pb-28">
      <div className="max-w-md mx-auto">
        <header className="mb-3">
          <div className="inline-flex items-center gap-1.5 text-cyan-700 font-black text-xs">
            <Video size={15} />
            VIDEO CONSULT
          </div>

          <h1 className="text-2xl font-black text-slate-950 mt-1">
            Consult Online
          </h1>

          <p className="text-sm text-slate-500 font-semibold">
            Book a secure video appointment with verified doctors.
          </p>
        </header>

        <section className="bg-cyan-600 rounded-3xl p-4 text-white shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black text-cyan-100">
                HOW IT WORKS
              </p>

              <h2 className="text-xl font-black mt-1">
                Choose doctor, book slot, join video
              </h2>

              <p className="text-sm text-cyan-100 mt-1">
                After payment, your video appointment appears in doctor queue.
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Video size={24} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <MiniBenefit icon={ShieldCheck} title="Verified" />
            <MiniBenefit icon={Clock} title="Booked Slot" />
            <MiniBenefit icon={Stethoscope} title="Digital Rx" />
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3 mt-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3">
            <Search className="text-cyan-600 shrink-0" size={17} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctor, hospital or speciality"
              className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
            />

            {search && (
              <button type="button" onClick={() => setSearch("")}>
                <X size={16} className="text-slate-400" />
              </button>
            )}
          </div>
        </section>

        <section className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-slate-900">
              Specialities
            </h2>

            <button
              type="button"
              onClick={() => setActiveSpeciality("All")}
              className="text-cyan-600 font-black text-xs"
            >
              Clear
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveSpeciality("All")}
              className={`min-w-[82px] border rounded-2xl p-3 text-center shadow-sm active:scale-95 transition ${
                activeSpeciality === "All"
                  ? "bg-cyan-600 text-white border-cyan-600"
                  : "bg-white text-slate-800 border-slate-100"
              }`}
            >
              <Video size={21} className="mx-auto" />
              <p className="text-[11px] font-black mt-2">All</p>
            </button>

            {specialties.map((item) => {
              const Icon = item.icon;
              const active = activeSpeciality === item.name;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setActiveSpeciality(item.name)}
                  className={`min-w-[92px] border rounded-2xl p-3 text-center shadow-sm active:scale-95 transition ${
                    active
                      ? "bg-cyan-600 text-white border-cyan-600"
                      : "bg-white border-slate-100"
                  }`}
                >
                  <div
                    className={`w-11 h-11 mx-auto rounded-2xl flex items-center justify-center ${
                      active ? "bg-white/20 text-white" : item.color
                    }`}
                  >
                    <Icon size={21} />
                  </div>

                  <p
                    className={`text-[11px] font-black mt-2 leading-tight ${
                      active ? "text-white" : "text-slate-800"
                    }`}
                  >
                    {item.name}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Video Doctors
              </h2>

              <p className="text-xs text-slate-500 font-semibold">
                {filteredDoctors.length} available for video booking
              </p>
            </div>

            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              ● Slots
            </span>
          </div>

          {loading ? (
            <LoadingState />
          ) : filteredDoctors.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {filteredDoctors.slice(0, 10).map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function DoctorCard({ doctor }) {
  const normalFee = Number(doctor.consultationFee || 0);
  const videoFee = Math.max(normalFee - 100, 0);

  return (
    <Link
      to={`/doctor/${doctor.id}?type=VIDEO`}
      className="block bg-white rounded-3xl border border-slate-100 shadow-sm p-4 active:scale-[0.98] transition"
    >
      <div className="flex gap-3">
        <div className="relative shrink-0">
          <img
            src={
              doctor.profileImage ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                doctor.doctorName || "Doctor"
              )}&background=0891b2&color=fff&bold=true`
            }
            alt={doctor.doctorName || "Doctor"}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-100"
          />

          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white">
            <BadgeCheck size={12} className="text-white" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-black text-slate-950 truncate">
                Dr. {doctor.doctorName || "Doctor"}
              </h3>

              <p className="text-xs text-cyan-700 font-black truncate">
                {doctor.specialization || "Specialist"}
              </p>
            </div>

            <span className="shrink-0 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
              Video
            </span>
          </div>

          <div className="mt-2 space-y-1">
            <Info icon={Building2}>
              {doctor.hospital?.hospitalName || "Hospital"}
            </Info>

            <Info icon={MapPin}>
              {doctor.city || doctor.hospital?.city || "Available online"}
            </Info>
          </div>

          <div className="mt-3 bg-slate-50 border border-slate-100 rounded-2xl p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] text-slate-500 font-bold">
                  Video consultation
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-lg font-black text-slate-950">
                    <IndianRupee size={16} />
                    {videoFee}
                  </div>

                  {normalFee > videoFee && (
                    <div className="flex items-center text-sm text-slate-400 line-through">
                      <IndianRupee size={12} />
                      {normalFee}
                    </div>
                  )}
                </div>
              </div>

              <div className="w-10 h-10 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shrink-0">
                <ChevronRight size={20} />
              </div>
            </div>

            <div className="mt-3 w-full bg-cyan-600 text-white py-3 rounded-2xl text-sm font-black flex items-center justify-center gap-2">
              <Video size={16} />
              Book Video Slot
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function MiniBenefit({ icon: Icon, title }) {
  return (
    <div className="bg-white/15 rounded-2xl p-2 text-center">
      <Icon size={17} className="mx-auto" />
      <p className="text-[10px] font-black mt-1">{title}</p>
    </div>
  );
}

function Info({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 min-w-0">
      <Icon size={12} className="text-cyan-600 shrink-0" />
      <span className="truncate">{children}</span>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 text-center shadow-sm">
      <Loader2 className="mx-auto text-cyan-600 animate-spin mb-3" size={32} />
      <p className="font-black text-slate-950">Loading doctors</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 text-center text-slate-500 text-sm shadow-sm">
      No video doctors found.
    </div>
  );
}