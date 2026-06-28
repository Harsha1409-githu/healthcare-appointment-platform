import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="mt-5 flex items-center gap-3 rounded-3xl border border-slate-100 bg-white px-4 py-4 shadow-sm">
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-50 text-cyan-600">
        <Search size={19} />
      </div>

      <div>
        <p className="text-xs font-black text-slate-400">Search</p>
        <p className="text-sm font-black text-slate-800">
          Doctors, hospitals or symptoms
        </p>
      </div>
    </div>
  );
}