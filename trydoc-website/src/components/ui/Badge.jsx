export default function Badge({ icon: Icon, children }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-white px-4 py-2 text-xs font-black text-cyan-700 shadow-sm">
      {Icon && <Icon size={16} />}
      {children}
    </div>
  );
}