import { useEffect, useMemo, useState } from "react";
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
  Loader2,
  BarChart3,
  ShieldCheck,
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

      setAnalytics(res.data || {});
    } catch (error) {
      console.error("Hospital analytics error:", error);
      alert("Failed to load hospital analytics");
      setAnalytics({});
    } finally {
      setLoading(false);
    }
  };

  const cards = useMemo(
    () => [
      {
        title: "Total Revenue",
        value: `₹${analytics?.revenue || 0}`,
        desc: "Completed consultations",
        icon: IndianRupee,
        gradient: "from-emerald-600 to-teal-500",
      },
      {
        title: "Appointments",
        value: analytics?.totalAppointments || 0,
        desc: "Total bookings",
        icon: CalendarCheck,
        gradient: "from-cyan-600 to-blue-500",
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
        gradient: "from-green-600 to-emerald-500",
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
    ],
    [analytics]
  );

  const monthlyStats = analytics?.monthlyStats || [];
  const doctorPerformance = analytics?.doctorPerformance || [];
  const specializationStats = analytics?.specializationStats || [];

  const maxRevenue =
    monthlyStats.length > 0
      ? Math.max(...monthlyStats.map((item) => Number(item.revenue || 0)))
      : 0;

  const maxDoctorRevenue =
    doctorPerformance.length > 0
      ? Math.max(...doctorPerformance.map((doctor) => Number(doctor.revenue || 0)))
      : 0;

  const totalSpecializations =
    specializationStats.reduce(
      (sum, item) => sum + Number(item.value || 0),
      0
    ) || 0;

  const completedPercent = analytics?.totalAppointments
    ? Math.round(
        (Number(analytics.completed || 0) /
          Number(analytics.totalAppointments || 1)) *
          100
      )
    : 0;

  const bookedPercent = analytics?.totalAppointments
    ? Math.round(
        (Number(analytics.booked || 0) /
          Number(analytics.totalAppointments || 1)) *
          100
      )
    : 0;

  const cancelledPercent = analytics?.totalAppointments
    ? Math.round(
        (Number(analytics.cancelled || 0) /
          Number(analytics.totalAppointments || 1)) *
          100
      )
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4fbff] flex items-center justify-center">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 text-center">
          <Loader2 className="mx-auto text-cyan-600 animate-spin mb-4" size={38} />

          <p className="text-slate-500 font-semibold">
            Loading hospital analytics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6 py-8">
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                <TrendingUp size={17} />
                Hospital Business Intelligence
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                Revenue & Analytics Dashboard
              </h1>

              <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
                Track revenue, appointments, doctor performance and
                specialization demand from one powerful dashboard.
              </p>
            </div>

            <button
              onClick={fetchAnalytics}
              className="inline-flex items-center justify-center gap-2 bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-cyan-700 transition"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </section>

        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {cards.map((card) => (
            <StatCard key={card.title} card={card} />
          ))}
        </section>

        <section className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
            <SectionTitle
              icon={BarChart3}
              title="Monthly Revenue Trend"
              desc="Revenue and appointment volume by month"
            />

            {monthlyStats.length === 0 ? (
              <Empty text="No monthly revenue data available." />
            ) : (
              <div className="space-y-5 mt-6">
                {monthlyStats.map((item) => {
                  const revenue = Number(item.revenue || 0);

                  const width =
                    maxRevenue === 0
                      ? 0
                      : Math.max(8, (revenue / maxRevenue) * 100);

                  return (
                    <div key={item.month}>
                      <div className="flex justify-between text-sm mb-2 gap-4">
                        <span className="font-black text-slate-700">
                          {item.month}
                        </span>

                        <span className="font-bold text-slate-500 text-right">
                          ₹{revenue} • {item.appointments || 0} appointments
                        </span>
                      </div>

                      <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-blue-500 transition-all duration-700"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="relative overflow-hidden bg-slate-950 text-white rounded-[2rem] p-6 shadow-sm">
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl" />

            <div className="relative">
              <Award className="text-cyan-300" size={36} />

              <h2 className="text-2xl font-black mt-5">
                Top Performing Doctor
              </h2>

              {analytics?.topDoctor ? (
                <>
                  <p className="text-3xl font-black mt-6">
                    {analytics.topDoctor.doctorName}
                  </p>

                  <p className="text-cyan-300 font-bold mt-2">
                    ₹{analytics.topDoctor.revenue || 0} revenue
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <DarkStat
                      label="Appointments"
                      value={analytics.topDoctor.appointments || 0}
                    />

                    <DarkStat
                      label="Completed"
                      value={analytics.topDoctor.completed || 0}
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
        </section>

        <section className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
            <SectionTitle
              icon={ShieldCheck}
              title="Appointment Health"
              desc="Status distribution"
            />

            <div className="space-y-5 mt-6">
              <ProgressRow
                label="Completed"
                value={completedPercent}
                color="from-emerald-500 to-teal-500"
              />

              <ProgressRow
                label="Booked"
                value={bookedPercent}
                color="from-purple-600 to-fuchsia-500"
              />

              <ProgressRow
                label="Cancelled"
                value={cancelledPercent}
                color="from-red-500 to-rose-500"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
            <SectionTitle
              icon={Stethoscope}
              title="Doctor Performance"
              desc="Revenue and completed consultations by doctor"
            />

            {doctorPerformance.length === 0 ? (
              <Empty text="No doctor performance available." />
            ) : (
              <div className="space-y-4 mt-6">
                {doctorPerformance.map((doctor) => {
                  const revenue = Number(doctor.revenue || 0);

                  const width =
                    maxDoctorRevenue === 0
                      ? 0
                      : Math.max(8, (revenue / maxDoctorRevenue) * 100);

                  return (
                    <div
                      key={doctor.doctorName}
                      className="bg-slate-50 rounded-2xl p-4 border border-slate-100"
                    >
                      <div className="flex justify-between gap-3 mb-3">
                        <div>
                          <h3 className="font-black text-slate-950">
                            {doctor.doctorName}
                          </h3>

                          <p className="text-sm text-slate-500">
                            {doctor.appointments || 0} appointments •{" "}
                            {doctor.completed || 0} completed
                          </p>
                        </div>

                        <p className="font-black text-emerald-600">
                          ₹{revenue}
                        </p>
                      </div>

                      <div className="h-3 bg-white rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-700"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
          <SectionTitle
            icon={PieChart}
            title="Specialization Demand"
            desc="Appointment distribution by specialization"
          />

          {specializationStats.length === 0 ? (
            <Empty text="No specialization data available." />
          ) : (
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              {specializationStats.map((item) => {
                const percent = totalSpecializations
                  ? Math.round((Number(item.value || 0) / totalSpecializations) * 100)
                  : 0;

                return (
                  <div
                    key={item.name}
                    className="bg-slate-50 rounded-2xl p-4 border border-slate-100"
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-black text-slate-800">
                        {item.name}
                      </span>

                      <span className="font-bold text-slate-500">
                        {item.value || 0} bookings
                      </span>
                    </div>

                    <div className="h-3 bg-white rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-400 transition-all duration-700"
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
        </section>
      </div>
    </div>
  );
}

function StatCard({ card }) {
  const Icon = card.icon;

  return (
    <div className="group relative">
      <div
        className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-40 blur transition duration-500`}
      />

      <div className="relative h-full bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm group-hover:-translate-y-1 group-hover:shadow-xl transition duration-500">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-sm`}
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
}

function SectionTitle({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center">
        <Icon className="text-cyan-600" size={22} />
      </div>

      <div>
        <h2 className="text-xl font-black text-slate-950">
          {title}
        </h2>

        <p className="text-sm text-slate-500">
          {desc}
        </p>
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

function DarkStat({ label, value }) {
  return (
    <div className="bg-white/10 border border-white/10 rounded-2xl p-4">
      <p className="text-xs text-slate-400 font-bold uppercase">
        {label}
      </p>

      <p className="text-2xl font-black mt-1">
        {value}
      </p>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-500 mt-6 border border-slate-100">
      {text}
    </div>
  );
}