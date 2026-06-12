import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  UserCircle,
  LogOut,
  Stethoscope,
  HeartPulse,
  ChevronDown,
  ShieldCheck,
  Building2,
  UserPlus,
  LayoutDashboard,
  CalendarDays,
  FileText,
  Bell,
  Brain,
  FlaskConical,
  Video,
  Search,
  Hospital,
  ClipboardList,
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
  const [adminUser, setAdminUser] = useState(() =>
    JSON.parse(localStorage.getItem("adminUser") || "null")
  );

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const patientToken = localStorage.getItem("patientToken");
  const doctorToken = localStorage.getItem("doctorToken");
  const hospitalToken = localStorage.getItem("hospitalToken");
  const adminToken = localStorage.getItem("adminToken");

  const isLoggedIn = patientToken || doctorToken || hospitalToken || adminToken;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const currentUser = patientToken
    ? {
        name: patientUser?.fullName || patientUser?.email || "Patient",
        subtitle: "Patient Account",
        image: patientUser?.profileImage,
        icon: UserCircle,
        dashboardPath: "/patient/dashboard",
      }
    : doctorToken
    ? {
        name: doctorUser?.doctorName || doctorUser?.email || "Doctor",
        subtitle: "Doctor Account",
        image: doctorUser?.profileImage,
        icon: Stethoscope,
        dashboardPath: "/doctor/dashboard",
      }
    : hospitalToken
    ? {
        name: hospitalUser?.hospitalName || hospitalUser?.email || "Hospital",
        subtitle: "Hospital Portal",
        image: hospitalUser?.profileImage,
        icon: Building2,
        dashboardPath: "/hospital/dashboard",
      }
    : adminToken
    ? {
        name: adminUser?.name || adminUser?.email || "Admin",
        subtitle: "Admin Console",
        image: "",
        icon: ShieldCheck,
        dashboardPath: "/admin/dashboard",
      }
    : null;

  const searchDoctors = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/doctors?specialization=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/doctors");
    }

    setMobileMenuOpen(false);
  };

  const loadNotifications = async () => {
    try {
      if (!isLoggedIn) return;

      const res = await api.get("/notifications/my");
      setNotifications(res.data || []);
    } catch (error) {
      console.error("Notification error:", error);
    }
  };

  const refreshUsers = () => {
    setPatientUser(JSON.parse(localStorage.getItem("patientUser") || "null"));
    setDoctorUser(JSON.parse(localStorage.getItem("doctorUser") || "null"));
    setHospitalUser(JSON.parse(localStorage.getItem("hospitalUser") || "null"));
    setAdminUser(JSON.parse(localStorage.getItem("adminUser") || "null"));
  };

  useEffect(() => {
    refreshUsers();

    window.addEventListener("patientProfileUpdated", refreshUsers);
    window.addEventListener("doctorProfileUpdated", refreshUsers);
    window.addEventListener("hospitalProfileUpdated", refreshUsers);
    window.addEventListener("storage", refreshUsers);

    return () => {
      window.removeEventListener("patientProfileUpdated", refreshUsers);
      window.removeEventListener("doctorProfileUpdated", refreshUsers);
      window.removeEventListener("hospitalProfileUpdated", refreshUsers);
      window.removeEventListener("storage", refreshUsers);
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
      socket.emit("joinUserRoom", { userId, role });
    });

    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => socket.disconnect();
  }, [
    isLoggedIn,
    patientToken,
    doctorToken,
    hospitalToken,
    adminToken,
    patientUser,
    doctorUser,
    hospitalUser,
    adminUser,
  ]);

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(loadNotifications, 30000);

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

  const handleLogout = () => {
    localStorage.removeItem("patientToken");
    localStorage.removeItem("patientUser");
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorUser");
    localStorage.removeItem("hospitalToken");
    localStorage.removeItem("hospitalUser");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setShowProfileMenu(false);
    setMobileMenuOpen(false);
    navigate("/login");
    window.location.reload();
  };

  const navClass = ({ isActive }) =>
    isActive
      ? "text-cyan-700 font-black"
      : "text-slate-700 hover:text-cyan-700 font-bold transition";

  const mobileNavClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 p-4 rounded-2xl bg-cyan-600 text-white font-black"
      : "flex items-center gap-3 p-4 rounded-2xl text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 font-bold transition";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-sm">
      <div className="max-w-[1450px] mx-auto px-5 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-cyan-600 flex items-center justify-center shadow-sm">
              <HeartPulse className="text-white" size={24} />
            </div>

            <h1 className="text-2xl font-black text-slate-950">
              MediCare
            </h1>
          </Link>

          <form
            onSubmit={searchDoctors}
            className="hidden lg:flex flex-1 max-w-md items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5"
          >
            <Search size={19} className="text-slate-400" />

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctors, specialties..."
              className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
            />
          </form>

          <nav className="hidden xl:flex items-center gap-7">
            <NavLink to="/doctors" className={navClass}>
              Find Doctors
            </NavLink>

            <NavLink to="/video-consult" className={navClass}>
              Video Consult
            </NavLink>

            <NavLink to="/hospitals" className={navClass}>
              Hospitals
            </NavLink>

            <NavLink to="/patient/lab-tests" className={navClass}>
              Lab Tests
            </NavLink>

            <NavLink to="/ai-health-assistant" className={navClass}>
  MediCare AI
