import { Bell, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

export default function FollowUpReminderCard({
  followUps = [],
}) {
  const today = new Date().toISOString().split("T")[0];

  const dueFollowUps = followUps.filter(
    (item) =>
      item.status === "PENDING" &&
      item.followUpDate <= today
  );

  if (dueFollowUps.length === 0) return null;

  return (
    <section className="bg-amber-50 border border-amber-200 rounded-3xl p-4 mt-3 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
          <Bell
            size={20}
            className="text-amber-700"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-black text-slate-950">
            Follow-up Reminder
          </h2>

          <p className="text-sm text-slate-600 mt-1">
            {dueFollowUps.length} follow-up
            {dueFollowUps.length > 1 ? "s" : ""}
            due today
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {dueFollowUps.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl px-3 py-3 border border-amber-100 flex items-center gap-3"
          >
            <CalendarDays
              size={16}
              className="text-amber-700 shrink-0"
            />

            <div className="min-w-0">
              <p className="text-sm font-black text-slate-950 truncate">
                {item.patient?.fullName ||
                  "Patient"}
              </p>

              <p className="text-xs text-slate-500">
                {item.followUpDate}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/doctor/follow-ups"
        className="mt-3 inline-flex text-sm font-black text-amber-700"
      >
        View All →
      </Link>
    </section>
  );
}