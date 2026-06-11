import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Brain,
  CalendarCheck,
  CalendarX,
  Clock,
  FileText,
  HeartPulse,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import api from "../api/axios";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [healthInsights, setHealthInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
    fetchHealthInsights();
  }, []);

  const fetchDashboard = () => {
    setLoading(true);

    api
      .get("/appointment/my")
      .then((res) => {
        setAppointments(res.data || []);
      })
      .catch((err) => {
        console.error("Dashboard API error:", err);
      })
      .finally(() => setLoading(false));
  };

  const fetchHealthInsights = async () => {
    try {
      const patient = JSON.parse(
        localStorage.getItem("patientUser") ||
          localStorage.getItem("user") ||
          "null"
      );

      if (!patient?.id) return;

      const res = await api.get(
        `/patient/${patient.id}/health-insights`
      );

      setHealthInsights(res.data);
    } catch (error) {
      console.error("Health insights error:", error);
    }
  };

  const total = appointments.length;

  const booked = appointments.filter(
    (item) => item.status === "BOOKED"
  ).length;

  const cancelled = appointments.filter(
    (item) => item.status === "CANCELLED"
  ).length;

  const completed = appointments.filter(
    (item) => item.status === "COMPLETED"
  ).length;

  const nextAppointment = appointments.find(
    (item) => item.status === "BOOKED"
  );

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-7xl mx-auto px-5">
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 font-black text-sm mb-3">
                <HeartPulse size={16} />
                Patient Portal
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-slate-950">
                Patient Dashboard
              </h1>

              <p className="text-slate-500 mt-2 max-w-2xl">
                View your appointments, AI health score, prescriptions,
                medicines and upcoming care actions in one clean dashboard.
              </p>
            </div>

            <Link
              to="/doctors"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-blue-700 transition"
            >
              <Stethoscope size={18} />
              Book Appointment
            </Link>
          </div>
        </section>

        {loading ? (
          <EmptyCard text="Loading dashboard..." />
        ) : (
          <>
            {healthInsights && (
              <section className="grid lg:grid-cols-[360px_1fr] gap-6 mb-6">
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 rounded-3xl p-6 text-white shadow-xl">
                  <div className="absolute -top-16 -right-16 w-56 h-56 bg-cyan-400/20 rounded-full blur-3xl" />

                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-5">
                      <Brain className="text-cyan-300" size={28} />
                    </div>

                    <p className="text-blue-100 font-bold">
                      AI Health Score
                    </p>

                    <h2 className="text-6xl font-black mt-1">
                      {healthInsights.healthScore}
                      <span className="text-2xl text-blue-100">/100</span>
                    </h2>

                    <div className="w-full h-3 bg-white/10 rounded-full mt-5 overflow-hidden">
                      <div
                        className="h-full bg-cyan-300 rounded-full"
                        style={{
                          width: `${healthInsights.healthScore}%`,
                        }}
                      />
                    </div>

                    <p className="text-sm text-blue-100 mt-5">
                      Score based on consultations, prescriptions and active
                      medicine reminders.
                    </p>

                    <Link
                      to="/patient/ai-health-insights"
                      className="inline-flex items-center gap-2 mt-5 text-cyan-200 font-black"
                    >
                      View full insights
                      <Sparkles size={16} />
                    </Link>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <InsightMini
                    icon={CalendarCheck}
                    value={healthInsights.upcomingAppointments}
                    label="Upcoming"
                    sub="Appointments"
                  />

                  <InsightMini
                    icon={Activity}
                    value={healthInsights.completedAppointments}
                    label="Completed"
                    sub="Consultations"
                  />

                  <InsightMini
                    icon={FileText}
                    value={healthInsights.prescriptions}
                    label="Prescriptions"
                    sub="Available"
                  />

                  <InsightMini
                    icon={Pill}
                    value={healthInsights.activeReminders}
                    label="Medicines"
                    sub="Active reminders"
                  />
                </div>
              </section>
            )}

            {healthInsights && (
              <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Sparkles className="text-blue-600" size={24} />
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      AI Recommendation
                    </h2>

                    <p className="text-slate-600 mt-1 font-medium">
                      {healthInsights.suggestion}
                    </p>
                  </div>
                </div>
              </section>
            )}

            <section className="grid md:grid-cols-4 gap-4 mb-6">
              <StatCard
                title="Total Appointments"
                value={total}
                icon={Activity}
                tone="blue"
              />

              <StatCard
                title="Upcoming"
                value={booked}
                icon={CalendarCheck}
                tone="green"
              />

              <StatCard
                title="Completed"
                value={completed}
                icon={ShieldCheck}
                tone="blue"
              />

              <StatCard
                title="Cancelled"
                value={cancelled}
                icon={CalendarX}
                tone="red"
              />
            </section>

            <section className="grid lg:grid-cols-[1fr_360px] gap-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Recent Appointments
                    </h2>

                    <p className="text-sm text-slate-500">
                      Latest consultation activity
                    </p>
                  </div>

                  <Link
                    to="/patient/appointments"
                    className="text-blue-600 font-black"
                  >
                    View All
                  </Link>
                </div>

                {appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500 mb-4">
                      No appointments yet.
                    </p>

                    <Link
                      to="/doctors"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-blue-700"
                    >
                      <Stethoscope size={18} />
                      Book Appointment
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {appointments.slice(0, 4).map((item) => (
                      <AppointmentRow key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center">
                      <Clock className="text-emerald-600" size={22} />
                    </div>

                    <div>
                      <h2 className="text-lg font-black text-slate-900">
                        Next Appointment
                      </h2>

                      <p className="text-sm text-slate-500">
                        Upcoming confirmed visit
                      </p>
                    </div>
                  </div>

                  {nextAppointment ? (
                    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
                      <p className="font-black text-slate-900">
                        {nextAppointment.doctor?.doctorName || "Doctor"}
                      </p>

                      <p className="text-blue-600 font-semibold">
                        {nextAppointment.doctor?.specialization}
                      </p>

                      <p className="text-sm text-slate-500 mt-2">
                        {nextAppointment.slot?.date} |{" "}
                        {nextAppointment.slot?.startTime} -{" "}
                        {nextAppointment.slot?.endTime}
                      </p>
                    </div>
                  ) : (
                    <p className="text-slate-500">
                      No upcoming appointment.
                    </p>
                  )}
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
                  <h2 className="text-lg font-black text-slate-900 mb-4">
                    Quick Actions
                  </h2>

                  <div className="grid gap-3">
                    <QuickAction
                      to="/doctors"
                      icon={Stethoscope}
                      title="Find Doctors"
                    />

                    <QuickAction
                      to="/patient/medicine-reminders"
                      icon={Pill}
                      title="Medicine Reminders"
                    />

                    <QuickAction
                      to="/patient/prescriptions"
                      icon={FileText}
                      title="Prescriptions"
                    />

                    <QuickAction
                      to="/patient/ai-health-insights"
                      icon={Brain}
                      title="AI Health Insights"
                    />
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyCard({ text }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center text-slate-500">
      {text}
    </div>
  );
}

function InsightMini({ icon: Icon, value, label, sub }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
      <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
        <Icon className="text-blue-600" size={22} />
      </div>

      <p className="text-3xl font-black text-slate-900">{value}</p>
      <p className="font-black text-slate-700 mt-1">{label}</p>
      <p className="text-sm text-slate-500">{sub}</p>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, tone }) {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
      <div
        className={`w-11 h-11 rounded-2xl ${styles[tone]} flex items-center justify-center mb-4`}
      >
        <Icon size={22} />
      </div>

      <p className="text-sm text-slate-500 font-bold">{title}</p>
      <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
    </div>
  );
}

function AppointmentRow({ item }) {
  const statusStyle =
    item.status === "BOOKED"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : item.status === "CANCELLED"
      ? "bg-red-50 text-red-700 border-red-100"
      : "bg-blue-50 text-blue-700 border-blue-100";

  return (
    <div className="border border-slate-100 bg-slate-50 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h3 className="font-black text-slate-900">
          {item.doctor?.doctorName || "Doctor"}
        </h3>

        <p className="text-blue-600 font-semibold">
          {item.doctor?.specialization || "Specialist"}
        </p>

        <p className="text-slate-500 text-sm mt-1">
          {item.slot?.date} | {item.slot?.startTime} - {item.slot?.endTime}
        </p>
      </div>

      <span
        className={`px-4 py-2 rounded-full text-sm font-black border w-fit ${statusStyle}`}
      >
        {item.status}
      </span>
    </div>
  );
}

function QuickAction({ to, icon: Icon, title }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4 hover:bg-blue-50 hover:border-blue-100 transition"
    >
      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
        <Icon className="text-blue-600" size={21} />
      </div>

      <p className="font-black text-slate-800">{title}</p>
    </Link>
  );
}