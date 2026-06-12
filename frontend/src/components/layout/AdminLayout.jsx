import { Outlet } from "react-router-dom";
import AdminSidebar from "../AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#f4fbff]">
      <div className="sticky top-0 h-screen z-30 shrink-0 hidden lg:block">
        <AdminSidebar />
      </div>

      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="w-full max-w-[1600px] mx-auto px-5 md:px-8 lg:px-10 py-8 lg:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}