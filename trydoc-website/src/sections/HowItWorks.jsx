import { CalendarCheck, HeartPulse, Stethoscope } from "lucide-react";

const steps = [
  {
    icon: CalendarCheck,
    title: "Book",
    text: "Find doctors, hospitals and available slots in seconds.",
  },
  {
    icon: Stethoscope,
    title: "Consult",
    text: "Attend in-person or video consultations with digital check-ins.",
  },
  {
    icon: HeartPulse,
    title: "Heal",
    text: "Access prescriptions, follow-ups and health records anytime.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-black text-cyan-700">HOW IT WORKS</p>
          <h2 className="text-4xl md:text-5xl font-black mt-3">
            Book. Consult. Heal.
          </h2>
          <p className="text-slate-600 mt-4">
            A simple healthcare journey designed for real patients and busy care teams.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-12">
          {steps.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="relative bg-[#f8fbfc] rounded-[2rem] border border-slate-100 p-7"
              >
                <span className="absolute top-5 right-6 text-5xl font-black text-cyan-100">
                  {index + 1}
                </span>

                <div className="w-14 h-14 rounded-2xl bg-cyan-600 text-white flex items-center justify-center">
                  <Icon size={26} />
                </div>

                <h3 className="text-2xl font-black mt-6">{item.title}</h3>
                <p className="text-slate-600 mt-2">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}