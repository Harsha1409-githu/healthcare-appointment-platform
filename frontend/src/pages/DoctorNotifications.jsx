import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  CalendarCheck,
  Star,
} from "lucide-react";

import api from "../api/axios";
import PageHeader from "../components/PageHeader";

export default function DoctorNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications/my");
      setNotifications(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, isRead: true }
            : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-24">
      <PageHeader
        title="Notifications"
        subtitle="Doctor alerts and updates"
      />

      <div className="max-w-md mx-auto px-4">
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-cyan-700 font-black">
                UNREAD
              </p>

              <h2 className="text-2xl font-black text-slate-950">
                {unreadCount}
              </h2>
            </div>

            <button
              onClick={markAllAsRead}
              className="bg-cyan-600 text-white px-4 py-2 rounded-2xl text-xs font-black"
            >
              Mark All Read
            </button>
          </div>
        </section>

        <section className="mt-3 space-y-3">
          {loading ? (
            <div className="bg-white rounded-3xl p-6 text-center">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-3xl p-6 text-center border border-slate-100">
              <Bell
                size={34}
                className="mx-auto text-cyan-600"
              />

              <h3 className="font-black text-slate-950 mt-3">
                No Notifications
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Notifications will appear here
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`rounded-3xl border p-4 shadow-sm ${
                  item.isRead
                    ? "bg-white border-slate-100"
                    : "bg-cyan-50 border-cyan-200"
                }`}
              >
                <div className="flex gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shrink-0">
                    {item.title.includes("Review") ? (
                      <Star
                        size={20}
                        className="text-yellow-500"
                      />
                    ) : item.title.includes(
                        "Appointment"
                      ) ? (
                      <CalendarCheck
                        size={20}
                        className="text-cyan-600"
                      />
                    ) : (
                      <Bell
                        size={20}
                        className="text-cyan-600"
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-black text-slate-950 text-sm">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-600 mt-1">
                      {item.message}
                    </p>

                    <p className="text-[11px] text-slate-400 mt-2">
                      {new Date(
                        item.createdAt
                      ).toLocaleString()}
                    </p>

                    {!item.isRead && (
                      <button
                        onClick={() =>
                          markAsRead(item.id)
                        }
                        className="mt-3 bg-emerald-600 text-white px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1"
                      >
                        <CheckCircle2 size={13} />
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}