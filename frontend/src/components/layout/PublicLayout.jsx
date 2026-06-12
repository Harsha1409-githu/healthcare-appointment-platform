// src/layouts/PublicLayout.jsx

import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import FloatingAI from "../FloatingAI";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#f4fbff]">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="min-h-[calc(100vh-80px)]">
        <Outlet />
      </main>

      {/* Floating AI Assistant */}
      <FloatingAI />
    </div>
  );
}