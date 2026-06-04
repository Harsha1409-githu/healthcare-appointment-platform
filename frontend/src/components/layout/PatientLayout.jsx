// src/layouts/PatientLayout.jsx

import { Outlet } from "react-router-dom";
import PatientSidebar from "../PatientSidebar";

export default function PatientLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <PatientSidebar />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}