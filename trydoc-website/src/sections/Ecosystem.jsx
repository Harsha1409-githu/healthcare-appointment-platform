import { Brain, Building2, Stethoscope, UserRound } from "lucide-react";

import Section from "../components/ui/Section";
import FeatureCard from "../components/ui/FeatureCard";

export default function Ecosystem() {
  return (
    <Section
      id="patients"
      eyebrow="ECOSYSTEM"
      title="One connected healthcare platform."
    >
      <div className="grid gap-5 md:grid-cols-3">
        <FeatureCard
          icon={UserRound}
          title="Patients"
          text="Book appointments, manage family profiles, access prescriptions and keep health records in one place."
        />

        <FeatureCard
          icon={Stethoscope}
          title="Doctors"
          text="Review check-ins, write consultation notes, create prescriptions, schedule follow-ups and manage care."
        />

        <FeatureCard
          icon={Building2}
          title="Hospitals"
          text="Manage doctors, appointments, hospital operations, approvals, analytics and patient workflows."
        />
      </div>

      <div className="mt-6 rounded-[2.5rem] bg-slate-950 p-6 text-white md:p-8">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-black tracking-[0.18em] text-cyan-300">
              TRYDOC CLOUD
            </p>

            <h3 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.04em] md:text-4xl">
              Patients, doctors and hospitals stay connected through one secure healthcare layer.
            </h3>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              Every appointment, consultation, prescription, follow-up and
              medical record becomes part of a continuous healthcare journey.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-400/20 text-cyan-300">
              <Brain size={28} />
            </div>

            <p className="mt-4 text-lg font-black">
              AI Health Engine
            </p>

            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-300">
              Supportive health insights designed to assist patients and
              care teams — not replace doctors.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}