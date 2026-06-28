// src/layouts/HospitalLayout.jsx

import { Outlet } from "react-router-dom";
import HospitalSidebar from "../HospitalSidebar";
import HospitalBottomNav from "../HospitalBottomNav";

export default function HospitalLayout() {
  return (
    <div className="flex min-h-screen bg-[#f4fbff]">
      <div className="sticky top-0 h-screen z-30 shrink-0 hidden lg:block">
        <HospitalSidebar />
      </div>

      <main className="flex-1 min-w-0 overflow-x-hidden pb-28 md:pb-0">
        <div className="w-full">
          <Outlet />
        </div>
      </main>

      <HospitalBottomNav />
    </div>
  );
}