import {
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

import Button from "../components/ui/Button";
import DoctorDashboardMockup from "../components/showcase/doctor/DoctorDashboardMockup";

const features = [
  "Today’s appointment schedule",
  "Patient check-in review",
  "Consultation notes",
  "Video consultation control",
  "Digital prescriptions",
  "Follow-up management",
];

export default function DoctorExperience() {
  return (
    <section className="bg-slate-950 py-28 text-white">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-20 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <DoctorDashboardMockup />
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-xl">
              <ShieldCheck size={16} className="text-cyan-300" />
              <span className="text-xs font-black text-cyan-300">
                FOR DOCTORS
              </span>
            </div>

            <h2 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight lg:text-6xl">
              A smarter way
              <span className="block text-cyan-300">
                to manage care.
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              TryDoc gives doctors a clean daily workflow for appointments,
              patient check-ins, consultation notes, prescriptions, video
              consultations and follow-up care.
            </p>

            <div className="mt-10 space-y-4">
              {features.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-cyan-300" />
                  <span className="font-semibold text-slate-200">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Button href="#waitlist">
                Join Doctor Early Access
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}