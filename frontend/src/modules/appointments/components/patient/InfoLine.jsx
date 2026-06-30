function InfoLine({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
      <Icon className="text-cyan-600 shrink-0" size={13} />
      <span className="truncate">{text || "-"}</span>
    </div>
  );
}

export default InfoLine;