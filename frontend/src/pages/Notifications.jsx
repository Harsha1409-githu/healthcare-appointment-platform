import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Search,
  Filter,
  Clock,
  ShieldCheck,
  AlertCircle,
  CalendarCheck,
  ClipboardList,
  ChevronDown,
} from "lucide-react";
import api from "../api/axios";

export default function Notifications() {
  const filterRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showFilter, setShowFilter] = useState(false);

  const filterOptions = [
    { label: "All Alerts", value: "ALL" },
    { label: "Unread", value: "UNREAD" },
    { label: "Read", value: "READ" },
  ];

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    const closeFilter = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", closeFilter);
    document.addEventListener("touchstart", closeFilter);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeFilter);
      document.removeEventListener("touchstart", closeFilter);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications/my");
      setNotifications(res.data || []);
    } catch (error) {
      console.error("Notification error:", error);
      alert("Failed to load notifications");
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

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const readCount = notifications.filter((n) => n.isRead).length;

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

  const selectedFilterLabel =
    filterOptions.find((option) => option.value === statusFilter)?.label ||
    "All Alerts";

  const stats = useMemo(
    () => ({
      total: notifications.length,
      unread: unreadCount,
      read: readCount,
    }),
    [notifications, unreadCount, readCount]
  );

  return (
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6 py-8">
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                <Bell size={17} />
                NOTIFICATION CENTER
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                Notifications
              </h1>

              <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
                Track appointment updates, prescriptions, approvals, reminders
                and important healthcare alerts.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <MiniStat title="Total" value={stats.total} icon={ClipboardList} />
              <MiniStat title="Unread" value={stats.unread} icon={AlertCircle} />
              <MiniStat title="Read" value={stats.read} icon={ShieldCheck} />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 mb-8">
          <div className="grid lg:grid-cols-[1fr_260px_auto] gap-4">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
              <Search className="text-cyan-600" size={20} />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notifications..."
                className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div ref={filterRef} className="relative">
              <button
                type="button"
                onClick={() => setShowFilter((prev) => !prev)}
                className="w-full flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 font-semibold"
              >
                <span className="flex items-center gap-3">
                  <Filter className="text-cyan-600" size={20} />
                  {selectedFilterLabel}
                </span>

                <ChevronDown
                  size={18}
                  className={`transition ${
                    showFilter ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showFilter && (
                <div className="absolute top-[58px] left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setStatusFilter(option.value);
                        setShowFilter(false);
                      }}
                      className={`w-full text-left px-4 py-3 font-bold hover:bg-cyan-50 ${
                        statusFilter === option.value
                          ? "text-cyan-600 bg-cyan-50"
                          : "text-slate-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-cyan-700 transition"
              >
                Mark all read
              </button>
            )}
          </div>
        </section>

        {loading ? (
          <EmptyState text="Loading notifications..." />
        ) : notifications.length === 0 ? (
          <EmptyState
            title="No notifications yet"
            text="Appointment, prescription and system alerts will appear here."
          />
        ) : filteredNotifications.length === 0 ? (
          <EmptyState
            title="No matching notifications"
            text="Try changing your search or filter."
          />
        ) : (
          <section className="grid xl:grid-cols-[1fr_340px] gap-8">
            <main className="space-y-4">
              {filteredNotifications.map((item) => (
                <NotificationCard
                  key={item.id}
                  item={item}
                  markAsRead={markAsRead}
                />
              ))}
            </main>

            <aside className="space-y-5">
              <InfoCard
                icon={CalendarCheck}
                title="Appointment Alerts"
                desc="Booking confirmations, cancellations and consultation reminders appear here."
              />

              <InfoCard
                icon={ShieldCheck}
                title="Stay Updated"
                desc="Unread alerts are highlighted so you never miss important updates."
              />

              <InfoCard
                icon={Bell}
                title="Real-Time Updates"
                desc="Notifications sync with appointment, prescription and hospital actions."
              />
            </aside>
          </section>
        )}
      </div>
    </div>
  );
}

function NotificationCard({ item, markAsRead }) {
  return (
    <div
      className={`rounded-[2rem] border p-5 shadow-sm transition hover:shadow-xl ${
        item.isRead
          ? "bg-white border-slate-100"
          : "bg-cyan-50 border-cyan-100"
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            item.isRead ? "bg-slate-100" : "bg-cyan-600"
          }`}
        >
          <Bell
            className={item.isRead ? "text-slate-500" : "text-white"}
            size={22}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="font-black text-xl text-slate-950">
              {item.title}
            </h3>

            {!item.isRead && (
              <span className="px-3 py-1 rounded-full bg-cyan-600 text-white text-xs font-black">
                New
              </span>
            )}
          </div>

          <p className="text-slate-600 leading-relaxed">{item.message}</p>

          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-100 text-slate-500 text-sm font-semibold">
            <Clock size={15} className="text-cyan-600" />
            {item.createdAt
              ? new Date(item.createdAt).toLocaleString()
              : "Just now"}
          </div>
        </div>

        {!item.isRead && (
          <button
            onClick={() => markAsRead(item.id)}
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-emerald-700 transition shrink-0"
          >
            <CheckCircle2 size={18} />
            Mark Read
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState({ title = "Please wait", text }) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto mb-4">
        <Bell className="text-cyan-600" size={34} />
      </div>

      <h3 className="text-2xl font-black text-slate-950">{title}</h3>

      <p className="text-slate-500 mt-2">{text}</p>
    </div>
  );
}

function InfoCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-white rounded-[1.7rem] border border-slate-100 shadow-sm p-5">
      <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center mb-4">
        <Icon className="text-cyan-600" size={22} />
      </div>

      <h3 className="font-black text-slate-950">{title}</h3>

      <p className="text-slate-500 text-sm mt-2 leading-relaxed">{desc}</p>
    </div>
  );
}

function MiniStat({ title, value, icon: Icon }) {
  return (
    <div className="min-w-[90px] bg-slate-50 rounded-2xl border border-slate-100 p-3">
      <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center mb-2">
        <Icon className="text-cyan-600" size={18} />
      </div>

      <p className="text-xl font-black text-slate-950">{value}</p>

      <p className="text-xs text-slate-500 font-bold">{title}</p>
    </div>
  );
}