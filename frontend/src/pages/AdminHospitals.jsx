import { useEffect, useState } from "react";
import {
  Building2,
  Mail,
  MapPin,
  ShieldCheck,
  XCircle,
  CheckCircle2,
  Search,
  RefreshCw,
} from "lucide-react";
import api from "../api/axios";

export default function AdminHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/hospitals");
      setHospitals(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approveHospital = async (id) => {
    try {
      await api.patch(`/admin/hospital/${id}/approve`);
      fetchHospitals();
      alert("Hospital approved successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Approve failed");
    }
  };

  const rejectHospital = async (id) => {
    try {
      await api.patch(`/admin/hospital/${id}/reject`);
      fetchHospitals();
      alert("Hospital rejected successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Reject failed");
    }
  };

  const filteredHospitals = hospitals.filter((hospital) =>
    `${hospital.hospitalName} ${hospital.email} ${hospital.city}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const approvedCount = hospitals.filter(
    (h) => h.status === "APPROVED"
  ).length;

  const pendingCount = hospitals.filter(
    (h) => h.status === "PENDING"
  ).length;

  const rejectedCount = hospitals.filter(
    (h) => h.status === "REJECTED"
  ).length;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/40 to-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-8 md:p-10 text-white shadow-2xl mb-8">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-5">
                <ShieldCheck size={18} className="text-cyan-300" />
                <span className="text-sm font-semibold">
                  Admin Approval Center
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black">
                Hospital Management
              </h1>

              <p className="text-blue-100 mt-3 max-w-2xl">
                Review registered hospitals, approve verified institutions,
                reject invalid requests and monitor onboarding status.
              </p>
            </div>

            <button
              onClick={fetchHospitals}
              className="flex items-center gap-2 bg-white/10 border border-white/20 px-5 py-3 rounded-2xl font-bold hover:bg-white/20"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-5 mb-8">
          <StatCard
            title="Total Hospitals"
            value={hospitals.length}
            icon={Building2}
            gradient="from-blue-600 to-cyan-500"
          />

          <StatCard
            title="Approved"
            value={approvedCount}
            icon={CheckCircle2}
            gradient="from-green-600 to-emerald-500"
          />

          <StatCard
            title="Pending"
            value={pendingCount}
            icon={ShieldCheck}
            gradient="from-yellow-500 to-orange-500"
          />

          <StatCard
            title="Rejected"
            value={rejectedCount}
            icon={XCircle}
            gradient="from-red-600 to-rose-500"
          />
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Registered Hospitals
              </h2>
              <p className="text-slate-500 text-sm">
                {filteredHospitals.length} hospitals found
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 w-full md:w-96">
              <Search size={18} className="text-blue-600" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search hospital..."
                className="w-full bg-transparent outline-none text-slate-800"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading hospitals...
            </div>
          ) : filteredHospitals.length === 0 ? (
            <div className="p-12 text-center">
              <Building2
                size={44}
                className="text-slate-300 mx-auto mb-4"
              />
              <h3 className="text-xl font-black text-slate-900">
                No hospitals found
              </h3>
              <p className="text-slate-500 mt-2">
                Registered hospitals will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredHospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="p-6 hover:bg-slate-50 transition"
                >
                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center overflow-hidden shrink-0">
                        {hospital.profileImage ? (
                          <img
                            src={hospital.profileImage}
                            alt={hospital.hospitalName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2
                            size={30}
                            className="text-blue-600"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-xl font-black text-slate-900 truncate">
                          {hospital.hospitalName}
                        </h3>

                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Mail size={15} />
                            {hospital.email}
                          </span>

                          <span className="flex items-center gap-1">
                            <MapPin size={15} />
                            {hospital.city || "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <StatusBadge status={hospital.status} />

                      {hospital.status !== "APPROVED" && (
                        <button
                          onClick={() => approveHospital(hospital.id)}
                          className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-2xl font-bold hover:bg-green-700"
                        >
                          <CheckCircle2 size={18} />
                          Approve
                        </button>
                      )}

                      {hospital.status !== "REJECTED" && (
                        <button
                          onClick={() => rejectHospital(hospital.id)}
                          className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-2xl font-bold hover:bg-red-700"
                        >
                          <XCircle size={18} />
                          Reject
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 mt-5">
                    <InfoItem label="Mobile" value={hospital.mobile} />
                    <InfoItem label="State" value={hospital.state} />
                    <InfoItem
                      label="License"
                      value={hospital.licenseNumber || "-"}
                    />
                    <InfoItem
                      label="Approved"
                      value={hospital.isApproved ? "Yes" : "No"}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const currentStatus = status || "PENDING";

  const className =
    currentStatus === "APPROVED"
      ? "bg-green-100 text-green-700"
      : currentStatus === "REJECTED"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <span
      className={`px-4 py-2 rounded-full text-sm font-black ${className}`}
    >
      {currentStatus}
    </span>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-4">
      <p className="text-xs font-bold text-slate-400 uppercase">
        {label}
      </p>
      <p className="font-black text-slate-800 mt-1 truncate">
        {value || "-"}
      </p>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, gradient }) {
  return (
    <div className="relative bg-white rounded-[2rem] p-6 shadow-xl border border-white">
      <div
        className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg mb-5`}
      >
        <Icon className="text-white" size={26} />
      </div>

      <p className="text-slate-500 text-sm">{title}</p>

      <h2 className="text-4xl font-black text-slate-950 mt-1">
        {value}
      </h2>
    </div>
  );
}