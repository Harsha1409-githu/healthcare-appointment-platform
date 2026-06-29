export default function AvailabilityHero({
  statusConfig,
  blockedUntil,
  selectedDateSlots,
  availableSlots,
  bookedSlots,
  nextAvailableSlot,
  onPause30,
  onPause60,
  onPause120,
  onCustomPause,
  onResume,
}) {
  return (
    <section
      className={`mb-3 rounded-[1.9rem] bg-gradient-to-br ${statusConfig.bg} p-4 text-white shadow-lg`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-wide text-white/75">
            Today&apos;s Status
          </p>

          <h2 className="mt-1 text-2xl font-black">{statusConfig.title}</h2>

          <p className="mt-1 text-sm font-semibold text-white/80">
            {blockedUntil
              ? `Paused until ${blockedUntil.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Patients can book your open slots"}
          </p>
        </div>

        <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-black">
          ● {statusConfig.badge}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <HeroStat label="Total" value={selectedDateSlots.length} />
        <HeroStat label="Free" value={availableSlots.length} />
        <HeroStat label="Booked" value={bookedSlots.length} />
      </div>

      <div className="mt-3 rounded-2xl bg-white/15 p-3">
        <p className="text-[11px] font-black text-white/70">
          NEXT AVAILABLE SLOT
        </p>

        <p className="mt-1 text-lg font-black">
          {nextAvailableSlot
            ? `${nextAvailableSlot.startTime} - ${nextAvailableSlot.endTime}`
            : "No free slot"}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        <button
          type="button"
          onClick={onPause30}
          className="rounded-2xl bg-white/20 py-3 text-[11px] font-black text-white active:scale-95"
        >
          30m
        </button>

        <button
          type="button"
          onClick={onPause60}
          className="rounded-2xl bg-white/20 py-3 text-[11px] font-black text-white active:scale-95"
        >
          1h
        </button>

        <button
          type="button"
          onClick={onPause120}
          className="rounded-2xl bg-white/20 py-3 text-[11px] font-black text-white active:scale-95"
        >
          2h
        </button>

        <button
          type="button"
          onClick={onCustomPause}
          className="rounded-2xl bg-white py-3 text-[11px] font-black text-slate-950 active:scale-95"
        >
          Custom
        </button>
      </div>

      <button
        type="button"
        onClick={onResume}
        className="mt-2 w-full rounded-2xl bg-white/15 py-3 text-xs font-black text-white active:scale-95"
      >
        Resume Availability
      </button>
    </section>
  );
}

function HeroStat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/15 p-3 text-center">
      <p className="text-xl font-black leading-none">{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase text-white/70">
        {label}
      </p>
    </div>
  );
}