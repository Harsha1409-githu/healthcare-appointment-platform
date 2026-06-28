import { Link } from "react-router-dom";
import {
  FileText,
  HeartPulse,
  Clock3,
  ShieldAlert,
} from "lucide-react";

export default function HomeSearchSuggestions() {
  const selectedProfile = JSON.parse(
    localStorage.getItem("selectedProfile") || "null"
  );

  const items = [
    {
      title: "Records",
      subtitle: "Reports & files",
      icon: FileText,
      to: "/patient/medical-records",
    },
    {
      title: "Prescriptions",
      subtitle: "Doctor Rx",
      icon: HeartPulse,
      to: "/patient/prescriptions",
    },
    {
      title: "Timeline",
      subtitle: "Health history",
      icon: Clock3,
      to: "/patient/health-timeline",
    },
    {
      title: "Emergency",
      subtitle: "SOS profile",
      icon: ShieldAlert,
      to: "/patient/emergency-profile",
    },
  ];

  return (
    <section className="max-w-[900px] mx-auto px-4 py-2">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-black text-slate-950">
            Your Health Hub
          </h2>

          <p className="text-xs text-slate-500 font-bold">
            {selectedProfile?.fullName || "Self"}’s care essentials
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              to={item.to}
              className="bg-white border border-slate-100 shadow-sm rounded-2xl p-3 text-center active:scale-95 transition"
            >
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto">
                <Icon className="text-cyan-600" size={20} />
              </div>

              <p className="text-[11px] font-black text-slate-900 mt-2 leading-tight">
                {item.title}
              </p>

              <p className="text-[10px] text-slate-400 font-bold leading-tight">
                {item.subtitle}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}