import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock,
  PauseCircle,
  PlayCircle,
} from "lucide-react";

import { TryDocButton } from "@/shared/ui";

export default function TodayStatusHero({
  statusConfig,
  blockedUntil,
  selectedDateSlots,
  availableSlots,
  bookedSlots,
  activePauseType,
  onPause30,
  onPause60,
  onPause120,
  onCustomPause,
  onResume,
}) {
  const isPaused = Boolean(blockedUntil);

  const total = selectedDateSlots.length;
  const booked = bookedSlots.length;
  const open = availableSlots.length;
  const utilization = total ? Math.round((booked / total) * 100) : 0;

  return (
    <section className="mb-3 rounded-[2rem] bg-white p-3 shadow-sm ring-1 ring-slate-100">
      <div className="rounded-[1.7rem] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-wide text-cyan-200/80">
              Today&apos;s Practice
            </p>

            <h2 className="mt-1 text-2xl font-black">
              {isPaused ? "Bookings Paused" : statusConfig.title}
            </h2>

            <p className="mt-1 text-sm font-semibold text-white/70">
              {isPaused
                ? `Paused until ${blockedUntil.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : "Your practice is accepting bookings today"}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1.5 text-xs font-black ${
              isPaused
                ? "bg-orange-500 text-white"
                : "bg-emerald-500 text-white"
            }`}
          >
            ● {isPaused ? "Paused" : statusConfig.badge}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <HeroStat icon={CalendarDays} label="Total" value={total} />
          <HeroStat icon={CheckCircle2} label="Booked" value={booked} />
          <HeroStat icon={Activity} label="Open" value={open} />
        </div>
      </div>

      <div className="mt-3 rounded-[1.7rem] bg-slate-50 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
              Today&apos;s Utilization
            </p>

            <p className="mt-1 text-2xl font-black text-slate-950">
              {utilization}%
            </p>
          </div>

          <div className="rounded-2xl bg-white px-3 py-2 text-right">
            <p className="text-[10px] font-black uppercase text-slate-400">
              Booked
            </p>
            <p className="text-sm font-black text-slate-900">
              {booked}/{total}
            </p>
          </div>
        </div>

        <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-cyan-600"
            style={{ width: `${utilization}%` }}
          />
        </div>

        <p className="mt-2 text-xs font-semibold text-slate-500">
          {total
            ? `${open} appointment times are still open today.`
            : "No working hours created for today."}
        </p>
      </div>

      <div className="mt-3 rounded-[1.7rem] border border-slate-100 p-3">
        <div className="mb-2 flex items-center gap-2">
          <Clock size={16} className="text-cyan-600" />
          <p className="text-sm font-black text-slate-950">Quick Pause</p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <QuickPause label="30m" active={activePauseType === "30m"} onClick={onPause30} />
          <QuickPause label="1h" active={activePauseType === "1h"} onClick={onPause60} />
          <QuickPause label="2h" active={activePauseType === "2h"} onClick={onPause120} />
          <QuickPause label="Custom" active={activePauseType === "custom"} onClick={onCustomPause} />
        </div>

        {isPaused && (
          <TryDocButton
            fullWidth
            variant="success"
            leftIcon={PlayCircle}
            onClick={onResume}
            className="mt-3"
          >
            Resume Bookings
          </TryDocButton>
        )}

        {!isPaused && (
          <p className="mt-2 text-center text-xs font-semibold text-slate-500">
            Tap a time to pause bookings instantly.
          </p>
        )}
      </div>
    </section>
  );
}

function HeroStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3 text-center">
      <Icon size={17} className="mx-auto text-cyan-100" />
      <p className="mt-1 text-xl font-black leading-none">{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase text-white/55">
        {label}
      </p>
    </div>
  );
}

function QuickPause({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl py-3 text-[11px] font-black active:scale-95 ${
        active
          ? "bg-orange-500 text-white shadow-sm"
          : "bg-slate-100 text-slate-700"
      }`}
    >
      <PauseCircle size={14} className="mx-auto mb-1" />
      {label}
    </button>
  );
}