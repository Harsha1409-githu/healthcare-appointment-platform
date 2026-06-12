import { Outlet } from "react-router-dom";
import PatientSidebar from "../PatientSidebar";

export default function PatientLayout() {
  return (
    <div className="flex min-h-screen bg-[#f4fbff]">
      <div className="sticky top-0 h-screen z-30 shrink-0 hidden lg:block">
        <PatientSidebar />
      </div>

      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}