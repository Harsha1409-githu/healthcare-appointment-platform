// src/layouts/PublicLayout.jsx

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../Navbar";
import MobileBottomNav from "../MobileBottomNav";

export default function PublicLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const hideBackButtonRoutes = [
    "/",
    "/login",
    "/register",
    "/patient/login",
    "/patient/register",
    "/doctor/login",
    "/hospital/login",
    "/admin/login",
    "/welcome",
    "/home",
  ];

  const showBackButton =
    !hideBackButtonRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="hidden md:block">
        <Navbar />
      </div>

      {showBackButton && (
        <div className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
            >
              <ArrowLeft size={20} />
            </button>

            <h1 className="font-black text-slate-900 text-base">
              Back
            </h1>
          </div>
        </div>
      )}

      <main className="min-h-screen pb-28 md:pb-0">
        <Outlet />
      </main>

      <MobileBottomNav />
    </div>
  );
}