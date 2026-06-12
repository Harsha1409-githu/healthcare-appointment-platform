import {
  Search,
  CalendarDays,
  Video,
  Pill,
  FileText,
  ArrowRight,
} from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Find a Doctor",
      desc: "Search verified doctors by specialty, hospital, ratings and experience.",
    },
    {
      icon: CalendarDays,
      title: "Book Appointment",
      desc: "Select a convenient date and time slot instantly.",
    },
    {
      icon: Video,
      title: "Consult Online",
      desc: "Connect securely with your doctor through video consultation.",
    },
    {
      icon: Pill,
      title: "Get Prescription",
      desc: "Receive digital prescriptions immediately after consultation.",
    },
    {
      icon: FileText,
      title: "Track Records",
      desc: "Manage reports, prescriptions and medical history in one place.",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-cyan-50">
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-100 rounded-full blur-3xl opacity-40" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="inline-flex items-center px-5 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold">
            How MediCare Works
          </span>

          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mt-6">
            Healthcare in
            <span className="block text-cyan-600">
              5 Easy Steps
            </span>
          </h2>

          <p className="text-slate-500 text-lg mt-6 max-w-2xl mx-auto">
            Book appointments, consult doctors and manage your complete
            healthcare journey digitally.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-1 bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200 rounded-full" />

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="group relative"
                >
                  <div className="bg-white/90 backdrop-blur rounded-[2rem] p-6 shadow-lg border border-slate-100 text-center h-full hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                        <Icon
                          size={34}
                          className="text-white"
                        />
                      </div>

                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black shadow-lg">
                        {index + 1}
                      </div>
                    </div>

                    <h3 className="font-black text-xl text-slate-900 mt-5">
                      {step.title}
                    </h3>

                    <p className="text-slate-500 mt-4 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center mt-16">
          <button className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition">
            Start Your Health Journey
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}