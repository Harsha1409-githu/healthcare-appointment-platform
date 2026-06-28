export default function StatusBar() {
  return (
    <div className="flex items-center justify-between px-2 text-[11px] font-black text-slate-800">
      <span>9:41</span>

      <div className="flex items-center gap-1.5">
        <span>▰▰▰</span>
        <span>5G</span>
        <span>🔋</span>
      </div>
    </div>
  );
}