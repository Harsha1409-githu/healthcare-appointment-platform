import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  IndianRupee,
  BarChart3,
  RefreshCw,
  Loader2,
  TrendingUp,
  Building2,
  Stethoscope,
  ShieldCheck,
  Activity,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import api from "../api/axios";

const COLORS = ["#0891b2", "#10b981", "#ef4444"];

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const res = await api.get("/appointment/analytics");

      setAnalytics(res.data || {});
    } catch (err) {
      console.error("Analytics API error:", err);
      alert("Failed to load admin analytics");
      setAnalytics({});
    } finally {
      setLoading(false);
    }
  };

  const appointmentChart = useMemo(
    () => [
      { name: "Booked", value: analytics?.booked || 0 },
      { name: "Completed", value: analytics?.completed || 0 },
      { name: "Cancelled", value: analytics?.cancelled || 0 },
    ],
    [analytics]
  );

  const totalAppointments = analytics?.total || 0;

  const completedPercent = totalAppointments
    ? Math.round(((analytics?.completed || 0) / totalAppointments) * 100)
    : 0;

  const bookedPercent = totalAppointments
    ? Math.round(((analytics?.booked || 0) / totalAppointments) * 100)
    : 0;

  const cancelledPercent = totalAppointments
    ? Math.round(((analytics?.cancelled || 0) / totalAppointments) * 100)
    : 0;

  const cards = [
    {
      icon: CalendarCheck,
      title: "Total",
      value: totalAppointments,
      desc: "All platform appointments",
      gradient: "from-cyan-600 to-blue-500",
    },
    {
      icon: Clock,
      title: "Booked",
      value: analytics?.booked || 0,
      desc: `${bookedPercent}% active bookings`,
      gradient: "from-purple-600 to-fuchsia-500",
    },
    {
      icon: CheckCircle2,
      title: "Completed",
      value: analytics?.completed || 0,
      desc: `${completedPercent}% completed`,
      gradient: "from-emerald-600 to-teal-500",
    },
    {
      icon: XCircle,
      title: "Cancelled",
      value: analytics?.cancelled || 0,
      desc: `${cancelledPercent}% cancelled`,
      gradient: "from-red-600 to-rose-500",
    },
    {
      icon: IndianRupee,
      title: "Revenue",
      value: `₹${analytics?.revenue || 0}`,
      desc: "Completed consultations",
      gradient: "from-green-600 to-emerald-500",
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
            Loading admin analytics...
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
                <BarChart3 size={17} />
                Admin Analytics
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                Platform Analytics
              </h1>

              <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
                Track appointments, revenue, hospital performance and
                specialization demand across the MediCare platform.
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

        <section className="grid md:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
          {cards.map((card) => (
            <Card key={card.title} {...card} />
          ))}
        </section>

        <section className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
            <SectionTitle
              icon={PieChartIcon}
              title="Appointment Status"
              desc="Booked, completed and cancelled distribution"
            />

            <div className="h-[340px] mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appointmentChart}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={120}
                    innerRadius={65}
                    paddingAngle={4}
                    label
                  >
                    {appointmentChart.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid md:grid-cols-3 gap-3 mt-4">
              <LegendItem color="bg-cyan-600" label="Booked" value={analytics?.booked || 0} />
              <LegendItem color="bg-emerald-500" label="Completed" value={analytics?.completed || 0} />
              <LegendItem color="bg-red-500" label="Cancelled" value={analytics?.cancelled || 0} />
            </div>
          </div>

          <div className="relative overflow-hidden bg-slate-950 rounded-[2rem] p-6 text-white shadow-sm">
            <div className="absolute -top-16 -right-16 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl" />

            <div className="relative">
              <TrendingUp className="text-cyan-300" size={36} />

              <h2 className="text-2xl font-black mt-5">
                Platform Health
              </h2>

              <p className="text-slate-300 mt-2 text-sm leading-relaxed">
                Based on appointment completion, revenue and booking activity.
              </p>

              <p className="text-5xl font-black mt-7">
                {Math.min(100, completedPercent + bookedPercent)}%
              </p>

              <p className="text-cyan-300 font-semibold mt-1">
                Operational score
              </p>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <DarkStat label="Revenue" value={`₹${analytics?.revenue || 0}`} />
                <DarkStat label="Completed" value={analytics?.completed || 0} />
              </div>
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-6 mb-8">
          <ChartBox
            icon={Building2}
            title="Hospital Revenue"
            desc="Revenue performance by hospital"
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={analytics?.hospitalRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  radius={[12, 12, 0, 0]}
                  fill="#0891b2"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>

          <ChartBox
            icon={Stethoscope}
            title="Specialization Demand"
            desc="Appointment distribution by specialization"
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={analytics?.specializationStats || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  radius={[12, 12, 0, 0]}
                  fill="#10b981"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
        </section>

        <section className="bg-cyan-600 rounded-[2rem] p-6 text-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm font-black mb-3">
              <ShieldCheck size={16} />
              Platform Insight
            </div>

            <h3 className="text-2xl font-black">
              Keep hospitals and doctors active
            </h3>

            <p className="text-cyan-100 mt-2">
              Higher active provider coverage improves appointment completion
              and revenue growth.
            </p>
          </div>

          <div className="bg-white text-cyan-700 px-6 py-4 rounded-2xl font-black">
            {totalAppointments} total appointments
          </div>
        </section>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, value, desc, gradient }) {
  return (
    <div className="group relative">
      <div
        className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-40 blur transition duration-500`}
      />

      <div className="relative h-full bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm group-hover:-translate-y-1 group-hover:shadow-xl transition duration-500">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}
        >
          <Icon className="text-white" size={27} />
        </div>

        <p className="text-slate-500 text-sm mt-5">
          {title}
        </p>

        <h2 className="text-3xl font-black mt-1 text-slate-950">
          {value}
        </h2>

        <p className="text-sm text-slate-500 mt-2">
          {desc}
        </p>
      </div>
    </div>
  );
}

function ChartBox({ icon: Icon, title, desc, children }) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
      <SectionTitle icon={Icon} title={title} desc={desc} />

      <div className="mt-6">
        {children}
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

function LegendItem({ color, label, value }) {
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
      <div className="flex items-center gap-2">
        <span className={`w-3 h-3 rounded-full ${color}`} />

        <p className="font-black text-slate-800">
          {label}
        </p>
      </div>

      <p className="text-2xl font-black text-slate-950 mt-2">
        {value}
      </p>
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

function PieChartIcon(props) {
  return <BarChart3 {...props} />;
}