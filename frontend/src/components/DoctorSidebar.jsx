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
  Home,
  ShieldCheck,
  Activity,
} from "lucide-react";

export default function DoctorSidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const [doctor, setDoctor] = useState(() =>
    JSON.parse(localStorage.getItem("doctorUser") || "null")
  );

  useEffect(() => {
    const updateDoctorProfile = () => {
      setDoctor(JSON.parse(localStorage.getItem("doctorUser") || "null"));
    };

    updateDoctorProfile();

    window.addEventListener("doctorProfileUpdated", updateDoctorProfile);
    window.addEventListener("storage", updateDoctorProfile);

    return () => {
      window.removeEventListener("doctorProfileUpdated", updateDoctorProfile);
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
      ? "flex items-center gap-3 p-3 rounded-2xl bg-cyan-600 text-white font-black shadow-sm"
      : "flex items-center gap-3 p-3 rounded-2xl text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 font-bold transition";

  return (
    <aside
      className={`min-h-screen bg-white border-r border-slate-100 p-5 shrink-0 transition-all duration-300 ${
        collapsed ? "w-24" : "w-72"
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600 flex items-center justify-center overflow-hidden shrink-0">
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
              <h1 className="text-2xl font-black text-slate-950">
                MediCare
              </h1>

              <p className="text-xs text-slate-500 truncate max-w-[170px]">
                Dr. {doctor?.doctorName || "Doctor Workspace"}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-center"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      {collapsed ? (
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
  to="/doctor/dashboard"
  icon={FileText}
  label="Prescriptions"
  collapsed={collapsed}
  linkClass={linkClass}
/>

          <NavItem
            to="/"
            icon={Home}
            label="Home"
            collapsed={collapsed}
            linkClass={linkClass}
          />

          <LogoutButton collapsed={collapsed} logout={logout} />
        </nav>
      ) : (
        <nav className="space-y-6">
          <MenuGroup title="Workspace">
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
              label="My Profile"
              collapsed={collapsed}
              linkClass={linkClass}
            />
          </MenuGroup>

          <MenuGroup title="Practice">
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
          </MenuGroup>

          <MenuGroup title="Insights">
            <NavItem
              to="/doctor/dashboard"
              icon={Activity}
              label="Analytics"
              collapsed={collapsed}
              linkClass={linkClass}
            />

            <NavItem
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
              Verified Doctor
            </p>

            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Manage consultations, prescriptions and patient records securely.
            </p>
          </div>

          <LogoutButton collapsed={collapsed} logout={logout} />
        </nav>
      )}
    </aside>
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

function NavItem({ to, icon: Icon, label, collapsed, linkClass }) {
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

function LogoutButton({ collapsed, logout }) {
  return (
    <button
      onClick={logout}
      className={`flex items-center gap-3 p-3 rounded-2xl text-red-600 hover:bg-red-50 w-full font-black transition ${
        collapsed ? "justify-center" : ""
      }`}
      title="Logout"
    >
      <LogOut size={20} />
      {!collapsed && <span>Logout</span>}
    </button>
  );
}