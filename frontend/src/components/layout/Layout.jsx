import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import FloatingAI from "../FloatingAI";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#f4fbff]">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="min-h-[calc(100vh-80px)]">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>

      {/* AI Assistant */}
      <FloatingAI />
    </div>
  );
}