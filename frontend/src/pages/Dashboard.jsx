import { useEffect, useMemo, useState } from "react";
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
  UserRound,
  FileHeart,
  FlaskConical,
  Bell,
  Video,
  ArrowRight,
  MapPin,
} from "lucide-react";
import api from "../api/axios";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [healthInsights, setHealthInsights] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
    fetchHealthInsights();
    fetchProfile();
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

      const res = await api.get(`/patient/${patient.id}/health-insights`);
      setHealthInsights(res.data);
    } catch (error) {
      console.error("Health insights error:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/patient/profile");
      setProfile(res.data);
    } catch (error) {
      console.error("Profile summary error:", error);
    }
  };

  const total = appointments.length;
  const booked = appointments.filter((item) => item.status === "BOOKED").length;
  const cancelled = appointments.filter(
    (item) => item.status === "CANCELLED"
  ).length;
  const completed = appointments.filter(
    (item) => item.status === "COMPLETED"
  ).length;

  const nextAppointment = useMemo(() => {
    return appointments
      .filter((item) => item.status === "BOOKED")
      .sort((a, b) => {
        const first = new Date(
          `${a.slot?.date || ""} ${a.slot?.startTime || ""}`
        );
        const second = new Date(
          `${b.slot?.date || ""} ${b.slot?.startTime || ""}`
        );

        return first - second;
      })[0];
  }, [appointments]);

  const profileCompletion = useMemo(() => {
    if (!profile) return 0;

    const fields = [
      profile.fullName,
      profile.email,
      profile.mobile,
      profile.gender,
      profile.age,
      profile.city,
      profile.profileImage,
    ];

    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  }, [profile]);

  const patientName =
    profile?.fullName ||
    JSON.parse(localStorage.getItem("patientUser") || "null")?.fullName ||
    "Patient";

  return (
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6 py-8">
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                <HeartPulse size={17} />
                PATIENT DASHBOARD
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                Good Morning, {patientName.split(" ")[0]} 👋
              </h1>

              <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
                Manage appointments, prescriptions, medical records, reminders
                and AI health insights from one place.
              </p>
            </div>

            <Link
              to="/doctors"
              className="inline-flex items-center justify-center gap-2 bg-cyan-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-cyan-700 transition"
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
            <section className="grid lg:grid-cols-[360px_1fr] gap-6 mb-8">
              <div className="relative overflow-hidden bg-slate-950 rounded-[2rem] p-6 text-white shadow-sm">
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-cyan-400/20 rounded-full blur-3xl" />

                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-5">
                    <Brain className="text-cyan-300" size={28} />
                  </div>

                  <p className="text-cyan-100 font-bold">
                    AI Health Score
                  </p>

                  <h2 className="text-6xl font-black mt-1">
                    {healthInsights?.healthScore || 0}
                    <span className="text-2xl text-cyan-100">/100</span>
                  </h2>

                  <div className="w-full h-3 bg-white/10 rounded-full mt-5 overflow-hidden">
                    <div
                      className="h-full bg-cyan-300 rounded-full"
                      style={{
                        width: `${healthInsights?.healthScore || 0}%`,
                      }}
                    />
                  </div>

                  <p className="text-sm text-cyan-100 mt-5">
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
                  value={healthInsights?.upcomingAppointments || booked}
                  label="Upcoming"
                  sub="Appointments"
                />

                <InsightMini
                  icon={Activity}
                  value={healthInsights?.completedAppointments || completed}
                  label="Completed"
                  sub="Consultations"
                />

                <InsightMini
                  icon={FileText}
                  value={healthInsights?.prescriptions || 0}
                  label="Prescriptions"
                  sub="Available"
                />

                <InsightMini
                  icon={Pill}
                  value={healthInsights?.activeReminders || 0}
                  label="Medicines"
                  sub="Active reminders"
                />
              </div>
            </section>

            <section className="grid lg:grid-cols-[1fr_360px] gap-6 mb-8">
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center shrink-0">
                    <Sparkles className="text-cyan-600" size={24} />
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-slate-950">
                      AI Recommendation
                    </h2>

                    <p className="text-slate-600 mt-1 font-medium leading-relaxed">
                      {healthInsights?.suggestion ||
                        "Keep your profile updated and book regular consultations for better health tracking."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 font-semibold">
                      Profile Completion
                    </p>

                    <h3 className="text-3xl font-black text-slate-950 mt-1">
                      {profileCompletion}%
                    </h3>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center">
                    <UserRound className="text-cyan-600" size={28} />
                  </div>
                </div>

                <div className="mt-5 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-600 rounded-full transition-all"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>

                <Link
                  to="/patient/profile"
                  className="inline-flex items-center gap-2 mt-4 text-cyan-700 font-black"
                >
                  Complete profile
                  <ArrowRight size={16} />
                </Link>
              </div>
            </section>

            <section className="grid md:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Total Appointments"
                value={total}
                icon={Activity}
                tone="cyan"
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
                tone="cyan"
              />

              <StatCard
                title="Cancelled"
                value={cancelled}
                icon={CalendarX}
                tone="red"
              />
            </section>

            <section className="grid xl:grid-cols-[1fr_390px] gap-8">
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div>
                    <h2 className="text-2xl font-black text-slate-950">
                      Recent Appointments
                    </h2>

                    <p className="text-sm text-slate-500">
                      Latest consultation activity
                    </p>
                  </div>

                  <Link
                    to="/patient/appointments"
                    className="text-cyan-700 font-black"
                  >
                    View All
                  </Link>
                </div>

                {appointments.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto mb-4">
                      <CalendarCheck className="text-cyan-600" size={32} />
                    </div>

                    <p className="text-slate-500 mb-4">
                      No appointments yet.
                    </p>

                    <Link
                      to="/doctors"
                      className="inline-flex items-center gap-2 bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-cyan-700"
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

              <aside className="space-y-6">
                <NextAppointmentCard appointment={nextAppointment} />

                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
                  <h2 className="text-xl font-black text-slate-950 mb-4">
                    Quick Actions
                  </h2>

                  <div className="grid grid-cols-2 gap-3">
                    <QuickAction
                      to="/doctors"
                      icon={Stethoscope}
                      title="Doctors"
                    />

                    <QuickAction
                      to="/video-consult"
                      icon={Video}
                      title="Video Consult"
                    />

                    <QuickAction
                      to="/patient/medical-records"
                      icon={FileHeart}
                      title="Records"
                    />

                    <QuickAction
                      to="/patient/prescriptions"
                      icon={FileText}
                      title="Prescriptions"
                    />

                    <QuickAction
                      to="/patient/lab-tests"
                      icon={FlaskConical}
                      title="Lab Tests"
                    />

                    <QuickAction
                      to="/notifications"
                      icon={Bell}
                      title="Notifications"
                    />

                    <QuickAction
                      to="/patient/medicine-reminders"
                      icon={Pill}
                      title="Medicines"
                    />

                    <QuickAction
                      to="/patient/ai-health-insights"
                      icon={Brain}
                      title="AI Insights"
                    />
                  </div>
                </div>

                <HealthSummary profile={profile} healthInsights={healthInsights} />
              </aside>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyCard({ text }) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10 text-center text-slate-500 font-semibold">
      {text}
    </div>
  );
}

function InsightMini({ icon: Icon, value, label, sub }) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5">
      <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center mb-4">
        <Icon className="text-cyan-600" size={22} />
      </div>

      <p className="text-3xl font-black text-slate-950">{value}</p>
      <p className="font-black text-slate-700 mt-1">{label}</p>
      <p className="text-sm text-slate-500">{sub}</p>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, tone }) {
  const styles = {
    cyan: "bg-cyan-50 text-cyan-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5">
      <div
        className={`w-11 h-11 rounded-2xl ${styles[tone]} flex items-center justify-center mb-4`}
      >
        <Icon size={22} />
      </div>

      <p className="text-sm text-slate-500 font-bold">{title}</p>
      <p className="text-3xl font-black text-slate-950 mt-1">{value}</p>
    </div>
  );
}

