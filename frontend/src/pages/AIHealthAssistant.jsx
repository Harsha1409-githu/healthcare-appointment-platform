import { Link } from "react-router-dom";
import {
  Brain,
  Stethoscope,
  HeartPulse,
  Activity,
  AlertTriangle,
  Bot,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function AIHealthAssistant() {
  const aiFeatures = [
    {
      title: "Symptom Checker",
      desc: "Analyze symptoms with AI",
      icon: Brain,
      to: "/symptom-checker",
    },
    {
      title: "Find Doctor",
      desc: "Match with specialists",
      icon: Stethoscope,
      to: "/ai-doctor-match",
    },
    {
      title: "Health Insights",
      desc: "View AI health summary",
      icon: HeartPulse,
      to: "/patient/ai-health-insights",
    },
    {
      title: "Health Timeline",
      desc: "Appointments & records",
      icon: Activity,
      to: "/patient/health-timeline",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f4f8fb] px-4 pt-4 pb-24">
      <div className="max-w-md mx-auto">
        <header className="mb-3">
          <div className="inline-flex items-center gap-1.5 text-cyan-700 font-black text-xs">
            <Sparkles size={15} />
            AI HEALTH
          </div>

          <h1 className="text-2xl font-black text-slate-950 mt-1">
            TryDoc AI
          </h1>

          <p className="text-sm text-slate-500 font-semibold">
            Smart health guidance in one place
          </p>
        </header>

        <section className="bg-cyan-600 rounded-3xl p-5 text-white shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black text-cyan-100">
                AI ASSISTANT
              </p>

              <h2 className="text-2xl font-black mt-1">
                Your Personal Health Guide
              </h2>

              <p className="text-sm text-cyan-100 mt-2 leading-relaxed">
                Check symptoms, match doctors and track your health faster.
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Bot size={28} />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 mt-3">
          {aiFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <Link
                key={feature.title}
                to={feature.to}
                className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm active:scale-95 transition"
              >
                <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center mb-3">
                  <Icon className="text-cyan-600" size={22} />
                </div>

                <h3 className="font-black text-slate-900 text-sm">
                  {feature.title}
                </h3>

                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {feature.desc}
                </p>

                <div className="mt-3 flex justify-end">
                  <ChevronRight className="text-cyan-600" size={18} />
                </div>
              </Link>
            );
          })}
        </section>

        <section className="mt-3 bg-amber-50 border border-amber-100 rounded-3xl p-4">
          <div className="flex gap-3">
            <AlertTriangle
              size={18}
              className="text-amber-600 shrink-0 mt-0.5"
            />

            <div>
              <p className="text-xs font-black text-amber-800">
                Important Notice
              </p>

              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                AI suggestions are informational only and do not replace medical
                advice. Contact emergency services for urgent conditions.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}