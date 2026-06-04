// src/layouts/HospitalLayout.jsx

import { Outlet } from "react-router-dom";
import HospitalSidebar from "../HospitalSidebar";

export default function HospitalLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <HospitalSidebar />

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}