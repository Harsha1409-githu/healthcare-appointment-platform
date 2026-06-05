import { useEffect, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  IndianRupee,
  BarChart3,
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

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api
      .get("/appointment/analytics")
      .then((res) => setAnalytics(res.data))
      .catch((err) =>
        console.error("Analytics API error:", err)
      );
  }, []);

  if (!analytics) {
    return (
      <div className="p-10 text-slate-500">
        Loading analytics...
      </div>
    );
  }

  const appointmentChart = [
    { name: "Booked", value: analytics.booked },
    { name: "Completed", value: analytics.completed },
    { name: "Cancelled", value: analytics.cancelled },
  ];

  const COLORS = ["#2563eb", "#10b981", "#ef4444"];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/40 to-white">
      <div className="relative max-w-7xl mx-auto px-6 py-10">
        <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-8 md:p-10 text-white shadow-2xl mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-5">
            <BarChart3 size={18} />
            Admin Analytics
          </div>

          <h1 className="text-4xl md:text-5xl font-black">
            Platform Analytics
          </h1>

          <p className="text-blue-100 mt-3">
            Track appointments, revenue, hospital performance and specialties.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-5 mb-8">
          <Card icon={CalendarCheck} title="Total" value={analytics.total} />
          <Card icon={Clock} title="Booked" value={analytics.booked} />
          <Card icon={CheckCircle2} title="Completed" value={analytics.completed} />
          <Card icon={XCircle} title="Cancelled" value={analytics.cancelled} />
          <Card icon={IndianRupee} title="Revenue" value={`₹${analytics.revenue}`} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <ChartBox title="Appointment Status">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={appointmentChart}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={115}
                  label
                >
                  {appointmentChart.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartBox>

          <ChartBox title="Hospital Revenue">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={analytics.hospitalRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>

          <ChartBox title="Specialization Demand">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={analytics.specializationStats || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
        </div>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, value }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl">
      <Icon className="text-blue-600 mb-4" size={28} />
      <p className="text-slate-500 text-sm">{title}</p>
      <h2 className="text-3xl font-black mt-1">{value}</h2>
    </div>
  );
}

function ChartBox({ title, children }) {
  return (
    <div className="bg-white rounded-[2rem] shadow-xl p-6">
      <h2 className="text-xl font-black mb-5">{title}</h2>
      {children}
    </div>
  );
}