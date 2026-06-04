// src/layouts/AdminLayout.jsx

import { Outlet } from "react-router-dom";
import AdminSidebar from "../AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}