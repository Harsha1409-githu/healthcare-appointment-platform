import { Building2, Pencil, Trash2, Video } from "lucide-react";

export default function DaySessions({
  day,
  sessions,
  loading,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-black text-slate-950">
            {formatDay(day)}
          </h2>
          <p className="text-[11px] font-semibold text-slate-500">
            {sessions.length
              ? `${sessions.length} saved session${sessions.length > 1 ? "s" : ""}`
              : "No session added"}
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="rounded-xl bg-white px-3 py-2 text-[10px] font-black text-cyan-700 active:scale-95"
        >
          + Add
        </button>
      </div>

      {sessions.length === 0 ? (
        <p className="mt-3 rounded-2xl bg-white p-4 text-center text-xs font-semibold text-slate-400">
          Add your {formatDay(day)} working hours.
        </p>
      ) : (
        <div className="mt-3 space-y-2">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              loading={loading}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SessionCard({ session, loading, onEdit, onDelete }) {
  const type = formatSlotType(session.slotType);

  return (
    <div className="rounded-2xl bg-white p-3">
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <div className="min-w-0">
          <p className="text-sm font-black text-slate-950">
            {type === "Video"
              ? "Evening Video"
              : type === "In-person"
              ? "Clinic Session"
              : "Flexible Session"}
          </p>

          <p className="mt-1 text-xs font-bold text-slate-500">
            {session.startTime} → {session.endTime} •{" "}
            {session.slotDuration || 30} mins
          </p>

          <div className="mt-2">
            <TypeChip type={session.slotType} />
          </div>
        </div>

        <div className="flex gap-1.5">
          <button
            type="button"
            disabled={loading}
            onClick={() => onEdit(session)}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 disabled:opacity-50"
          >
            <Pencil size={14} />
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => onDelete(session.id)}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600 disabled:opacity-50"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function TypeChip({ type }) {
  const isVideo = type === "VIDEO";
  const isBoth = type === "BOTH";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black ${
        isVideo
          ? "bg-blue-50 text-blue-700"
          : isBoth
          ? "bg-purple-50 text-purple-700"
          : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {isVideo ? <Video size={12} /> : <Building2 size={12} />}
      {formatSlotType(type)}
    </span>
  );
}

function formatDay(day) {
  return String(day || "")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

function formatSlotType(type) {
  if (type === "VIDEO") return "Video";
  if (type === "BOTH") return "Both";
  return "In-person";
}