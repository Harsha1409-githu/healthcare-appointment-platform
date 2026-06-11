import { useEffect, useState } from "react";
import {
  Brain,
  HeartPulse,
  CalendarCheck,
  Pill,
  FileText,
  Sparkles,
  Activity,
} from "lucide-react";
import api from "../api/axios";

export default function AIHealthInsights() {
  const patient = JSON.parse(
    localStorage.getItem("patientUser") ||
      localStorage.getItem("user") ||
      "null"
  );

  const [insights, setInsights] = useState(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      if (!patient?.id) return;

      const res = await api.get(
        `/patient/${patient.id}/health-insights`
      );

      setInsights(res.data);
    } catch (error) {
      console.error("AI insights error:", error);
    }
  };

  if (!insights) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
          Loading AI Health Insights...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
              <Brain className="text-white" size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-black text-slate-950">
                AI Health Insights
              </h1>
              <p className="text-slate-500">
                Personalized health summary based on your activity.
              </p>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-[360px_1fr] gap-6">
          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 rounded-3xl p-6 text-white shadow-xl">
            <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center mb-5">
              <HeartPulse className="text-cyan-300" size={34} />
            </div>

            <p className="text-blue-100 font-bold">Health Score</p>

            <h2 className="text-6xl font-black mt-2">
              {insights.healthScore}
              <span className="text-2xl text-blue-100">/100</span>
            </h2>

            <div className="w-full h-3 bg-white/10 rounded-full mt-6 overflow-hidden">
              <div
                className="h-full bg-cyan-300 rounded-full"
                style={{
                  width: `${insights.healthScore}%`,
                }}
              />
            </div>

            <p className="text-sm text-blue-100 mt-5">
              Score is calculated from consultations, prescriptions and active
              reminders.
            </p>
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
        </div>

        <div className="mt-6 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
              <Sparkles className="text-blue-600" size={24} />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">
                AI Recommendation
              </h2>

              <p className="text-slate-600 mt-2 font-medium">
                {insights.suggestion}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ icon: Icon, title, value, subtitle }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
        <Icon className="text-blue-600" size={24} />
      </div>

      <p className="text-3xl font-black text-slate-900">{value}</p>

      <p className="font-black text-slate-700 mt-1">{title}</p>

      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}