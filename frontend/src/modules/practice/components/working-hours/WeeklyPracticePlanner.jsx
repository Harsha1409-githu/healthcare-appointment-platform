import { Plus } from "lucide-react";
import { WorkingHoursDay } from "@/modules/practice";
import { formatDay } from "@/modules/practice/utils/time.utils";

export default function WeeklySessionPlanner({
  groupedAvailability,
  activeDay,
  setActiveDay,
  loading,
  onAdd,
  onEdit,
  onDelete,
}) {
  const activeGroup =
    groupedAvailability.find((item) => item.day === activeDay) ||
    groupedAvailability[0];

  return (
    <section className="rounded-[1.7rem] border border-slate-100 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700">
            Weekly Practice
          </p>

          <h1 className="text-xl font-black text-slate-950">
            Choose working day
          </h1>

          <p className="text-xs font-semibold text-slate-500">
            Add working hours for each day
          </p>
        </div>

        <button
          type="button"
          onClick={() => onAdd(activeDay)}
          className="flex items-center gap-1.5 rounded-2xl bg-slate-950 px-3 py-2 text-xs font-black text-white active:scale-95"
        >
          <Plus size={15} />
          Add Hours
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1.5 rounded-2xl bg-slate-50 p-1.5">
        {groupedAvailability.map((item) => {
          const active = activeDay === item.day;

          return (
            <button
              key={item.day}
              type="button"
              onClick={() => setActiveDay(item.day)}
              className={`rounded-2xl px-1 py-2 text-center active:scale-95 ${
                active
                  ? "bg-cyan-600 text-white shadow-sm"
                  : item.sessions.length
                  ? "bg-white text-slate-800"
                  : "text-slate-400"
              }`}
            >
              <p className="text-[9px] font-black">{item.day.slice(0, 3)}</p>

              <p className="mt-0.5 text-base font-black">
                {item.sessions.length}
              </p>

              <p className="text-[8px] font-bold opacity-80">
                session{item.sessions.length === 1 ? "" : "s"}
              </p>
            </button>
          );
        })}
      </div>

      {activeGroup && (
        <div className="mt-3 rounded-2xl bg-cyan-50 p-3">
          <p className="text-[10px] font-black uppercase text-cyan-700">
            Selected Day
          </p>

          <div className="mt-1 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-950">
                {formatDay(activeGroup.day)}
              </h2>

              <p className="text-xs font-semibold text-slate-600">
                {activeGroup.sessions.length
                  ? `${activeGroup.sessions.length} session${
                      activeGroup.sessions.length > 1 ? "s" : ""
                    } configured`
                  : "No sessions yet"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onAdd(activeGroup.day)}
              className="rounded-2xl bg-white px-3 py-2 text-xs font-black text-cyan-700 active:scale-95"
            >
              + Add Working Hours
            </button>
          </div>
        </div>
      )}

      <div className="mt-3 space-y-3">
        {activeGroup && (
          <WorkingHoursDay
            day={activeGroup.day}
            sessions={activeGroup.sessions}
            loading={loading}
            onAdd={() => onAdd(activeGroup.day)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </div>
    </section>
  );
}

