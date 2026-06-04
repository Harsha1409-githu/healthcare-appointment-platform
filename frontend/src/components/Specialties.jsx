import {
  HeartPulse,
  Brain,
  Baby,
  Eye,
  Bone,
  Stethoscope,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Specialties() {
  const navigate = useNavigate();

  const items = [
    {
      name: "Cardiology",
      icon: HeartPulse,
      desc: "Heart care, ECG, BP & cardiac consultation",
      gradient: "from-red-500 to-pink-500",
      bg: "bg-red-50",
      text: "text-red-600",
      avatar: "❤️",
    },
    {
      name: "Neurology",
      icon: Brain,
      desc: "Brain, nerves, migraine & stroke care",
      gradient: "from-purple-500 to-indigo-500",
      bg: "bg-purple-50",
      text: "text-purple-600",
      avatar: "🧠",
    },
    {
      name: "Pediatrics",
      icon: Baby,
      desc: "Child health, vaccines & growth support",
      gradient: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      avatar: "👶",
    },
    {
      name: "Ophthalmology",
      icon: Eye,
      desc: "Eye checkups, vision & retina care",
      gradient: "from-cyan-500 to-blue-500",
      bg: "bg-cyan-50",
      text: "text-cyan-600",
      avatar: "👁️",
    },
    {
      name: "Orthopedics",
      icon: Bone,
      desc: "Bone, joint, spine & sports injury care",
      gradient: "from-orange-500 to-amber-500",
      bg: "bg-orange-50",
      text: "text-orange-600",
      avatar: "🦴",
    },
    {
      name: "General Physician",
      icon: Stethoscope,
      desc: "Fever, infection, diabetes & general care",
      gradient: "from-blue-600 to-cyan-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
      avatar: "🩺",
    },
  ];

  const openSpecialty = (specialization) => {
    navigate(
      `/doctors?specialization=${encodeURIComponent(
        specialization
      )}`
    );
  };

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-blue-50/60">
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold mb-5">
            <Sparkles size={18} />
            Explore Care Categories
          </div>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-950">
            Popular Medical
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Specialties
            </span>
          </h2>

          <p className="text-slate-500 mt-5 text-lg">
            Choose a specialty and instantly discover verified doctors
            available for consultation and appointment booking.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() => openSpecialty(item.name)}
                className="group relative text-left"
              >
                <div
                  className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r ${item.gradient} opacity-0 blur group-hover:opacity-50 transition duration-500`}
                />

                <div className="relative h-full bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl overflow-hidden group-hover:-translate-y-2 transition duration-500">
                  <div
                    className={`absolute -right-8 -top-8 w-28 h-28 ${item.bg} rounded-full`}
                  />

                  <div className="relative flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-20 h-20 rounded-3xl ${item.bg} flex items-center justify-center shadow-inner group-hover:scale-110 transition duration-500`}
                      >
                        <span className="text-4xl">
                          {item.avatar}
                        </span>
                      </div>

                      <div>
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${item.bg} ${item.text} text-xs font-bold mb-2`}
                        >
                          <Icon size={14} />
                          Specialist
                        </div>

                        <h3 className="text-2xl font-black text-slate-900">
                          {item.name}
                        </h3>
                      </div>
                    </div>

                    <div
                      className={`w-11 h-11 rounded-full bg-gradient-to-r ${item.gradient} flex items-center justify-center text-white shadow-lg group-hover:rotate-[-12deg] group-hover:scale-110 transition`}
                    >
                      <ArrowRight size={20} />
                    </div>
                  </div>

                  <p className="relative mt-5 text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="relative mt-6 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-400">
                      View available doctors
                    </span>

                    <span
                      className={`text-sm font-black ${item.text} group-hover:translate-x-1 transition`}
                    >
                      Explore →
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}