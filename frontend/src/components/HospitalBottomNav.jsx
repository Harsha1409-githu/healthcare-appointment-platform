import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Clock3,
  BarChart3,
} from "lucide-react";
import useHideBottomNav from "../hooks/useHideBottomNav";

export default function HospitalBottomNav() {
  const isLoggedIn = !!localStorage.getItem("hospitalToken");
  const hidden = useHideBottomNav();

  if (!isLoggedIn) return null;

  const links = [
    {
      to: "/hospital/dashboard",
      label: "Home",
      icon: LayoutDashboard,
    },
    {
      to: "/hospital/doctors",
      label: "Doctors",
      icon: Users,
    },
    {
      to: "/hospital/appointments",
      label: "Bookings",
      icon: CalendarCheck,
    },
    {
      to: "/hospital/availability",
      label: "Slots",
      icon: Clock3,
    },
    {
      to: "/hospital/analytics",
      label: "Analytics",
      icon: BarChart3,
    },
  ];

  return (
  <div
    className={`md:hidden fixed bottom-4 left-0 right-0 z-50 px-4 transition-all duration-300 ease-out ${
      hidden
        ? "translate-y-28 opacity-0 pointer-events-none"
        : "translate-y-0 opacity-100"
    }`}
  >
    <nav className="mx-auto max-w-md bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[28px] shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      <div className="grid grid-cols-5 p-2">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-cyan-600 text-white shadow-lg"
                    : "text-slate-500"
                }`
              }
            >
              <Icon size={18} />

              <span className="text-[10px] font-black mt-1 text-center leading-tight">
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