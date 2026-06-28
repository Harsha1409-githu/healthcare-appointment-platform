import { CheckCircle2, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = (e) => {
    e.preventDefault();

    if (!email) return;

    // TODO:
    // Connect with Supabase / Firebase / Mailchimp later

    setSuccess(true);
    setEmail("");

    setTimeout(() => {
      setSuccess(false);
    }, 4000);
  };

  return (
    <section
      id="waitlist"
      className="relative overflow-hidden bg-slate-950 py-28 text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0891b220,transparent_70%)]" />

      <div className="relative mx-auto max-w-5xl px-5 text-center">

        <p className="text-xs font-black tracking-[0.2em] text-cyan-300">
          EARLY ACCESS
        </p>

        <h2 className="mt-5 text-5xl md:text-6xl font-black leading-[0.95]">
          Be among the first
          <span className="block text-cyan-300">
            to experience TryDoc.
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Join our early access program and receive exclusive launch updates,
          priority onboarding and premium features before everyone else.
        </p>

        <motion.form
          layout
          onSubmit={submit}
          className="mx-auto mt-12 flex max-w-2xl flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl md:flex-row"
        >
          <div className="relative flex-1">
            <Mail
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-16 w-full rounded-2xl border border-white/10 bg-white/10 pl-14 pr-5 text-white placeholder:text-slate-400 outline-none focus:border-cyan-500"
            />
          </div>

          <button
            className="flex h-16 items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-8 font-black transition hover:scale-[1.02]"
          >
            Get Early Access
            <ArrowRight size={18} />
          </button>
        </motion.form>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-5 py-3 text-emerald-300"
          >
            <CheckCircle2 size={18} />
            You're on the waitlist 🎉
          </motion.div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-slate-400">
          <span>✓ No spam</span>
          <span>✓ Launch updates</span>
          <span>✓ Priority access</span>
        </div>

      </div>
    </section>
  );
}