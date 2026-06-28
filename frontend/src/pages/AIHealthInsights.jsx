import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  HeartPulse,
  CalendarCheck,
  Pill,
  FileText,
  Sparkles,
  Activity,
  Stethoscope,
  RefreshCcw,
} from "lucide-react";
import api from "../api/axios";

export default function AIHealthInsights() {
  const patient =
    JSON.parse(localStorage.getItem("patientUser") || "null") ||
    JSON.parse(localStorage.getItem("user") || "null");

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
      setInsights(null);
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
      <main className="min-h-screen bg-[#f4f8fb] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
          <Brain className="text-cyan-600 animate-pulse mx-auto" size={34} />
          <p className="text-slate-500 font-bold mt-3">
            Loading insights...
          </p>
        </div>
      </main>
    );
  }

  if (!insights) {
    return (
      <main className="min-h-screen bg-[#f4f8fb] px-4 pt-4 pb-24">
        <div className="max-w-md mx-auto">
          <header className="mb-4">
            <div className="inline-flex items-center gap-1.5 text-cyan-700 font-black text-xs">
              <Brain size={15} />
              AI HEALTH
            </div>

            <h1 className="text-2xl font-black text-slate-950 mt-1">
              Health Insights
            </h1>

            <p className="text-sm text-slate-500 font-semibold">
              Your AI health summary will appear here.
            </p>
          </header>

          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto mb-4">
              <Brain className="text-cyan-600" size={32} />
            </div>

            <h2 className="text-lg font-black text-slate-950">
              No insights available
            </h2>

            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Book appointments, add prescriptions or create medicine reminders
              to generate insights.
            </p>

            <button
              onClick={fetchInsights}
              className="mt-5 inline-flex items-center gap-2 bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black"
            >
              <RefreshCcw size={17} />
              Refresh
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8fb] px-4 pt-4 pb-24">
      <div className="max-w-md mx-auto">
        <header className="mb-4">
          <div className="inline-flex items-center gap-1.5 text-cyan-700 font-black text-xs">
            <Brain size={15} />
            AI HEALTH
          </div>

          <h1 className="text-2xl font-black text-slate-950 mt-1">
            Health Insights
          </h1>

          <p className="text-sm text-slate-500 font-semibold">
            Personalized summary from your health activity.
          </p>
        </header>

        <section className="bg-slate-950 rounded-3xl p-5 text-white shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-cyan-200 font-bold text-sm">
                Health Score
              </p>

              <h2 className="text-5xl font-black mt-1">
                {healthScore}
                <span className="text-lg text-cyan-100">/100</span>
              </h2>

              <p className="text-sm text-cyan-100 font-black mt-1">
                {scoreLabel}
              </p>
            </div>

            <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center">
              <HeartPulse className="text-cyan-300" size={34} />
            </div>
          </div>

          <div className="h-2 bg-white/10 rounded-full mt-5 overflow-hidden">
            <div
              className="h-full bg-cyan-300 rounded-full"
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <div className="flex gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center shrink-0">
              <Sparkles className="text-cyan-600" size={22} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-950">
                AI Recommendation
              </h2>

              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                {insights.suggestion ||
                  "Keep your profile updated and continue tracking appointments, prescriptions and medicines for better insights."}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <h2 className="text-lg font-black text-slate-950 mb-3">
            Health Summary
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <SummaryBox
              icon={CalendarCheck}
              value={insights.upcomingAppointments}
              label="Upcoming"
            />

            <SummaryBox
              icon={Activity}
              value={insights.completedAppointments}
              label="Completed"
            />

            <SummaryBox
              icon={FileText}
              value={insights.prescriptions}
              label="Prescriptions"
            />

            <SummaryBox
              icon={Pill}
              value={insights.activeReminders}
              label="Medicines"
            />
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <h2 className="text-lg font-black text-slate-950 mb-3">
            Quick Actions
          </h2>

          <div className="grid grid-cols-3 gap-3">
            <QuickAction
              to="/doctors"
              icon={Stethoscope}
              title="Doctors"
            />

            <QuickAction
              to="/patient/medicine-reminders"
              icon={Pill}
              title="Meds"
            />

            <QuickAction
              to="/patient/medical-records"
              icon={FileText}
              title="Records"
            />
          </div>
        </section>

        <button
          onClick={fetchInsights}
          className="mt-3 w-full bg-white border border-slate-200 text-slate-700 py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 active:scale-95 transition"
        >
          <RefreshCcw size={17} />
          Refresh Insights
        </button>
      </div>
    </main>
  );
}

function SummaryBox({ icon: Icon, value, label }) {
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-3">
      <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center mb-2">
        <Icon className="text-cyan-600" size={20} />
      </div>

      <p className="text-2xl font-black text-slate-950">
        {value || 0}
      </p>

      <p className="text-xs text-slate-500 font-black">
        {label}
      </p>
    </div>
  );
}

function QuickAction({ to, icon: Icon, title }) {
  return (
    <Link
      to={to}
      className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center active:scale-95 transition"
    >
      <Icon className="text-cyan-600 mx-auto" size={22} />

      <p className="text-xs font-black text-slate-800 mt-2">
        {title}
      </p>
    </Link>
  );
}