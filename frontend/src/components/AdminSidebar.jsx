import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Stethoscope,
  BarChart3,
  LogOut,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Home,
  UsersRound,
  Activity,
} from "lucide-react";
import { useState } from "react";

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "null");

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 px-4 py-3 rounded-2xl bg-cyan-600 text-white font-black shadow-sm"
      : "flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 font-bold transition";

  return (
    <aside
      className={`shrink-0 min-h-screen bg-white border-r border-slate-100 p-5 transition-all duration-300 ${
        collapsed ? "w-24" : "w-72"
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="text-white" size={25} />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-2xl font-black text-slate-950">
                TryDoc
              </h1>

              <p className="text-xs text-slate-500 truncate max-w-[170px]">
                {adminUser?.name || "Admin Control Center"}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-center"
          title="Toggle sidebar"
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
            to="/admin/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
            collapsed={collapsed}
            linkClass={linkClass}
          />

          <SidebarItem
            to="/admin/hospitals"
            icon={Building2}
            label="Hospitals"
            collapsed={collapsed}
            linkClass={linkClass}
          />

          <SidebarItem
            to="/admin/doctors"
            icon={Stethoscope}
            label="Doctors"
            collapsed={collapsed}
            linkClass={linkClass}
          />

          <SidebarItem
            to="/admin/analytics"
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
        <nav className="space-y-6">
          <MenuGroup title="Control Center">
            <SidebarItem
              to="/admin/dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
              collapsed={collapsed}
              linkClass={linkClass}
            />

            <SidebarItem
              to="/admin/analytics"
              icon={BarChart3}
              label="Analytics"
              collapsed={collapsed}
              linkClass={linkClass}
            />
          </MenuGroup>

          <MenuGroup title="Management">
            <SidebarItem
              to="/admin/hospitals"
              icon={Building2}
              label="Hospitals"
              collapsed={collapsed}
              linkClass={linkClass}
            />

            <SidebarItem
              to="/admin/doctors"
              icon={Stethoscope}
              label="Doctors"
              collapsed={collapsed}
              linkClass={linkClass}
            />

            <SidebarItem
              to="/admin/doctors"
              icon={UsersRound}
              label="Providers"
              collapsed={collapsed}
              linkClass={linkClass}
            />
          </MenuGroup>

          <MenuGroup title="Platform">
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
              <Activity className="text-cyan-600" size={21} />
            </div>

            <p className="font-black text-slate-950 text-sm">
              Platform Admin
            </p>

            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Manage hospitals, doctors, approvals and platform analytics.
            </p>
          </div>
        </nav>
      )}

      <button
        onClick={logout}
        className={`mt-8 flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-600 text-white font-black hover:bg-red-700 transition w-full ${
          collapsed ? "justify-center" : ""
        }`}
        title="Logout"
      >
        <LogOut size={20} />
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
}

function MenuGroup({ title, children }) {
  return (
    <div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
        {title}
      </p>

      <div className="space-y-2">{children}</div>
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