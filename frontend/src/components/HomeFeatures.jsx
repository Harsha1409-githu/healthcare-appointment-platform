import {
  Video,
  Brain,
  FileText,
  Pill,
  Bell,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomeFeatures() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Video Consultations",
      description:
        "Connect with doctors securely from anywhere through HD video consultations.",
      icon: Video,
      color:
        "from-blue-600 to-cyan-500",
      path: "/doctors",
    },

    {
      title: "AI Symptom Checker",
      description:
        "Describe symptoms and instantly discover the right specialist.",
      icon: Brain,
      color:
        "from-purple-600 to-fuchsia-500",
      path: "/symptom-checker",
    },

    {
      title: "Medical Records",
      description:
        "Upload reports, scans and prescriptions securely in one place.",
      icon: FileText,
      color:
        "from-emerald-600 to-teal-500",
      path: "/patient/medical-records",
    },

    {
      title: "Digital Prescriptions",
      description:
        "Receive prescriptions online and access them anytime.",
      icon: Pill,
      color:
        "from-orange-500 to-amber-500",
      path: "/patient/prescriptions",
    },

    {
      title: "Real-Time Notifications",
      description:
        "Get updates for appointments, prescriptions and approvals instantly.",
      icon: Bell,
      color:
        "from-rose-600 to-pink-500",
      path: "/notifications",
    },

    {
      title: "Smart Appointment Calendar",
      description:
        "Manage appointments using a modern scheduling experience.",
      icon: CalendarDays,
      color:
        "from-indigo-600 to-blue-500",
      path: "/doctors",
    },
  ];

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-flex px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-100">
            Why Choose MediCare
          </span>

          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-6">
            Everything You Need
            <span className="block text-blue-600">
              For Better Healthcare
            </span>
          </h2>

          <p className="max-w-3xl mx-auto text-slate-500 text-lg mt-5">
            MediCare combines appointments, consultations,
            AI guidance, prescriptions and records into one
            powerful healthcare ecosystem.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group relative"
              >
                <div
                  className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-40 blur transition duration-500`}
                />

                <div className="relative bg-white rounded-[2rem] border border-slate-100 shadow-xl p-7 h-full group-hover:-translate-y-2 transition duration-500">
                  <div
                    className={`w-16 h-16 rounded-3xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-xl`}
                  >
                    <Icon
                      size={30}
                      className="text-white"
                    />
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mt-6">
                    {feature.title}
                  </h3>

                  <p className="text-slate-500 mt-4 leading-relaxed">
                    {feature.description}
                  </p>

                  <button
                    onClick={() =>
                      navigate(feature.path)
                    }
                    className="mt-6 flex items-center gap-2 text-blue-600 font-black"
                  >
                    Explore Feature
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition"
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}