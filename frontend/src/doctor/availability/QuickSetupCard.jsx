import { Building2, CalendarDays, Video } from "lucide-react";

export default function QuickSetupCard({
  onApplyClinic,
  onApplyVideo,
  onApplyMixed,
  onCopyMonday,
}) {
  return (
    <section className="mb-3 rounded-[1.7rem] border border-slate-100 bg-white p-3 shadow-sm">
      <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700">
        Quick Setup
      </p>

      <h2 className="mt-1 text-lg font-black text-slate-950">
        Create weekly practice
      </h2>

     <div className="mt-3 grid grid-cols-4 gap-2">
        <QuickButton icon={Building2} label="Clinic" onClick={onApplyClinic} />
        <QuickButton icon={Video} label="Video" onClick={onApplyVideo} />
        <QuickButton icon={CalendarDays} label="Mixed" onClick={onApplyMixed} />
        <QuickButton
  icon={CalendarDays}
  label="Copy Mon"
  onClick={onCopyMonday}
/>
      </div>
    </section>
  );
}

function QuickButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl bg-slate-50 px-2 py-3 text-center active:scale-95"
    >
      <Icon size={18} className="mx-auto text-cyan-600" />
      <p className="mt-1 text-xs font-black text-slate-800">{label}</p>
    </button>
  );
}