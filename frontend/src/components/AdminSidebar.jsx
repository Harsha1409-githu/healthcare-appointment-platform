import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Stethoscope,
} from "lucide-react";

export default function AdminSidebar() {
  return (
    <aside className="w-72 bg-white border-r min-h-screen p-5">
      <h1 className="text-2xl font-black mb-8">
        Admin Portal
      </h1>

      <nav className="space-y-3">
        <NavLink
          to="/admin/dashboard"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/hospitals"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
        >
          <Building2 size={20} />
          Hospitals
        </NavLink>

        <NavLink
          to="/admin/doctors"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
        >
          <Stethoscope size={20} />
          Doctors
        </NavLink>
      </nav>
    </aside>
  );
}