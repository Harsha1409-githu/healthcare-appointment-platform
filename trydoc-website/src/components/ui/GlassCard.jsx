export default function GlassCard({ children, className = "" }) {
  return (
    <div className={`td-glass rounded-[2rem] p-6 ${className}`}>
      {children}
    </div>
  );
}