// src/layouts/HospitalLayout.jsx

import { Outlet } from "react-router-dom";
import HospitalSidebar from "../HospitalSidebar";

export default function HospitalLayout() {
  return (
    <div className="flex min-h-screen bg-[#f4fbff]">
      {/* Sidebar */}
      <div className="sticky top-0 h-screen z-30 shrink-0 hidden lg:block">
        <HospitalSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="w-full max-w-[1800px] mx-auto px-5 md:px-8 lg:px-10 py-8 lg:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}