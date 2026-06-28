import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Stethoscope,
  CalendarDays,
  ClipboardList,
  BarChart3,
  LogOut,
  Building2,
  UserRound,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Home,
} from "lucide-react";

export default function HospitalLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const [hospital, setHospital] = useState(() =>
    JSON.parse(localStorage.getItem("hospitalUser") || "null")
  );

  useEffect(() => {
    const updateHospitalProfile = () => {
      setHospital(JSON.parse(localStorage.getItem("hospitalUser") || "null"));
    };

    updateHospitalProfile();

    window.addEventListener("hospitalProfileUpdated", updateHospitalProfile);
    window.addEventListener("storage", updateHospitalProfile);

    return () => {
      window.removeEventListener("hospitalProfileUpdated", updateHospitalProfile);
      window.removeEventListener("storage", updateHospitalProfile);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("hospitalToken");
    localStorage.removeItem("hospitalUser");
    navigate("/hospital/login");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 px-4 py-3 rounded-2xl bg-cyan-600 text-white font-black shadow-sm"
      : "flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 font-bold transition";

  return (
    <div className="min-h-screen bg-[#f4fbff] flex">
      <aside
        className={`hidden lg:flex bg-white border-r border-slate-100 p-5 shrink-0 flex-col transition-all duration-300 ${
          collapsed ? "w-24" : "w-72"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-cyan-600 flex items-center justify-center overflow-hidden shrink-0">
              {hospital?.profileImage ? (
                <img
                  src={hospital.profileImage}
                  alt="Hospital"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="text-white" size={26} />
              )}
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <h2 className="font-black text-2xl text-slate-950">
                  TryDoc
                </h2>

                <p className="text-xs text-slate-500 truncate max-w-[170px]">
                  {hospital?.hospitalName || "Hospital Portal"}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-center"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {collapsed ? (
          <nav className="space-y-3 flex-1">
            <SidebarItem
              to="/hospital/dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
              collapsed={collapsed}
              linkClass={linkClass}
            />

            <SidebarItem
              to="/hospital/profile"
              icon={UserRound}
              label="Profile"
              collapsed={collapsed}
              linkClass={linkClass}
            />

            <SidebarItem
              to="/hospital/doctors"
              icon={Stethoscope}
              label="Doctors"
              collapsed={collapsed}
              linkClass={linkClass}
            />

            <SidebarItem
              to="/hospital/availability"
              icon={CalendarDays}
              label="Availability"
              collapsed={collapsed}
              linkClass={linkClass}
            />

            <SidebarItem
              to="/hospital/calendar"
              icon={CalendarClock}
              label="Calendar"
              collapsed={collapsed}
              linkClass={linkClass}
            />

            <SidebarItem
              to="/hospital/appointments"
              icon={ClipboardList}
              label="Appointments"
              collapsed={collapsed}
              linkClass={linkClass}
            />

            <SidebarItem
              to="/hospital/analytics"
              icon={BarChart3}
              label="Analytics"
              collapsed={collapsed}
              linkClass={linkClass}
            />

            <SidebarItem
              to="/"
              icon={Home}
              label="Home"
              collapsed={collapsed}
              linkClass={linkClass}
            />
          </nav>
        ) : (
          <nav className="space-y-6 flex-1">
            <MenuGroup title="Workspace">
              <SidebarItem
                to="/hospital/dashboard"
                icon={LayoutDashboard}
                label="Dashboard"
                collapsed={collapsed}
                linkClass={linkClass}
              />

              <SidebarItem
                to="/hospital/profile"
                icon={UserRound}
                label="Hospital Profile"
                collapsed={collapsed}
                linkClass={linkClass}
              />
            </MenuGroup>

            <MenuGroup title="Operations">
              <SidebarItem
                to="/hospital/doctors"
                icon={Stethoscope}
                label="Doctors"
                collapsed={collapsed}
                linkClass={linkClass}
              />

              <SidebarItem
                to="/hospital/availability"
                icon={CalendarDays}
                label="Availability"
                collapsed={collapsed}
                linkClass={linkClass}
              />

              <SidebarItem
                to="/hospital/calendar"
                icon={CalendarClock}
                label="Calendar"
                collapsed={collapsed}
                linkClass={linkClass}
              />

              <SidebarItem
                to="/hospital/appointments"
                icon={ClipboardList}
                label="Appointments"
                collapsed={collapsed}
                linkClass={linkClass}
              />
            </MenuGroup>

            <MenuGroup title="Insights">
              <SidebarItem
                to="/hospital/analytics"
                icon={BarChart3}
                label="Analytics"
                collapsed={collapsed}
                linkClass={linkClass}
              />

              <SidebarItem
                to="/"
                icon={Home}
                label="Public Home"
                collapsed={collapsed}
                linkClass={linkClass}
              />
            </MenuGroup>

            <div className="bg-cyan-50 border border-cyan-100 rounded-[1.5rem] p-4">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center mb-3">
                <ShieldCheck className="text-cyan-600" size={21} />
              </div>

              <p className="font-black text-slate-950 text-sm">
                Verified Hospital
              </p>

              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Manage doctors, slots, appointments and analytics securely.
              </p>
            </div>
          </nav>
        )}

        <button
          onClick={logout}
          className={`mt-5 flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-600 text-white font-black hover:bg-red-700 transition ${
            collapsed ? "justify-center" : ""
          }`}
          title="Logout"
        >
          <LogOut size={20} />
          {!collapsed && "Logout"}
        </button>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

function MenuGroup({ title, children }) {
  return (
    <div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
        {title}
      </p>

      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

function SidebarItem({ to, icon: Icon, label, collapsed, linkClass }) {
  return (
    <NavLink
      to={to}
      className={(props) =>
        `${linkClass(props)} ${collapsed ? "justify-center" : ""}`
      }
      title={label}
    >
      <Icon size={20} />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}