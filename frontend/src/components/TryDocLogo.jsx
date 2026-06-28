export default function TryDocLogo({ size = 42, showText = true }) {
  return (
    <div className="flex items-center gap-2">
      <div
        style={{ width: size, height: size }}
        className="rounded-2xl bg-cyan-600 flex items-center justify-center shadow-sm"
      >
        <span className="text-white font-black text-lg tracking-tight">
          TD
        </span>
      </div>

      {showText && (
        <div>
          <h1 className="text-xl font-black text-slate-950 leading-none">
            TryDoc
          </h1>
          <p className="text-[10px] font-bold text-cyan-700 mt-0.5">
            Smart Healthcare for Everyone
          </p>
        </div>
      )}
    </div>
  );
}