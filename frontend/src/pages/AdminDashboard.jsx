import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Stethoscope,
  Users,
  CalendarCheck,
  LogOut,
  ShieldCheck,
  BarChart3,
  Loader2,
  RefreshCw,
  ArrowRight,
  Activity,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import api from "../api/axios";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/dashboard");

      setStats(res.data || {});
    } catch (error) {
      console.error("Admin dashboard error:", error);
      setStats({});
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/admin/login");
  };

  const platformScore = useMemo(() => {
    if (!stats) return 0;

    const hospitals = Number(stats.hospitals || 0);
    const doctors = Number(stats.doctors || 0);
    const patients = Number(stats.patients || 0);
    const appointments = Number(stats.appointments || 0);

    return Math.min(
      100,
      hospitals * 8 + doctors * 2 + patients * 0.2 + appointments * 0.1
    ).toFixed(0);
  }, [stats]);

  const cards = [
    {
      icon: Building2,
      title: "Hospitals",
      value: stats?.hospitals || 0,
      desc: "Registered healthcare providers",
      gradient: "from-cyan-600 to-blue-500",
    },
    {
      icon: Stethoscope,
      title: "Doctors",
      value: stats?.doctors || 0,
      desc: "Doctors across hospitals",
      gradient: "from-emerald-600 to-teal-500",
    },
    {
      icon: Users,
      title: "Patients",
      value: stats?.patients || 0,
      desc: "Patient accounts created",
      gradient: "from-purple-600 to-fuchsia-500",
    },
    {
      icon: CalendarCheck,
      title: "Appointments",
      value: stats?.appointments || 0,
      desc: "Total platform bookings",
      gradient: "from-orange-500 to-amber-500",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4fbff] flex items-center justify-center">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 text-center">
          <Loader2
            className="mx-auto text-cyan-600 animate-spin mb-4"
            size={38}
          />

          <p className="text-slate-500 font-semibold">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f4fbff]">
      <div className="w-full max-w-[1500px] mx-auto px-6 py-8">
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                <ShieldCheck size={17} />
                Admin Control Center
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                Admin Dashboard
              </h1>

              <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
                Monitor hospitals, doctors, patients and appointments across
                the MediCare platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={fetchStats}
                className="inline-flex items-center justify-center gap-2 bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-cyan-700 transition"
              >
                <RefreshCw size={18} />
                Refresh
              </button>

              <button
                onClick={logout}
                className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-red-700 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {cards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </section>

        <section className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
                <Activity className="text-cyan-600" size={25} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  Platform Overview
                </h2>

                <p className="text-slate-500">
                  Core MediCare platform activity summary.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <MiniMetric
                icon={Building2}
                label="Hospitals onboarded"
                value={stats?.hospitals || 0}
              />

              <MiniMetric
                icon={Stethoscope}
                label="Doctors managed"
                value={stats?.doctors || 0}
              />

              <MiniMetric
                icon={Users}
                label="Patients registered"
                value={stats?.patients || 0}
              />

              <MiniMetric
                icon={CalendarCheck}
                label="Appointments booked"
                value={stats?.appointments || 0}
              />
            </div>
          </div>

          <div className="relative overflow-hidden bg-slate-950 text-white rounded-[2rem] p-6 shadow-sm">
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl" />

            <div className="relative">
              <TrendingUp className="text-cyan-300" size={36} />

              <h2 className="text-2xl font-black mt-5">
                Platform Health Score
              </h2>

              <p className="text-slate-300 mt-2 text-sm leading-relaxed">
                Based on hospitals, doctors, patients and appointments growth.
              </p>

              <p className="text-5xl font-black mt-7">
                {platformScore}%
              </p>

              <p className="text-cyan-300 font-semibold mt-1">
                Operational strength
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ActionCard
            to="/admin/hospitals"
            icon={Building2}
            title="Manage Hospitals"
            desc="Approve, reject and monitor registered hospitals."
            gradient="from-cyan-600 to-blue-500"
          />

          <ActionCard
            to="/admin/doctors"
            icon={Stethoscope}
            title="Manage Doctors"
            desc="View, activate or deactivate doctors."
            gradient="from-emerald-600 to-teal-500"
          />

          <ActionCard
            to="/admin/analytics"
            icon={BarChart3}
            title="Analytics"
            desc="View revenue, appointments and platform performance."
            gradient="from-purple-600 to-fuchsia-500"
          />
        </section>

        <section className="mt-8 bg-cyan-600 rounded-[2rem] p-6 text-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm font-black mb-3">
              <CheckCircle2 size={16} />
              Admin Insight
            </div>

            <h3 className="text-2xl font-black">
              Keep hospitals approved and doctors active
            </h3>

            <p className="text-cyan-100 mt-2">
              Active hospitals and doctors improve patient booking experience
              and platform growth.
            </p>
          </div>

          <Link
            to="/admin/analytics"
            className="inline-flex items-center justify-center gap-2 bg-white text-cyan-700 px-6 py-4 rounded-2xl font-black hover:bg-cyan-50 transition"
          >
            View Analytics
            <ArrowRight size={18} />
          </Link>
        </section>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, desc, gradient }) {
  return (
    <div className="group relative">
      <div
        className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-40 blur transition duration-500`}
      />

      <div className="relative h-full bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group-hover:-translate-y-1 group-hover:shadow-xl transition duration-500">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-sm mb-5`}
        >
          <Icon className="text-white" size={27} />
        </div>

        <p className="text-slate-500 text-sm">
          {title}
        </p>

        <h2 className="text-4xl font-black mt-1 text-slate-950">
          {value}
        </h2>

        <p className="text-sm text-slate-500 mt-2">
          {desc}
        </p>
      </div>
    </div>
  );
}

function MiniMetric({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center">
          <Icon className="text-cyan-600" size={22} />
        </div>

        <div>
          <p className="text-sm text-slate-500 font-semibold">
            {label}
          </p>

          <p className="text-2xl font-black text-slate-950">
            {value}
          </p>
        </div>
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

      <div className="relative h-full bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group-hover:-translate-y-1 group-hover:shadow-xl transition duration-500">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-sm mb-5`}
        >
          <Icon className="text-white" size={27} />
        </div>

        <h2 className="text-xl font-black text-slate-950">
          {title}
        </h2>

        <p className="text-slate-500 mt-2">
          {desc}
        </p>

        <div className="mt-5 flex items-center gap-2 text-cyan-600 font-black">
          Open
          <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
        </div>
      </div>
    </Link>
  );
}