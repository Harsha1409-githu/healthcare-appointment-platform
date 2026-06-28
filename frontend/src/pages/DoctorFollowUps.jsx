import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Loader2,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/axios";
import usePullToRefresh from "../hooks/usePullToRefresh";

const todayIso = () => new Date().toISOString().split("T")[0];

const formatDate = (value) => {
  if (!value) return "-";

  const today = todayIso();

  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split("T")[0];

  if (value === today) return "Today";
  if (value === tomorrow) return "Tomorrow";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const getFollowUpType = (item, today) => {
  const date = String(item.followUpDate || "");

  if (item.status === "COMPLETED") return "COMPLETED";
  if (date < today) return "OVERDUE";
  if (date === today) return "TODAY";
  return "UPCOMING";
};

export default function DoctorFollowUps() {
  const doctor = JSON.parse(localStorage.getItem("doctorUser") || "null");

  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [completingId, setCompletingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [menuId, setMenuId] = useState(null);

  const { pullDistance, refreshing, visible } = usePullToRefresh(async () => {
    await loadFollowUps(false);
  });

  useEffect(() => {
    if (doctor?.id) {
      loadFollowUps();
    } else {
      setLoading(false);
    }
  }, []);

  const loadFollowUps = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      const res = await api.get(`/follow-up/doctor/${doctor.id}`);
      setFollowUps(res.data || []);
    } catch (error) {
      console.error("Follow-up load error:", error);
      toast.error("Failed to load follow-ups");
      setFollowUps([]);
    } finally {
      setLoading(false);
    }
  };

  const completeFollowUp = async (id) => {
    try {
      setCompletingId(id);
      await api.patch(`/follow-up/${id}/complete`);
      toast.success("Follow-up completed");
      await loadFollowUps(false);
    } catch (error) {
      console.error("Complete follow-up error:", error);
      toast.error("Failed to complete follow-up");
    } finally {
      setCompletingId(null);
    }
  };

  const deleteFollowUp = async (id) => {
    if (!window.confirm("Delete follow-up?")) return;

    try {
      setDeletingId(id);
      await api.delete(`/follow-up/${id}`);
      toast.success("Follow-up deleted");
      await loadFollowUps(false);
    } catch (error) {
      console.error("Delete follow-up error:", error);
      toast.error("Failed to delete follow-up");
    } finally {
      setDeletingId(null);
      setMenuId(null);
    }
  };

  const today = todayIso();

  const enrichedFollowUps = useMemo(() => {
    return followUps.map((item) => ({
      ...item,
      followUpType: getFollowUpType(item, today),
    }));
  }, [followUps, today]);

  const stats = useMemo(() => {
    return {
      today: enrichedFollowUps.filter((item) => item.followUpType === "TODAY").length,
      overdue: enrichedFollowUps.filter((item) => item.followUpType === "OVERDUE").length,
      upcoming: enrichedFollowUps.filter((item) => item.followUpType === "UPCOMING").length,
      completed: enrichedFollowUps.filter((item) => item.followUpType === "COMPLETED").length,
    };
  }, [enrichedFollowUps]);

  const filteredFollowUps = useMemo(() => {
    const query = search.toLowerCase().trim();

    return enrichedFollowUps
      .filter((item) => {
        const matchesSearch = `${item.patient?.fullName || ""} ${item.notes || ""} ${
          item.status || ""
        } ${item.followUpDate || ""}`
          .toLowerCase()
          .includes(query);

        const matchesFilter =
          filter === "ALL" ||
          item.followUpType === filter ||
          (filter === "PENDING" && item.status === "PENDING");

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        const priority = {
          OVERDUE: 1,
          TODAY: 2,
          UPCOMING: 3,
          COMPLETED: 4,
        };

        const p1 = priority[a.followUpType] || 9;
        const p2 = priority[b.followUpType] || 9;

        if (p1 !== p2) return p1 - p2;

        return String(a.followUpDate || "").localeCompare(String(b.followUpDate || ""));
      });
  }, [enrichedFollowUps, search, filter]);

  const nextFollowUp = useMemo(() => {
    return filteredFollowUps.find((item) => item.status !== "COMPLETED") || null;
  }, [filteredFollowUps]);

  return (
    <main className="min-h-screen bg-[#f6f8fb] pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
      {visible && (
        <div
          className="fixed left-0 right-0 top-0 z-[100] flex justify-center transition-all duration-300"
          style={{ transform: `translateY(${pullDistance}px)` }}
        >
          <div className="mt-3 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-lg">
            <div
              className={`h-4 w-4 rounded-full border-2 border-cyan-600 border-t-transparent ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            <span className="text-xs font-black text-cyan-700">
              {refreshing ? "Refreshing..." : "Pull to refresh"}
            </span>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-md px-3 pt-3">
        <section className="rounded-[1.7rem] border border-slate-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
              <CalendarDays size={24} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700">
                Doctor Follow-ups
              </p>
              <h1 className="text-xl font-black text-slate-950">Follow-ups</h1>
              <p className="text-xs font-semibold text-slate-500">
                Review pending patient follow-ups
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <PriorityStat label="Today" value={stats.today} tone="amber" />
            <PriorityStat label="Overdue" value={stats.overdue} tone="red" />
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <MiniStat label="Upcoming" value={stats.upcoming} />
            <MiniStat label="Completed" value={stats.completed} />
          </div>
        </section>

        <section className="sticky top-0 z-20 mt-3 bg-[#f6f8fb] pb-2 pt-1">
          <div className="flex h-12 items-center gap-2 rounded-2xl border border-slate-100 bg-white px-3 shadow-sm">
            <Search size={17} className="text-cyan-600" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient or note"
              className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
            />

            {search && (
              <button type="button" onClick={() => setSearch("")}>
                <X size={16} className="text-slate-400" />
              </button>
            )}
          </div>

          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {[
              ["ALL", "All"],
              ["TODAY", "Today"],
              ["OVERDUE", "Overdue"],
              ["UPCOMING", "Upcoming"],
              ["COMPLETED", "Done"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`whitespace-nowrap rounded-2xl px-3 py-2 text-xs font-black ${
                  filter === key
                    ? "bg-cyan-600 text-white"
                    : "bg-white text-slate-600 border border-slate-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {loading ? (
          <FollowUpsSkeleton />
        ) : filteredFollowUps.length === 0 ? (
          <EmptyState />
        ) : (
          <section className="space-y-3">
            {nextFollowUp && (
              <NextFollowUpCard
                item={nextFollowUp}
                today={today}
                completing={completingId === nextFollowUp.id}
                completeFollowUp={completeFollowUp}
              />
            )}

            <section className="rounded-[1.5rem] border border-slate-100 bg-white p-2.5 shadow-sm">
              <div className="mb-2 flex items-center justify-between px-1">
                <div>
                  <h2 className="text-sm font-black text-slate-950">
                    Follow-up Queue
                  </h2>
                  <p className="text-xs font-semibold text-slate-500">
                    {filteredFollowUps.length} records
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {filteredFollowUps.map((item) => (
                  <FollowUpRow
                    key={item.id}
                    item={item}
                    today={today}
                    completing={completingId === item.id}
                    deleting={deletingId === item.id}
                    menuOpen={menuId === item.id}
                    setMenuId={setMenuId}
                    completeFollowUp={completeFollowUp}
                    deleteFollowUp={deleteFollowUp}
                  />
                ))}
              </div>
            </section>
          </section>
        )}
      </div>
    </main>
  );
}

function PriorityStat({ label, value, tone }) {
  const style =
    tone === "red"
      ? "bg-red-50 text-red-700"
      : "bg-amber-50 text-amber-700";

  return (
    <div className={`rounded-2xl px-3 py-3 ${style}`}>
      <p className="text-2xl font-black leading-none">{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase">{label}</p>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
      <p className="text-xl font-black leading-none text-slate-950">{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase text-slate-500">
        {label}
      </p>
    </div>
  );
}

function NextFollowUpCard({ item, today, completing, completeFollowUp }) {
  return (
    <section className="rounded-[1.7rem] bg-gradient-to-br from-cyan-700 via-cyan-600 to-sky-500 p-4 text-white shadow-lg shadow-cyan-900/10">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-cyan-100">
        Next Follow-up
      </p>

      <div className="mt-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-black">
            {item.patient?.fullName || "Patient"}
          </h2>
          <p className="mt-1 truncate text-sm font-semibold text-cyan-50/90">
            {formatDate(item.followUpDate)} • {item.notes || "Review patient"}
          </p>
        </div>

        <FollowUpBadge type={getFollowUpType(item, today)} light />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <OpenPatientButton item={item} light />
        <button
          type="button"
          disabled={completing}
          onClick={() => completeFollowUp(item.id)}
          className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-white/15 text-xs font-black text-white active:scale-95 disabled:opacity-60"
        >
          {completing ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
          Done
        </button>
      </div>
    </section>
  );
}

function FollowUpRow({
  item,
  today,
  completing,
  deleting,
  menuOpen,
  setMenuId,
  completeFollowUp,
  deleteFollowUp,
}) {
  const type = getFollowUpType(item, today);
  const completed = item.status === "COMPLETED";

  return (
    <article className="rounded-2xl bg-slate-50 p-3">
      <div className="grid grid-cols-[42px_1fr_auto] items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-cyan-600">
          <UserRound size={20} />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-black text-slate-950">
            {item.patient?.fullName || "Patient"}
          </h3>

          <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
            Follow-up: {formatDate(item.followUpDate)}
          </p>

          {item.notes && (
            <p className="mt-1 line-clamp-1 text-xs text-slate-500">
              {item.notes}
            </p>
          )}
        </div>

        <div className="relative flex flex-col items-end gap-1.5">
          <FollowUpBadge type={type} />

          <button
            type="button"
            onClick={() => setMenuId(menuOpen ? null : item.id)}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-500"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-16 z-30 w-36 rounded-2xl border border-slate-100 bg-white p-1 shadow-xl">
              <button
                type="button"
                onClick={() => deleteFollowUp(item.id)}
                disabled={deleting}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-black text-red-600 disabled:text-slate-400"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <OpenPatientButton item={item} />

        <button
          type="button"
          disabled={completed || completing}
          onClick={() => completeFollowUp(item.id)}
          className="flex h-10 items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 text-xs font-black text-white active:scale-95 disabled:bg-slate-300"
        >
          {completing ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
          {completed ? "Done" : "Mark Done"}
        </button>
      </div>
    </article>
  );
}

function OpenPatientButton({ item, light = false }) {
  const appointmentId = item.appointment?.id || item.appointmentId;

  if (!appointmentId) {
    return (
      <button
        type="button"
        disabled
        className={`flex h-10 items-center justify-center rounded-2xl text-xs font-black ${
          light ? "bg-white/20 text-white/70" : "bg-white text-slate-400"
        }`}
      >
        No Profile
      </button>
    );
  }

  return (
    <Link
      to={`/doctor/appointment/${appointmentId}/patient-profile`}
      className={`flex h-10 items-center justify-center gap-1.5 rounded-2xl text-xs font-black active:scale-95 ${
        light ? "bg-white text-cyan-700" : "bg-white text-slate-800"
      }`}
    >
      Open Patient
      <ChevronRight size={14} />
    </Link>
  );
}

function FollowUpBadge({ type, light = false }) {
  if (light) {
    return (
      <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-black text-white">
        {type}
      </span>
    );
  }

  const style =
    type === "COMPLETED"
      ? "bg-cyan-100 text-cyan-700"
      : type === "OVERDUE"
      ? "bg-red-100 text-red-700"
      : type === "TODAY"
      ? "bg-amber-100 text-amber-700"
      : "bg-emerald-100 text-emerald-700";

  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${style}`}>
      {type}
    </span>
  );
}

function FollowUpsSkeleton() {
  return (
    <section className="space-y-3">
      <div className="h-36 animate-pulse rounded-[1.7rem] bg-white" />
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="h-[108px] animate-pulse rounded-2xl bg-white"
        />
      ))}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[1.5rem] border border-slate-100 bg-white p-8 text-center shadow-sm">
      <Plus className="mx-auto text-cyan-600" size={32} />
      <p className="mt-3 font-black text-slate-950">No Follow-ups Found</p>
      <p className="mt-1 text-sm text-slate-500">
        Follow-ups created after consultation will appear here.
      </p>
    </div>
  );
}