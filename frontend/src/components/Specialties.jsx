import {
  HeartPulse,
  Brain,
  Baby,
  Eye,
  Bone,
  Stethoscope,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Specialties() {
  const navigate = useNavigate();

  const items = [
    {
      name: "Cardiology",
      icon: HeartPulse,
      bg: "bg-red-50",
      text: "text-red-600",
    },
    {
      name: "Neurology",
      icon: Brain,
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    {
      name: "Pediatrics",
      icon: Baby,
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      name: "Ophthalmology",
      icon: Eye,
      bg: "bg-cyan-50",
      text: "text-cyan-600",
    },
    {
      name: "Orthopedics",
      icon: Bone,
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
    {
      name: "General Physician",
      icon: Stethoscope,
      bg: "bg-blue-50",
      text: "text-blue-600",
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
    <section className="py-6 bg-white">
      <div className="max-w-[1450px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-black text-slate-900">
            Specialities
          </h2>

          <button
            onClick={() => navigate("/doctors")}
            className="text-cyan-600 font-black text-sm"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() => openSpecialty(item.name)}
                className="bg-white border border-slate-100 rounded-2xl p-3 text-center shadow-sm active:scale-95 transition"
              >
                <div
                  className={`w-12 h-12 mx-auto rounded-2xl ${item.bg} flex items-center justify-center`}
                >
                  <Icon size={22} className={item.text} />
                </div>

                <p className="text-xs md:text-sm font-bold text-slate-800 mt-2 leading-tight">
                  {item.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}