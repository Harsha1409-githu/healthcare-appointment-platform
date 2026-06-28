import { UserRound, Stethoscope, Building2 } from "lucide-react";

const products = [
  {
    icon: UserRound,
    title: "For Patients",
    text: "Book appointments, consult doctors, manage prescriptions, family profiles and medical records.",
  },
  {
    icon: Stethoscope,
    title: "For Doctors",
    text: "Daily schedule, check-ins, consultation notes, prescriptions, follow-ups and video control.",
  },
  {
    icon: Building2,
    title: "For Hospitals",
    text: "Manage doctors, appointments, approvals, analytics and hospital operations.",
  },
];

export default function ProductSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid lg:grid-cols-3 gap-5">
          {products.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[2rem] border border-slate-100 p-7 bg-[#f8fbfc]"
              >
                <Icon className="text-cyan-600" size={32} />

                <h3 className="text-2xl font-black mt-5">{item.title}</h3>

                <p className="text-slate-600 mt-3 leading-relaxed">
                  {item.text}
                </p>

                <button className="mt-6 text-cyan-700 font-black">
                  Learn more →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}