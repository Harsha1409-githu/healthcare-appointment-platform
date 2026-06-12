import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  IndianRupee,
  BadgeCheck,
  ArrowRight,
  Search,
  Filter,
  MapPin,
  Building2,
  Award,
  CalendarCheck,
  Video,
  Clock,
  ShieldCheck,
  Star,
  Loader2,
} from "lucide-react";
import api from "../api/axios";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ACTIVE");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const res = await api.get("/doctor");
      setDoctors(res.data || []);
    } catch (error) {
      console.error("Doctor list error:", error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const specializations = useMemo(() => {
    return [
      "ALL",
      ...new Set(doctors.map((doc) => doc.specialization).filter(Boolean)),
    ];
  }, [doctors]);

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = `${doc.doctorName || ""} ${
      doc.specialization || ""
    } ${doc.qualification || ""} ${doc.hospital?.hospitalName || ""} ${
      doc.city || doc.hospital?.city || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesSpecialization =
      specializationFilter === "ALL" ||
      doc.specialization === specializationFilter;

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && doc.isActive) ||
      (statusFilter === "INACTIVE" && !doc.isActive);

    return matchesSearch && matchesSpecialization && matchesStatus;
  });

  const stats = useMemo(() => {
    return {
      total: doctors.length,
      active: doctors.filter((doc) => doc.isActive).length,
      inactive: doctors.filter((doc) => !doc.isActive).length,
      specializations: specializations.filter((item) => item !== "ALL").length,
    };
  }, [doctors, specializations]);

  return (
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6 py-8">
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                <Stethoscope size={17} />
                DOCTOR DIRECTORY
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                Doctors
              </h1>

              <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
                Browse verified doctors, specializations, hospitals,
                consultation fees and availability.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MiniStat title="Total" value={stats.total} icon={Stethoscope} />
              <MiniStat title="Active" value={stats.active} icon={ShieldCheck} />
              <MiniStat title="Inactive" value={stats.inactive} icon={Clock} />
              <MiniStat
                title="Specialties"
                value={stats.specializations}
                icon={Award}
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 mb-8">
          <div className="grid lg:grid-cols-[1fr_260px_220px] gap-4">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
              <Search className="text-cyan-600" size={20} />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctor, specialty, hospital or city..."
                className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
              <Filter className="text-cyan-600" size={20} />

              <select
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-800 font-semibold"
              >
                {specializations.map((specialization) => (
                  <option key={specialization} value={specialization}>
                    {specialization === "ALL"
                      ? "All Specializations"
                      : specialization}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
              <BadgeCheck className="text-cyan-600" size={20} />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-800 font-semibold"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active Only</option>
                <option value="INACTIVE">Inactive Only</option>
              </select>
            </div>
          </div>
        </section>

        {loading ? (
          <LoadingState />
        ) : filteredDoctors.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-5">
            {filteredDoctors.map((doc) => (
              <DoctorRowCard key={doc.id} doc={doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DoctorRowCard({ doc }) {
  const doctorImage =
    doc.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      doc.doctorName || "Doctor"
    )}&background=0891b2&color=fff&bold=true`;

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition overflow-hidden">
      <div className="p-6">
        <div className="grid xl:grid-cols-[1fr_260px] gap-6">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="relative shrink-0">
              <img
                src={doctorImage}
                alt={doc.doctorName}
                className="w-28 h-28 rounded-3xl border border-slate-100 shadow-sm object-cover"
              />

              <div
                className={`absolute -bottom-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center border-4 border-white ${
                  doc.isActive ? "bg-emerald-500" : "bg-slate-400"
                }`}
              >
                <BadgeCheck size={17} className="text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-black text-xs border ${
                    doc.isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-slate-50 text-slate-500 border-slate-100"
                  }`}
                >
                  <BadgeCheck size={14} />
                  {doc.isActive ? "Active Doctor" : "Inactive Doctor"}
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 font-black text-xs border border-yellow-100">
                  <Star size={14} className="fill-yellow-500 text-yellow-500" />
                  Trusted
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-950">
                {doc.doctorName}
              </h3>

              <p className="text-cyan-700 font-black mt-1">
                {doc.specialization || "Specialist"}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <SmallBadge
                  icon={Award}
                  text={`${doc.experience || 0}+ Years`}
                />

                <SmallBadge icon={Video} text="Video Consult" />

                <SmallBadge
                  icon={CalendarCheck}
                  text="Instant Booking"
                  green
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mt-5">
                <InfoLine
                  icon={Stethoscope}
                  text={doc.qualification || "Qualification not added"}
                />

                <InfoLine
                  icon={Building2}
                  text={doc.hospital?.hospitalName || "Hospital Not Available"}
                />

                <InfoLine
                  icon={MapPin}
                  text={doc.city || doc.hospital?.city || "Location Available"}
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
                {doc.consultationFee || 0}
              </div>

              <p className="text-sm text-emerald-700 font-black mt-3 flex items-center gap-2">
                <CalendarCheck size={17} />
                Instant appointment booking
              </p>
            </div>

            <div className="grid gap-3 mt-5">
              <Link to={`/doctor/${doc.id}`}>
                <button className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black hover:bg-cyan-700 transition flex items-center justify-center gap-2">
                  View Profile
                  <ArrowRight size={18} />
                </button>
              </Link>

              <Link to={`/doctor/${doc.id}`}>
                <button className="w-full border border-cyan-600 text-cyan-700 py-4 rounded-2xl font-black hover:bg-cyan-50 transition">
                  Book Appointment
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoLine({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3 text-slate-600 bg-slate-50 border border-slate-100 rounded-2xl px-3 py-2 min-w-0">
      <Icon size={18} className="text-cyan-600 shrink-0" />
      <span className="truncate">{text || "-"}</span>
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

function MiniStat({ title, value, icon: Icon }) {
  return (
    <div className="min-w-[90px] bg-slate-50 rounded-2xl border border-slate-100 p-3">
      <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center mb-2">
        <Icon className="text-cyan-600" size={18} />
      </div>

      <p className="text-xl font-black text-slate-950">{value}</p>

      <p className="text-xs text-slate-500 font-bold">{title}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto mb-4">
        <Loader2 className="text-cyan-600 animate-spin" size={34} />
      </div>

      <h3 className="text-2xl font-black text-slate-950">
        Loading doctors
      </h3>

      <p className="text-slate-500 mt-2">
        Please wait while we fetch doctor profiles.
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto mb-4">
        <Stethoscope className="text-cyan-600" size={34} />
      </div>

      <h3 className="text-2xl font-black text-slate-950">
        No doctors found
      </h3>

      <p className="text-slate-500 mt-2">
        Try changing search or filters.
      </p>
    </div>
  );
}