</NavLink>
          </nav>

          <div className="hidden xl:flex items-center gap-3 shrink-0">
            {isLoggedIn && (
              <NotificationBell
                unreadCount={unreadCount}
                showNotifications={showNotifications}
                setShowNotifications={setShowNotifications}
                notifications={notifications}
                markAllAsRead={markAllAsRead}
              />
            )}

            {isLoggedIn && currentUser ? (
              <ProfileDropdown
                currentUser={currentUser}
                patientToken={patientToken}
                doctorToken={doctorToken}
                hospitalToken={hospitalToken}
                showProfileMenu={showProfileMenu}
                setShowProfileMenu={setShowProfileMenu}
                handleLogout={handleLogout}
              />
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center bg-cyan-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-cyan-700 transition"
                >
                  Login / Sign Up
                </Link>

                <ProviderMenu />
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="xl:hidden relative p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 transition shadow-sm"
          >
            <Menu size={25} />

            {unreadCount > 0 && isLoggedIn && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-black rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <MobileMenu
          closeMobile={closeMobile}
          currentUser={currentUser}
          searchDoctors={searchDoctors}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          mobileNavClass={mobileNavClass}
          patientToken={patientToken}
          doctorToken={doctorToken}
          hospitalToken={hospitalToken}
          adminToken={adminToken}
          isLoggedIn={isLoggedIn}
          unreadCount={unreadCount}
          handleLogout={handleLogout}
        />
      )}
    </header>
  );
}

