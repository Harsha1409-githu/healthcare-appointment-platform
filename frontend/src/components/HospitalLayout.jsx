import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Stethoscope,
  CalendarDays,
  ClipboardList,
  BarChart3,
  LogOut,
  Building2,
} from "lucide-react";

export default function HospitalLayout() {
  const navigate = useNavigate();

  const hospital = JSON.parse(
    localStorage.getItem("hospitalUser") || "null"
  );

  const logout = () => {
    localStorage.removeItem("hospitalToken");
    localStorage.removeItem("hospitalUser");
    navigate("/hospital/login");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 px-4 py-3 rounded-2xl bg-blue-600 text-white font-bold shadow"
      : "flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 hover:bg-blue-50 hover:text-blue-600 font-semibold";

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-72 bg-white border-r border-slate-200 p-5 hidden lg:flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
            <Building2 className="text-white" size={26} />
          </div>

          <div>
            <h2 className="font-black text-xl text-slate-900">
              Hospital Portal
            </h2>
            <p className="text-xs text-slate-500 truncate max-w-[180px]">
              {hospital?.hospitalName || "MediCare"}
            </p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <NavLink to="/hospital/dashboard" className={linkClass}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink to="/hospital/doctors" className={linkClass}>
            <Stethoscope size={20} />
            Doctors
          </NavLink>

          <NavLink to="/hospital/availability" className={linkClass}>
            <CalendarDays size={20} />
            Availability
          </NavLink>

          <NavLink to="/hospital/appointments" className={linkClass}>
            <ClipboardList size={20} />
            Appointments
          </NavLink>

          <NavLink to="/hospital/analytics" className={linkClass}>
            <BarChart3 size={20} />
            Analytics
          </NavLink>
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}