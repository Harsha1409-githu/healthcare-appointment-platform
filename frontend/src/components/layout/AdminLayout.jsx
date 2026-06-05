import { Outlet } from "react-router-dom";
import AdminSidebar from "../AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <div className="sticky top-0 h-screen z-30 shrink-0">
        <AdminSidebar />
      </div>

      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="w-full max-w-[1600px] mx-auto px-10 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}