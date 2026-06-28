import {
  ArrowRight,
  Brain,
  CalendarCheck,
  FileText,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Video,
} from "lucide-react";
import { motion } from "framer-motion";

import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import HeroExperienceSwitcher from "../components/showcase/HeroExperienceSwitcher";

export default function Hero() {
  return (
    <section className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-20 px-5 pb-20 pt-32 lg:grid-cols-[0.42fr_0.58fr] lg:gap-28 lg:px-8 lg:pt-28">
      <div className="absolute left-[-18rem] top-20 h-[34rem] w-[34rem] rounded-full bg-cyan-200/45 blur-3xl" />
      <div className="absolute bottom-10 right-[-14rem] h-[30rem] w-[30rem] rounded-full bg-sky-200/40 blur-3xl" />

      <div className="relative z-10">
        <Badge icon={ShieldCheck}>Launching Soon</Badge>

        <h1 className="mt-7 max-w-4xl text-6xl font-black leading-[0.9] tracking-[-0.075em] text-slate-950 md:text-7xl lg:text-8xl">
          Smart Healthcare
          <span className="block text-cyan-600">
            for Everyone
          </span>
        </h1>

        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
          Book appointments, consult doctors, manage health records, receive
          AI-powered guidance, and stay connected through one secure healthcare
          platform.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href="#waitlist">
            Get Early Access
            <ArrowRight size={18} />
          </Button>

          <Button href="#features" variant="secondary">
            Explore Features
          </Button>
        </div>

        <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
          <TrustItem text="Video Consultations" />
          <TrustItem text="Digital Prescriptions" />
          <TrustItem text="AI Health Assistant" />
          <TrustItem text="Family Profiles" />
        </div>

        <div className="mt-7 grid max-w-xl grid-cols-3 gap-3">
  <HeroTrust label="25+ Features" />
  <HeroTrust label="AI Powered" />
  <HeroTrust label="Secure Platform" />
</div>
        
      </div>

      <div className="relative z-10">

        
  <HeroExperienceSwitcher />
  
</div>
    </section>
    
  );
  
}



function TrustItem({ text }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
      <p className="text-sm font-black text-slate-950">
        ✓ {text}
      </p>
    </div>
  );
}

function FloatingCard({ icon: Icon, text, className }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute z-20 items-center gap-2 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-2xl backdrop-blur-xl ${className}`}
    >
      <Icon size={17} className="text-cyan-600" />
      <span className="text-xs font-black text-slate-700">
        {text}
      </span>
    </motion.div>
  );
}

function PhoneCard({ icon: Icon, title }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <Icon className="text-cyan-600" size={23} />

      <p className="mt-3 text-sm font-black text-slate-800">
        {title}
      </p>
    </div>
  );
}

function Timeline({ text }) {
  return (
    <div className="mt-3 flex items-center gap-3">
      <span className="h-2.5 w-2.5 rounded-full bg-cyan-600" />

      <p className="text-sm font-bold text-slate-600">
        {text}
      </p>
    </div>
  );
}
function HeroTrust({ label }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white/80 px-3 py-3 text-center shadow-sm backdrop-blur-xl">
      <p className="text-xs font-black text-slate-700">
        ✓ {label}
      </p>
    </div>
  );
}