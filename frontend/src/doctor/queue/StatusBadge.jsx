export default function StatusBadge({ label }) {
  const style =
    label === "Completed"
      ? "bg-emerald-100 text-emerald-700"
      : label === "Ready"
      ? "bg-orange-100 text-orange-700"
      : label === "Waiting Room"
      ? "bg-cyan-100 text-cyan-700"
      : label === "Missed" ||
        label === "Patient No-Show" ||
        label === "Doctor No-Show"
      ? "bg-red-100 text-red-700"
      : label === "Documentation Pending"
      ? "bg-amber-100 text-amber-700"
      : "bg-slate-100 text-slate-700";

  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black ${style}`}
    >
      {label}
    </span>
  );
}