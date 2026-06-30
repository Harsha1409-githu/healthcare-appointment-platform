function MiniStat({ title, value }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 text-center">
      <p className="text-base font-black text-slate-950">{value}</p>
      <p className="text-[10px] text-slate-500 font-bold">{title}</p>
    </div>
  );
}

export default MiniStat;