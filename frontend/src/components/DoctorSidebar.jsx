import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  LogOut,
  UserRound,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  CalendarClock,
} from "lucide-react";

export default function DoctorSidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const [doctor, setDoctor] = useState(() =>
    JSON.parse(localStorage.getItem("doctorUser") || "null")
  );

  useEffect(() => {
    const updateDoctorProfile = () => {
      setDoctor(
        JSON.parse(localStorage.getItem("doctorUser") || "null")
      );
    };

    updateDoctorProfile();

    window.addEventListener(
      "doctorProfileUpdated",
      updateDoctorProfile
    );
    window.addEventListener("storage", updateDoctorProfile);

    return () => {
      window.removeEventListener(
        "doctorProfileUpdated",
        updateDoctorProfile
      );
      window.removeEventListener("storage", updateDoctorProfile);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorUser");
    navigate("/doctor/login");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 p-3 rounded-xl bg-emerald-600 text-white font-bold shadow"
      : "flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 font-semibold";

  return (
    <aside
      className={`min-h-screen bg-white border-r border-slate-200 p-5 shrink-0 transition-all duration-300 ${
        collapsed ? "w-24" : "w-72"
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-500 flex items-center justify-center overflow-hidden shrink-0">
            {doctor?.profileImage ? (
              <img
                src={doctor.profileImage}
                alt="Doctor"
                className="w-full h-full object-cover"
              />
            ) : (
              <Stethoscope className="text-white" size={24} />
            )}
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-2xl font-black text-slate-900">
                Doctor Portal
              </h1>
              <p className="text-xs text-slate-500 truncate max-w-[170px]">
                {doctor?.doctorName || "Medical Workspace"}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      <nav className="space-y-3">
        <NavItem
          to="/doctor/dashboard"
          icon={LayoutDashboard}
          label="Dashboard"
          collapsed={collapsed}
          linkClass={linkClass}
        />

        <NavItem
          to="/doctor/profile"
          icon={UserRound}
          label="Profile"
          collapsed={collapsed}
          linkClass={linkClass}
        />

        <NavItem
          to="/doctor/appointments"
          icon={CalendarDays}
          label="Appointments"
          collapsed={collapsed}
          linkClass={linkClass}
        />

        <NavItem
  to="/doctor/calendar"
  icon={CalendarClock}
  label="Calendar"
  collapsed={collapsed}
  linkClass={linkClass}
/>

        <NavItem
          to="/doctor/prescriptions"
          icon={FileText}
          label="Prescriptions"
          collapsed={collapsed}
          linkClass={linkClass}
        />

        <button
          onClick={logout}
          className={`flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 w-full font-bold ${
            collapsed ? "justify-center" : ""
          }`}
          title="Logout"
        >
          <LogOut size={20} />
          {!collapsed && "Logout"}
        </button>
      </nav>
    </aside>
  );
}

function NavItem({
  to,
  icon: Icon,
  label,
  collapsed,
  linkClass,
}) {
  return (
    <NavLink
      to={to}
      className={(props) =>
        `${linkClass(props)} ${collapsed ? "justify-center" : ""}`
      }
      title={label}
    >
      <Icon size={20} />
      {!collapsed && label}
    </NavLink>
  );
}