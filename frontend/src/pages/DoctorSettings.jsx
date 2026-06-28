import { useState } from "react";
import {
  Bell,
  ChevronRight,
  Lock,
  LogOut,
  Mail,
  Moon,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function DoctorSettings() {
  const doctor = JSON.parse(localStorage.getItem("doctorUser") || "null");

  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const logout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorUser");
    window.location.href = "/doctor/login";
  };

  return (
    <main className="min-h-screen bg-[#f6f8fb] pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
      <PageHeader title="Settings" subtitle="Doctor account preferences" />

      <div className="mx-auto max-w-md px-3">
        <section className="rounded-[1.7rem] border border-slate-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-50 text-cyan-600">
              <UserRound size={26} />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700">
                Doctor Account
              </p>
              <h1 className="truncate text-xl font-black text-slate-950">
                Dr. {doctor?.doctorName || "Doctor"}
              </h1>
              <p className="truncate text-xs font-semibold text-slate-500">
                {doctor?.email || "Email not added"}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-3 rounded-[1.7rem] border border-slate-100 bg-white p-2 shadow-sm">
          <SettingToggle
            icon={Bell}
            title="Notifications"
            subtitle="Appointment and patient alerts"
            value={notifications}
            onChange={() => setNotifications(!notifications)}
          />

          <SettingToggle
            icon={Smartphone}
            title="Medicine & Follow-up Reminders"
            subtitle="Patient review reminders"
            value={reminders}
            onChange={() => setReminders(!reminders)}
          />

          <SettingToggle
            icon={Moon}
            title="Dark Mode"
            subtitle="Coming soon"
            value={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        </section>

        <section className="mt-3 rounded-[1.7rem] border border-slate-100 bg-white p-2 shadow-sm">
          <SettingLink
            icon={Lock}
            title="Change Password"
            subtitle="Update login security"
            to="/doctor/change-password"
          />

          <SettingLink
            icon={ShieldCheck}
            title="Privacy & Security"
            subtitle="Manage account safety"
            to="/doctor/profile"
          />

          <SettingLink
            icon={Mail}
            title="Support"
            subtitle="Contact TryDoc support"
            to="/doctor/notifications"
          />
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

function SettingToggle({ icon: Icon, title, subtitle, value, onChange }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl px-2 py-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
        <Icon size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="text-sm font-black text-slate-950">{title}</h2>
        <p className="truncate text-xs font-semibold text-slate-500">
          {subtitle}
        </p>
      </div>

      <button
        type="button"
        onClick={onChange}
        className={`h-7 w-12 rounded-full p-1 transition ${
          value ? "bg-cyan-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-white transition ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function SettingLink({ icon: Icon, title, subtitle, to }) {
  return (
    <a
      href={to}
      className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-2xl px-2 py-3 active:bg-slate-50"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-700">
        <Icon size={20} />
      </div>

      <div className="min-w-0">
        <h2 className="text-sm font-black text-slate-950">{title}</h2>
        <p className="truncate text-xs font-semibold text-slate-500">
          {subtitle}
        </p>
      </div>

      <ChevronRight size={18} className="text-slate-300" />
    </a>
  );
}