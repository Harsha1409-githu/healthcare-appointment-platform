import { CalendarCheck, Search, X } from "lucide-react";

export default function HospitalAppointmentToolbar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  clearFilters,
}) {
  return (
   
 <section className="sticky top-[72px] z-20 bg-[#f4f8fb]/95 backdrop-blur-md pt-3 pb-3">
          <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-3 py-3 shadow-sm">
            <Search className="text-cyan-600 shrink-0" size={18} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient, phone, doctor"
              className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-slate-400"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2 mt-3">
            {["ALL", "BOOKED", "COMPLETED", "CANCELLED"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`py-2.5 rounded-2xl text-[10px] font-black transition ${
                  statusFilter === status
                    ? "bg-cyan-600 text-white"
                    : "bg-white text-slate-600 border border-slate-100"
                }`}
              >
                {status === "ALL"
                  ? "All"
                  : status === "BOOKED"
                  ? "Booked"
                  : status === "COMPLETED"
                  ? "Done"
                  : "Cancel"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-2 mt-3">
            <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-2xl px-3 py-3 shadow-sm">
              <CalendarCheck size={17} className="text-cyan-600" />

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-slate-800"
              />
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="px-4 rounded-2xl bg-slate-950 text-white text-xs font-black"
            >
              Clear
            </button>
          </div>
        </section>
  );
}