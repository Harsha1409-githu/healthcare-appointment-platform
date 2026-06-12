import { useEffect, useMemo, useState } from "react";
import {
  Brain,
  HeartPulse,
  CalendarCheck,
  Pill,
  FileText,
  Sparkles,
  Activity,
  ShieldCheck,
  Stethoscope,
  ClipboardList,
  ArrowRight,
  RefreshCcw,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function AIHealthInsights() {
  const patient = JSON.parse(
    localStorage.getItem("patientUser") ||
      localStorage.getItem("user") ||
      "null"
  );

  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);

      if (!patient?.id) {
        setInsights(null);
        return;
      }

      const res = await api.get(`/patient/${patient.id}/health-insights`);
      setInsights(res.data);
    } catch (error) {
      console.error("AI insights error:", error);
    } finally {
      setLoading(false);
    }
  };

  const healthScore = Number(insights?.healthScore || 0);

  const scoreLabel = useMemo(() => {
    if (healthScore >= 80) return "Excellent";
    if (healthScore >= 60) return "Good";
    if (healthScore >= 40) return "Needs Attention";
    return "Needs Improvement";
  }, [healthScore]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4fbff] flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto mb-4">
            <Brain className="text-cyan-600 animate-pulse" size={34} />
          </div>

          <p className="text-slate-500 font-semibold">
            Loading AI Health Insights...
          </p>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="min-h-screen bg-[#f4fbff] px-6 py-8">
        <div className="max-w-[900px] mx-auto bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto mb-4">
            <Brain className="text-cyan-600" size={34} />
          </div>

          <h2 className="text-2xl font-black text-slate-950">
            No insights available
          </h2>

          <p className="text-slate-500 mt-2">
            Book appointments, add prescriptions or create medicine reminders to
            generate AI health insights.
          </p>

          <button
            onClick={fetchInsights}
            className="mt-6 inline-flex items-center gap-2 bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-cyan-700"
          >
            <RefreshCcw size={18} />
            Refresh Insights
          </button>
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
                <Brain size={17} />
                AI HEALTH INSIGHTS
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                Personalized Health Summary
              </h1>

              <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
                AI-powered overview based on your appointments, prescriptions
                and active medicine reminders.
              </p>
            </div>

            <button
              onClick={fetchInsights}
              className="inline-flex items-center justify-center gap-2 bg-cyan-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-cyan-700 transition"
            >
              <RefreshCcw size={18} />
              Refresh
            </button>
          </div>
        </section>

        <section className="grid lg:grid-cols-[380px_1fr] gap-8 mb-8">
          <div className="relative overflow-hidden bg-slate-950 rounded-[2rem] p-6 text-white shadow-sm">
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-cyan-400/20 rounded-full blur-3xl" />

            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mb-5">
                <HeartPulse className="text-cyan-300" size={34} />
              </div>

              <p className="text-cyan-100 font-bold">
                Health Score
              </p>

              <h2 className="text-6xl font-black mt-2">
                {healthScore}
                <span className="text-2xl text-cyan-100">/100</span>
              </h2>

              <div className="w-full h-3 bg-white/10 rounded-full mt-6 overflow-hidden">
                <div
                  className="h-full bg-cyan-300 rounded-full transition-all"
                  style={{ width: `${healthScore}%` }}
                />
              </div>

              <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-cyan-100 font-black">
                <ShieldCheck size={17} />
                {scoreLabel}
              </div>

              <p className="text-sm text-cyan-100 mt-5 leading-relaxed">
                Score is calculated from consultations, prescriptions and active
                medicine reminders.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            <InsightCard
              icon={CalendarCheck}
              title="Upcoming"
              value={insights.upcomingAppointments}
              subtitle="Appointments"
            />

            <InsightCard
              icon={Activity}
              title="Completed"
              value={insights.completedAppointments}
              subtitle="Consultations"
            />

            <InsightCard
              icon={FileText}
              title="Prescriptions"
              value={insights.prescriptions}
              subtitle="Available"
            />

            <InsightCard
              icon={Pill}
              title="Medicines"
              value={insights.activeReminders}
              subtitle="Active reminders"
            />
          </div>
        </section>

        <section className="grid xl:grid-cols-[1fr_360px] gap-8">
          <main className="space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center shrink-0">
                  <Sparkles className="text-cyan-600" size={24} />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    AI Recommendation
                  </h2>

                  <p className="text-slate-600 mt-2 font-medium leading-relaxed">
                    {insights.suggestion ||
                      "Keep your profile updated and continue tracking appointments, prescriptions and medicines for better insights."}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <CareCard
                icon={Stethoscope}
                title="Regular Care"
                desc="Book timely consultations and follow doctor advice."
                to="/doctors"
              />

              <CareCard
                icon={Pill}
                title="Medicine Routine"
                desc="Use reminders to stay consistent with prescribed medicines."
                to="/patient/medicine-reminders"
              />

              <CareCard
                icon={FileText}
                title="Medical Records"
                desc="Keep your reports and prescriptions organized."
                to="/patient/medical-records"
              />
            </div>
          </main>

          <aside className="space-y-5">
            <SummaryCard
              icon={ClipboardList}
              title="Insight Factors"
              items={[
                ["Upcoming Appointments", insights.upcomingAppointments],
                ["Completed Consultations", insights.completedAppointments],
                ["Prescriptions", insights.prescriptions],
                ["Active Medicines", insights.activeReminders],
              ]}
            />

            <div className="bg-cyan-600 rounded-[2rem] p-6 text-white">
              <Brain size={30} className="mb-4" />

              <h3 className="text-xl font-black">
                Improve your score
              </h3>

              <p className="text-cyan-100 text-sm mt-2 leading-relaxed">
                Complete your profile, attend scheduled appointments and keep
                prescriptions updated.
              </p>

              <Link
                to="/patient/profile"
                className="mt-5 inline-flex items-center gap-2 bg-white text-cyan-700 px-5 py-3 rounded-2xl font-black"
              >
                Update Profile
                <ArrowRight size={17} />
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

function InsightCard({ icon: Icon, title, value, subtitle }) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5">
      <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center mb-4">
        <Icon className="text-cyan-600" size={24} />
      </div>

      <p className="text-3xl font-black text-slate-950">
        {value}
      </p>

      <p className="font-black text-slate-700 mt-1">
        {title}
      </p>

      <p className="text-sm text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}

function CareCard({ icon: Icon, title, desc, to }) {
  return (
    <Link
      to={to}
      className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 hover:shadow-xl hover:-translate-y-1 transition"
    >
      <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center mb-4">
        <Icon className="text-cyan-600" size={24} />
      </div>

      <h3 className="font-black text-slate-950">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-2 leading-relaxed">
        {desc}
      </p>
    </Link>
  );
}

function SummaryCard({ icon: Icon, title, items }) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center">
          <Icon className="text-cyan-600" size={22} />
        </div>

        <h3 className="text-xl font-black text-slate-950">
          {title}
        </h3>
      </div>

      <div className="space-y-3">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
          >
            <p className="text-sm text-slate-500 font-semibold">
              {label}
            </p>

            <p className="font-black text-slate-950">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}