export default function StatCard({ value, label, text }) {
  return (
    <div className="td-card text-center">
      <p className="text-4xl font-black tracking-[-0.05em] text-slate-950">
        {value}
      </p>

      <p className="mt-2 text-sm font-black text-cyan-700">
        {label}
      </p>

      {text && (
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {text}
        </p>
      )}
    </div>
  );
}