function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 text-center">
      <Icon className="text-cyan-600 mx-auto" size={17} />

      <p className="text-sm font-black text-slate-950 mt-1">
        {value}
      </p>

      <p className="text-[9px] text-slate-500 font-bold">
        {label}
      </p>
    </div>
  );
}

export default MiniStat;