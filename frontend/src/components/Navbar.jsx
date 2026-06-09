import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  UserCircle,
  LogOut,
  Stethoscope,
  HeartPulse,
  ChevronRight,
  ShieldCheck,
  Building2,
  UserPlus,
  UserRound,
  LayoutDashboard,
  CalendarDays,
  FileText,
  Bell,
  Home,
} from "lucide-react";
import api from "../api/axios";
import { io } from "socket.io-client";

export default function Navbar() {
  const navigate = useNavigate();

  const [patientUser, setPatientUser] = useState(() =>
    JSON.parse(localStorage.getItem("patientUser") || "null")
  );

  const [doctorUser, setDoctorUser] = useState(() =>
    JSON.parse(localStorage.getItem("doctorUser") || "null")
  );

  const [hospitalUser, setHospitalUser] = useState(() =>
    JSON.parse(localStorage.getItem("hospitalUser") || "null")
  );

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const patientToken = localStorage.getItem("patientToken");
  const doctorToken = localStorage.getItem("doctorToken");
  const hospitalToken = localStorage.getItem("hospitalToken");
  const adminToken = localStorage.getItem("adminToken");

  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "null");

  const isLoggedIn =
    patientToken || doctorToken || hospitalToken || adminToken;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const currentUser = patientToken
    ? {
        name: patientUser?.fullName || patientUser?.email || "Patient",
        subtitle: "Patient Account",
        image: patientUser?.profileImage,
        icon: UserCircle,
        profilePath: "/profile",
      }
    : doctorToken
    ? {
        name: doctorUser?.doctorName || doctorUser?.email || "Doctor",
        subtitle: "Doctor Account",
        image: doctorUser?.profileImage,
        icon: UserCircle,
        profilePath: "/doctor/profile",
      }
    : hospitalToken
    ? {
        name:
          hospitalUser?.hospitalName || hospitalUser?.email || "Hospital",
        subtitle: "Hospital Portal",
        image: hospitalUser?.profileImage,
        icon: Building2,
        profilePath: "/hospital/profile",
      }
    : adminToken
    ? {
        name: adminUser?.name || "Admin",
        subtitle: "Admin Console",
        image: "",
        icon: ShieldCheck,
        profilePath: "/admin/dashboard",
      }
    : null;

  const loadNotifications = async () => {
    try {
      if (!isLoggedIn) return;
      const res = await api.get("/notifications/my");
      setNotifications(res.data || []);
    } catch (error) {
      console.error("Notification error:", error);
    }
  };

  useEffect(() => {
    const updatePatientProfile = () => {
      setPatientUser(
        JSON.parse(localStorage.getItem("patientUser") || "null")
      );
    };

    updatePatientProfile();
    window.addEventListener("patientProfileUpdated", updatePatientProfile);
    window.addEventListener("storage", updatePatientProfile);

    return () => {
      window.removeEventListener(
        "patientProfileUpdated",
        updatePatientProfile
      );
      window.removeEventListener("storage", updatePatientProfile);
    };
  }, []);

  useEffect(() => {
    const updateDoctorProfile = () => {
      setDoctorUser(
        JSON.parse(localStorage.getItem("doctorUser") || "null")
      );
    };

    updateDoctorProfile();
    window.addEventListener("doctorProfileUpdated", updateDoctorProfile);
    window.addEventListener("storage", updateDoctorProfile);

    return () => {
      window.removeEventListener("doctorProfileUpdated", updateDoctorProfile);
      window.removeEventListener("storage", updateDoctorProfile);
    };
  }, []);

  useEffect(() => {
    const updateHospitalProfile = () => {
      setHospitalUser(
        JSON.parse(localStorage.getItem("hospitalUser") || "null")
      );
    };

    updateHospitalProfile();
    window.addEventListener("hospitalProfileUpdated", updateHospitalProfile);
    window.addEventListener("storage", updateHospitalProfile);

    return () => {
      window.removeEventListener(
        "hospitalProfileUpdated",
        updateHospitalProfile
      );
      window.removeEventListener("storage", updateHospitalProfile);
    };
  }, []);

  useEffect(() => {
  if (!isLoggedIn) return;

  const role = patientToken
    ? "patient"
    : doctorToken
    ? "doctor"
    : hospitalToken
    ? "hospital"
    : "admin";

  const user =
    role === "patient"
      ? patientUser
      : role === "doctor"
      ? doctorUser
      : role === "hospital"
      ? hospitalUser
      : adminUser;

  const userId = role === "admin" ? "admin" : user?.id;

  if (!userId) return;

  const socket = io("http://localhost:3000");

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);

    socket.emit("joinUserRoom", {
      userId,
      role,
    });
  });

  socket.on("newNotification", (notification) => {
    console.log("New live notification:", notification);

    setNotifications((prev) => [
      notification,
      ...prev,
    ]);
  });

  return () => {
    socket.disconnect();
  };
}, [
  patientToken,
  doctorToken,
  hospitalToken,
  adminToken,
  patientUser,
  doctorUser,
  hospitalUser,
]);

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [patientToken, doctorToken, hospitalToken, adminToken]);

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      loadNotifications();
    } catch (error) {
      console.error("Mark all read error:", error);
    }
  };

  const closeMobile = () => setMobileMenuOpen(false);

  const logout = () => {
    localStorage.removeItem("patientToken");
    localStorage.removeItem("patientUser");
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

  const hospitalLogout = () => {
    localStorage.removeItem("hospitalToken");
    localStorage.removeItem("hospitalUser");
    navigate("/hospital/login");
    window.location.reload();
  };

  const adminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
    window.location.reload();
  };

  const handleLogout = () => {
    closeMobile();

    if (patientToken) logout();
    else if (doctorToken) doctorLogout();
    else if (hospitalToken) hospitalLogout();
    else if (adminToken) adminLogout();
  };

  const navClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-100"
      : "flex items-center gap-2 px-4 py-2 rounded-2xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-semibold transition";

  const mobileNavClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 p-4 rounded-2xl bg-blue-600 text-white font-black shadow-lg"
      : "flex items-center gap-3 p-4 rounded-2xl text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-bold transition";

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-2xl border-b border-slate-100 shadow-sm">
      <div className="max-w-[1500px] mx-auto px-5 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-blue-700 via-cyan-500 to-emerald-400 flex items-center justify-center shadow-xl shadow-blue-100">
              <Stethoscope className="text-white" size={25} />
            </div>

            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black bg-gradient-to-r from-slate-950 via-blue-700 to-cyan-600 bg-clip-text text-transparent">
                  MediCare
                </h1>

                <span className="hidden xl:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <HeartPulse size={11} />
                  Live
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Smart Healthcare Platform
              </p>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-2 bg-slate-50 rounded-3xl p-2 border border-slate-100">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>

            <NavLink to="/doctors" className={navClass}>
              <Stethoscope size={17} />
              Doctors
            </NavLink>

            {patientToken && (
              <>
                <NavLink to="/dashboard" className={navClass}>
                  <LayoutDashboard size={17} />
                  Dashboard
                </NavLink>

                <NavLink to="/appointments" className={navClass}>
                  <CalendarDays size={17} />
                  Appointments
                </NavLink>

                <NavLink to="/prescriptions" className={navClass}>
                  <FileText size={17} />
                  Prescriptions
                </NavLink>
              </>
            )}

            {doctorToken && (
              <NavLink to="/doctor/dashboard" className={navClass}>
                <Stethoscope size={17} />
                Doctor
              </NavLink>
            )}

            {hospitalToken && (
              <NavLink to="/hospital/dashboard" className={navClass}>
                <Building2 size={17} />
                Hospital
              </NavLink>
            )}

            {adminToken && (
              <NavLink to="/admin/dashboard" className={navClass}>
                <ShieldCheck size={17} />
                Admin
              </NavLink>
            )}
          </nav>

          <div className="hidden xl:flex items-center gap-3 shrink-0">
            {isLoggedIn && (
              <div className="relative">
                <button
                  onClick={() =>
                    setShowNotifications(!showNotifications)
                  }
                  className="relative p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition"
                >
                  <Bell size={22} className="text-slate-700" />

                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-black rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-96 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 z-50 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <h3 className="font-black text-slate-900">
                          Notifications
                        </h3>
                        <p className="text-xs text-slate-500">
                          {unreadCount} unread
                        </p>
                      </div>

                      {notifications.length > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-5 text-sm text-slate-500">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((item) => (
                          <div
                            key={item.id}
                            className={`p-4 border-b border-slate-100 ${
                              item.isRead
                                ? "bg-white"
                                : "bg-blue-50/60"
                            }`}
                          >
                            <div className="flex gap-3">
                              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                                <Bell size={17} className="text-white" />
                              </div>

                              <div>
                                <p className="font-black text-sm text-slate-900">
                                  {item.title}
                                </p>
                                <p className="text-sm text-slate-600 mt-1">
                                  {item.message}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-2">
                                  {new Date(item.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-3 bg-slate-50">
                      <Link
                        to="/notifications"
                        onClick={() => setShowNotifications(false)}
                        className="block text-center text-blue-600 font-black text-sm"
                      >
                        View All Notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {patientToken ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2 rounded-3xl bg-white border border-blue-100 shadow-sm hover:bg-blue-50 transition"
                >
                  <ProfileIcon
                    image={patientUser?.profileImage}
                    fallback={UserCircle}
                    color="text-blue-600"
                  />

                  <div className="leading-tight text-left">
                    <p className="text-sm font-black max-w-[160px] truncate text-slate-800">
                      {patientUser?.fullName ||
                        patientUser?.email ||
                        "Patient"}
                    </p>
                    <p className="text-xs text-blue-500">
                      Patient Account
                    </p>
                  </div>
                </Link>

                <LogoutButton onClick={logout} />
              </>
            ) : doctorToken ? (
              <>
                <Link
                  to="/doctor/profile"
                  className="flex items-center gap-3 px-4 py-2 rounded-3xl bg-white border border-emerald-100 shadow-sm hover:bg-emerald-50 transition"
                >
                  <ProfileIcon
                    image={doctorUser?.profileImage}
                    fallback={UserCircle}
                    color="text-emerald-600"
                  />

                  <div>
                    <p className="text-sm font-black max-w-[160px] truncate">
                      {doctorUser?.doctorName ||
                        doctorUser?.email ||
                        "Doctor"}
                    </p>
                    <p className="text-xs text-emerald-600">
                      Doctor Account
                    </p>
                  </div>
                </Link>

                <LogoutButton onClick={doctorLogout} />
              </>
            ) : hospitalToken ? (
              <>
                <Link
                  to="/hospital/profile"
                  className="flex items-center gap-3 px-4 py-2 rounded-3xl bg-white border border-blue-100 shadow-sm hover:bg-blue-50 transition"
                >
                  <ProfileIcon
                    image={hospitalUser?.profileImage}
                    fallback={Building2}
                    color="text-blue-600"
                  />

                  <div>
                    <p className="text-sm font-black max-w-[160px] truncate">
                      {hospitalUser?.hospitalName ||
                        hospitalUser?.email ||
                        "Hospital"}
                    </p>
                    <p className="text-xs text-blue-600">
                      Hospital Portal
                    </p>
                  </div>
                </Link>

                <LogoutButton onClick={hospitalLogout} />
              </>
            ) : adminToken ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 rounded-3xl bg-white border border-purple-100 shadow-sm">
                  <ShieldCheck size={25} className="text-purple-600" />
                  <div>
                    <p className="text-sm font-black">
                      {adminUser?.name || "Admin"}
                    </p>
                    <p className="text-xs text-purple-600">
                      Admin Console
                    </p>
                  </div>
                </div>

                <LogoutButton onClick={adminLogout} />
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white border border-blue-100 text-blue-700 font-bold hover:bg-blue-50"
                >
                  <UserRound size={18} />
                  Patient Login
                </Link>

                <Link
                  to="/doctor/login"
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white border border-emerald-100 text-emerald-700 font-bold hover:bg-emerald-50"
                >
                  <Stethoscope size={18} />
                  Doctor Login
                </Link>

                <Link
                  to="/register"
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black shadow-xl shadow-blue-100 hover:scale-[1.02] transition"
                >
                  <UserPlus size={18} />
                  Register
                  <ChevronRight size={17} />
                </Link>

                <Link
                  to="/hospital/login"
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl text-slate-500 hover:text-blue-600 font-bold"
                >
                  <Building2 size={17} />
                  Hospital Portal
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="xl:hidden relative p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 transition"
          >
            <Menu size={26} />

            {unreadCount > 0 && isLoggedIn && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-black rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <>
          <div
            onClick={closeMobile}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 xl:hidden"
          />

          <aside className="fixed top-0 right-0 h-full w-[88%] max-w-[390px] bg-white z-50 shadow-2xl xl:hidden overflow-y-auto">
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-6 text-white">
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-cyan-400/20 blur-3xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="w-14 h-14 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mb-4">
                    <Stethoscope size={28} className="text-cyan-300" />
                  </div>

                  <h2 className="text-3xl font-black">MediCare</h2>
                  <p className="text-blue-100 text-sm mt-1">
                    Smart Healthcare Platform
                  </p>
                </div>

                <button
                  onClick={closeMobile}
                  className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center"
                >
                  <X size={22} />
                </button>
              </div>

              {currentUser && (
                <Link
                  to={currentUser.profilePath}
                  onClick={closeMobile}
                  className="relative mt-6 flex items-center gap-3 bg-white/10 border border-white/20 rounded-3xl p-4"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/10 overflow-hidden flex items-center justify-center shrink-0">
                    {currentUser.image ? (
                      <img
                        src={currentUser.image}
                        alt={currentUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <currentUser.icon size={30} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="font-black truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-sm text-blue-100">
                      {currentUser.subtitle}
                    </p>
                  </div>
                </Link>
              )}
            </div>

            <nav className="p-5 space-y-2">
              <NavLink to="/" onClick={closeMobile} className={mobileNavClass}>
                <Home size={19} />
                Home
              </NavLink>

              <NavLink
                to="/doctors"
                onClick={closeMobile}
                className={mobileNavClass}
              >
                <Stethoscope size={19} />
                Doctors
              </NavLink>

              {patientToken && (
                <>
                  <NavLink
                    to="/dashboard"
                    onClick={closeMobile}
                    className={mobileNavClass}
                  >
                    <LayoutDashboard size={19} />
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/appointments"
                    onClick={closeMobile}
                    className={mobileNavClass}
                  >
                    <CalendarDays size={19} />
                    Appointments
                  </NavLink>

                  <NavLink
                    to="/prescriptions"
                    onClick={closeMobile}
                    className={mobileNavClass}
                  >
                    <FileText size={19} />
                    Prescriptions
                  </NavLink>

                  <NavLink
                    to="/profile"
                    onClick={closeMobile}
                    className={mobileNavClass}
                  >
                    <UserCircle size={19} />
                    Profile
                  </NavLink>
                </>
              )}

              {doctorToken && (
                <>
                  <NavLink
                    to="/doctor/dashboard"
                    onClick={closeMobile}
                    className={mobileNavClass}
                  >
                    <Stethoscope size={19} />
                    Doctor Dashboard
                  </NavLink>

                  <NavLink
                    to="/doctor/profile"
                    onClick={closeMobile}
                    className={mobileNavClass}
                  >
                    <UserCircle size={19} />
                    My Profile
                  </NavLink>
                </>
              )}

              {hospitalToken && (
                <>
                  <NavLink
                    to="/hospital/dashboard"
                    onClick={closeMobile}
                    className={mobileNavClass}
                  >
                    <Building2 size={19} />
                    Hospital Dashboard
                  </NavLink>

                  <NavLink
                    to="/hospital/doctors"
                    onClick={closeMobile}
                    className={mobileNavClass}
                  >
                    <Stethoscope size={19} />
                    Doctors
                  </NavLink>

                  <NavLink
                    to="/hospital/availability"
                    onClick={closeMobile}
                    className={mobileNavClass}
                  >
                    <CalendarDays size={19} />
                    Availability
                  </NavLink>

                  <NavLink
                    to="/hospital/appointments"
                    onClick={closeMobile}
                    className={mobileNavClass}
                  >
                    <FileText size={19} />
                    Appointments
                  </NavLink>

                  <NavLink
                    to="/hospital/profile"
                    onClick={closeMobile}
                    className={mobileNavClass}
                  >
                    <Building2 size={19} />
                    Hospital Profile
                  </NavLink>
                </>
              )}

              {adminToken && (
                <NavLink
                  to="/admin/dashboard"
                  onClick={closeMobile}
                  className={mobileNavClass}
                >
                  <ShieldCheck size={19} />
                  Admin Dashboard
                </NavLink>
              )}

              {isLoggedIn && (
                <NavLink
                  to="/notifications"
                  onClick={closeMobile}
                  className={mobileNavClass}
                >
                  <Bell size={19} />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              )}

              {!isLoggedIn && (
                <div className="pt-4 space-y-3">
                  <Link
                    to="/login"
                    onClick={closeMobile}
                    className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl bg-blue-600 text-white font-black"
                  >
                    <UserRound size={18} />
                    Patient Login
                  </Link>

                  <Link
                    to="/doctor/login"
                    onClick={closeMobile}
                    className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl bg-emerald-600 text-white font-black"
                  >
                    <Stethoscope size={18} />
                    Doctor Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobile}
                    className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl bg-slate-950 text-white font-black"
                  >
                    <UserPlus size={18} />
                    Register
                  </Link>

                  <Link
                    to="/hospital/login"
                    onClick={closeMobile}
                    className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border border-slate-200 font-black text-slate-700"
                  >
                    <Building2 size={18} />
                    Hospital Portal
                  </Link>
                </div>
              )}

              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="mt-5 flex items-center justify-center gap-2 w-full p-4 rounded-2xl bg-red-600 text-white font-black"
                >
                  <LogOut size={19} />
                  Logout
                </button>
              )}
            </nav>
          </aside>
        </>
      )}
    </header>
  );
}

function ProfileIcon({ image, fallback: Fallback, color }) {
  return (
    <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center overflow-hidden">
      {image ? (
        <img src={image} alt="Profile" className="w-full h-full object-cover" />
      ) : (
        <Fallback size={28} className={color} />
      )}
    </div>
  );
}

function LogoutButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-100 transition"
    >
      <LogOut size={18} />
      Logout
    </button>
  );
}