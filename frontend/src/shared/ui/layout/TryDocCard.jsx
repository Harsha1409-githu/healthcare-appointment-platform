export default function TryDocCard({
  children,
  className = "",
  padding = "p-3",
}) {
  return (
    <section
      className={`rounded-[1.7rem] border border-slate-100 bg-white ${padding} shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}