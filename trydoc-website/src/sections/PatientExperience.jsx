import {
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

import Button from "../components/ui/Button";
import PatientPhone from "../components/showcase/patient/PatientPhone";

const features = [
  "Book appointments instantly",
  "Video consultations",
  "Digital prescriptions",
  "Family profiles",
  "AI Health Assistant",
  "Medical timeline",
];

export default function PatientExperience() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT */}

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2">
              <ShieldCheck size={16} className="text-cyan-600" />
              <span className="text-xs font-black text-cyan-700">
                FOR PATIENTS
              </span>
            </div>

            <h2 className="mt-6 text-5xl lg:text-6xl font-black leading-[0.95] tracking-tight">
              Healthcare,
              <span className="block text-cyan-600">
                beautifully simplified.
              </span>
            </h2>

            <p className="mt-6 text-lg text-slate-600 leading-8">
              Everything a patient needs—from booking appointments to
              prescriptions, AI guidance and follow-ups—in one beautifully
              designed healthcare app.
            </p>

            <div className="mt-10 space-y-4">
              {features.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2
                    size={20}
                    className="text-cyan-600"
                  />

                  <span className="font-semibold text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Button href="#waitlist">
                Get Early Access
                <ChevronRight size={18} />
              </Button>
            </div>

          </div>

          {/* RIGHT */}

          <div className="flex justify-center">
            <PatientPhone />
          </div>

        </div>

      </div>
    </section>
  );
}