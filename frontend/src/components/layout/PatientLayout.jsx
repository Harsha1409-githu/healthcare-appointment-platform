// src/layouts/PatientLayout.jsx

import { Outlet } from "react-router-dom";
import PatientSidebar from "../PatientSidebar";
import MobileBottomNav from "../MobileBottomNav";

export default function PatientLayout() {
  return (
    <div className="flex min-h-screen bg-[#f4fbff]">
      <div className="hidden md:block">
        <PatientSidebar />
      </div>

      <main className="flex-1 min-w-0 pb-28 md:pb-0">
        <Outlet />
      </main>

      <MobileBottomNav />
    </div>
  );
}