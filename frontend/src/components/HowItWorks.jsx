import {
  Search,
  CalendarDays,
  Video,
  Pill,
  FileText,
} from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Find a Doctor",
      desc: "Search verified doctors by specialty, experience and hospital.",
    },
    {
      icon: CalendarDays,
      title: "Book Appointment",
      desc: "Choose a convenient slot and confirm instantly.",
    },
    {
      icon: Video,
      title: "Consult Online",
      desc: "Meet your doctor through secure video consultation.",
    },
    {
      icon: Pill,
      title: "Get Prescription",
      desc: "Receive digital prescriptions immediately after consultation.",
    },
    {
      icon: FileText,
      title: "Track Records",
      desc: "Store reports, prescriptions and medical history securely.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-100">
            How MediCare Works
          </span>

          <h2 className="text-5xl font-black text-slate-900 mt-6">
            Healthcare in
            <span className="block text-blue-600">
              5 Simple Steps
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="relative text-center"
              >
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-xl">
                  <Icon size={34} className="text-white" />
                </div>

                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black mx-auto -mt-3 relative z-10">
                  {index + 1}
                </div>

                <h3 className="font-black text-xl mt-5">
                  {step.title}
                </h3>

                <p className="text-slate-500 mt-3">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}