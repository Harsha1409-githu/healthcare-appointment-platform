export default function SectionCard({
  children,
  className = "",
  compact = false,
}) {
  return (
    <section
      className={`rounded-[2rem] border border-slate-100 bg-white shadow-sm ${
        compact ? "p-3" : "p-4"
      } ${className}`}
    >
      {children}
    </section>
  );
}
