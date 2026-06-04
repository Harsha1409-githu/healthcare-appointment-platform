import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  User,
} from "lucide-react";

export default function PatientSidebar() {
  return (
    <aside className="w-72 min-h-screen bg-white border-r p-5">
      <h1 className="text-2xl font-black mb-8">
        Patient Portal
      </h1>

      <nav className="space-y-3">
        <NavLink
          to="/patient/dashboard"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/patient/appointments"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
        >
          <CalendarDays size={20} />
          Appointments
        </NavLink>

        <NavLink
          to="/patient/prescriptions"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
        >
          <FileText size={20} />
          Prescriptions
        </NavLink>

        <NavLink
          to="/patient/profile"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
        >
          <User size={20} />
          Profile
        </NavLink>
      </nav>
    </aside>
  );
}