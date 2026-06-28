import { Link } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  Clock,
  IndianRupee,
  LineChart,
  LogOut,
  Settings,
  Star,
  Stethoscope,
  UserRound,
  CalendarCheck,
} from "lucide-react";

export default function DoctorHub() {
  const doctor = JSON.parse(localStorage.getItem("doctorUser") || "null");

  const hubItems = [
    {
      to: "/doctor/availability",
      title: "Availability",
      subtitle: "Manage weekly schedule",
      status: "Available Today",
      icon: Clock,
      tone: "emerald",
    },

    {
  to: "/doctor/calendar",
  title: "Calendar",
  subtitle: "Monthly appointments and slots",
  status: "View schedule",
  icon: CalendarCheck,
  tone: "cyan",
},
    {
      to: "/doctor/leave",
      title: "Leave Management",
      subtitle: "Apply leave and holidays",
      status: "No upcoming leave",
      icon: CalendarDays,
      tone: "cyan",
    },
    {
      to: "/doctor/analytics",
      title: "Analytics",
      subtitle: "Appointments and patients",
      status: "View performance",
      icon: LineChart,
      tone: "violet",
    },
    {
      to: "/doctor/earnings",
      title: "Earnings",
      subtitle: "Payouts and transactions",
      status: "Revenue summary",
      icon: IndianRupee,
      tone: "emerald",
    },
    {
      to: "/doctor/reviews",
      title: "Reviews",
      subtitle: "Patient feedback",
      status: "Ratings",
      icon: Star,
      tone: "amber",
    },
    {
      to: "/doctor/notifications",
      title: "Notifications",
      subtitle: "Updates and reminders",
      status: "Check updates",
      icon: Bell,
      tone: "red",
    },
  {
  to: "/doctor/profile",
  title: "My Profile",
  subtitle: "Qualification and clinic details",
  status: "Profile details",
  icon: UserRound,
  tone: "cyan",
},
   {
  to: "/doctor/settings",
  title: "Settings",
  subtitle: "Security and preferences",
  status: "Account controls",
  icon: Settings,
  tone: "slate",
},
  ];

  const logout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorUser");
    window.location.href = "/doctor/login";
  };

  return (
    <main className="min-h-screen bg-[#f6f8fb] pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-md px-3 pt-3">
        <section className="rounded-[1.7rem] border border-slate-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-3xl bg-cyan-50 text-cyan-600">
              {doctor?.profileImage ? (
                <img
                  src={doctor.profileImage}
                  alt={doctor?.doctorName || "Doctor"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Stethoscope size={26} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700">
                Doctor Hub
              </p>

              <h1 className="truncate text-xl font-black text-slate-950">
                Dr. {doctor?.doctorName || "Doctor"}
              </h1>

              <p className="truncate text-xs font-semibold text-slate-500">
                {doctor?.specialization || "Medical Specialist"}
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            <QuickLink to="/doctor/availability" label="Slots" icon={Clock} />
            <QuickLink to="/doctor/leave" label="Leave" icon={CalendarDays} />
           <QuickLink to="/doctor/calendar" label="Calendar" icon={CalendarCheck} />
            <QuickLink to="/doctor/profile" label="Profile" icon={UserRound} />
          </div>
        </section>

        <section className="mt-3 rounded-[1.7rem] border border-slate-100 bg-white p-2 shadow-sm">
          {hubItems.map((item) => (
            <HubRow key={item.to} item={item} />
          ))}
        </section>

        <button
          type="button"
          onClick={logout}
          className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-red-50 text-sm font-black text-red-600 active:scale-95"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </main>
  );
}

function QuickLink({ to, label, icon: Icon }) {
  return (
    <Link
      to={to}
      className="rounded-2xl bg-slate-50 px-2 py-3 text-center active:scale-95"
    >
      <Icon className="mx-auto text-cyan-600" size={19} />
      <p className="mt-1 text-[10px] font-black text-slate-700">{label}</p>
    </Link>
  );
}

function HubRow({ item }) {
  const Icon = item.icon;

  const toneClass =
    item.tone === "emerald"
      ? "bg-emerald-50 text-emerald-600"
      : item.tone === "violet"
      ? "bg-violet-50 text-violet-600"
      : item.tone === "amber"
      ? "bg-amber-50 text-amber-600"
      : item.tone === "red"
      ? "bg-red-50 text-red-600"
      : item.tone === "slate"
      ? "bg-slate-100 text-slate-600"
      : "bg-cyan-50 text-cyan-600";

  return (
    <Link
      to={item.to}
      className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-2xl px-2 py-3 active:bg-slate-50"
    >
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${toneClass}`}>
        <Icon size={20} />
      </div>

      <div className="min-w-0">
        <h2 className="truncate text-sm font-black text-slate-950">
          {item.title}
        </h2>

        <p className="truncate text-xs font-semibold text-slate-500">
          {item.subtitle}
        </p>

        <p className="mt-0.5 truncate text-[10px] font-black text-cyan-700">
          {item.status}
        </p>
      </div>

      <ChevronRight size={18} className="text-slate-300" />
    </Link>
  );
}