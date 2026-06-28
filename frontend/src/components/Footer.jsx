import { HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 mt-6">
      <div className="max-w-[1450px] mx-auto px-4 py-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600 flex items-center justify-center mb-3">
            <HeartPulse size={24} className="text-white" />
          </div>

          <h2 className="text-xl font-black text-slate-900">
            TryDoc
          </h2>

          <p className="text-sm text-slate-500 mt-2 max-w-md">
            Book appointments, consult doctors and manage your health in one place.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
            <Link
              to="/doctors"
              className="text-slate-600 hover:text-cyan-600"
            >
              Doctors
            </Link>

            <Link
              to="/patient/medical-records"
              className="text-slate-600 hover:text-cyan-600"
            >
              Records
            </Link>

            <Link
              to="/symptom-checker"
              className="text-slate-600 hover:text-cyan-600"
            >
              AI Health
            </Link>

            <Link
              to="/notifications"
              className="text-slate-600 hover:text-cyan-600"
            >
              Notifications
            </Link>
          </div>

          <div className="mt-5 text-xs text-slate-400">
            © 2026 TryDoc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}