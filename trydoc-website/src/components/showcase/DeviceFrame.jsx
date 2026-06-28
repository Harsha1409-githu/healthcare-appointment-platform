export default function DeviceFrame({ children }) {
  return (
    <div className="relative mx-auto w-[390px]">
      {/* Device shadow */}
      <div className="absolute inset-0 scale-[1.04] rounded-[4.2rem] bg-black/10 blur-3xl" />

      {/* Titanium frame */}
      <div className="relative rounded-[4rem] bg-gradient-to-br from-slate-500 via-slate-300 to-slate-600 p-[3px] shadow-[0_60px_140px_rgba(15,23,42,0.35)]">

        {/* Frame */}
        <div className="relative overflow-hidden rounded-[3.8rem] bg-black">

          {/* Dynamic Island */}
          <div className="absolute left-1/2 top-3 z-50 h-8 w-36 -translate-x-1/2 rounded-full bg-black shadow-lg" />

          {/* Speaker */}
          <div className="absolute left-1/2 top-[18px] z-50 h-1 w-14 -translate-x-1/2 rounded-full bg-slate-800" />

          {/* Screen */}
          <div className="relative h-[800px] overflow-hidden rounded-[3.6rem] bg-white">
            {children}

            {/* Glass reflection */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/18 via-transparent to-transparent" />
          </div>

          {/* Bottom gesture bar */}
          <div className="absolute bottom-2 left-1/2 h-1.5 w-36 -translate-x-1/2 rounded-full bg-white/70" />
        </div>
      </div>

      {/* Left buttons */}
      <div className="absolute left-[-3px] top-36 h-12 w-[3px] rounded-l-full bg-slate-500" />
      <div className="absolute left-[-3px] top-52 h-20 w-[3px] rounded-l-full bg-slate-500" />

      {/* Right power button */}
      <div className="absolute right-[-3px] top-44 h-24 w-[3px] rounded-r-full bg-slate-500" />
    </div>
  );
}