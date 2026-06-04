import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  Menu,
  UserCircle,
  LogOut,
  Stethoscope,
  HeartPulse,
  ChevronRight,
  ShieldCheck,
  Building2,
  UserPlus,
  UserRound,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const doctorToken = localStorage.getItem("doctorToken");
  const adminToken = localStorage.getItem("adminToken");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const doctorUser = JSON.parse(
    localStorage.getItem("doctorUser") || "null"
  );

  const adminUser = JSON.parse(
    localStorage.getItem("adminUser") || "null"
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  const doctorLogout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorUser");
    navigate("/doctor/login");
    window.location.reload();
  };

  const adminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
    window.location.reload();
  };

  const pillClass = ({ isActive }) =>
    isActive
      ? "relative px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-200 transition-all"
      : "px-5 py-2.5 rounded-full text-slate-600 hover:text-blue-600 hover:bg-white hover:shadow-sm transition-all";

  return (
    <header className="sticky top-0 z-50">
      <div className="absolute inset-0 bg-white/75 backdrop-blur-2xl border-b border-white/60 shadow-[0_8px_30px_rgba(15,23,42,0.06)]" />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 blur opacity-40 group-hover:opacity-70 transition" />

              <div className="relative w-12 h-12 rounded-3xl bg-gradient-to-br from-blue-700 via-cyan-500 to-emerald-400 flex items-center justify-center shadow-xl shadow-blue-200 group-hover:scale-105 transition">
                <Stethoscope
                  className="text-white"
                  size={25}
                />
              </div>
            </div>

            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-slate-950 via-blue-700 to-cyan-600 bg-clip-text text-transparent">
                  MediCare
                </h1>

                <span className="hidden lg:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <HeartPulse size={11} />
                  Live
                </span>
              </div>

              <p className="text-xs text-slate-400 -mt-0.5">
                Smart Healthcare Platform
              </p>
            </div>
          </Link>

          {/* Center Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 rounded-full p-1.5 border border-white shadow-inner">
            <NavLink to="/" className={pillClass}>
              Home
            </NavLink>

            <NavLink to="/doctors" className={pillClass}>
              Doctors
            </NavLink>

            {token && (
              <>
                <NavLink
                  to="/dashboard"
                  className={pillClass}
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/appointments"
                  className={pillClass}
                >
                  Appointments
                </NavLink>

                <NavLink
                  to="/prescriptions"
                  className={pillClass}
                >
                  Prescriptions
                </NavLink>
              </>
            )}

            {doctorToken && (
              <NavLink
                to="/doctor/dashboard"
                className={pillClass}
              >
                Doctor Dashboard
              </NavLink>
            )}

            {adminToken && (
              <>
                <NavLink
                  to="/admin/dashboard"
                  className={pillClass}
                >
                  Admin
                </NavLink>

                <NavLink
                  to="/admin/hospitals"
                  className={pillClass}
                >
                  Hospitals
                </NavLink>

                <NavLink
                  to="/admin/doctors"
                  className={pillClass}
                >
                  Doctors
                </NavLink>
              </>
            )}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {token ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-sm">
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                    <UserCircle
                      size={28}
                      className="text-blue-600"
                    />
                  </div>

                  <div className="leading-tight">
                    <p className="text-sm font-bold max-w-[165px] truncate text-slate-800">
                      {user?.fullName ||
                        user?.email ||
                        "Patient"}
                    </p>

                    <p className="text-xs text-blue-500">
                      Patient Account
                    </p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 shadow-lg shadow-red-100 transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : doctorToken ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
                    <UserCircle
                      size={28}
                      className="text-emerald-600"
                    />
                  </div>

                  <div className="leading-tight">
                    <p className="text-sm font-bold max-w-[175px] truncate text-slate-800">
                      {doctorUser?.doctorName ||
                        doctorUser?.email ||
                        "Doctor"}
                    </p>

                    <p className="text-xs text-emerald-600">
                      Doctor Account
                    </p>
                  </div>
                </div>

                <button
                  onClick={doctorLogout}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 shadow-lg shadow-red-100 transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : adminToken ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-purple-100 shadow-sm">
                  <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center">
                    <ShieldCheck
                      size={24}
                      className="text-purple-600"
                    />
                  </div>

                  <div className="leading-tight">
                    <p className="text-sm font-bold max-w-[165px] truncate text-slate-800">
                      {adminUser?.name || "Admin"}
                    </p>

                    <p className="text-xs text-purple-600">
                      Admin Console
                    </p>
                  </div>
                </div>

                <button
                  onClick={adminLogout}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 shadow-lg shadow-red-100 transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-blue-100 text-blue-700 font-semibold hover:border-blue-300 hover:bg-blue-50 shadow-sm transition"
                >
                  <UserRound size={18} />
                  Patient Login
                </Link>

                <Link
                  to="/doctor/login"
                  className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-emerald-100 text-emerald-700 font-semibold hover:border-emerald-300 hover:bg-emerald-50 shadow-sm transition"
                >
                  <Stethoscope size={18} />
                  Doctor Login
                </Link>

                <Link
                  to="/register"
                  className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-xl shadow-blue-200 hover:scale-[1.02] transition"
                >
                  <UserPlus size={18} />
                  Register
                  <ChevronRight
                    size={17}
                    className="group-hover:translate-x-0.5 transition"
                  />
                </Link>

                <Link
                  to="/hospital/login"
                  className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 font-semibold transition"
                >
                  <Building2 size={17} />
                  Hospital Portal
                </Link>
              </>
            )}
          </div>

          {/* Mobile */}
          <button className="lg:hidden p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 transition">
            <Menu size={26} />
          </button>
        </div>
      </div>
    </header>
  );
}