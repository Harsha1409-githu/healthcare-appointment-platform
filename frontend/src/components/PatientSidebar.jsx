import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  User,
  Brain,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Home,
  FileHeart,
  Pill,
  Activity,
  FlaskConical,
  Bell,
} from "lucide-react";

export default function PatientSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const [patient, setPatient] = useState(() =>
    JSON.parse(localStorage.getItem("patientUser") || "null")
  );

  useEffect(() => {
    const updatePatientProfile = () => {
      setPatient(
        JSON.parse(localStorage.getItem("patientUser") || "null")
      );
    };

    updatePatientProfile();

    window.addEventListener(
      "patientProfileUpdated",
      updatePatientProfile
    );

    window.addEventListener("storage", updatePatientProfile);

    return () => {
      window.removeEventListener(
        "patientProfileUpdated",
        updatePatientProfile
      );

      window.removeEventListener("storage", updatePatientProfile);
    };
  }, []);

  const linkClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 p-3 rounded-2xl bg-cyan-600 text-white font-black shadow-sm"
      : "flex items-center gap-3 p-3 rounded-2xl text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 font-bold transition";

  return (
    <aside
  className={`h-screen sticky top-0 overflow-y-auto bg-white border-r border-slate-100 p-5 shrink-0 transition-all duration-300 ${
    collapsed ? "w-24" : "w-72"
  }`}
>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600 flex items-center justify-center overflow-hidden shrink-0">
            {patient?.profileImage ? (
              <img
                src={patient.profileImage}
                alt="Patient"
                className="w-full h-full object-cover"
              />
            ) : (
              <HeartPulse size={24} className="text-white" />
            )}
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-2xl font-black text-slate-950">
                TryDoc
              </h1>

              <p className="text-xs text-slate-500 truncate max-w-[170px]">
                {patient?.fullName || "Patient Dashboard"}
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
          <SidebarItem
            to="/patient/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
            collapsed={collapsed}
            linkClass={linkClass}
          />

          <SidebarItem
            to="/patient/appointments"
            icon={CalendarDays}
            label="Appointments"
            collapsed={collapsed}
            linkClass={linkClass}
          />

          <SidebarItem
            to="/patient/medical-records"
            icon={FileHeart}
            label="Medical Records"
            collapsed={collapsed}
            linkClass={linkClass}
          />

          <SidebarItem
            to="/patient/prescriptions"
            icon={FileText}
            label="Prescriptions"
            collapsed={collapsed}
            linkClass={linkClass}
          />

          <SidebarItem
            to="/symptom-checker"
            icon={Brain}
            label="Symptom Checker"
            collapsed={collapsed}
            linkClass={linkClass}
          />

          <SidebarItem
            to="/notifications"
            icon={Bell}
            label="Notifications"
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
        <nav className="space-y-6">
          <MenuGroup title="Overview">
            <SidebarItem
              to="/patient/dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
              collapsed={collapsed}
              linkClass={linkClass}
            />

            <SidebarItem
              to="/patient/profile"
              icon={User}
              label="My Profile"
              collapsed={collapsed}
              linkClass={linkClass}
            />

            <SidebarItem
              to="/patient/appointments"
              icon={CalendarDays}
              label="Appointments"
              collapsed={collapsed}
              linkClass={linkClass}
            />
          </MenuGroup>

          <MenuGroup title="Healthcare">
            <SidebarItem
              to="/patient/medical-records"
              icon={FileHeart}
              label="Medical Records"
              collapsed={collapsed}
              linkClass={linkClass}
            />

            <SidebarItem
              to="/patient/prescriptions"
              icon={FileText}
              label="Prescriptions"
              collapsed={collapsed}
              linkClass={linkClass}
            />

            <SidebarItem
              to="/patient/lab-tests"
              icon={FlaskConical}
              label="Lab Tests"
              collapsed={collapsed}
              linkClass={linkClass}
            />

            <SidebarItem
              to="/patient/medicine-reminders"
              icon={Pill}
              label="Medicine Reminders"
              collapsed={collapsed}
              linkClass={linkClass}
            />

            <SidebarItem
              to="/patient/health-timeline"
              icon={Activity}
              label="Health Timeline"
              collapsed={collapsed}
              linkClass={linkClass}
            />
          </MenuGroup>

          <MenuGroup title="AI Tools">
            <SidebarItem
              to="/symptom-checker"
              icon={Brain}
              label="Symptom Checker"
              collapsed={collapsed}
              linkClass={linkClass}
            />

            <SidebarItem
              to="/patient/symptom-history"
              icon={Brain}
              label="Symptom History"
              collapsed={collapsed}
              linkClass={linkClass}
            />

            <SidebarItem
  to="/ai-health-assistant"
  icon={Brain}
  label="TryDoc AI"
  collapsed={collapsed}
  linkClass={linkClass}
/>
          </MenuGroup>

          <MenuGroup title="Navigation">
            <SidebarItem
              to="/notifications"
              icon={Bell}
              label="Notifications"
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
          </MenuGroup>
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

function SidebarItem({
  to,
  icon: Icon,
  label,
  collapsed,
  linkClass,
}) {
  return (
    <NavLink
      to={to}
      title={label}
      className={(props) =>
        `${linkClass(props)} ${collapsed ? "justify-center" : ""}`
      }
    >
      <Icon size={20} />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}