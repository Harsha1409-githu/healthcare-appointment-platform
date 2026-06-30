import { CalendarCheck, Search, X } from "lucide-react";

import { QUICK_FILTERS } from "../../constants/appointment.constants";

export default function DoctorAppointmentToolbar({
  search,
  setSearch,
  view,
  setView,
  dateFilter,
  setDateFilter,
}) {
  return (
    <section className="sticky top-0 z-20 mt-3 space-y-2 bg-[#f6f8fb] pb-2 pt-1">
      <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-sm">
        <Search size={17} className="text-cyan-600" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patient"
          className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
        />

        {search && (
          <button type="button" onClick={() => setSearch("")}>
            <X size={16} className="text-slate-400" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {QUICK_FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setView(key)}
            className={`rounded-2xl py-2.5 text-[11px] font-black ${
              view === key
                ? "bg-cyan-600 text-white"
                : "border border-slate-100 bg-white text-slate-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {view === "CUSTOM" && (
        <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-sm">
          <CalendarCheck size={17} className="text-cyan-600" />

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
          />
        </div>
      )}
    </section>
  );
}