import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  UserCircle,
  LogOut,
  Stethoscope,
  LayoutDashboard,
  CalendarDays,
  FileText,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const doctorToken = localStorage.getItem("doctorToken");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const doctorUser = JSON.parse(
    localStorage.getItem("doctorUser") || "null"
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

  const activeClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-blue-600";

  const pillClass = ({ isActive }) =>
    isActive
      ? "px-4 py-2 rounded-full bg-blue-600 text-white font-medium shadow-sm"
      : "px-4 py-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
            <Stethoscope className="text-white" size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">
              MediCare
            </h1>
            <p className="text-xs text-gray-400 -mt-1">
              Smart Healthcare Platform
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2 bg-gray-50 rounded-full p-1 border">
          <NavLink to="/" className={pillClass}>
            Home
          </NavLink>

          <NavLink to="/doctors" className={pillClass}>
            Doctors
          </NavLink>

          {token && (
            <>
              <NavLink to="/dashboard" className={pillClass}>
                Dashboard
              </NavLink>

              <NavLink to="/appointments" className={pillClass}>
                Appointments
              </NavLink>

              <NavLink to="/prescriptions" className={pillClass}>
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
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {token ? (
            <>
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50 border">
                <UserCircle
                  size={30}
                  className="text-blue-600"
                />

                <div className="leading-tight">
                  <p className="text-sm font-semibold max-w-[160px] truncate text-gray-800">
                    {user?.fullName || user?.email || "User"}
                  </p>
                  <p className="text-xs text-gray-400">
                    Patient
                  </p>
                </div>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-sm"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : doctorToken ? (
            <>
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-green-50 border border-green-100">
                <UserCircle
                  size={30}
                  className="text-green-600"
                />

                <div className="leading-tight">
                  <p className="text-sm font-semibold max-w-[170px] truncate text-gray-800">
                    {doctorUser?.doctorName ||
                      doctorUser?.email ||
                      "Doctor"}
                  </p>
                  <p className="text-xs text-green-600">
                    Doctor
                  </p>
                </div>
              </div>

              <button
                onClick={doctorLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-sm"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition"
              >
                Patient Login
              </Link>

              <Link
                to="/doctor/login"
                className="px-4 py-2 text-green-600 border border-green-600 rounded-full hover:bg-green-50 transition"
              >
                Doctor Login
              </Link>

              <Link
                to="/register"
                className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2 rounded-xl hover:bg-gray-100">
          <Menu size={28} />
        </button>
      </div>
    </header>
  );
}