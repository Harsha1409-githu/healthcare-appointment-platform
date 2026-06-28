import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  MapPin,
  Stethoscope,
  IndianRupee,
  BadgeCheck,
  Award,
  Building2,
  X,
  Clock,
  Loader2,
  CalendarCheck,
} from "lucide-react";
import api from "../api/axios";

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function Doctors() {
  const [searchParams] = useSearchParams();

  const urlCity =
    searchParams.get("city") ||
    localStorage.getItem("selectedCity") ||
    "Chennai";

  const urlSpecialization = searchParams.get("specialization") || "All";

  const [city, setCity] = useState(urlCity);
  const [doctors, setDoctors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [specialization, setSpecialization] = useState(urlSpecialization);
  const [sortBy, setSortBy] = useState("relevance");

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    setCity(urlCity);
    setSpecialization(urlSpecialization);
  }, [urlCity, urlSpecialization]);

  useEffect(() => {
    setLoading(true);

    api
      .get(`/doctor/search?city=${encodeURIComponent(city)}`)
      .then((res) => {
        const data = res.data?.data || [];
        const activeDoctors = data.filter((d) => d.isActive);

        setDoctors(activeDoctors);
        setFiltered(activeDoctors);
      })
      .catch((err) => {
        console.error("Doctors API error:", err);
        setDoctors([]);
        setFiltered([]);
      })
      .finally(() => setLoading(false));
  }, [city]);

  const specs = useMemo(
    () => [
      "All",
      ...new Set(doctors.map((d) => d.specialization).filter(Boolean)),
    ],
    [doctors]
  );

  const cities = [
    ...new Set(
      [
        localStorage.getItem("selectedCity"),
        "Chennai",
        "Mumbai",
        "Delhi",
        "Bangalore",
        "Hyderabad",
      ].filter(Boolean)
    ),
  ];

  useEffect(() => {
    let result = [...doctors];

    if (debouncedSearch) {
      result = result.filter((d) =>
        `${d.doctorName || ""} ${d.specialization || ""} ${
          d.hospital?.hospitalName || ""
        } ${d.city || ""}`
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase())
      );
    }

    if (specialization !== "All") {
      result = result.filter((d) =>
        d.specialization
          ?.toLowerCase()
          .includes(specialization.toLowerCase())
      );
    }

    if (sortBy === "experience") {
      result.sort(
        (a, b) => Number(b.experience || 0) - Number(a.experience || 0)
      );
    }

    if (sortBy === "fee-low") {
      result.sort(
        (a, b) =>
          Number(a.consultationFee || 0) -
          Number(b.consultationFee || 0)
      );
    }

    if (sortBy === "fee-high") {
      result.sort(
        (a, b) =>
          Number(b.consultationFee || 0) -
          Number(a.consultationFee || 0)
      );
    }

    setFiltered(result);
  }, [debouncedSearch, specialization, doctors, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setSpecialization("All");
    setSortBy("relevance");
  };

  const clearLocation = () => {
    localStorage.removeItem("selectedCity");
    setCity("Chennai");
  };

  return (
    <main className="min-h-screen bg-[#f4f8fb] px-4 pt-4 pb-24">
      <div className="max-w-md mx-auto">
        <header className="mb-3">
          <div className="inline-flex items-center gap-1.5 text-cyan-700 font-black text-xs">
            <Stethoscope size={15} />
            DOCTORS
          </div>

          <h1 className="text-2xl font-black text-slate-950 mt-1">
            Find Doctors
          </h1>

          <p className="text-sm text-slate-500 font-semibold">
            {loading
              ? "Searching verified doctors..."
              : `${filtered.length} doctors available in ${city}`}
          </p>
        </header>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3">
            <Search size={17} className="text-cyan-600 shrink-0" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctor, speciality, hospital"
              className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
            />

            {search && (
              <button onClick={() => setSearch("")}>
                <X size={16} className="text-slate-400" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <StatCard value={filtered.length} label="Doctors" />
            <StatCard value="100%" label="Verified" />
            <StatCard value="24x7" label="Booking" />
          </div>

          <div className="flex gap-2 overflow-x-auto mt-3 pb-1">
            {specs.map((spec) => (
              <button
                key={spec}
                onClick={() => setSpecialization(spec)}
                className={`shrink-0 px-3 py-2 rounded-full text-xs font-black border ${
                  specialization === spec
                    ? "bg-cyan-600 text-white border-cyan-600"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto mt-3 pb-1">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="shrink-0 bg-white border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-black text-slate-700"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="shrink-0 bg-white border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-black text-slate-700"
            >
              <option value="relevance">Relevance</option>
              <option value="experience">Experience</option>
              <option value="fee-low">Fee Low</option>
              <option value="fee-high">Fee High</option>
            </select>

            {localStorage.getItem("selectedCity") && (
              <button
                onClick={clearLocation}
                className="shrink-0 inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-100 rounded-2xl px-3 py-2.5 text-xs font-black"
              >
                <X size={13} />
                Clear
              </button>
            )}
          </div>
        </section>

        <section className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-slate-950">
              Verified Doctors
            </h2>

            {(search || specialization !== "All" || sortBy !== "relevance") && (
              <button
                onClick={clearFilters}
                className="text-xs font-black text-cyan-700"
              >
                Clear Filters
              </button>
            )}
          </div>

          {loading ? (
            <LoadingDoctors />
          ) : filtered.length === 0 ? (
            <EmptyDoctors clearFilters={clearFilters} />
          ) : (
            <div className="space-y-3">
              {filtered.map((doc) => (
                <DoctorCard key={doc.id} doc={doc} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function DoctorCard({ doc }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
      <div className="flex gap-3">
        <div className="relative shrink-0">
          <img
            src={
              doc.profileImage ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                doc.doctorName || "Doctor"
              )}&background=0891b2&color=fff&bold=true`
            }
            alt={doc.doctorName}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-100"
          />

          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white">
            <BadgeCheck size={12} className="text-white" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-black text-slate-950 truncate">
            {doc.doctorName}
          </h3>

          <p className="text-xs text-cyan-700 font-black truncate">
            {doc.specialization || "Specialist"}
          </p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <SmallBadge icon={Award} text={`${doc.experience || 0}+ yrs`} />
            <SmallBadge icon={Clock} text="Available Today" green />
          </div>

          <div className="mt-2 space-y-1">
            <InfoLine
              icon={Building2}
              text={doc.hospital?.hospitalName || "Hospital"}
            />

            <InfoLine
              icon={MapPin}
              text={doc.city || doc.hospital?.city || "Available"}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between mb-3">
         <div className="flex flex-col gap-1">
  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100">
    <Building2 size={11} />
    In-Person ₹{doc.consultationFee || 0}
  </span>

  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-100">
    🎥
    Video-Consult ₹{Math.max(Number(doc.consultationFee || 0) - 100, 0)}
  </span>
</div>
          

          <div className="text-right">
            <p className="text-[11px] text-slate-500 font-bold">
              Status
            </p>

            <p className="text-xs text-emerald-600 font-black">
              Verified
            </p>
          </div>
        </div>

        <Link
          to={`/doctor/${doc.id}`}
          className="w-full flex items-center justify-center gap-2 bg-cyan-600 text-white py-3 rounded-2xl font-black text-sm active:scale-95 transition"
        >
          <CalendarCheck size={17} />
          Book Appointment
        </Link>
      </div>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center">
      <p className="text-base font-black text-slate-950">
        {value}
      </p>

      <p className="text-[10px] text-slate-500 font-bold">
        {label}
      </p>
    </div>
  );
}

function SmallBadge({ icon: Icon, text, green }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black border ${
        green
          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
          : "bg-cyan-50 text-cyan-700 border-cyan-100"
      }`}
    >
      <Icon size={11} />
      {text}
    </span>
  );
}

function InfoLine({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
      <Icon size={13} className="text-cyan-600 shrink-0" />
      <span className="truncate">{text}</span>
    </div>
  );
}

function LoadingDoctors() {
  return (
    <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-slate-100">
      <Loader2 className="text-cyan-600 animate-spin mx-auto" size={34} />

      <h3 className="text-lg font-black text-slate-950 mt-4">
        Searching Doctors
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        Finding verified specialists near you.
      </p>
    </div>
  );
}

function EmptyDoctors({ clearFilters }) {
  return (
    <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-slate-100">
      <Search className="text-cyan-600 mx-auto" size={34} />

      <h3 className="text-lg font-black text-slate-950 mt-4">
        No Doctors Found
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        Try changing city, specialty or removing filters.
      </p>

      <button
        onClick={clearFilters}
        className="mt-5 bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black text-sm"
      >
        Clear Filters
      </button>
    </div>
  );
}