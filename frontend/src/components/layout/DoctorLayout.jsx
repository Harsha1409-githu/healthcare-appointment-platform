import { Outlet } from "react-router-dom";
import DoctorSidebar from "../DoctorSidebar";
import DoctorBottomNav from "../DoctorBottomNav";

export default function DoctorLayout() {
  return (
    <div className="flex min-h-screen bg-[#f4fbff]">
      <div className="sticky top-0 h-screen z-30 shrink-0 hidden lg:block">
        <DoctorSidebar />
      </div>

      <main className="flex-1 min-w-0 overflow-x-hidden pb-28 md:pb-0">
        <div className="w-full">
          <Outlet />
        </div>
      </main>

      <DoctorBottomNav />
    </div>
  );
}