function AppointmentRow({ item }) {
  const statusStyle =
    item.status === "BOOKED"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : item.status === "CANCELLED"
      ? "bg-red-50 text-red-700 border-red-100"
      : "bg-cyan-50 text-cyan-700 border-cyan-100";

  return (
    <div className="border border-slate-100 bg-slate-50 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h3 className="font-black text-slate-950">
          {item.doctor?.doctorName || "Doctor"}
        </h3>

        <p className="text-cyan-700 font-semibold">
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

function NextAppointmentCard({ appointment }) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center">
          <Clock className="text-emerald-600" size={22} />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-950">
            Next Appointment
          </h2>

          <p className="text-sm text-slate-500">
            Upcoming confirmed visit
          </p>
        </div>
      </div>

      {appointment ? (
        <div>
          <div className="flex items-center gap-4 bg-slate-50 rounded-2xl border border-slate-100 p-4">
            <img
              src={
                appointment.doctor?.profileImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  appointment.doctor?.doctorName || "Doctor"
                )}&background=0891b2&color=fff&bold=true`
              }
              alt={appointment.doctor?.doctorName || "Doctor"}
              className="w-14 h-14 rounded-2xl object-cover"
            />

            <div className="min-w-0">
              <p className="font-black text-slate-950 truncate">
                {appointment.doctor?.doctorName || "Doctor"}
              </p>

              <p className="text-cyan-700 font-semibold text-sm">
                {appointment.doctor?.specialization || "Specialist"}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                {appointment.slot?.date} | {appointment.slot?.startTime}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <Link
              to={`/chat/${appointment.id}`}
              className="text-center bg-slate-950 text-white py-3 rounded-2xl font-black hover:bg-cyan-700 transition"
            >
              Chat
            </Link>

            <Link
              to={`/video-call/${appointment.id}`}
              className="text-center bg-cyan-600 text-white py-3 rounded-2xl font-black hover:bg-cyan-700 transition"
            >
              Video
            </Link>
          </div>
        </div>
      ) : (
        <p className="text-slate-500">
          No upcoming appointment.
        </p>
      )}
    </div>
  );
}

function QuickAction({ to, icon: Icon, title }) {
  return (
    <Link
      to={to}
      className="bg-slate-50 border border-slate-100 rounded-2xl p-4 hover:bg-cyan-50 hover:border-cyan-100 transition"
    >
      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm mb-3">
        <Icon className="text-cyan-600" size={21} />
      </div>

      <p className="font-black text-slate-800 text-sm">{title}</p>
    </Link>
  );
}

function HealthSummary({ profile, healthInsights }) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center">
          <HeartPulse className="text-cyan-600" size={22} />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-950">
            Health Summary
          </h2>

          <p className="text-sm text-slate-500">
            Your basic health profile
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <SummaryItem label="Age" value={profile?.age || "Not Set"} />
        <SummaryItem label="Gender" value={profile?.gender || "Not Set"} />
        <SummaryItem label="City" value={profile?.city || "Not Set"} />
        <SummaryItem
          label="Health Score"
          value={`${healthInsights?.healthScore || 0}/100`}
        />
        <SummaryItem
          label="Active Medicines"
          value={healthInsights?.activeReminders || 0}
        />
      </div>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <p className="text-sm text-slate-500 font-semibold">
        {label}
      </p>

      <p className="font-black text-slate-950 text-right">
        {value}
      </p>
    </div>
  );
}