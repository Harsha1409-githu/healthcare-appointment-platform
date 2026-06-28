import { Brain, LockKeyhole, Network, Rocket } from "lucide-react";

const items = [
  {
    icon: Brain,
    title: "Intelligent Healthcare",
    text: "AI-assisted symptom guidance and specialist recommendations to prepare better for care.",
  },
  {
    icon: Network,
    title: "Connected Care",
    text: "Patients, doctors, hospitals, prescriptions and follow-ups stay connected in one flow.",
  },
  {
    icon: LockKeyhole,
    title: "Privacy First",
    text: "Designed around secure access, role-based workflows and protected health records.",
  },
  {
    icon: Rocket,
    title: "Built to Scale",
    text: "Made for individual doctors, clinics, hospitals and future healthcare networks.",
  },
];

export default function WhyTryDocSection() {
  return (
    <section className="max-w-7xl mx-auto px-5 py-20">
      <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
        <div>
          <p className="text-xs font-black text-cyan-700">WHY TRYDOC</p>
          <h2 className="text-4xl md:text-5xl font-black mt-3">
            Healthcare should feel simple, connected and trustworthy.
          </h2>
          <p className="text-slate-600 mt-5 leading-relaxed">
            TryDoc is built to reduce friction for patients while giving doctors
            and hospitals the tools they need to deliver better digital care.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
                  <Icon className="text-cyan-600" size={23} />
                </div>

                <h3 className="text-xl font-black mt-5">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}