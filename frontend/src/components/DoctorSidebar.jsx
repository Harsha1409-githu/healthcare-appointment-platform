import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  LogOut,
} from "lucide-react";

export default function DoctorSidebar() {
  return (
    <aside className="w-72 min-h-screen bg-white border-r p-5">
      <h1 className="text-2xl font-black mb-8">
        Doctor Portal
      </h1>

      <nav className="space-y-3">
        <NavLink
          to="/doctor/dashboard"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/doctor/appointments"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
        >
          <CalendarDays size={20} />
          Appointments
        </NavLink>

        <NavLink
          to="/doctor/prescriptions"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100"
        >
          <FileText size={20} />
          Prescriptions
        </NavLink>

        <button className="flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 w-full">
          <LogOut size={20} />
          Logout
        </button>
      </nav>
    </aside>
  );
}