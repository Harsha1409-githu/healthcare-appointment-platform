import { Link } from "react-router-dom";
import {
  Brain,
  Stethoscope,
  HeartPulse,
  Activity,
  ArrowRight,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export default function AIHealthAssistant() {
  const aiFeatures = [
    {
      title: "Symptom Checker",
      desc: "Enter symptoms and get possible condition, urgency and advice.",
      icon: Brain,
      to: "/symptom-checker",
      button: "Check Symptoms",
    },
    {
      title: "AI Doctor Match",
      desc: "Find the right specialist and recommended doctors based on symptoms.",
      icon: Stethoscope,
      to: "/ai-doctor-match",
      button: "Find Doctor",
    },
    {
      title: "AI Health Insights",
      desc: "View personalized health score, appointments, prescriptions and reminders.",
      icon: HeartPulse,
      to: "/patient/ai-health-insights",
      button: "View Insights",
    },
    {
      title: "Health Timeline",
      desc: "Track your appointments, reminders and health activities in one place.",
      icon: Activity,
      to: "/patient/health-timeline",
      button: "View Timeline",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4fbff] py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white p-8 md:p-12 shadow-2xl mb-8">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <Sparkles size={18} className="text-cyan-300" />
              <span className="font-black">MediCare AI</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              Your AI Health Assistant
            </h1>

            <p className="text-blue-100 text-lg mt-4">
              Check symptoms, find the right doctor, view health insights and
              track your medical journey from one place.
            </p>
          </div>
        </section>

        <div className="bg-red-50 border border-red-100 rounded-[2rem] p-5 mb-8 flex gap-4">
          <AlertTriangle className="text-red-600 shrink-0" size={28} />

          <div>
            <h3 className="font-black text-red-700">
              Emergency Notice
            </h3>

            <p className="text-red-600 mt-1">
              AI suggestions are only for guidance. For chest pain, breathing
              difficulty, severe bleeding, fainting or emergency symptoms,
              contact emergency care immediately.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {aiFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <Link
                key={feature.title}
                to={feature.to}
                className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 hover:-translate-y-2 hover:shadow-xl transition"
              >
                <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center mb-5">
                  <Icon className="text-cyan-600" size={28} />
                </div>

                <h2 className="text-xl font-black text-slate-950">
                  {feature.title}
                </h2>

                <p className="text-slate-500 mt-3">
                  {feature.desc}
                </p>

                <div className="mt-6 flex items-center gap-2 text-cyan-600 font-black">
                  {feature.button}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}