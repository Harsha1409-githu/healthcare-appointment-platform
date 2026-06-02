import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, UserCircle } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  const activeClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-blue-600";

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-blue-600 font-bold text-xl"
        >
          🏥 MediCare
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={activeClass}>
            Home
          </NavLink>

          <NavLink to="/doctors" className={activeClass}>
            Doctors
          </NavLink>

          {token && (
  <>
    <NavLink to="/dashboard" className={activeClass}>
      Dashboard
    </NavLink>

    <NavLink to="/appointments" className={activeClass}>
      Appointments
    </NavLink>

    <NavLink to="/prescriptions" className={activeClass}>
      Prescriptions
    </NavLink>
  </>
)}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {token ? (
            <>
              <div className="flex items-center gap-2 text-gray-600">
                <UserCircle size={30} />

                <span className="text-sm max-w-[180px] truncate">
                  {user?.fullName || user?.email || "User"}
                </span>
              </div>

              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Register
              </Link>

              <UserCircle size={32} className="text-gray-500" />
            </>
          )}
        </div>

        <button className="md:hidden">
          <Menu size={28} />
        </button>
      </div>
    </header>
  );
}