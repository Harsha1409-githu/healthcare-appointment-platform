import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Search,
  ShieldCheck,
  BadgeCheck,
  Stethoscope,
  X,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const res = await api.get("/hospital");
      setHospitals(res.data || []);
    } catch (error) {
      console.error("Hospital fetch error:", error);
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredHospitals = hospitals.filter((hospital) =>
    `${hospital.hospitalName || ""} ${hospital.city || ""} ${
      hospital.state || ""
    } ${hospital.email || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const stats = useMemo(() => {
    return {
      total: hospitals.length,
      verified: hospitals.filter(
        (h) =>
          h.status === "APPROVED" ||
          h.status === "ACTIVE" ||
          h.isApproved === true
      ).length,
    };
  }, [hospitals]);

  return (
    <main className="min-h-screen bg-[#f4f8fb] px-4 pt-4 pb-24">
      <div className="max-w-md mx-auto">
        <header className="mb-3">
          <div className="inline-flex items-center gap-1.5 text-cyan-700 font-black text-xs">
            <Building2 size={15} />
            HOSPITALS
          </div>

          <h1 className="text-2xl font-black text-slate-950 mt-1">
            Partner Hospitals
          </h1>

          <p className="text-sm text-slate-500 font-semibold">
            Browse verified hospitals connected with TryDoc
          </p>
        </header>

        <section className="bg-cyan-600 rounded-3xl p-4 text-white shadow-sm mb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black text-cyan-100">
                VERIFIED NETWORK
              </p>

              <h2 className="text-xl font-black mt-1">
                Hospitals near you
              </h2>

              <p className="text-sm text-cyan-100 mt-1">
                Find hospitals and book doctors quickly.
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <MiniStat value={stats.total} label="Hospitals" />
            <MiniStat value={stats.verified} label="Verified" />
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3">
            <Search className="text-cyan-600 shrink-0" size={17} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hospital or city"
              className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
            />

            {search && (
              <button onClick={() => setSearch("")}>
                <X size={16} className="text-slate-400" />
              </button>
            )}
          </div>
        </section>

        <section className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-black text-slate-950">
                Available Hospitals
              </h2>

              <p className="text-xs text-slate-500 font-semibold">
                {loading
                  ? "Loading hospitals..."
                  : `${filteredHospitals.length} hospitals found`}
              </p>
            </div>

            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              ● Verified
            </span>
          </div>

          {loading ? (
            <LoadingHospitals />
          ) : filteredHospitals.length === 0 ? (
            <EmptyHospitals />
          ) : (
            <div className="space-y-3">
              {filteredHospitals.map((hospital) => (
                <HospitalCard key={hospital.id} hospital={hospital} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function HospitalCard({ hospital }) {
  const status =
    hospital.status || (hospital.isApproved ? "APPROVED" : "PENDING");

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
      <div className="flex gap-3">
        <div className="relative shrink-0">
          {hospital.profileImage ? (
            <img
              src={hospital.profileImage}
              alt={hospital.hospitalName}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-100"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center border border-cyan-100">
              <Building2 className="text-cyan-600" size={28} />
            </div>
          )}

          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white">
            <BadgeCheck size={12} className="text-white" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-black text-slate-950 truncate">
                {hospital.hospitalName || "Hospital"}
              </h3>

              <p className="text-xs text-cyan-700 font-black mt-1">
                {status}
              </p>
            </div>

            <span className="shrink-0 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
              Verified
            </span>
          </div>

          <div className="mt-2 space-y-1">
            <Info icon={MapPin}>
              {hospital.city || "-"}, {hospital.state || "-"}
            </Info>

            <Info icon={Phone}>
              {hospital.mobile || "Mobile not added"}
            </Info>

            <Info icon={Mail}>
              {hospital.email || "Email not added"}
            </Info>
          </div>
        </div>
      </div>

      {hospital.address && (
        <p className="text-xs text-slate-500 leading-relaxed mt-3 bg-slate-50 rounded-2xl p-3">
          {hospital.address}
        </p>
      )}

      <Link
        to={`/doctors?hospitalId=${hospital.id}&city=${encodeURIComponent(
          hospital.city || ""
        )}`}
        className="mt-3 w-full flex items-center justify-center gap-2 bg-cyan-600 text-white py-3 rounded-2xl font-black text-sm active:scale-95 transition"
      >
        <Stethoscope size={17} />
        View Doctors
      </Link>
    </div>
  );
}

function MiniStat({ value, label }) {
  return (
    <div className="bg-white/15 rounded-2xl p-3 text-center">
      <p className="text-xl font-black">
        {value}
      </p>

      <p className="text-[10px] text-cyan-100 font-black">
        {label}
      </p>
    </div>
  );
}

function Info({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
      <Icon size={13} className="text-cyan-600 shrink-0" />
      <span className="truncate">{children}</span>
    </div>
  );
}

function LoadingHospitals() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
      <Loader2 className="text-cyan-600 animate-spin mx-auto" size={32} />

      <p className="text-sm text-slate-500 font-bold mt-3">
        Loading hospitals...
      </p>
    </div>
  );
}

function EmptyHospitals() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
      <Building2 className="text-slate-300 mx-auto" size={34} />

      <h3 className="text-lg font-black text-slate-950 mt-3">
        No hospitals found
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        Try searching another hospital or city.
      </p>
    </div>
  );
}