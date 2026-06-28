import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  Stethoscope,
  UserRound,
} from "lucide-react";

import Button from "../components/ui/Button";
import PatientPhone from "../components/showcase/patient/PatientPhone";
import DoctorDashboardMockup from "../components/showcase/doctor/DoctorDashboardMockup";
import HospitalDashboardMockup from "../components/showcase/hospital/HospitalDashboardMockup";

const experiences = [
  {
    id: "patient",
    label: "Patient",
    icon: UserRound,
    eyebrow: "FOR PATIENTS",
    title: "Healthcare, beautifully simplified.",
    text: "Book appointments, consult online, manage family profiles, access prescriptions, follow-ups and medical records in one app.",
    cta: "Book Smarter",
    glow: "bg-cyan-200/40",
    points: [
      "Book appointments instantly",
      "Video consultation",
      "Digital prescriptions",
      "Family profiles",
      "Health timeline",
    ],
  },
  {
    id: "doctor",
    label: "Doctor",
    icon: Stethoscope,
    eyebrow: "FOR DOCTORS",
    title: "A smarter way to manage care.",
    text: "Doctors get a clean daily workflow for appointments, check-ins, consultation notes, prescriptions, video consults and follow-ups.",
    cta: "Start Consulting",
    glow: "bg-blue-200/40",
    points: [
      "Today's schedule",
      "Patient check-in review",
      "Consultation notes",
      "Prescription workflow",
      "Follow-up management",
    ],
  },
  {
    id: "hospital",
    label: "Hospital",
    icon: Building2,
    eyebrow: "FOR HOSPITALS",
    title: "Modern hospital operations.",
    text: "Hospitals can manage doctors, appointments, approvals, analytics, revenue and operational workflows from one dashboard.",
    cta: "Manage Operations",
    glow: "bg-emerald-200/40",
    points: [
      "Doctor management",
      "Appointment analytics",
      "Revenue monitoring",
      "Hospital approvals",
      "Operational insights",
    ],
  },
];

export default function ExperienceShowcase() {
  const [active, setActive] = useState("patient");
  const [paused, setPaused] = useState(false);

  const currentIndex = experiences.findIndex((item) => item.id === active);
  const current = experiences[currentIndex];

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setActive((prev) => {
        const index = experiences.findIndex((item) => item.id === prev);
        const nextIndex = (index + 1) % experiences.length;
        return experiences[nextIndex].id;
      });
    }, 5500);

    return () => clearInterval(interval);
  }, [paused]);

  return (
    <section
      className="relative overflow-hidden bg-white py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        key={`glow-left-${active}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`absolute left-[-16rem] top-24 h-[34rem] w-[34rem] rounded-full ${current.glow} blur-3xl`}
      />

      <motion.div
        key={`glow-right-${active}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`absolute right-[-18rem] bottom-20 h-[34rem] w-[34rem] rounded-full ${current.glow} blur-3xl`}
      />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="td-eyebrow">ONE PLATFORM</p>

          <h2 className="mt-4 td-heading-xl">
            Built for Patients.
            <span className="block text-cyan-600">
              Loved by Doctors.
            </span>
            <span className="block">
              Trusted by Hospitals.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            TryDoc brings every healthcare journey into one connected digital
            ecosystem.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl rounded-[2.2rem] border border-slate-100 bg-[#f8fbfc] p-2 shadow-sm">
          <div className="relative grid grid-cols-3 gap-1">
            <motion.div
              className="absolute bottom-0 top-0 rounded-[1.7rem] bg-white shadow-sm"
              animate={{
                left: `${currentIndex * 33.333}%`,
              }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 32,
              }}
              style={{
                width: "33.333%",
              }}
            />

            {experiences.map((item) => {
              const Icon = item.icon;
              const selected = active === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(item.id)}
                  className={`relative z-10 flex items-center justify-center gap-2 rounded-[1.7rem] px-3 py-4 text-sm font-black transition ${
                    selected
                      ? "text-cyan-700"
                      : "text-slate-500 hover:text-slate-950"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2">
          {experiences.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-12 bg-cyan-600"
                  : "w-2 bg-slate-200"
              }`}
              aria-label={item.label}
            />
          ))}
        </div>

        <div className="mt-16 grid items-center gap-20 lg:grid-cols-[0.42fr_0.58fr]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${current.id}`}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.35 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2">
                <current.icon size={16} className="text-cyan-600" />

                <span className="text-xs font-black text-cyan-700">
                  {current.eyebrow}
                </span>
              </div>

              <h3 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight text-slate-950 lg:text-6xl">
                {current.title}
              </h3>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                {current.text}
              </p>

              <div className="mt-10 space-y-4">
                {current.points.map((point, index) => (
                  <motion.div
                    key={point}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 size={20} className="text-cyan-600" />

                    <span className="font-semibold text-slate-700">
                      {point}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10">
                <Button href="#waitlist">
                  {current.cta}
                  <ChevronRight size={18} />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="relative flex min-h-[720px] justify-center lg:justify-end">
            <div className="absolute inset-x-8 bottom-20 top-10 rounded-[4rem] border border-white/70 bg-white/50 shadow-[0_80px_180px_rgba(15,23,42,0.12)] backdrop-blur-2xl" />

            <AnimatePresence mode="wait">
              <motion.div
                key={`mockup-${active}`}
                initial={{ opacity: 0, x: 42, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -42, scale: 0.96 }}
                transition={{ duration: 0.42, ease: "easeOut" }}
                className="relative z-10 w-full max-w-[520px]"
              >
                {active === "patient" && <PatientPhone />}
                {active === "doctor" && <DoctorDashboardMockup />}
                {active === "hospital" && <HospitalDashboardMockup />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}