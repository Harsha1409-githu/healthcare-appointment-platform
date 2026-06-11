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

      window.removeEventListener(
        "storage",
        updatePatientProfile
      );
    };
  }, []);

  const linkClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 p-3 rounded-xl bg-blue-600 text-white font-bold shadow"
      : "flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-700 font-semibold";

  return (
    <aside
      className={`min-h-screen bg-white border-r border-slate-200 p-5 shrink-0 transition-all duration-300 ${
        collapsed ? "w-24" : "w-72"
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center overflow-hidden">
            {patient?.profileImage ? (
              <img
                src={patient.profileImage}
                alt="Patient"
                className="w-full h-full object-cover"
              />
            ) : (
              <HeartPulse
                size={24}
                className="text-white"
              />
            )}
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                Patient Portal
              </h1>

              <p className="text-xs text-slate-500 truncate max-w-[170px]">
                {patient?.fullName || "Healthcare Dashboard"}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() =>
            setCollapsed(!collapsed)
          }
          className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      <SidebarItem
  to="/"
  icon={Home}
  label="Home"
  collapsed={collapsed}
  linkClass={linkClass}
/>

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
          to="/patient/prescriptions"
          icon={FileText}
          label="Prescriptions"
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
          to="/patient/profile"
          icon={User}
          label="Profile"
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

<SidebarItem
  to="/patient/lab-tests"
  icon={FlaskConical}
  label="Lab Tests"
  collapsed={collapsed}
  linkClass={linkClass}
/>

<SidebarItem
  to="/patient/ai-health-insights"
  icon={Brain}
  label="AI Health Insights"
  collapsed={collapsed}
  linkClass={linkClass}
/>
      </nav>
    </aside>
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
        `${linkClass(props)} ${
          collapsed ? "justify-center" : ""
        }`
      }
    >
      <Icon size={20} />
      {!collapsed && label}
    </NavLink>
  );
}