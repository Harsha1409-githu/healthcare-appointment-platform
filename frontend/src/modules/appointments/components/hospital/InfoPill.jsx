function InfoPill({ icon: Icon, title, text }) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-3 py-3 min-w-0">
      <Icon size={18} className="text-cyan-600 shrink-0" />

      <div className="min-w-0">
        <p className="text-sm font-black text-slate-950 truncate">
          {title || "-"}
        </p>

        <p className="text-xs text-slate-500 truncate">
          {text || "-"}
        </p>
      </div>
    </div>
  );
}

export default InfoPill;