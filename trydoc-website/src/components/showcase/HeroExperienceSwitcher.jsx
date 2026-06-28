import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Building2, Stethoscope, UserRound } from "lucide-react";

import PatientPhone from "./patient/PatientPhone";
import DoctorDashboardMockup from "./doctor/DoctorDashboardMockup";
import HospitalDashboardMockup from "./hospital/HospitalDashboardMockup";

const items = [
  { id: "patient", label: "Patient", icon: UserRound },
  { id: "doctor", label: "Doctor", icon: Stethoscope },
  { id: "hospital", label: "Hospital", icon: Building2 },
];

export default function HeroExperienceSwitcher() {
  const [active, setActive] = useState("patient");

  const activeIndex = items.findIndex((item) => item.id === active);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => {
        const index = items.findIndex((item) => item.id === prev);
        return items[(index + 1) % items.length].id;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div className="mx-auto mb-6 max-w-md rounded-[2rem] border border-slate-100 bg-white/80 p-2 shadow-sm backdrop-blur-xl">
        <div className="relative grid grid-cols-3 gap-1">
          <motion.div
            className="absolute bottom-0 top-0 rounded-[1.5rem] bg-cyan-600 shadow-sm"
            animate={{ left: `${activeIndex * 33.333}%` }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            style={{ width: "33.333%" }}
          />

          {items.map((item) => {
            const Icon = item.icon;
            const selected = active === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item.id)}
                className={`relative z-10 flex items-center justify-center gap-2 rounded-[1.5rem] px-3 py-3 text-xs font-black transition ${
                  selected ? "text-white" : "text-slate-500"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative min-h-[680px]">
        <div className="absolute inset-x-8 bottom-20 top-10 rounded-[4rem] border border-white/70 bg-white/50 shadow-[0_80px_180px_rgba(15,23,42,0.12)] backdrop-blur-2xl" />

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 42, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -42, scale: 0.96 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
            className="relative z-10"
          >
            {active === "patient" && <PatientPhone />}
            {active === "doctor" && <DoctorDashboardMockup />}
            {active === "hospital" && <HospitalDashboardMockup />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}