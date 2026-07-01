import { CheckCircle2, ChevronDown } from "lucide-react";

export default function StepCard({
  id,
  activeStep,
  setActiveStep,
  done,
  icon: Icon,
  title,
  children,
}) {
  const open = activeStep === id;

  return (
    <section className="mt-3 rounded-[1.7rem] border border-slate-100 bg-white p-3 shadow-sm">
      <button
        type="button"
        onClick={() => setActiveStep(open ? "" : id)}
        className="flex w-full items-center gap-3 text-left"
      >
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
            done
              ? "bg-emerald-50 text-emerald-600"
              : "bg-cyan-50 text-cyan-600"
          }`}
        >
          {done ? <CheckCircle2 size={19} /> : <Icon size={19} />}
        </div>

        <h2 className="flex-1 text-base font-black text-slate-950">
          {title}
        </h2>

        <ChevronDown
          className={`text-slate-400 transition ${open ? "rotate-180" : ""}`}
          size={18}
        />
      </button>

      {open && <div className="mt-3">{children}</div>}
    </section>
  );
}