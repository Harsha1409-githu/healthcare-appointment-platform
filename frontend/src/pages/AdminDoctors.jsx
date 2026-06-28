import { useEffect, useMemo, useState } from "react";
import {
  Stethoscope,
  Search,
  Filter,
  ShieldCheck,
  XCircle,
  CheckCircle2,
  Building2,
  Mail,
  Phone,
  IndianRupee,
  GraduationCap,
  Loader2,
  RefreshCw,
  UserRound,
} from "lucide-react";
import api from "../api/axios";

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/doctors");

      setDoctors(res.data || []);
    } catch (error) {
      console.error("Admin doctors error:", error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const activateDoctor = async (id) => {
    try {
      setActionLoading(true);

      await api.patch(`/admin/doctor/${id}/activate`);

      fetchDoctors();
    } catch (error) {
      alert(error.response?.data?.message || "Activate failed");
    } finally {
      setActionLoading(false);
    }
  };

  const deactivateDoctor = async (id) => {
    try {
      setActionLoading(true);

      await api.patch(`/admin/doctor/${id}/deactivate`);

      fetchDoctors();
    } catch (error) {
      alert(error.response?.data?.message || "Deactivate failed");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const searchText = `
      ${doctor.doctorName || ""}
      ${doctor.specialization || ""}
      ${doctor.email || ""}
      ${doctor.mobile || ""}
      ${doctor.hospital?.hospitalName || ""}
    `.toLowerCase();

    const matchesSearch = searchText.includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && doctor.isActive) ||
      (statusFilter === "INACTIVE" && !doctor.isActive);

    return matchesSearch && matchesStatus;
  });

  const stats = useMemo(
    () => ({
      total: doctors.length,
      active: doctors.filter((doctor) => doctor.isActive).length,
      inactive: doctors.filter((doctor) => !doctor.isActive).length,
    }),
    [doctors]
  );

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
  };

  return (
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6 py-8">
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                <Stethoscope size={17} />
                Doctor Control Center
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                Doctor Management
              </h1>

              <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
                View doctors, check hospital mapping, and activate or
                deactivate doctor profiles across TryDoc.
              </p>
            </div>

            <button
              onClick={fetchDoctors}
              className="inline-flex items-center justify-center gap-2 bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-cyan-700 transition"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Stethoscope}
            title="Total Doctors"
            value={stats.total}
            gradient="from-cyan-600 to-blue-500"
          />

          <StatCard
            icon={CheckCircle2}
            title="Active"
            value={stats.active}
            gradient="from-emerald-600 to-teal-500"
          />

          <StatCard
            icon={XCircle}
            title="Inactive"
            value={stats.inactive}
            gradient="from-red-600 to-rose-500"
          />
        </section>

        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center">
                <Filter className="text-cyan-600" size={22} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-950">
                  Search & Filters
                </h2>

                <p className="text-sm text-slate-500">
                  Search by doctor, specialization, hospital, email or mobile.
                </p>
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 font-black hover:bg-slate-200 transition"
            >
              Clear Filters
            </button>
          </div>

          <div className="grid md:grid-cols-[1fr_260px] gap-4">
            <InputBox icon={Search}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctors..."
                className="w-full bg-transparent outline-none"
              />
            </InputBox>

            <InputBox icon={ShieldCheck}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-transparent outline-none font-bold text-slate-700"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </InputBox>
          </div>
        </section>

        {loading ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10 text-center text-slate-500">
            <Loader2 className="mx-auto animate-spin text-cyan-600 mb-3" />
            Loading doctors...
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-12 text-center">
            <div className="w-20 h-20 rounded-3xl bg-cyan-50 flex items-center justify-center mx-auto mb-5">
              <Stethoscope className="text-cyan-600" size={36} />
            </div>

            <h3 className="text-2xl font-black text-slate-950">
              No doctors found
            </h3>

            <p className="text-slate-500 mt-2">
              Try changing the search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                actionLoading={actionLoading}
                activateDoctor={activateDoctor}
                deactivateDoctor={deactivateDoctor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DoctorCard({
  doctor,
  actionLoading,
  activateDoctor,
  deactivateDoctor,
}) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 opacity-0 group-hover:opacity-30 blur transition duration-500" />

      <div className="relative bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div className="flex gap-4 min-w-0">
              <img
                src={
                  doctor.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    doctor.doctorName || "Doctor"
                  )}&background=0891b2&color=fff&bold=true`
                }
                alt={doctor.doctorName}
                className="w-20 h-20 rounded-3xl object-cover border border-slate-100 shrink-0"
              />

              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-black text-slate-950">
                    {doctor.doctorName}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black border ${
                      doctor.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-red-50 text-red-700 border-red-100"
                    }`}
                  >
                    {doctor.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>

                <p className="text-cyan-600 font-black mt-1">
                  {doctor.specialization || "Specialist"}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  <InfoPill icon={Building2}>
                    {doctor.hospital?.hospitalName || "No Hospital"}
                  </InfoPill>

                  <InfoPill icon={Mail}>
                    {doctor.email || "No Email"}
                  </InfoPill>

                  <InfoPill icon={Phone}>
                    {doctor.mobile || "No Mobile"}
                  </InfoPill>

                  <InfoPill icon={GraduationCap}>
                    {doctor.qualification || "Qualification not added"}
                  </InfoPill>

                  <InfoPill icon={IndianRupee}>
                    ₹{doctor.consultationFee || 0}
                  </InfoPill>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              {doctor.isActive ? (
                <button
                  disabled={actionLoading}
                  onClick={() => deactivateDoctor(doctor.id)}
                  className="w-full xl:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-2xl font-black transition disabled:bg-slate-400"
                >
                  <XCircle size={18} />
                  Deactivate
                </button>
              ) : (
                <button
                  disabled={actionLoading}
                  onClick={() => activateDoctor(doctor.id)}
                  className="w-full xl:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-black transition disabled:bg-slate-400"
                >
                  <CheckCircle2 size={18} />
                  Activate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, gradient }) {
  return (
    <div className="group relative">
      <div
        className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-40 blur transition duration-500`}
      />

      <div className="relative bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 group-hover:-translate-y-1 group-hover:shadow-xl transition duration-500">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-sm mb-5`}
        >
          <Icon className="text-white" size={27} />
        </div>

        <p className="text-slate-500 text-sm">
          {title}
        </p>

        <h2 className="text-4xl font-black text-slate-950 mt-1">
          {value}
        </h2>
      </div>
    </div>
  );
}

function InputBox({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-cyan-500 transition">
      <Icon size={19} className="text-cyan-600 shrink-0" />
      {children}
    </div>
  );
}

function InfoPill({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
      <Icon size={14} />
      {children}
    </span>
  );
}