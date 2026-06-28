import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Search,
  Clock,
  ShieldCheck,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
import api from "../api/axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filterOptions = [
    ["ALL", "All"],
    ["UNREAD", "Unread"],
    ["READ", "Read"],
  ];

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications/my");
      setNotifications(res.data || []);
    } catch (error) {
      console.error("Notification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      loadNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const stats = useMemo(() => {
    const unread = notifications.filter((n) => !n.isRead).length;
    const read = notifications.filter((n) => n.isRead).length;

    return {
      total: notifications.length,
      unread,
      read,
    };
  }, [notifications]);

  const filteredNotifications = notifications.filter((item) => {
    const matchesSearch = `${item.title || ""} ${item.message || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "UNREAD" && !item.isRead) ||
      (statusFilter === "READ" && item.isRead);

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-[#f4f8fb] px-4 pt-4 pb-24">
      <div className="max-w-md mx-auto">
        <header className="mb-3">
          <div className="inline-flex items-center gap-1.5 text-cyan-700 font-black text-xs">
            <Bell size={15} />
            NOTIFICATIONS
          </div>

          <h1 className="text-2xl font-black text-slate-950 mt-1">
            Alerts
          </h1>

          <p className="text-sm text-slate-500 font-semibold">
            Appointment, prescription and health updates
          </p>
        </header>

        <section className="grid grid-cols-3 gap-2 mb-3">
          <MiniStat title="Total" value={stats.total} icon={ClipboardList} />
          <MiniStat title="Unread" value={stats.unread} icon={AlertCircle} />
          <MiniStat title="Read" value={stats.read} icon={ShieldCheck} />
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3">
            <Search className="text-cyan-600 shrink-0" size={17} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notifications"
              className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center justify-between gap-3 mt-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {filterOptions.map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setStatusFilter(value)}
                  className={`shrink-0 px-3 py-2 rounded-full text-xs font-black border ${
                    statusFilter === value
                      ? "bg-cyan-600 text-white border-cyan-600"
                      : "bg-white text-slate-600 border-slate-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {stats.unread > 0 && (
              <button
                onClick={markAllAsRead}
                className="shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-2 rounded-full text-xs font-black"
              >
                Mark all
              </button>
            )}
          </div>
        </section>

        <section className="mt-3">
          {loading ? (
            <EmptyState text="Loading notifications..." />
          ) : notifications.length === 0 ? (
            <EmptyState
              title="No notifications yet"
              text="Your health alerts will appear here."
            />
          ) : filteredNotifications.length === 0 ? (
            <EmptyState
              title="No matching alerts"
              text="Try changing search or filter."
            />
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((item) => (
                <NotificationCard
                  key={item.id}
                  item={item}
                  markAsRead={markAsRead}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function NotificationCard({ item, markAsRead }) {
  return (
    <div
      className={`rounded-3xl border p-4 shadow-sm ${
        item.isRead
          ? "bg-white border-slate-100"
          : "bg-cyan-50 border-cyan-100"
      }`}
    >
      <div className="flex gap-3">
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
            item.isRead ? "bg-slate-100" : "bg-cyan-600"
          }`}
        >
          <Bell
            className={item.isRead ? "text-slate-500" : "text-white"}
            size={20}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-black text-slate-950 text-sm leading-snug">
              {item.title || "Notification"}
            </h3>

            {!item.isRead && (
              <span className="shrink-0 px-2 py-1 rounded-full bg-cyan-600 text-white text-[10px] font-black">
                New
              </span>
            )}
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mt-1">
            {item.message}
          </p>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <Clock size={14} className="text-cyan-600" />
              {item.createdAt
                ? new Date(item.createdAt).toLocaleString()
                : "Just now"}
            </div>

            {!item.isRead && (
              <button
                onClick={() => markAsRead(item.id)}
                className="shrink-0 inline-flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-2 rounded-2xl font-black text-xs"
              >
                <CheckCircle2 size={15} />
                Read
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title = "Please wait", text }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto mb-3">
        <Bell className="text-cyan-600" size={30} />
      </div>

      <h3 className="text-lg font-black text-slate-950">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        {text}
      </p>
    </div>
  );
}

function MiniStat({ title, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 text-center">
      <Icon className="text-cyan-600 mx-auto mb-1.5" size={18} />

      <p className="text-base font-black text-slate-950">
        {value}
      </p>

      <p className="text-[10px] text-slate-500 font-bold">
        {title}
      </p>
    </div>
  );
}