import {
  Brain,
  CalendarCheck,
  FileText,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

const nodes = [
  {
    icon: HeartPulse,
    title: "Symptoms",
    text: "Patient describes health concern",
    position: "left-0 top-10",
  },
  {
    icon: Stethoscope,
    title: "Specialist",
    text: "AI suggests right care category",
    position: "right-0 top-10",
  },
  {
    icon: CalendarCheck,
    title: "Booking",
    text: "Appointment journey starts",
    position: "left-4 bottom-10",
  },
  {
    icon: FileText,
    title: "Records",
    text: "Timeline stays connected",
    position: "right-4 bottom-10",
  },
];

export default function AISection() {
  return (
    <section id="ai" className="bg-slate-950 px-5 py-28 text-white lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-xl">
            <Sparkles size={16} className="text-cyan-300" />
            <span className="text-xs font-black text-cyan-300">
              TRYDOC AI ECOSYSTEM
            </span>
          </div>

          <h2 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight md:text-6xl">
            Intelligence that connects
            <span className="block text-cyan-300">
              the care journey.
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            TryDoc AI helps patients describe symptoms, discover the right
            specialist, prepare before consultations and keep healthcare records
            connected across patients, doctors and hospitals.
          </p>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
            <div className="flex gap-3">
              <ShieldCheck className="mt-1 shrink-0 text-cyan-300" size={22} />

              <p className="text-sm leading-7 text-slate-300">
                AI is designed to support healthcare decisions, not replace
                qualified doctors. Medical decisions should always be reviewed
                by professionals.
              </p>
            </div>
          </div>
        </div>

        <div className="relative min-h-[620px]">
          <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-3xl" />

          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 36,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20"
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 52,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
          />

          <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="grid h-40 w-40 place-items-center rounded-[2.5rem] border border-cyan-300/30 bg-cyan-500/20 shadow-[0_0_80px_rgba(34,211,238,0.35)] backdrop-blur-xl"
            >
              <div className="text-center">
                <Brain className="mx-auto text-cyan-300" size={44} />
                <p className="mt-3 text-sm font-black text-white">
                  TryDoc AI
                </p>
              </div>
            </motion.div>
          </div>

          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 600 620"
            fill="none"
          >
            <motion.path
              d="M300 310 C180 180 120 120 80 90"
              stroke="#22D3EE"
              strokeOpacity="0.35"
              strokeWidth="2"
              strokeDasharray="8 8"
              animate={{ strokeDashoffset: [0, -32] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            <motion.path
              d="M300 310 C420 180 480 120 520 90"
              stroke="#22D3EE"
              strokeOpacity="0.35"
              strokeWidth="2"
              strokeDasharray="8 8"
              animate={{ strokeDashoffset: [0, -32] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            <motion.path
              d="M300 310 C180 440 130 510 90 560"
              stroke="#22D3EE"
              strokeOpacity="0.35"
              strokeWidth="2"
              strokeDasharray="8 8"
              animate={{ strokeDashoffset: [0, -32] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            <motion.path
              d="M300 310 C420 440 480 510 520 560"
              stroke="#22D3EE"
              strokeOpacity="0.35"
              strokeWidth="2"
              strokeDasharray="8 8"
              animate={{ strokeDashoffset: [0, -32] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </svg>

          {nodes.map((node, index) => {
            const Icon = node.icon;

            return (
              <motion.div
                key={node.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  opacity: { duration: 0.4, delay: index * 0.15 },
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.25,
                  },
                }}
                viewport={{ once: true }}
                className={`absolute z-30 w-52 rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-xl ${node.position}`}
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/20 text-cyan-300">
                  <Icon size={24} />
                </div>

                <h3 className="mt-4 text-lg font-black text-white">
                  {node.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {node.text}
                </p>
              </motion.div>
            );
          })}

          <div className="absolute bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 rounded-[2rem] border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-400/20 text-cyan-300">
                <Users size={22} />
              </div>

              <div>
                <p className="text-sm font-black text-white">
                  Patients • Doctors • Hospitals
                </p>
                <p className="text-xs font-bold text-slate-300">
                  Connected by one intelligent healthcare layer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}