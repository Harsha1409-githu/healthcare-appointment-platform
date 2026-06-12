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
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-100",
    },
    {
      name: "Neurology",
      icon: Brain,
      desc: "Brain, nerves, migraine & stroke care",
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-100",
    },
    {
      name: "Pediatrics",
      icon: Baby,
      desc: "Child health, vaccines & growth support",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
    },
    {
      name: "Ophthalmology",
      icon: Eye,
      desc: "Eye checkups, vision & retina care",
      bg: "bg-cyan-50",
      text: "text-cyan-600",
      border: "border-cyan-100",
    },
    {
      name: "Orthopedics",
      icon: Bone,
      desc: "Bone, joint, spine & sports injury care",
      bg: "bg-orange-50",
      text: "text-orange-600",
      border: "border-orange-100",
    },
    {
      name: "General Physician",
      icon: Stethoscope,
      desc: "Fever, infection, diabetes & general care",
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-100",
    },
  ];

  const openSpecialty = (specialization) => {
    navigate(`/doctors?specialization=${encodeURIComponent(specialization)}`);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1450px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-5">
              <Sparkles size={17} />
              POPULAR SPECIALTIES
            </div>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-950">
              Consult doctors by
              <span className="block text-cyan-600">
                medical specialty
              </span>
            </h2>

            <p className="text-slate-500 mt-5 text-lg max-w-2xl leading-relaxed">
              Choose a specialty and instantly discover verified doctors
              available for consultation and appointment booking.
            </p>
          </div>

          <button
            onClick={() => navigate("/doctors")}
            className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-950 text-white font-black hover:bg-cyan-700 transition"
          >
            View All Specialties
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() => openSpecialty(item.name)}
                className={`group text-left bg-white rounded-[1.7rem] p-6 border ${item.border} shadow-sm hover:shadow-xl hover:-translate-y-1 transition`}
              >
                <div className="flex items-start justify-between gap-5">
                  <div
                    className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center shrink-0`}
                  >
                    <Icon size={30} className={item.text} />
                  </div>

                  <div className="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-cyan-600 transition">
                    <ArrowRight
                      size={20}
                      className="text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition"
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-950 mt-6">
                  {item.name}
                </h3>

                <p className="text-slate-500 mt-3 leading-relaxed">
                  {item.desc}
                </p>

                <div className="mt-5 text-cyan-600 font-black">
                  View available doctors
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}