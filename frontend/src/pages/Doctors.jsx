import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  MapPin,
  Stethoscope,
  IndianRupee,
  BadgeCheck,
  CalendarCheck,
  ArrowRight,
  SlidersHorizontal,
  Award,
  Building2,
  X,
  Video,
  Clock,
  ShieldCheck,
  Star,
  HeartPulse,
  Filter,
  Loader2,
} from "lucide-react";

import api from "../api/axios";

function useDebounce(value, delay = 500) {
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

  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState(urlSpecialization);
  const [experienceFilter, setExperienceFilter] = useState("All");
  const [feeFilter, setFeeFilter] = useState("All");
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

        setDoctors(data);
        setFiltered(activeDoctors);
      })
      .catch((err) => {
        console.error("API ERROR:", err);
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
  ...new Set([
    localStorage.getItem("selectedCity"),
    "Chennai",
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
  ].filter(Boolean)),
];

  useEffect(() => {
    let result = [...doctors].filter((d) => d.isActive);

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

    if (experienceFilter !== "All") {
      result = result.filter((d) => {
        const exp = Number(d.experience || 0);

        if (experienceFilter === "0-5") return exp <= 5;
        if (experienceFilter === "5-10") return exp > 5 && exp <= 10;
        if (experienceFilter === "10+") return exp > 10;

        return true;
      });
    }

    if (feeFilter !== "All") {
      result = result.filter((d) => {
        const fee = Number(d.consultationFee || 0);

        if (feeFilter === "below-500") return fee < 500;
        if (feeFilter === "500-1000") return fee >= 500 && fee <= 1000;
        if (feeFilter === "above-1000") return fee > 1000;

        return true;
      });
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
  }, [
    debouncedSearch,
    specialization,
    doctors,
    experienceFilter,
    feeFilter,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearch("");
    setSpecialization("All");
    setExperienceFilter("All");
    setFeeFilter("All");
    setSortBy("relevance");
  };

  const hasFilters =
    search ||
    specialization !== "All" ||
    experienceFilter !== "All" ||
    feeFilter !== "All" ||
    sortBy !== "relevance";

  const activeDoctorsCount = doctors.filter((d) => d.isActive).length;

  return (
    <div className="bg-[#f4fbff] min-h-screen">
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-[1450px] mx-auto px-6 py-10">
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-5">
                <Stethoscope size={17} />
                VERIFIED DOCTORS
              </div>

              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-950">
                Find Doctors in{" "}
                <span className="text-cyan-600">{city}</span>
              </h1>

              {localStorage.getItem("selectedCity") && (
  <div className="mt-4">
    <button
      onClick={() => {
        localStorage.removeItem("selectedCity");
        setCity("Chennai");
      }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 font-black"
    >
      <X size={16} />
      Clear Location
    </button>
  </div>
)}

              <p className="mt-4 text-slate-500 text-lg max-w-2xl leading-relaxed">
                Search verified doctors by specialty, city, hospital,
                experience and consultation fee.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <TopStat
                icon={ShieldCheck}
                value={activeDoctorsCount}
                label="Verified"
              />

              <TopStat
                icon={Video}
                value="Online"
                label="Consult"
              />

              <TopStat
                icon={CalendarCheck}
                value="Today"
                label="Available"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1450px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[330px_1fr] gap-8">
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center">
                    <SlidersHorizontal className="text-cyan-600" size={21} />
                  </div>

                  <div>
                    <h2 className="font-black text-xl text-slate-950">
                      Filters
                    </h2>

                    <p className="text-sm text-slate-500">
                      Refine doctors
                    </p>
                  </div>
                </div>

                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm font-black text-cyan-600 hover:text-cyan-700"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-5">
                <FilterField label="Search">
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-cyan-500 transition">
                    <Search className="text-slate-400" size={20} />

                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Doctor, specialty, hospital"
                      className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </FilterField>

                <FilterField label="City">
                  <SelectBox
                    icon={MapPin}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    options={cities.map((c) => [c, c])}
                  />
                </FilterField>

                <FilterField label="Specialization">
                  <SelectBox
                    icon={Stethoscope}
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    options={specs.map((s) => [s, s])}
                  />
                </FilterField>

                <FilterField label="Experience">
                  <SelectBox
                    icon={Award}
                    value={experienceFilter}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                    options={[
                      ["All", "All Experience"],
                      ["0-5", "0 - 5 Years"],
                      ["5-10", "5 - 10 Years"],
                      ["10+", "10+ Years"],
                    ]}
                  />
                </FilterField>

                <FilterField label="Consultation Fee">
                  <SelectBox
                    icon={IndianRupee}
                    value={feeFilter}
                    onChange={(e) => setFeeFilter(e.target.value)}
                    options={[
                      ["All", "All Fees"],
                      ["below-500", "Below ₹500"],
                      ["500-1000", "₹500 - ₹1000"],
                      ["above-1000", "Above ₹1000"],
                    ]}
                  />
                </FilterField>
              </div>

              <div className="mt-6 bg-cyan-50 border border-cyan-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-cyan-700 font-black">
                  <HeartPulse size={18} />
                  Need help choosing?
                </div>

                <p className="text-sm text-cyan-700 mt-2 leading-relaxed">
                  Use AI symptom checker to find the right specialist.
                </p>

                <Link
                  to="/symptom-checker"
                  className="inline-flex items-center gap-2 mt-3 text-cyan-800 font-black"
                >
                  Open checker
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </aside>

          <main>
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 mb-6">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    {loading ? "Searching Doctors..." : `${filtered.length} Doctors Found`}
                  </h2>

                  <p className="text-slate-500 mt-1">
                    Showing active doctors matching your search
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none text-slate-800 font-semibold"
                  >
                    <option value="relevance">Sort: Relevance</option>
                    <option value="experience">Experience: High to Low</option>
                    <option value="fee-low">Fee: Low to High</option>
                    <option value="fee-high">Fee: High to Low</option>
                  </select>
                </div>
              </div>

              {hasFilters && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {city && <Chip label={city} />}

                  {specialization !== "All" && (
                    <Chip
                      label={specialization}
                      onRemove={() => setSpecialization("All")}
                    />
                  )}

                  {experienceFilter !== "All" && (
                    <Chip
                      label={`Experience: ${experienceFilter}`}
                      onRemove={() => setExperienceFilter("All")}
                    />
                  )}

                  {feeFilter !== "All" && (
                    <Chip
                      label={
                        feeFilter === "below-500"
                          ? "Below ₹500"
                          : feeFilter === "500-1000"
                          ? "₹500 - ₹1000"
                          : "Above ₹1000"
                      }
                      onRemove={() => setFeeFilter("All")}
                    />
                  )}

                  {search && (
                    <Chip
                      label={`Search: ${search}`}
                      onRemove={() => setSearch("")}
                    />
                  )}

                  {sortBy !== "relevance" && (
                    <Chip
                      label={
                        sortBy === "experience"
                          ? "Sort: Experience"
                          : sortBy === "fee-low"
                          ? "Sort: Fee Low"
                          : "Sort: Fee High"
                      }
                      onRemove={() => setSortBy("relevance")}
                    />
                  )}
                </div>
              )}
            </div>

            {loading ? (
              <LoadingDoctors />
            ) : filtered.length === 0 ? (
              <EmptyDoctors clearFilters={clearFilters} />
            ) : (
              <div className="space-y-5">
                {filtered.map((doc) => (
                  <DoctorCard key={doc.id} doc={doc} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function FilterField({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-black text-slate-700 mb-2">
        {label}
      </label>

      {children}
    </div>
  );
}

function SelectBox({ icon: Icon, value, onChange, options }) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
      <Icon className="text-cyan-600" size={20} />

      <select
        value={value}
        onChange={onChange}
        className="w-full bg-transparent outline-none text-slate-800 font-semibold"
      >
        {options.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm border border-cyan-100">
      {label}

      {onRemove && (
        <button onClick={onRemove}>
          <X size={14} />
        </button>
      )}
    </span>
  );
}

function DoctorCard({ doc }) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition overflow-hidden">
      <div className="p-6">
        <div className="grid xl:grid-cols-[1fr_250px] gap-6">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="relative shrink-0">
              <img
                src={
                  doc.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    doc.doctorName || "Doctor"
                  )}&background=0891b2&color=fff&bold=true`
                }
                alt={doc.doctorName}
                className="w-28 h-28 rounded-3xl border border-slate-100 shadow-sm object-cover"
              />

              <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-white">
                <BadgeCheck size={17} className="text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs border border-emerald-100">
                  <BadgeCheck size={14} />
                  Verified Doctor
                </div>

                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 font-black text-xs border border-yellow-100">
                  <Star size={14} className="fill-yellow-500 text-yellow-500" />
                  Trusted
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-950">
                {doc.doctorName}
              </h3>

              <p className="text-cyan-700 font-black mt-1">
                {doc.specialization || "Specialist"}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <SmallBadge icon={Award} text={`${doc.experience || 0}+ Years`} />
                <SmallBadge icon={Video} text="Video Consult" />
                <SmallBadge icon={Clock} text="Available Today" green />
              </div>

              <div className="mt-5 grid sm:grid-cols-2 gap-3">
                <InfoLine
                  icon={Building2}
                  text={doc.hospital?.hospitalName || "Hospital Not Available"}
                />

                <InfoLine
                  icon={MapPin}
                  text={doc.city || doc.hospital?.city || "Available"}
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
                  Book Appointment
                  <ArrowRight size={18} />
                </button>
              </Link>

              <Link to={`/doctor/${doc.id}`}>
                <button className="w-full border border-cyan-600 text-cyan-700 py-4 rounded-2xl font-black hover:bg-cyan-50 transition">
                  View Profile
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
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

function InfoLine({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3 text-slate-600 bg-slate-50 border border-slate-100 rounded-2xl px-3 py-2 min-w-0">
      <Icon size={18} className="text-cyan-600 shrink-0" />
      <span className="truncate">{text}</span>
    </div>
  );
}

function TopStat({ icon: Icon, value, label }) {
  return (
    <div className="min-w-[105px] bg-slate-50 rounded-2xl border border-slate-100 p-3">
      <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center mb-2">
        <Icon className="text-cyan-600" size={18} />
      </div>

      <p className="text-lg font-black text-slate-950">
        {value}
      </p>

      <p className="text-xs text-slate-500 font-bold">
        {label}
      </p>
    </div>
  );
}

function LoadingDoctors() {
  return (
    <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-slate-100">
      <div className="w-20 h-20 rounded-3xl bg-cyan-50 flex items-center justify-center mx-auto mb-5">
        <Loader2 className="text-cyan-600 animate-spin" size={34} />
      </div>

      <h3 className="text-2xl font-black text-slate-950">
        Searching Doctors
      </h3>

      <p className="text-slate-500 mt-2">
        Please wait while we find verified specialists.
      </p>
    </div>
  );
}

function EmptyDoctors({ clearFilters }) {
  return (
    <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-slate-100">
      <div className="w-20 h-20 rounded-3xl bg-cyan-50 flex items-center justify-center mx-auto mb-5">
        <Search className="text-cyan-600" size={34} />
      </div>

      <h3 className="text-2xl font-black text-slate-950">
        No Doctors Found
      </h3>

      <p className="text-slate-500 mt-2">
        Try changing city, specialty or removing filters.
      </p>

      <button
        onClick={clearFilters}
        className="mt-6 bg-cyan-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-cyan-700 transition"
      >
        Clear Filters
      </button>
    </div>
  );
}