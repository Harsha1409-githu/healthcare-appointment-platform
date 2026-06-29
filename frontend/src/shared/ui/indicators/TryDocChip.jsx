export default function TryDocChip({
  children,
  selected = false,
  color = "cyan",
  onClick,
  disabled = false,
  className = "",
}) {
  const colors = {
    cyan: selected
      ? "bg-cyan-600 text-white border-cyan-600"
      : "bg-cyan-50 text-cyan-700 border-cyan-100",

    green: selected
      ? "bg-emerald-600 text-white border-emerald-600"
      : "bg-emerald-50 text-emerald-700 border-emerald-100",

    orange: selected
      ? "bg-orange-600 text-white border-orange-600"
      : "bg-orange-50 text-orange-700 border-orange-100",

    red: selected
      ? "bg-red-600 text-white border-red-600"
      : "bg-red-50 text-red-700 border-red-100",

    slate: selected
      ? "bg-slate-800 text-white border-slate-800"
      : "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-xs font-bold transition active:scale-95 disabled:opacity-50 ${
        colors[color] || colors.cyan
      } ${className}`}
    >
      {children}
    </button>
  );
}