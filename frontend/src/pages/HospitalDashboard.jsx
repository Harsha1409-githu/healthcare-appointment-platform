import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Stethoscope,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Star,
  Activity,
  ArrowRight,
  Building2,
  Clock,
  UsersRound,
  TrendingUp,
  LogOut,
} from "lucide-react";
import api from "../api/axios";

export default function HospitalDashboard() {
  const navigate = useNavigate();

  const hospital = JSON.parse(
    localStorage.getItem("hospitalUser") ||
      localStorage.getItem("user") ||
      "null"
  );

  const [stats, setStats] = useState({
    doctors: 0,
    activeDoctors: 0,
    appointments: 0,
    completed: 0,
    cancelled: 0,
    pending: 0,
    reviews: 0,
    avgRating: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const logout = () => {
    localStorage.removeItem("hospitalToken");
    localStorage.removeItem("hospitalUser");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/hospital/login");
    window.location.reload();
  };

  const loadDashboard = async () => {
    try {
      const [doctorRes, appointmentRes] = await Promise.all([
        api.get("/doctor"),
        api.get("/appointment"),
      ]);

      const allDoctors = doctorRes.data || [];
      const allAppointments = appointmentRes.data || [];

      const hospitalDoctors = hospital?.id
        ? allDoctors.filter(
            (d) => d.hospital?.id === hospital.id
          )
        : allDoctors;

      const doctorIds = hospitalDoctors.map((d) => d.id);

      const hospitalAppointments = allAppointments.filter((a) =>
        doctorIds.includes(a.doctor?.id)
      );

      const completed = hospitalAppointments.filter(
        (a) => a.status === "COMPLETED"
      ).length;

      const cancelled = hospitalAppointments.filter(
        (a) => a.status === "CANCELLED"
      ).length;

      const pending = hospitalAppointments.filter(
        (a) => a.status === "BOOKED"
      ).length;

      let totalReviews = 0;
      let totalRating = 0;

      for (const doctor of hospitalDoctors) {
        try {
          const summary = await api.get(
            `/review/doctor/${doctor.id}/summary`
          );

          totalReviews += summary.data.totalReviews || 0;

          totalRating +=
            (summary.data.averageRating || 0) *
            (summary.data.totalReviews || 0);
        } catch (err) {
          console.log(err);
        }
      }

      const avgRating =
        totalReviews === 0
          ? 0
          : (totalRating / totalReviews).toFixed(1);

      setStats({
        doctors: hospitalDoctors.length,
        activeDoctors: hospitalDoctors.filter((d) => d.isActive)
          .length,
        appointments: hospitalAppointments.length,
        completed,
        cancelled,
        pending,
        reviews: totalReviews,
        avgRating,
      });
    } catch (error) {
      console.error("Hospital dashboard error:", error);
    }
  };

  const completedPercent = stats.appointments
    ? Math.round((stats.completed / stats.appointments) * 100)
    : 0;

  const cancelledPercent = stats.appointments
    ? Math.round((stats.cancelled / stats.appointments) * 100)
    : 0;

  const pendingPercent = stats.appointments
    ? Math.round((stats.pending / stats.appointments) * 100)
    : 0;

  const cards = [
    {
      title: "Doctors",
      value: stats.doctors,
      desc: `${stats.activeDoctors} active doctors`,
      icon: Stethoscope,
      gradient: "from-blue-600 to-cyan-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Appointments",
      value: stats.appointments,
      desc: "Total hospital bookings",
      icon: CalendarCheck,
      gradient: "from-purple-600 to-fuchsia-500",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    {
      title: "Completed",
      value: stats.completed,
      desc: `${completedPercent}% completion rate`,
      icon: CheckCircle2,
      gradient: "from-emerald-600 to-teal-500",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      title: "Pending",
      value: stats.pending,
      desc: `${pendingPercent}% awaiting consultation`,
      icon: Clock,
      gradient: "from-orange-500 to-amber-500",
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
    {
      title: "Cancelled",
      value: stats.cancelled,
      desc: `${cancelledPercent}% cancelled bookings`,
      icon: XCircle,
      gradient: "from-red-600 to-rose-500",
      bg: "bg-red-50",
      text: "text-red-600",
    },
    {
      title: "Avg Rating",
      value: stats.avgRating ? `⭐ ${stats.avgRating}` : "0",
      desc: `${stats.reviews} patient reviews`,
      icon: Star,
      gradient: "from-yellow-500 to-orange-500",
      bg: "bg-yellow-50",
      text: "text-yellow-600",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/40 to-white">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      <div className="absolute top-40 right-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-10">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-8 md:p-10 text-white shadow-2xl mb-8">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur mb-5">
                <Building2 size={18} className="text-cyan-300" />
                <span className="text-sm font-semibold">
                  Hospital Command Center
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                {hospital?.hospitalName || "Hospital Dashboard"}
              </h1>

              <p className="text-blue-100 mt-3 max-w-2xl">
                Manage doctors, appointments, availability, patient reviews and
                hospital performance from one premium dashboard.
              </p>
            </div>

            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-2xl font-bold shadow-lg shadow-red-900/20 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div key={card.title} className="group relative">
                <div
                  className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-40 blur transition duration-500`}
                />

                <div className="relative h-full bg-white/95 backdrop-blur-xl rounded-[2rem] p-6 border border-white shadow-xl group-hover:-translate-y-1 transition duration-500">
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="text-white" size={27} />
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full ${card.bg} ${card.text} text-xs font-bold`}
                    >
                      Live
                    </span>
                  </div>

                  <p className="text-slate-500 text-sm mt-5">
                    {card.title}
                  </p>

                  <h2 className="text-4xl font-black mt-1 text-slate-950">
                    {card.value}
                  </h2>

                  <p className="text-sm text-slate-500 mt-2">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Overview */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
                <Activity className="text-white" size={22} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Appointment Overview
                </h2>
                <p className="text-sm text-slate-500">
                  Current booking performance
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <ProgressRow
                label="Completed"
                value={completedPercent}
                color="from-emerald-500 to-teal-500"
              />

              <ProgressRow
                label="Pending"
                value={pendingPercent}
                color="from-orange-500 to-amber-500"
              />

              <ProgressRow
                label="Cancelled"
                value={cancelledPercent}
                color="from-red-500 to-rose-500"
              />
            </div>
          </div>

          <div className="relative overflow-hidden bg-slate-950 text-white rounded-[2rem] p-6 shadow-2xl">
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-cyan-400/20 rounded-full blur-3xl" />

            <div className="relative">
              <TrendingUp className="text-cyan-300" size={34} />

              <h2 className="text-2xl font-black mt-5">
                Hospital Health Score
              </h2>

              <p className="text-slate-300 mt-2 text-sm">
                Based on completion rate, active doctors and patient reviews.
              </p>

              <div className="mt-7">
                <p className="text-5xl font-black">
                  {Math.min(
                    100,
                    completedPercent +
                      Math.min(stats.activeDoctors * 4, 30)
                  )}
                  %
                </p>

                <p className="text-cyan-300 font-semibold mt-1">
                  Operational strength
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <ActionCard
            to="/hospital/doctors"
            icon={UsersRound}
            title="Manage Doctors"
            desc="Add, deactivate and manage hospital doctors."
            gradient="from-blue-600 to-cyan-500"
          />

          <ActionCard
            to="/hospital/availability"
            icon={Clock}
            title="Manage Availability"
            desc="Configure doctor schedules and available timings."
            gradient="from-emerald-600 to-teal-500"
          />

          <ActionCard
            to="/hospital/appointments"
            icon={CalendarCheck}
            title="Appointments"
            desc="Monitor bookings and consultation status."
            gradient="from-purple-600 to-fuchsia-500"
          />
        </div>
      </div>
    </div>
  );
}

function ProgressRow({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-bold mb-2">
        <span className="text-slate-700">{label}</span>
        <span className="text-slate-500">{value}%</span>
      </div>

      <div className="h-4 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
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

      <div className="relative h-full bg-white rounded-[2rem] shadow-xl border border-white p-6 group-hover:-translate-y-1 transition duration-500">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg mb-5`}
        >
          <Icon className="text-white" size={26} />
        </div>

        <h2 className="text-xl font-black text-slate-900">
          {title}
        </h2>

        <p className="text-slate-500 mt-2">{desc}</p>

        <div className="mt-5 flex items-center gap-2 text-blue-600 font-bold">
          Open
          <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
        </div>
      </div>
    </Link>
  );
}