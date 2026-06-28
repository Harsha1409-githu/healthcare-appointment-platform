import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  UsersRound,
  Grid3X3,
} from "lucide-react";
import useHideBottomNav from "../hooks/useHideBottomNav";

export default function DoctorBottomNav() {
  const isLoggedIn = !!localStorage.getItem("doctorToken");
  const hidden = useHideBottomNav();

  if (!isLoggedIn) return null;

  const links = [
    {
      to: "/doctor/dashboard",
      label: "Home",
      icon: LayoutDashboard,
    },
    {
      to: "/doctor/appointments",
      label: "Schedule",
      icon: CalendarCheck,
    },
    {
      to: "/doctor/patients",
      label: "Patients",
      icon: UsersRound,
    },
    {
      to: "/doctor/hub",
      label: "Doc-Hub",
      icon: Grid3X3,
    },
  ];

  return (
    <div
      className={`md:hidden fixed left-0 right-0 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 px-3 transition-all duration-300 ease-out ${
        hidden
          ? "translate-y-28 opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100"
      }`}
    >
      <nav className="mx-auto max-w-md rounded-[1.7rem] border border-slate-200 bg-white/95 p-1.5 shadow-[0_12px_40px_rgba(15,23,42,0.14)] backdrop-blur-xl">
        <div className="grid grid-cols-4 gap-1">
          {links.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `flex h-14 flex-col items-center justify-center rounded-[1.25rem] transition-all duration-200 active:scale-95 ${
                    isActive
                      ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/25"
                      : "text-slate-500"
                  }`
                }
              >
                <Icon size={20} strokeWidth={2.4} />
                <span className="mt-1 text-[10px] font-black leading-none">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}