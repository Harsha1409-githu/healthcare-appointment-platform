import { Search, X } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
}) {
  return (
    <div className="relative w-full">
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search doctors, hospitals, specialization..."
        className="
          w-full
          h-14
          pl-12
          pr-12
          rounded-2xl
          border border-slate-200
          bg-white
          shadow-sm
          text-slate-800
          placeholder:text-slate-400
          focus:outline-none
          focus:ring-4
          focus:ring-blue-100
          focus:border-blue-500
          transition-all
        "
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-slate-400
            hover:text-slate-700
            transition
          "
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}