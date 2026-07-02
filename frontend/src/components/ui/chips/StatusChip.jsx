export default function StatusChip({
  status = "PENDING",
  label,
  className = "",
}) {
  const value = String(status || "PENDING").toUpperCase();

  const styles = {
    RECOMMENDED: "bg-cyan-50 text-cyan-700 border-cyan-100",
    PENDING: "bg-amber-50 text-amber-700 border-amber-100",
    BOOKED: "bg-blue-50 text-blue-700 border-blue-100",
    PAID: "bg-violet-50 text-violet-700 border-violet-100",
    SCHEDULED: "bg-blue-50 text-blue-700 border-blue-100",
    IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-100",
    PROCESSING: "bg-amber-50 text-amber-700 border-amber-100",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    REVIEWED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    CANCELLED: "bg-red-50 text-red-700 border-red-100",
    FAILED: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black ${styles[value] || styles.PENDING} ${className}`}
    >
      {(label || value).replaceAll("_", " ")}
    </span>
  );
}
