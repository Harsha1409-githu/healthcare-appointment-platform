import { useEffect, useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import api from "../api/axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadNotifications();
  }, []);

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

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white rounded-[2rem] p-8 shadow-2xl mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
              <Bell size={28} />
            </div>

            <div>
              <h1 className="text-4xl font-black">
                Notifications
              </h1>
              <p className="text-blue-100">
                {unreadCount} unread notifications
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-slate-900">
              Recent Alerts
            </h2>

            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-blue-600 font-bold"
              >
                Mark all as read
              </button>
            )}
          </div>

          {loading ? (
            <p className="text-slate-500">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-slate-500">No notifications yet.</p>
          ) : (
            <div className="space-y-4">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-5 ${
                    item.isRead
                      ? "bg-white border-slate-100"
                      : "bg-blue-50 border-blue-100"
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
                      <Bell className="text-white" size={21} />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-black text-slate-900">
                        {item.title}
                      </h3>

                      <p className="text-slate-600 mt-1">
                        {item.message}
                      </p>

                      <p className="text-xs text-slate-400 mt-2">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {!item.isRead && (
                      <button
                        onClick={() => markAsRead(item.id)}
                        className="flex items-center gap-2 text-emerald-600 font-bold"
                      >
                        <CheckCircle2 size={18} />
                        Read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}