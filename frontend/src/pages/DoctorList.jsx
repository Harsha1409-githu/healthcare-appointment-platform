import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  IndianRupee,
  BadgeCheck,
  ArrowRight,
  Search,
  MapPin,
  Building2,
  Award,
  CalendarCheck,
  Video,
  Clock,
  ShieldCheck,
  Star,
  Loader2,
  SlidersHorizontal,
  X,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import api from "../api/axios";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ACTIVE");
  const [showFilters, setShowFilters] = useState(false);

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
    const searchText = `${doc.doctorName || ""} ${doc.specialization || ""} ${
      doc.qualification || ""
    } ${doc.hospital?.hospitalName || ""} ${
      doc.city || doc.hospital?.city || ""
    }`.toLowerCase();

    const matchesSearch = searchText.includes(search.toLowerCase());

    const matchesSpecialization =
      specializationFilter === "ALL" ||
      doc.specialization === specializationFilter;

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && doc.isActive) ||
      (statusFilter === "INACTIVE" && !doc.isActive);

    return matchesSearch && matchesSpecialization && matchesStatus;
  });

  const activeSpecialty =
    specializationFilter === "ALL" ? "All Specialities" : specializationFilter;

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-28">
      <PageHeader
        title="Doctors"
        subtitle={`${filteredDoctors.length} doctors available`}
      />

      <div className="max-w-md mx-auto px-4">
        <section className="sticky top-[72px] z-20 bg-[#f4f8fb]/95 backdrop-blur-md pt-1 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-3 py-3 shadow-sm">
              <Search className="text-cyan-600 shrink-0" size={18} />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctor, speciality, hospital"
                className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-slate-400"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-cyan-600 active:scale-95"
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3 pb-1">
            {specializations.slice(0, 8).map((specialization) => (
              <button
                key={specialization}
                type="button"
                onClick={() => setSpecializationFilter(specialization)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-black border transition ${
                  specializationFilter === specialization
                    ? "bg-cyan-600 text-white border-cyan-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-100"
                }`}
              >
                {specialization === "ALL" ? "All" : specialization}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mb-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-cyan-700 font-black">
                {activeSpecialty}
              </p>

              <h2 className="text-xl font-black text-slate-950">
                Find your doctor
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Verified specialists near you
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center">
              <Stethoscope className="text-cyan-600" size={28} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <MiniStat
              icon={ShieldCheck}
              label="Active"
              value={doctors.filter((doc) => doc.isActive).length}
            />

            <MiniStat
              icon={Award}
              label="Speciality"
              value={specializations.length - 1}
            />

            <MiniStat
              icon={CalendarCheck}
              label="Booking"
              value="Fast"
            />
          </div>
        </section>

        {loading ? (
          <LoadingState />
        ) : filteredDoctors.length === 0 ? (
          <EmptyState
            clearFilters={() => {
              setSearch("");
              setSpecializationFilter("ALL");
              setStatusFilter("ACTIVE");
            }}
          />
        ) : (
          <section className="space-y-3">
            {filteredDoctors.map((doc) => (
              <DoctorMobileCard key={doc.id} doc={doc} />
            ))}
          </section>
        )}
      </div>

      {showFilters && (
        <FilterSheet
          specializations={specializations}
          specializationFilter={specializationFilter}
          setSpecializationFilter={setSpecializationFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onClose={() => setShowFilters(false)}
        />
      )}
    </main>
  );
}

function DoctorMobileCard({ doc }) {
  const doctorImage =
    doc.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      doc.doctorName || "Doctor"
    )}&background=0891b2&color=fff&bold=true`;

  return (
    <article className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3 active:scale-[0.99] transition">
      <div className="flex gap-3">
        <div className="relative shrink-0">
          <img
            src={doctorImage}
            alt={doc.doctorName || "Doctor"}
            className="w-20 h-20 rounded-3xl border border-slate-100 object-cover"
          />

          <div
            className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white ${
              doc.isActive ? "bg-emerald-500" : "bg-slate-400"
            }`}
          >
            <BadgeCheck size={14} className="text-white" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-base font-black text-slate-950 truncate">
                {doc.doctorName || "Doctor"}
              </h3>

              <p className="text-sm text-cyan-700 font-black truncate">
                {doc.specialization || "Specialist"}
              </p>
            </div>

            <span
              className={`shrink-0 px-2 py-1 rounded-full text-[10px] font-black ${
                doc.isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {doc.isActive ? "ACTIVE" : "OFF"}
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-1 truncate">
            {doc.qualification || "Qualification not added"}
          </p>

          <div className="flex items-center gap-1.5 text-yellow-600 text-xs font-black mt-2">
            <Star size={13} className="fill-yellow-500 text-yellow-500" />
            4.8
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">
              {doc.experience || 0}+ years
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <InfoPill
          icon={Building2}
          text={doc.hospital?.hospitalName || "Hospital"}
        />

        <InfoPill
          icon={MapPin}
          text={doc.city || doc.hospital?.city || "Available"}
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
            {doc.consultationFee || 0}
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black">
          <CalendarCheck size={13} />
          Instant
        </div>
      </div>
<div className="grid grid-cols-3 gap-2 mt-3">
  <Link
    to={`/doctor/${doc.id}`}
    className="border border-slate-200 text-slate-700 py-3 rounded-2xl text-xs font-black text-center"
  >
    Profile
  </Link>

  <Link
    to={`/book/${doc.id}?type=IN_PERSON`}
    className="bg-emerald-600 text-white py-3 rounded-2xl text-xs font-black text-center"
  >
    🏥 In-Person
  </Link>

  <Link
    to={`/book/${doc.id}?type=VIDEO`}
    className="bg-blue-600 text-white py-3 rounded-2xl text-xs font-black text-center"
  >
    🎥 Video
  </Link>
</div>
    </article>
  );
}

function FilterSheet({
  specializations,
  specializationFilter,
  setSpecializationFilter,
  statusFilter,
  setStatusFilter,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end">
      <div className="bg-white w-full max-w-md mx-auto rounded-t-[2rem] p-4 max-h-[85vh] overflow-y-auto">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              Filters
            </h2>

            <p className="text-sm text-slate-500">
              Refine doctor results
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        <h3 className="text-sm font-black text-slate-900 mb-2">
          Doctor Status
        </h3>

        <div className="grid grid-cols-3 gap-2 mb-5">
          {["ALL", "ACTIVE", "INACTIVE"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`py-3 rounded-2xl text-xs font-black ${
                statusFilter === status
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-50 text-slate-600"
              }`}
            >
              {status === "ALL"
                ? "All"
                : status === "ACTIVE"
                ? "Active"
                : "Inactive"}
            </button>
          ))}
        </div>

        <h3 className="text-sm font-black text-slate-900 mb-2">
          Specialization
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {specializations.map((specialization) => (
            <button
              key={specialization}
              type="button"
              onClick={() => setSpecializationFilter(specialization)}
              className={`py-3 px-3 rounded-2xl text-xs font-black text-left ${
                specializationFilter === specialization
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-50 text-slate-600"
              }`}
            >
              {specialization === "ALL" ? "All Specialities" : specialization}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full bg-cyan-600 text-white py-4 rounded-2xl font-black"
        >
          Apply Filters
        </button>
      </div>
    </div>
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

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center">
      <Icon className="text-cyan-600 mx-auto" size={18} />

      <p className="text-sm font-black text-slate-950 mt-1">
        {value}
      </p>

      <p className="text-[10px] text-slate-500 font-bold">
        {label}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
      <Loader2 className="text-cyan-600 animate-spin mx-auto mb-3" size={34} />

      <h3 className="text-lg font-black text-slate-950">
        Loading doctors
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        Please wait while we fetch doctors.
      </p>
    </div>
  );
}

function EmptyState({ clearFilters }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
      <Stethoscope className="text-cyan-600 mx-auto mb-3" size={34} />

      <h3 className="text-lg font-black text-slate-950">
        No doctors found
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        Try changing search or filters.
      </p>

      <button
        type="button"
        onClick={clearFilters}
        className="mt-4 bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black text-sm"
      >
        Clear Filters
      </button>
    </div>
  );
}