export default function SkeletonCard({
  height = "h-24",
  rounded = "rounded-3xl",
}) {
  return (
    <div
      className={`
        ${height}
        ${rounded}
        relative
        overflow-hidden
        bg-slate-100
        border
        border-slate-100
      `}
    >
      <div
        className="
          absolute inset-0
          -translate-x-full
          animate-[shimmer_1.5s_infinite]
          bg-gradient-to-r
          from-transparent
          via-white/70
          to-transparent
        "
      />
    </div>
  );
}