export default function RecommendationStatus({ status = "RECOMMENDED" }) {
  const styles = {
    RECOMMENDED: "bg-cyan-50 text-cyan-700 border-cyan-100",
    BOOKED: "bg-blue-50 text-blue-700 border-blue-100",
    PAID: "bg-violet-50 text-violet-700 border-violet-100",
    IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-100",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    REVIEWED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    CANCELLED: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black ${
        styles[status] || styles.RECOMMENDED
      }`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
