import {
  Video,
  Brain,
  FileText,
  Pill,
  Bell,
  CalendarDays,
  ArrowRight,
  Stethoscope,
  FlaskConical,
  Hospital,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomeFeatures() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Find Doctors",
      description: "Search verified doctors by specialty and book appointments instantly.",
      icon: Stethoscope,
      path: "/doctors",
    },
    {
      title: "Video Consultation",
      description: "Consult trusted doctors online from the comfort of your home.",
      icon: Video,
      path: "/doctors",
    },
    {
      title: "AI Symptom Checker",
      description: "Describe symptoms and get guidance to find the right specialist.",
      icon: Brain,
      path: "/symptom-checker",
    },
    {
      title: "Medical Records",
      description: "Upload and manage reports, scans and prescriptions securely.",
      icon: FileText,
      path: "/patient/medical-records",
    },
    {
      title: "Lab Tests",
      description: "Explore health packages and diagnostic test options easily.",
      icon: FlaskConical,
      path: "/lab-tests",
    },
    {
      title: "Hospitals",
      description: "Discover trusted hospitals and available specialists near you.",
      icon: Hospital,
      path: "/hospitals",
    },
    {
      title: "Digital Prescriptions",
      description: "Access doctor prescriptions online anytime from your account.",
      icon: Pill,
      path: "/patient/prescriptions",
    },
    {
      title: "Notifications",
      description: "Get updates for appointments, prescriptions and approvals instantly.",
      icon: Bell,
      path: "/notifications",
    },
    {
      title: "Smart Calendar",
      description: "Manage doctor appointments with a simple scheduling experience.",
      icon: CalendarDays,
      path: "/doctors",
    },
  ];

  return (
    <section className="relative py-20 bg-white">
      <div className="max-w-[1450px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm">
              TryDoc SERVICES
            </span>

            <h2 className="text-4xl md:text-5xl font-black text-slate-950 mt-5">
              One place for all your
              <span className="block text-cyan-600">
                healthcare needs
              </span>
            </h2>

            <p className="max-w-2xl text-slate-500 text-lg mt-5 leading-relaxed">
              Book appointments, consult doctors online, manage health records,
              track prescriptions and access smart healthcare features.
            </p>
          </div>

          <button
            onClick={() => navigate("/doctors")}
            className="inline-flex items-center justify-center gap-2 bg-slate-950 text-white px-6 py-4 rounded-2xl font-black hover:bg-cyan-700 transition"
          >
            View All Services
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <button
                key={feature.title}
                onClick={() => navigate(feature.path)}
                className="group text-left bg-white border border-slate-100 rounded-[1.7rem] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center shrink-0 group-hover:bg-cyan-600 transition">
                    <Icon
                      size={28}
                      className="text-cyan-600 group-hover:text-white transition"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-950">
                      {feature.title}
                    </h3>

                    <p className="text-slate-500 mt-2 leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 text-cyan-600 font-black">
                      Explore
                      <ArrowRight
                        size={17}
                        className="group-hover:translate-x-1 transition"
                      />
                    </div>
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