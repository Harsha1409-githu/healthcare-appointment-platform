import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Stethoscope,
  BarChart3,
  LogOut,
  Menu,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const linkClass = ({ isActive }) =>
    [
      "flex items-center rounded-2xl font-bold transition-all duration-300",
      collapsed ? "justify-center px-0 py-4" : "gap-3 px-4 py-3",
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
        : "text-slate-600 hover:bg-blue-50 hover:text-blue-600",
    ].join(" ");

  return (
    <aside
      className={`shrink-0 min-h-screen bg-white border-r border-slate-200 p-4 transition-all duration-300 ${
        collapsed ? "w-20" : "w-80"
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
              <ShieldCheck className="text-white" size={24} />
            </div>

            <div>
              <h1 className="text-xl font-black text-slate-900">
                Admin Portal
              </h1>
              <p className="text-xs text-slate-500">
                MediCare Control Center
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-3 rounded-2xl bg-slate-100 hover:bg-blue-100 mx-auto"
          title="Toggle sidebar"
        >
          <Menu size={22} />
        </button>
      </div>

      <nav className="space-y-3">
        <NavLink to="/admin/dashboard" className={linkClass} title="Dashboard">
          <LayoutDashboard size={22} />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/admin/hospitals" className={linkClass} title="Hospitals">
          <Building2 size={22} />
          {!collapsed && <span>Hospitals</span>}
        </NavLink>

        <NavLink to="/admin/doctors" className={linkClass} title="Doctors">
          <Stethoscope size={22} />
          {!collapsed && <span>Doctors</span>}
        </NavLink>

        <NavLink to="/admin/analytics" className={linkClass} title="Analytics">
          <BarChart3 size={22} />
          {!collapsed && <span>Analytics</span>}
        </NavLink>
      </nav>

      <button
        onClick={logout}
        className={`mt-10 flex items-center rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition ${
          collapsed
            ? "justify-center px-0 py-4 w-full"
            : "gap-3 px-4 py-3 w-full"
        }`}
        title="Logout"
      >
        <LogOut size={22} />
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
}