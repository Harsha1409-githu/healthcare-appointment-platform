import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Mail,
  MapPin,
  ShieldCheck,
  XCircle,
  CheckCircle2,
  Search,
  RefreshCw,
  Loader2,
  Filter,
  Phone,
  FileText,
  BadgeCheck,
} from "lucide-react";
import api from "../api/axios";

export default function AdminHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/hospitals");

      setHospitals(res.data || []);
    } catch (error) {
      console.error("Admin hospitals error:", error);
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  const approveHospital = async (id) => {
    try {
      setActionLoading(true);

      await api.patch(`/admin/hospital/${id}/approve`);

      await fetchHospitals();

      alert("Hospital approved successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Approve failed");
    } finally {
      setActionLoading(false);
    }
  };

  const rejectHospital = async (id) => {
    try {
      setActionLoading(true);

      await api.patch(`/admin/hospital/${id}/reject`);

      await fetchHospitals();

      alert("Hospital rejected successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Reject failed");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredHospitals = hospitals.filter((hospital) => {
    const searchText = `
      ${hospital.hospitalName || ""}
      ${hospital.email || ""}
      ${hospital.city || ""}
      ${hospital.state || ""}
      ${hospital.mobile || ""}
      ${hospital.licenseNumber || ""}
    `.toLowerCase();

    const matchesSearch = searchText.includes(search.toLowerCase());

    const hospitalStatus = hospital.status || "PENDING";

    const matchesStatus =
      statusFilter === "ALL" || hospitalStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = useMemo(
    () => ({
      total: hospitals.length,
      approved: hospitals.filter((hospital) => hospital.status === "APPROVED")
        .length,
      pending: hospitals.filter(
        (hospital) => (hospital.status || "PENDING") === "PENDING"
      ).length,
      rejected: hospitals.filter((hospital) => hospital.status === "REJECTED")
        .length,
    }),
    [hospitals]
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
                <ShieldCheck size={17} />
                Admin Approval Center
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                Hospital Management
              </h1>

              <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
                Review registered hospitals, approve verified institutions,
                reject invalid requests and monitor onboarding status.
              </p>
            </div>

            <button
              onClick={fetchHospitals}
              className="inline-flex items-center justify-center gap-2 bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-cyan-700 transition"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </section>

        <section className="grid md:grid-cols-4 gap-5 mb-8">
          <StatCard
            title="Total Hospitals"
            value={stats.total}
            icon={Building2}
            gradient="from-cyan-600 to-blue-500"
          />

          <StatCard
            title="Approved"
            value={stats.approved}
            icon={CheckCircle2}
            gradient="from-emerald-600 to-teal-500"
          />

          <StatCard
            title="Pending"
            value={stats.pending}
            icon={ShieldCheck}
            gradient="from-yellow-500 to-orange-500"
          />

          <StatCard
            title="Rejected"
            value={stats.rejected}
            icon={XCircle}
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
                  Search by hospital, email, city, state, mobile or license.
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
                placeholder="Search hospital..."
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
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </InputBox>
          </div>
        </section>

        <section className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                Registered Hospitals
              </h2>

              <p className="text-slate-500 text-sm">
                Showing {filteredHospitals.length} of {hospitals.length} hospitals
              </p>
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500">
              <Loader2 className="mx-auto animate-spin text-cyan-600 mb-3" />
              Loading hospitals...
            </div>
          ) : filteredHospitals.length === 0 ? (
            <div className="p-12 text-center">
              <Building2
                size={44}
                className="text-slate-300 mx-auto mb-4"
              />

              <h3 className="text-xl font-black text-slate-950">
                No hospitals found
              </h3>

              <p className="text-slate-500 mt-2">
                Registered hospitals will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredHospitals.map((hospital) => (
                <HospitalRow
                  key={hospital.id}
                  hospital={hospital}
                  actionLoading={actionLoading}
                  approveHospital={approveHospital}
                  rejectHospital={rejectHospital}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function HospitalRow({
  hospital,
  actionLoading,
  approveHospital,
  rejectHospital,
}) {
  return (
    <div className="p-6 hover:bg-slate-50 transition">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center overflow-hidden shrink-0">
            {hospital.profileImage ? (
              <img
                src={hospital.profileImage}
                alt={hospital.hospitalName}
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 size={30} className="text-cyan-600" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-black text-slate-950 truncate">
                {hospital.hospitalName || "Hospital"}
              </h3>

              <StatusBadge status={hospital.status} />
            </div>

            <div className="flex flex-wrap gap-3 mt-3">
              <InfoPill icon={Mail}>{hospital.email || "-"}</InfoPill>
              <InfoPill icon={MapPin}>{hospital.city || "-"}</InfoPill>
              <InfoPill icon={Phone}>{hospital.mobile || "-"}</InfoPill>
              <InfoPill icon={FileText}>
                {hospital.licenseNumber || "No License"}
              </InfoPill>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {hospital.status !== "APPROVED" && (
            <button
              disabled={actionLoading}
              onClick={() => approveHospital(hospital.id)}
              className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-2xl font-black hover:bg-emerald-700 disabled:bg-slate-400"
            >
              <CheckCircle2 size={18} />
              Approve
            </button>
          )}

          {hospital.status !== "REJECTED" && (
            <button
              disabled={actionLoading}
              onClick={() => rejectHospital(hospital.id)}
              className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-2xl font-black hover:bg-red-700 disabled:bg-slate-400"
            >
              <XCircle size={18} />
              Reject
            </button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mt-5">
        <InfoItem label="State" value={hospital.state} />
        <InfoItem label="Address" value={hospital.address} />
        <InfoItem
          label="Approved"
          value={hospital.isApproved ? "Yes" : "No"}
        />
        <InfoItem
          label="Status"
          value={hospital.status || "PENDING"}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const currentStatus = status || "PENDING";

  const className =
    currentStatus === "APPROVED"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : currentStatus === "REJECTED"
      ? "bg-red-50 text-red-700 border-red-100"
      : "bg-yellow-50 text-yellow-700 border-yellow-100";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-black border ${className}`}
    >
      {currentStatus}
    </span>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
      <p className="text-xs font-black text-slate-400 uppercase">
        {label}
      </p>

      <p className="font-black text-slate-800 mt-1 truncate">
        {value || "-"}
      </p>
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

function InputBox({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-cyan-500 transition">
      <Icon size={19} className="text-cyan-600 shrink-0" />
      {children}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, gradient }) {
  return (
    <div className="group relative">
      <div
        className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-40 blur transition duration-500`}
      />

      <div className="relative bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 group-hover:-translate-y-1 group-hover:shadow-xl transition duration-500">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-sm mb-5`}
        >
          <Icon className="text-white" size={26} />
        </div>

        <p className="text-slate-500 text-sm">{title}</p>

        <h2 className="text-4xl font-black text-slate-950 mt-1">
          {value}
        </h2>
      </div>
    </div>
  );
}