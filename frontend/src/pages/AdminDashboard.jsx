import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Stethoscope,
  Users,
  CalendarCheck,
  LogOut,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  return (
    <div className="w-full">
      <div className="w-full max-w-[1500px] mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold mb-4">
              <ShieldCheck size={18} />
              Admin Control Center
            </div>

            <h1 className="text-4xl font-black text-slate-900">
              Admin Dashboard
            </h1>

            <p className="text-slate-500 mt-2">
              Platform overview and management
            </p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-2xl font-bold hover:bg-red-700"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            icon={Building2}
            title="Hospitals"
            value={stats?.hospitals || 0}
            gradient="from-blue-600 to-cyan-500"
          />

          <StatCard
            icon={Stethoscope}
            title="Doctors"
            value={stats?.doctors || 0}
            gradient="from-emerald-600 to-teal-500"
          />

          <StatCard
            icon={Users}
            title="Patients"
            value={stats?.patients || 0}
            gradient="from-purple-600 to-fuchsia-500"
          />

          <StatCard
            icon={CalendarCheck}
            title="Appointments"
            value={stats?.appointments || 0}
            gradient="from-orange-500 to-amber-500"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ActionCard
            to="/admin/hospitals"
            icon={Building2}
            title="Manage Hospitals"
            desc="Approve or reject registered hospitals."
            gradient="from-blue-600 to-cyan-500"
          />

          <ActionCard
            to="/admin/doctors"
            icon={Stethoscope}
            title="Manage Doctors"
            desc="Activate or deactivate doctors."
            gradient="from-emerald-600 to-teal-500"
          />

          <ActionCard
            to="/admin/analytics"
            icon={BarChart3}
            title="Analytics"
            desc="View revenue, appointments and platform performance."
            gradient="from-purple-600 to-fuchsia-500"
          />
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

      <div className="relative bg-white p-6 rounded-[2rem] shadow-xl border border-white group-hover:-translate-y-1 transition duration-500">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg mb-5`}
        >
          <Icon className="text-white" size={27} />
        </div>

        <p className="text-slate-500 text-sm">{title}</p>

        <h2 className="text-4xl font-black mt-1 text-slate-950">
          {value}
        </h2>
      </div>
    </div>
  );
}

function ActionCard({ to, icon: Icon, title, desc, gradient }) {
  return (
    <Link to={to} className="group relative">
      <div
        className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-40 blur transition duration-500`}
      />

      <div className="relative h-full bg-white p-6 rounded-[2rem] shadow-xl border border-white group-hover:-translate-y-1 transition duration-500">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg mb-5`}
        >
          <Icon className="text-white" size={27} />
        </div>

        <h2 className="text-xl font-black text-slate-900">
          {title}
        </h2>

        <p className="text-slate-500 mt-2">{desc}</p>
      </div>
    </Link>
  );
}