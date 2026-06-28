import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  Clock,
  FileText,
  HeartPulse,
  Stethoscope,
  UserRound,
  FlaskConical,
  Video,
  Brain,
  ChevronDown,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import usePullToRefresh from "../hooks/usePullToRefresh";

export default function Dashboard() {
  const patient =
    JSON.parse(localStorage.getItem("patientUser") || "null") ||
    JSON.parse(localStorage.getItem("user") || "null");

  const [appointments, setAppointments] = useState([]);
  const [healthInsights, setHealthInsights] = useState(null);
  const [profile, setProfile] = useState(null);
  const [familyProfiles, setFamilyProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(
    JSON.parse(localStorage.getItem("selectedProfile") || "null")
  );
  const [loading, setLoading] = useState(true);
  const [showSwitcher, setShowSwitcher] = useState(false);

  const fetchDashboard = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      const res = await api.get("/appointment/my");
      setAppointments(res.data || []);
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Unable to load dashboard");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthInsights = async () => {
    try {
      if (!patient?.id) return;

      const res = await api.get(`/patient/${patient.id}/health-insights`);
      setHealthInsights(res.data);
    } catch {
      console.log("Health insights not available");
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/patient/profile");
      setProfile(res.data);
    } catch {
      console.log("Profile not available");
    }
  };

  const fetchFamilyProfiles = async () => {
    try {
      if (!patient?.id) return;

      const res = await api.get(`/family-member/patient/${patient.id}`);

      const selfProfile = {
        id: patient.id,
        fullName: patient.fullName || "Me",
        relation: "SELF",
        gender: patient.gender,
        age: patient.age,
        mobile: patient.mobile,
        profileImage: patient.profileImage,
        isSelf: true,
      };

      const allProfiles = [selfProfile, ...(res.data || [])];
      setFamilyProfiles(allProfiles);

      const saved = JSON.parse(localStorage.getItem("selectedProfile") || "null");

      if (!saved?.id) {
        localStorage.setItem("selectedProfile", JSON.stringify(selfProfile));
        setSelectedProfile(selfProfile);
      }
    } catch (error) {
      console.error("Family profile error:", error);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchHealthInsights();
    fetchProfile();
    fetchFamilyProfiles();
  }, []);

  const { pullDistance, refreshing, visible } = usePullToRefresh(async () => {
    await fetchDashboard(false);
    await fetchHealthInsights();
    await fetchProfile();
    await fetchFamilyProfiles();
    
  });

  const profileAppointments = useMemo(() => {
    return appointments.filter((item) => {
      if (!selectedProfile) return true;

      if (selectedProfile.isSelf) {
        return !item.familyMember;
      }

      return item.familyMember?.id === selectedProfile.id;
    });
  }, [appointments, selectedProfile]);

  const nextAppointment = useMemo(() => {
    return profileAppointments
      .filter((item) => item.status === "BOOKED")
      .sort((a, b) => {
        const first = new Date(`${a.slot?.date || ""} ${a.slot?.startTime || ""}`);
        const second = new Date(`${b.slot?.date || ""} ${b.slot?.startTime || ""}`);
        return first - second;
      })[0];
  }, [profileAppointments]);

  const stats = useMemo(
    () => ({
      total: profileAppointments.length,
      booked: profileAppointments.filter((a) => a.status === "BOOKED").length,
      completed: profileAppointments.filter((a) => a.status === "COMPLETED").length,
      cancelled: profileAppointments.filter((a) => a.status === "CANCELLED").length,
    }),
    [profileAppointments]
  );

  const patientName =
    selectedProfile?.fullName ||
    profile?.fullName ||
    patient?.fullName ||
    "Patient";

  const switchProfile = (item) => {
    localStorage.setItem("selectedProfile", JSON.stringify(item));
    setSelectedProfile(item);
    setShowSwitcher(false);
    toast.success(`Switched to ${item.fullName}`);
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-28">
      {visible && (
        <div
          className="fixed top-0 left-0 right-0 z-[100] flex justify-center transition-all duration-300"
          style={{ transform: `translateY(${pullDistance}px)` }}
        >
          <div className="mt-3 bg-white border border-slate-200 shadow-lg rounded-full px-4 py-2 flex items-center gap-2">
            <div
              className={`w-4 h-4 border-2 border-cyan-600 border-t-transparent rounded-full ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            <span className="text-xs font-black text-cyan-700">
              {refreshing
                ? "Refreshing..."
                : pullDistance > 70
                ? "Release to refresh"
                : "Pull to refresh"}
            </span>
          </div>
        </div>
      )}

      <PageHeader
        title="Dashboard"
        subtitle="Your healthcare overview"
        showBack={false}
      />

      <div className="max-w-md mx-auto px-4">
        <section>
          <button
            type="button"
            onClick={() => setShowSwitcher(true)}
            className="w-full flex items-center justify-between bg-white rounded-3xl border border-slate-100 shadow-sm p-4 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center shrink-0">
                <UserRound className="text-cyan-600" size={23} />
              </div>

              <div className="text-left min-w-0">
                <p className="text-xs text-cyan-700 font-black">
                  CURRENT PROFILE
                </p>

                <h2 className="text-lg font-black text-slate-950 truncate">
                  {patientName}
                </h2>

                <p className="text-xs text-slate-500">
                  {selectedProfile?.relation || "SELF"}
                  {selectedProfile?.age ? ` • ${selectedProfile.age}Y` : ""}
                  {selectedProfile?.gender ? ` • ${selectedProfile.gender}` : ""}
                </p>
              </div>
            </div>

            <ChevronDown className="text-slate-400 shrink-0" size={20} />
          </button>

          <h1 className="text-2xl font-black text-slate-950 mt-3">
            Welcome {patientName.split(" ")[0]} 👋
          </h1>

          <p className="text-sm text-slate-500 font-semibold">
            Your healthcare at a glance.
          </p>
        </section>

        <section className="grid grid-cols-4 gap-2 mt-3">
          <MiniStat title="Total" value={stats.total} />
          <MiniStat title="Booked" value={stats.booked} />
          <MiniStat title="Completed" value={stats.completed} />
          <MiniStat title="Cancelled" value={stats.cancelled} />
        </section>

        <section className="mt-3">
          <NextAppointmentCard appointment={nextAppointment} />
        </section>

        <section className="bg-slate-950 rounded-3xl p-5 text-white shadow-sm mt-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-cyan-200 font-black text-sm">
                🤖 Health Score
              </p>

              <h2 className="text-4xl font-black mt-2">
                {healthInsights?.healthScore || 86}
                <span className="text-lg text-cyan-100">/100</span>
              </h2>

              <p className="text-sm text-cyan-100 mt-1 font-bold">
                {(healthInsights?.healthScore || 86) >= 80
                  ? "Good Health"
                  : (healthInsights?.healthScore || 86) >= 60
                  ? "Needs Attention"
                  : "High Risk"}
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
              <Brain size={28} className="text-cyan-300" />
            </div>
          </div>

          <div className="h-2 bg-white/10 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-cyan-300 rounded-full"
              style={{
                width: `${healthInsights?.healthScore || 86}%`,
              }}
            />
          </div>

          <Link
            to="/patient/ai-health-insights"
            className="inline-flex items-center gap-1 mt-4 text-cyan-200 font-black text-sm"
          >
            View Insights →
          </Link>
        </section>


        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <h2 className="text-lg font-black text-slate-950 mb-3">
            Quick Actions
          </h2>

          <div className="grid grid-cols-5 gap-2">
            <QuickAction to="/doctors" icon={Stethoscope} title="Doctors" />
            <QuickAction to="/video-consult" icon={Video} title="Video-consult" />
            <QuickAction to="/patient/lab-tests" icon={FlaskConical} title="Lab-tests" />
            <QuickAction to="/patient/medical-records" icon={FileText} title="Medical Records" />
            <QuickAction
  to="/patient/emergency-profile"
  icon={HeartPulse}
  title="Emergency"
/>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-slate-950">
              Recent Appointments
            </h2>

            <Link
              to="/patient/appointments"
              className="text-cyan-600 font-black text-xs"
            >
              View All
            </Link>
          </div>

          {profileAppointments.length === 0 ? (
            <div className="text-center py-8">
              <CalendarCheck className="text-cyan-600 mx-auto" size={34} />

              <p className="text-sm text-slate-500 mt-3">
                No appointments for this profile.
              </p>

              <Link
                to="/doctors"
                className="inline-flex items-center justify-center bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black mt-4"
              >
                Book Appointment
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {profileAppointments.slice(0, 2).map((item) => (
                <AppointmentCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </div>

      {showSwitcher && (
        <ProfileSwitcher
          profiles={familyProfiles}
          selectedProfile={selectedProfile}
          onClose={() => setShowSwitcher(false)}
          onSelect={switchProfile}
        />
      )}
    </main>
  );
}

function ProfileSwitcher({ profiles, selectedProfile, onClose, onSelect }) {
  return (
    <div className="fixed inset-0 z-[200] bg-black/40 flex items-end">
      <div className="w-full max-w-md mx-auto bg-white rounded-t-[2rem] p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-black text-slate-950">
              Switch Profile
            </h2>
            <p className="text-xs text-slate-500">
              Choose who is using TryDoc
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2">
          {profiles.map((item) => {
            const active = selectedProfile?.id === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item)}
                className={`w-full rounded-3xl border p-4 flex items-center justify-between ${
                  active
                    ? "bg-cyan-50 border-cyan-200"
                    : "bg-white border-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center">
                    <UserRound
                      size={22}
                      className={active ? "text-cyan-600" : "text-slate-400"}
                    />
                  </div>

                  <div className="text-left">
                    <p className="font-black text-slate-950">
                      {item.fullName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.relation || "SELF"}
                    </p>
                  </div>
                </div>

                {active && (
                  <span className="text-xs font-black text-cyan-700">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ title, value }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 text-center">
      <p className="text-base font-black text-slate-950">{value}</p>
      <p className="text-[10px] text-slate-500 font-bold">{title}</p>
    </div>
  );
}

function QuickAction({ to, icon: Icon, title }) {
  return (
    <Link
      to={to}
      className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center active:scale-95 transition"
    >
      <Icon className="text-cyan-600 mx-auto" size={21} />
      <p className="text-[11px] font-black text-slate-800 mt-2 leading-tight">
        {title}
      </p>
    </Link>
  );
}

function NextAppointmentCard({ appointment }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center">
          <Clock className="text-emerald-600" size={22} />
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-950">
            Next Appointment
          </h2>
          <p className="text-xs text-slate-500">Upcoming confirmed visit</p>
        </div>
      </div>

      {appointment ? (
        <div>
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-3">
            <h3 className="font-black text-slate-950 truncate">
              {appointment.doctor?.doctorName || "Doctor"}
            </h3>

            <p className="text-sm text-cyan-700 font-black truncate">
              {appointment.doctor?.specialization || "Specialist"}
            </p>

            <p className="text-xs text-slate-500 mt-1">
              {appointment.slot?.date} | {formatTime(appointment.slot?.startTime)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <Link
              to={`/chat/${appointment.id}`}
              className="text-center bg-slate-950 text-white py-3 rounded-2xl font-black text-sm"
            >
              Chat
            </Link>

            <Link
              to={`/video-call/${appointment.id}`}
              className="text-center bg-cyan-600 text-white py-3 rounded-2xl font-black text-sm"
            >
              Video
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-3">
          <p className="text-sm text-slate-500">No upcoming appointment.</p>

          <Link
            to="/doctors"
            className="inline-flex items-center justify-center bg-cyan-600 text-white px-4 py-2.5 rounded-2xl font-black text-sm mt-3"
          >
            Book Now
          </Link>
        </div>
      )}
    </div>
  );
}

function AppointmentCard({ item }) {
  const statusStyle =
    item.status === "BOOKED"
      ? "bg-emerald-50 text-emerald-700"
      : item.status === "CANCELLED"
      ? "bg-red-50 text-red-700"
      : "bg-cyan-50 text-cyan-700";

  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-black text-slate-950 truncate">
            {item.doctor?.doctorName || "Doctor"}
          </h3>

          <p className="text-sm text-cyan-700 font-black truncate">
            {item.doctor?.specialization || "Specialist"}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            {item.slot?.date} | {item.slot?.startTime}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-[11px] font-black shrink-0 ${statusStyle}`}
        >
          {item.status}
        </span>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-28">
      <div className="max-w-md mx-auto px-4 pt-4 animate-pulse">
        <div className="h-20 bg-white rounded-3xl" />
        <div className="grid grid-cols-5 gap-2 mt-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-white rounded-2xl" />
          ))}
        </div>
        <div className="h-40 bg-white rounded-3xl mt-3" />
        <div className="h-40 bg-slate-900 rounded-3xl mt-3" />
        <div className="h-32 bg-white rounded-3xl mt-3" />
      </div>
    </main>
  );
}

