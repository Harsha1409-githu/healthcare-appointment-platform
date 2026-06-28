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
import PageHeader from "../components/PageHeader";
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

  const monthlyStats = analytics?.monthlyStats || [];
  const doctorPerformance = analytics?.doctorPerformance || [];
  const specializationStats = analytics?.specializationStats || [];

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

  const maxRevenue = useMemo(() => {
    if (!monthlyStats.length) return 0;
    return Math.max(...monthlyStats.map((item) => Number(item.revenue || 0)));
  }, [monthlyStats]);

  const maxDoctorRevenue = useMemo(() => {
    if (!doctorPerformance.length) return 0;
    return Math.max(
      ...doctorPerformance.map((doctor) => Number(doctor.revenue || 0))
    );
  }, [doctorPerformance]);

  const totalSpecializations = useMemo(() => {
    return (
      specializationStats.reduce(
        (sum, item) => sum + Number(item.value || 0),
        0
      ) || 0
    );
  }, [specializationStats]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f8fb] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
          <Loader2
            className="mx-auto text-cyan-600 animate-spin mb-4"
            size={38}
          />

          <p className="text-slate-500 font-bold">
            Loading hospital analytics...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-28">
      <PageHeader
        title="Analytics"
        subtitle="Revenue and hospital insights"
      />

      <div className="max-w-md mx-auto px-4">
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-cyan-700 font-black">
                HOSPITAL INSIGHTS
              </p>

              <h1 className="text-xl font-black text-slate-950">
                Business Overview
              </h1>

              <p className="text-sm text-slate-500">
                Revenue, bookings and doctor performance
              </p>
            </div>

            <button
              type="button"
              onClick={fetchAnalytics}
              className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 active:scale-95"
            >
              <RefreshCw size={20} />
            </button>
          </div>

          <div className="mt-4 rounded-3xl bg-slate-950 text-white p-4 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl" />

            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                <IndianRupee className="text-cyan-300" size={26} />
              </div>

              <p className="text-sm text-slate-300 font-bold">
                Total Revenue
              </p>

              <h2 className="text-4xl font-black mt-1">
                ₹{analytics?.revenue || 0}
              </h2>

              <p className="text-xs text-slate-400 mt-2">
                From completed consultations
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <MiniStat
              icon={CalendarCheck}
              label="Total"
              value={analytics?.totalAppointments || 0}
            />

            <MiniStat
              icon={Clock}
              label="Today"
              value={analytics?.todayAppointments || 0}
            />

            <MiniStat
              icon={CheckCircle2}
              label="Done"
              value={analytics?.completed || 0}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2">
            <MiniStat
              icon={Activity}
              label="Booked"
              value={analytics?.booked || 0}
            />

            <MiniStat
              icon={XCircle}
              label="Cancel"
              value={analytics?.cancelled || 0}
            />

            <MiniStat
              icon={TrendingUp}
              label="Growth"
              value={`${completedPercent}%`}
            />
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <SectionTitle
            icon={ShieldCheck}
            title="Appointment Health"
            desc="Status distribution"
          />

          <div className="space-y-4 mt-4">
            <ProgressRow label="Completed" value={completedPercent} />
            <ProgressRow label="Booked" value={bookedPercent} />
            <ProgressRow label="Cancelled" value={cancelledPercent} danger />
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <SectionTitle
            icon={Award}
            title="Top Performing Doctor"
            desc="Best revenue performer"
          />

          {analytics?.topDoctor ? (
            <div className="mt-4 bg-cyan-50 border border-cyan-100 rounded-3xl p-4">
              <p className="text-xs text-cyan-700 font-black">
                TOP DOCTOR
              </p>

              <h3 className="text-xl font-black text-slate-950 mt-2">
                {analytics.topDoctor.doctorName}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                ₹{analytics.topDoctor.revenue || 0} revenue
              </p>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <SmallInfo
                  label="Appointments"
                  value={analytics.topDoctor.appointments || 0}
                />

                <SmallInfo
                  label="Completed"
                  value={analytics.topDoctor.completed || 0}
                />
              </div>
            </div>
          ) : (
            <Empty text="No doctor performance data yet." />
          )}
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <SectionTitle
            icon={BarChart3}
            title="Monthly Revenue"
            desc="Revenue and bookings by month"
          />

          {monthlyStats.length === 0 ? (
            <Empty text="No monthly revenue data available." />
          ) : (
            <div className="space-y-4 mt-4">
              {monthlyStats.map((item) => {
                const revenue = Number(item.revenue || 0);

                const width =
                  maxRevenue === 0
                    ? 0
                    : Math.max(8, (revenue / maxRevenue) * 100);

                return (
                  <div
                    key={item.month}
                    className="bg-slate-50 rounded-2xl border border-slate-100 p-3"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div>
                        <p className="font-black text-slate-950">
                          {item.month}
                        </p>

                        <p className="text-xs text-slate-500 font-bold">
                          {item.appointments || 0} appointments
                        </p>
                      </div>

                      <p className="font-black text-emerald-600">
                        ₹{revenue}
                      </p>
                    </div>

                    <div className="h-3 bg-white rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-cyan-600"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <SectionTitle
            icon={Stethoscope}
            title="Doctor Performance"
            desc="Revenue by doctor"
          />

          {doctorPerformance.length === 0 ? (
            <Empty text="No doctor performance available." />
          ) : (
            <div className="space-y-3 mt-4">
              {doctorPerformance.map((doctor) => {
                const revenue = Number(doctor.revenue || 0);

                const width =
                  maxDoctorRevenue === 0
                    ? 0
                    : Math.max(8, (revenue / maxDoctorRevenue) * 100);

                return (
                  <div
                    key={doctor.doctorName}
                    className="bg-slate-50 rounded-2xl p-3 border border-slate-100"
                  >
                    <div className="flex justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <h3 className="font-black text-slate-950 truncate">
                          {doctor.doctorName}
                        </h3>

                        <p className="text-xs text-slate-500">
                          {doctor.appointments || 0} appointments •{" "}
                          {doctor.completed || 0} completed
                        </p>
                      </div>

                      <p className="font-black text-emerald-600 shrink-0">
                        ₹{revenue}
                      </p>
                    </div>

                    <div className="h-3 bg-white rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <SectionTitle
            icon={PieChart}
            title="Specialization Demand"
            desc="Bookings by specialization"
          />

          {specializationStats.length === 0 ? (
            <Empty text="No specialization data available." />
          ) : (
            <div className="space-y-3 mt-4">
              {specializationStats.map((item) => {
                const percent = totalSpecializations
                  ? Math.round(
                      (Number(item.value || 0) / totalSpecializations) * 100
                    )
                  : 0;

                return (
                  <div
                    key={item.name}
                    className="bg-slate-50 rounded-2xl p-3 border border-slate-100"
                  >
                    <div className="flex justify-between gap-3 mb-2">
                      <span className="font-black text-slate-800 truncate">
                        {item.name}
                      </span>

                      <span className="font-bold text-slate-500 shrink-0">
                        {item.value || 0} bookings
                      </span>
                    </div>

                    <div className="h-3 bg-white rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-purple-500"
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
    </main>
  );
}

function SectionTitle({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center">
        <Icon className="text-cyan-600" size={22} />
      </div>

      <div>
        <h2 className="text-lg font-black text-slate-950">
          {title}
        </h2>

        <p className="text-xs text-slate-500">
          {desc}
        </p>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center">
      <Icon className="text-cyan-600 mx-auto" size={18} />

      <p className="text-sm font-black text-slate-950 mt-1">
        {value}
      </p>

      <p className="text-[10px] text-slate-500 font-bold">
        {label}
      </p>
    </div>
  );
}

function ProgressRow({ label, value, danger = false }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-bold mb-2">
        <span className="text-slate-700">{label}</span>
        <span className="text-slate-500">{value}%</span>
      </div>

      <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${
            danger ? "bg-red-500" : "bg-cyan-600"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function SmallInfo({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-cyan-100 p-3">
      <p className="text-[10px] text-slate-400 font-black uppercase">
        {label}
      </p>

      <p className="text-lg font-black text-slate-950 mt-1">
        {value}
      </p>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-6 text-center text-sm text-slate-500 mt-4 border border-slate-100">
      {text}
    </div>
  );
}