function ProfileDropdown({
  currentUser,
  patientToken,
  doctorToken,
  hospitalToken,
  showProfileMenu,
  setShowProfileMenu,
  handleLogout,
}) {
  return (
    <div className="relative">
      <button
        onClick={() => setShowProfileMenu(!showProfileMenu)}
        className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition"
      >
        <ProfileIcon
          image={currentUser.image}
          fallback={currentUser.icon}
          color="text-cyan-600"
        />

        <div className="leading-tight text-left">
          <p className="text-sm font-black max-w-[140px] truncate text-slate-800">
            {currentUser.name}
          </p>
          <p className="text-xs text-slate-500">{currentUser.subtitle}</p>
        </div>

        <ChevronDown size={17} className="text-slate-400" />
      </button>

      {showProfileMenu && (
        <div className="absolute right-0 mt-3 w-72 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 overflow-hidden z-50">
          <ProfileMenuLink
            to={currentUser.dashboardPath}
            icon={LayoutDashboard}
            title="Dashboard"
            onClick={() => setShowProfileMenu(false)}
          />

          {patientToken && (
            <>
              <ProfileMenuLink
                to="/appointments"
                icon={CalendarDays}
                title="Appointments"
                onClick={() => setShowProfileMenu(false)}
              />

              <ProfileMenuLink
                to="/patient/medical-records"
                icon={FileText}
                title="Medical Records"
                onClick={() => setShowProfileMenu(false)}
              />

              <ProfileMenuLink
                to="/patient/prescriptions"
                icon={ClipboardList}
                title="Prescriptions"
                onClick={() => setShowProfileMenu(false)}
              />
            </>
          )}

          {doctorToken && (
            <>
              <ProfileMenuLink
                to="/doctor/profile"
                icon={UserCircle}
                title="Doctor Profile"
                onClick={() => setShowProfileMenu(false)}
              />

              <ProfileMenuLink
                to="/doctor/prescriptions"
                icon={FileText}
                title="Prescriptions"
                onClick={() => setShowProfileMenu(false)}
              />
            </>
          )}

          {hospitalToken && (
            <>
              <ProfileMenuLink
                to="/hospital/profile"
                icon={Building2}
                title="Hospital Profile"
                onClick={() => setShowProfileMenu(false)}
              />

              <ProfileMenuLink
                to="/hospital/doctors"
                icon={Stethoscope}
                title="Manage Doctors"
                onClick={() => setShowProfileMenu(false)}
              />
            </>
          )}

          <ProfileMenuLink
            to="/notifications"
            icon={Bell}
            title="Notifications"
            onClick={() => setShowProfileMenu(false)}
          />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 text-red-600 hover:bg-red-50 transition font-black"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

function ProviderMenu() {
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-950 text-white font-black hover:bg-cyan-700 transition">
        For Providers
        <ChevronDown size={17} />
      </button>

      <div className="absolute right-0 mt-3 w-72 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        <PortalLink
          to="/doctor/login"
          icon={Stethoscope}
          title="Doctor Login"
          desc="Access doctor workspace"
        />

        <PortalLink
          to="/hospital/login"
          icon={Building2}
          title="Hospital Portal"
          desc="Manage hospital dashboard"
        />

        <PortalLink
          to="/hospital/register"
          icon={UserPlus}
          title="Hospital Signup"
          desc="Register new hospital"
        />

        <PortalLink
          to="/admin/login"
          icon={ShieldCheck}
          title="Admin Login"
          desc="Platform administration"
        />
      </div>
    </div>
  );
}

function MobileMenu({
  closeMobile,
  currentUser,
  searchDoctors,
  searchQuery,
  setSearchQuery,
  mobileNavClass,
  patientToken,
  doctorToken,
  hospitalToken,
  adminToken,
  isLoggedIn,
  unreadCount,
  handleLogout,
}) {
  return (
    <>
      <div
        onClick={closeMobile}
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40 xl:hidden"
      />

      <aside className="fixed top-0 right-0 h-full w-[88%] max-w-[390px] bg-white z-50 shadow-2xl xl:hidden overflow-y-auto">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-start justify-between gap-4">
            <Link to="/" onClick={closeMobile} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600 flex items-center justify-center">
                <HeartPulse className="text-white" size={25} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  MediCare
                </h2>
                <p className="text-sm text-slate-500">
                  Healthcare made simple
                </p>
              </div>
            </Link>

            <button
              onClick={closeMobile}
              className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center"
            >
              <X size={22} />
            </button>
          </div>

          {currentUser && (
            <Link
              to={currentUser.dashboardPath}
              onClick={closeMobile}
              className="mt-5 flex items-center gap-3 bg-cyan-50 border border-cyan-100 rounded-3xl p-4"
            >
              <ProfileIcon
                image={currentUser.image}
                fallback={currentUser.icon}
                color="text-cyan-600"
              />

              <div className="min-w-0">
                <p className="font-black truncate text-slate-950">
                  {currentUser.name}
                </p>
                <p className="text-sm text-cyan-700">
                  {currentUser.subtitle}
                </p>
              </div>
            </Link>
          )}
        </div>

        <div className="p-5">
          <form
            onSubmit={searchDoctors}
            className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 mb-4"
          >
            <Search size={19} className="text-slate-400" />

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctors..."
              className="w-full bg-transparent outline-none text-sm"
            />
          </form>

          <nav className="space-y-2">
            <NavLink to="/" onClick={closeMobile} className={mobileNavClass}>
              <Home size={19} />
              Home
            </NavLink>

            <NavLink to="/doctors" onClick={closeMobile} className={mobileNavClass}>
              <Stethoscope size={19} />
              Find Doctors
            </NavLink>

            <NavLink
              to="/video-consult"
              onClick={closeMobile}
              className={mobileNavClass}
            >
              <Video size={19} />
              Video Consult
            </NavLink>

            <NavLink to="/hospitals" onClick={closeMobile} className={mobileNavClass}>
              <Hospital size={19} />
              Hospitals
            </NavLink>

            <NavLink
              to="/patient/lab-tests"
              onClick={closeMobile}
              className={mobileNavClass}
            >
              <FlaskConical size={19} />
              Lab Tests
            </NavLink>

           <NavLink
  to="/ai-health-assistant"
  onClick={closeMobile}
  className={mobileNavClass}
>
  <Brain size={19} />
  MediCare AI
</NavLink>

            {patientToken && (
              <>
                <NavLink
                  to="/patient/dashboard"
                  onClick={closeMobile}
                  className={mobileNavClass}
                >
                  <LayoutDashboard size={19} />
                  Patient Dashboard
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
                  to="/patient/medical-records"
                  onClick={closeMobile}
                  className={mobileNavClass}
                >
                  <FileText size={19} />
                  Medical Records
                </NavLink>

                <NavLink
                  to="/patient/prescriptions"
                  onClick={closeMobile}
                  className={mobileNavClass}
                >
                  <ClipboardList size={19} />
                  Prescriptions
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
                  <LayoutDashboard size={19} />
                  Doctor Dashboard
                </NavLink>

                <NavLink
                  to="/doctor/profile"
                  onClick={closeMobile}
                  className={mobileNavClass}
                >
                  <UserCircle size={19} />
                  Doctor Profile
                </NavLink>

                <NavLink
                  to="/doctor/prescriptions"
                  onClick={closeMobile}
                  className={mobileNavClass}
                >
                  <FileText size={19} />
                  Doctor Prescriptions
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
                  <LayoutDashboard size={19} />
                  Hospital Dashboard
                </NavLink>

                <NavLink
                  to="/hospital/doctors"
                  onClick={closeMobile}
                  className={mobileNavClass}
                >
                  <Stethoscope size={19} />
                  Manage Doctors
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
                  className="flex items-center justify-center w-full bg-cyan-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-cyan-700 transition"
                >
                  Login / Sign Up
                </Link>

                <Link
                  to="/doctor/login"
                  onClick={closeMobile}
                  className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border border-slate-200 font-black text-slate-700"
                >
                  <Stethoscope size={18} />
                  Doctor Login
                </Link>

                <Link
                  to="/hospital/login"
                  onClick={closeMobile}
                  className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border border-slate-200 font-black text-slate-700"
                >
                  <Building2 size={18} />
                  Hospital Portal
                </Link>

                <Link
                  to="/hospital/register"
                  onClick={closeMobile}
                  className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border border-slate-200 font-black text-slate-700"
                >
                  <UserPlus size={18} />
                  Hospital Signup
                </Link>

                <Link
                  to="/admin/login"
                  onClick={closeMobile}
                  className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border border-slate-200 font-black text-slate-700"
                >
                  <ShieldCheck size={18} />
                  Admin Login
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
        </div>
      </aside>
    </>
  );
}

function NotificationBell({
  unreadCount,
  showNotifications,
  setShowNotifications,
  notifications,
  markAllAsRead,
}) {
  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition shadow-sm"
      >
        <Bell size={21} className="text-slate-700" />

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
              <h3 className="font-black text-slate-900">Notifications</h3>
              <p className="text-xs text-slate-500">{unreadCount} unread</p>
            </div>

            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-bold text-cyan-600 hover:text-cyan-700"
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
                    item.isRead ? "bg-white" : "bg-cyan-50/60"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-600 flex items-center justify-center shrink-0">
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
              className="block text-center text-cyan-600 font-black text-sm"
            >
              View All Notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function PortalLink({ to, icon: Icon, title, desc }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-4 hover:bg-cyan-50 transition"
    >
      <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center">
        <Icon className="text-cyan-600" size={22} />
      </div>

      <div>
        <p className="font-black text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </Link>
  );
}

function ProfileMenuLink({ to, icon: Icon, title, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 p-4 hover:bg-cyan-50 transition font-bold text-slate-700"
    >
      <div className="w-10 h-10 rounded-2xl bg-cyan-50 flex items-center justify-center">
        <Icon className="text-cyan-600" size={20} />
      </div>

      {title}
    </Link>
  );
}

function ProfileIcon({ image, fallback: Fallback, color }) {
  return (
    <div className="w-10 h-10 rounded-2xl bg-cyan-50 flex items-center justify-center overflow-hidden shrink-0">
      {image ? (
        <img src={image} alt="Profile" className="w-full h-full object-cover" />
      ) : (
        <Fallback size={25} className={color} />
      )}
    </div>
  );
}