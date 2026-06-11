import { useEffect, useState } from "react";
import {
  Activity,
  CalendarCheck,
  CheckCircle2,
  Clock,
  IndianRupee,
  Stethoscope,
  TrendingUp,
  XCircle,
  RefreshCw,
  Award,
  PieChart,
} from "lucide-react";
import api from "../api/axios";

export default function HospitalAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointment/hospital/analytics");
      setAnalytics(res.data);
    } catch (error) {
      console.error("Hospital analytics error:", error);
      alert("Failed to load hospital analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        Loading hospital analytics...
      </div>
    );
  }

  const cards = [
    {
      title: "Total Revenue",
      value: `₹${analytics?.revenue || 0}`,
      desc: "Completed consultations",
      icon: IndianRupee,
      gradient: "from-green-600 to-emerald-500",
    },
    {
      title: "Appointments",
      value: analytics?.totalAppointments || 0,
      desc: "Total bookings",
      icon: CalendarCheck,
      gradient: "from-blue-600 to-cyan-500",
    },
    {
      title: "Today",
      value: analytics?.todayAppointments || 0,
      desc: "Appointments today",
      icon: Clock,
      gradient: "from-orange-500 to-amber-500",
    },
    {
      title: "Completed",
      value: analytics?.completed || 0,
      desc: "Finished consultations",
      icon: CheckCircle2,
      gradient: "from-emerald-600 to-teal-500",
    },
    {
      title: "Booked",
      value: analytics?.booked || 0,
      desc: "Upcoming consultations",
      icon: Activity,
      gradient: "from-purple-600 to-fuchsia-500",
    },
    {
      title: "Cancelled",
      value: analytics?.cancelled || 0,
      desc: "Cancelled bookings",
      icon: XCircle,
      gradient: "from-red-600 to-rose-500",
    },
  ];

  const maxRevenue =
    analytics?.monthlyStats?.length > 0
      ? Math.max(...analytics.monthlyStats.map((m) => m.revenue))
      : 0;

  const maxDoctorRevenue =
    analytics?.doctorPerformance?.length > 0
      ? Math.max(...analytics.doctorPerformance.map((d) => d.revenue))
      : 0;

  const totalSpecializations =
    analytics?.specializationStats?.reduce(
      (sum, item) => sum + item.value,
      0
    ) || 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/40 to-white">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      <div className="absolute top-48 right-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-8 md:p-10 text-white shadow-2xl mb-8">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-5">
                <TrendingUp size={18} className="text-cyan-300" />
                <span className="text-sm font-semibold">
                  Hospital Business Intelligence
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black">
                Revenue & Analytics Dashboard
              </h1>

              <p className="text-blue-100 mt-3 max-w-2xl">
                Track revenue, appointments, doctor performance and
                specialization demand from one powerful dashboard.
              </p>
            </div>

            <button
              onClick={fetchAnalytics}
              className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 px-5 py-3 rounded-2xl font-bold hover:bg-white/20"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div key={card.title} className="group relative">
                <div
                  className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-40 blur transition duration-500`}
                />

                <div className="relative h-full bg-white/95 backdrop-blur-xl rounded-[2rem] p-6 border border-white shadow-xl group-hover:-translate-y-1 transition duration-500">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="text-white" size={27} />
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

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Monthly Revenue Trend
                </h2>
                <p className="text-slate-500 text-sm">
                  Revenue and appointment volume by month
                </p>
              </div>

              <TrendingUp className="text-blue-600" size={28} />
            </div>

            {analytics?.monthlyStats?.length === 0 ? (
              <Empty text="No monthly revenue data available." />
            ) : (
              <div className="space-y-5">
                {analytics.monthlyStats.map((item) => {
                  const width =
                    maxRevenue === 0
                      ? 0
                      : Math.max(8, (item.revenue / maxRevenue) * 100);

                  return (
                    <div key={item.month}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-black text-slate-700">
                          {item.month}
                        </span>
                        <span className="font-bold text-slate-500">
                          ₹{item.revenue} • {item.appointments} appointments
                        </span>
                      </div>

                      <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="relative overflow-hidden bg-slate-950 text-white rounded-[2rem] p-6 shadow-2xl">
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl" />

            <div className="relative">
              <Award className="text-cyan-300" size={36} />

              <h2 className="text-2xl font-black mt-5">
                Top Performing Doctor
              </h2>

              {analytics?.topDoctor ? (
                <>
                  <p className="text-4xl font-black mt-6">
                    {analytics.topDoctor.doctorName}
                  </p>

                  <p className="text-cyan-300 font-bold mt-2">
                    ₹{analytics.topDoctor.revenue} revenue
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <DarkStat
                      label="Appointments"
                      value={analytics.topDoctor.appointments}
                    />
                    <DarkStat
                      label="Completed"
                      value={analytics.topDoctor.completed}
                    />
                  </div>
                </>
              ) : (
                <p className="text-slate-300 mt-5">
                  No doctor performance data yet.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6">
            <div className="flex items-center gap-3 mb-6">
              <Stethoscope className="text-blue-600" size={28} />
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Doctor Performance
                </h2>
                <p className="text-slate-500 text-sm">
                  Revenue and completed consultations by doctor
                </p>
              </div>
            </div>

            {analytics?.doctorPerformance?.length === 0 ? (
              <Empty text="No doctor performance available." />
            ) : (
              <div className="space-y-4">
                {analytics.doctorPerformance.map((doctor) => {
                  const width =
                    maxDoctorRevenue === 0
                      ? 0
                      : Math.max(
                          8,
                          (doctor.revenue / maxDoctorRevenue) * 100
                        );

                  return (
                    <div
                      key={doctor.doctorName}
                      className="bg-slate-50 rounded-2xl p-4"
                    >
                      <div className="flex justify-between gap-3 mb-3">
                        <div>
                          <h3 className="font-black text-slate-900">
                            {doctor.doctorName}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {doctor.appointments} appointments •{" "}
                            {doctor.completed} completed
                          </p>
                        </div>

                        <p className="font-black text-green-600">
                          ₹{doctor.revenue}
                        </p>
                      </div>

                      <div className="h-3 bg-white rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-green-600 to-emerald-400"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6">
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="text-purple-600" size={28} />
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Specialization Demand
                </h2>
                <p className="text-slate-500 text-sm">
                  Appointment distribution by specialization
                </p>
              </div>
            </div>

            {analytics?.specializationStats?.length === 0 ? (
              <Empty text="No specialization data available." />
            ) : (
              <div className="space-y-4">
                {analytics.specializationStats.map((item) => {
                  const percent = totalSpecializations
                    ? Math.round((item.value / totalSpecializations) * 100)
                    : 0;

                  return (
                    <div
                      key={item.name}
                      className="bg-slate-50 rounded-2xl p-4"
                    >
                      <div className="flex justify-between mb-2">
                        <span className="font-black text-slate-800">
                          {item.name}
                        </span>
                        <span className="font-bold text-slate-500">
                          {item.value} bookings
                        </span>
                      </div>

                      <div className="h-3 bg-white rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-400"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <p className="text-xs text-slate-400 mt-2">
                        {percent}% of total appointments
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DarkStat({ label, value }) {
  return (
    <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
      <p className="text-xs text-slate-400 font-bold uppercase">
        {label}
      </p>
      <p className="text-2xl font-black mt-1">{value}</p>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-500">
      {text}
    </div>
  );
}