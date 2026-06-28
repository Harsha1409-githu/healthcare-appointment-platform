import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Home,
  Stethoscope,
  CalendarDays,
  User,
  Bot,
} from "lucide-react";
import useHideBottomNav from "../hooks/useHideBottomNav";

export default function MobileBottomNav() {
  const isLoggedIn = !!localStorage.getItem("patientToken");

  const getPatientImage = () => {
    const patient =
      JSON.parse(localStorage.getItem("patientUser") || "null") ||
      JSON.parse(localStorage.getItem("user") || "null");

    return patient?.profileImage || null;
  };
  const hidden = useHideBottomNav();
  const [profileImage, setProfileImage] = useState(getPatientImage);

  useEffect(() => {
    const refreshProfile = () => {
      setProfileImage(getPatientImage());
    };

    window.addEventListener("patientProfileUpdated", refreshProfile);
    window.addEventListener("storage", refreshProfile);

    return () => {
      window.removeEventListener("patientProfileUpdated", refreshProfile);
      window.removeEventListener("storage", refreshProfile);
    };
  }, []);

  if (!isLoggedIn) return null;

  const links = [
  
{
  to: "/home",
  label: "Home",
  icon: Home,
},
    {
      to: "/doctors",
      label: "Doctors",
      icon: Stethoscope,
    },
    {
      to: "/patient/appointments",
      label: "My Bookings",
      icon: CalendarDays,
    },
    {
      to: "/ai-health-assistant",
      label: "TryDoc AI",
      icon: Bot,
    },
    {
      to: "/account",
      label: "Account",
      icon: User,
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
                `flex flex-col items-center justify-center py-1 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-cyan-600 text-white shadow-lg"
                    : "text-slate-500"
                }`
              }
            >
              {item.label === "Account" ? (
                profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border-2 border-cyan-500 shadow-md"
                  />
                ) : (
                  <Icon size={20} />
                )
              ) : (
                <Icon size={20} />
              )}

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
