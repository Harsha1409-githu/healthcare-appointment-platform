import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Stethoscope,
  CalendarCheck,
  Clock,
  UsersRound,
  IndianRupee,
  Activity,
  LogOut,
  RefreshCw,
  Loader2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import api from "../api/axios";
import usePullToRefresh from "../hooks/usePullToRefresh";
import PageHeader from "@/components/PageHeader";

export default function HospitalDashboard() {

       const {
  pullDistance,
  refreshing,
  visible,
} = usePullToRefresh(async () => {
  await fetchDashboardData();
  await fetchNotificationCount();

  toast.success("Dashboard refreshed");
});

  const navigate = useNavigate();

  const hospital = JSON.parse(
    localStorage.getItem("hospitalUser") ||
      localStorage.getItem("user") ||
      "null"
  );

  const [stats, setStats] = useState({
    doctors: 0,
    activeDoctors: 0,
    appointments: 0,
    completed: 0,
    pending: 0,
    revenue: 0,
  });

  const [recentDoctors, setRecentDoctors] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hospital) {
      navigate("/hospital/login");
      return;
    }

    loadDashboard();
  }, []);

  const logout = () => {
    localStorage.removeItem("hospitalToken");
    localStorage.removeItem("hospitalUser");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/hospital/login");
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [doctorRes, appointmentRes] = await Promise.all([
        api.get("/doctor"),
        api.get("/appointment"),
      ]);

      const allDoctors = doctorRes.data || [];
      const allAppointments = appointmentRes.data || [];

      const hospitalDoctors = hospital?.id
        ? allDoctors.filter((doctor) => doctor.hospital?.id === hospital.id)
        : allDoctors;

      const doctorIds = hospitalDoctors.map((doctor) => doctor.id);

      const hospitalAppointments = allAppointments.filter((appointment) =>
        doctorIds.includes(appointment.doctor?.id)
      );

      const today = new Date().toISOString().split("T")[0];

      const todays = hospitalAppointments.filter(
        (appointment) => appointment.slot?.date === today
      );

      const completedAppointments = hospitalAppointments.filter(
        (appointment) => appointment.status === "COMPLETED"
      );

      const pendingAppointments = hospitalAppointments.filter(
        (appointment) => appointment.status === "BOOKED"
      );

      const revenue = completedAppointments.reduce(
        (sum, appointment) =>
          sum + Number(appointment.doctor?.consultationFee || 0),
        0
      );

 

      setStats({
        doctors: hospitalDoctors.length,
        activeDoctors: hospitalDoctors.filter((doctor) => doctor.isActive)
          .length,
        appointments: hospitalAppointments.length,
        completed: completedAppointments.length,
        pending: pendingAppointments.length,
        revenue,
      });

      setRecentDoctors(hospitalDoctors.slice(0, 4));
      setTodayAppointments(todays.slice(0, 4));
    } catch (error) {
      console.error("Hospital dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f8fb] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
          <Loader2 className="mx-auto text-cyan-600 animate-spin" size={36} />

          <p className="text-slate-500 font-bold mt-3">
            Loading hospital dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8fb] px-4 pt-4 pb-24">
      <PageHeader
  title="Hospital Dashboard"
  subtitle="Manage doctors and appointments"
  showBack={false}
/>
      <div className="max-w-md mx-auto">
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-3xl bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0 overflow-hidden">
              {hospital?.profileImage ? (
                <img
                  src={hospital.profileImage}
                  alt={hospital.hospitalName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="text-cyan-600" size={32} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-cyan-700 font-black">
                HOSPITAL DASHBOARD
              </p>

              <h1 className="text-xl font-black text-slate-950 truncate mt-1">
                {hospital?.hospitalName || "Hospital"}
              </h1>

              <p className="text-sm text-slate-500 truncate">
                {hospital?.city || "Healthcare Partner"}
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center active:scale-95 transition"
            >
              <LogOut className="text-red-600" size={19} />
            </button>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 mt-3">
          <StatCard icon={Stethoscope} value={stats.doctors} label="Doctors" />
          <StatCard
            icon={CalendarCheck}
            value={stats.appointments}
            label="Appointments"
          />
          <StatCard icon={CheckCircle2} value={stats.completed} label="Done" />
          <StatCard icon={IndianRupee} value={`₹${stats.revenue}`} label="Revenue" />
        </section>

        <section className="bg-cyan-600 rounded-3xl p-4 text-white shadow-sm mt-3">
          <div className="flex gap-3">
            <Activity className="shrink-0 mt-0.5" size={23} />

            <div>
              <h2 className="font-black">Today&apos;s Overview</h2>

              <p className="text-sm text-cyan-100 mt-1 leading-relaxed">
                {todayAppointments.length} appointment
                {todayAppointments.length === 1 ? "" : "s"} today and{" "}
                {stats.pending} booking{stats.pending === 1 ? "" : "s"} pending.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <h2 className="text-lg font-black text-slate-950 mb-3">
            Quick Actions
          </h2>

          <div className="grid grid-cols-4 gap-2">
            <QuickAction
              to="/hospital/doctors"
              icon={UsersRound}
              title="Doctors"
            />

            <QuickAction
              to="/hospital/appointments"
              icon={CalendarCheck}
              title="Bookings"
            />

            <QuickAction
              to="/hospital/availability"
              icon={Clock}
              title="Slots"
            />

            <QuickAction
              to="/hospital/profile"
              icon={Building2}
              title="Profile"
            />
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-slate-950">
              Today&apos;s Appointments
            </h2>

            <Link
              to="/hospital/appointments"
              className="text-xs text-cyan-600 font-black"
            >
              View All
            </Link>
          </div>

          {todayAppointments.length === 0 ? (
            <EmptyBox text="No appointments today." />
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((item) => (
                <AppointmentItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-slate-950">
              Recent Doctors
            </h2>

            <Link
              to="/hospital/doctors"
              className="text-xs text-cyan-600 font-black"
            >
              View All
            </Link>
          </div>

          {recentDoctors.length === 0 ? (
            <EmptyBox text="No doctors added yet." />
          ) : (
            <div className="space-y-3">
              {recentDoctors.map((doctor) => (
                <DoctorItem key={doctor.id} doctor={doctor} />
              ))}
            </div>
          )}
        </section>

        <button
          type="button"
          onClick={loadDashboard}
          className="mt-3 w-full bg-white border border-slate-200 text-slate-700 py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 active:scale-95 transition"
        >
          <RefreshCw size={17} />
          Refresh Dashboard
        </button>
      </div>
    </main>
  );
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
      <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center mb-3">
        <Icon className="text-cyan-600" size={22} />
      </div>

      <p className="text-2xl font-black text-slate-950">
        {value}
      </p>

      <p className="text-xs text-slate-500 font-black">
        {label}
      </p>
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

      <p className="text-[11px] font-black text-slate-800 mt-2">
        {title}
      </p>
    </Link>
  );
}

function AppointmentItem({ item }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-black text-slate-950 text-sm truncate">
            {item.patient?.fullName || item.patientName || "Patient"}
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Dr. {item.doctor?.doctorName || "Doctor"}
          </p>

          <p className="text-xs text-cyan-700 font-black mt-1">
            {item.slot?.startTime || "--"} - {item.slot?.endTime || "--"}
          </p>
        </div>

        <StatusBadge status={item.status} />
      </div>
    </div>
  );
}

function DoctorItem({ doctor }) {
  return (
    <Link
      to={`/doctor/${doctor.id}`}
      className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-3 active:scale-[0.98] transition"
    >
      <img
        src={
          doctor.profileImage ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            doctor.doctorName || "Doctor"
          )}&background=0891b2&color=fff&bold=true`
        }
        alt={doctor.doctorName}
        className="w-11 h-11 rounded-2xl object-cover"
      />

      <div className="min-w-0 flex-1">
        <h3 className="font-black text-slate-950 text-sm truncate">
          {doctor.doctorName || "Doctor"}
        </h3>

        <p className="text-xs text-slate-500 truncate">
          {doctor.specialization || "Specialist"}
        </p>
      </div>

      <ArrowRight className="text-cyan-600" size={18} />
    </Link>
  );
}

function StatusBadge({ status }) {
  const style =
    status === "COMPLETED"
      ? "bg-emerald-50 text-emerald-700"
      : status === "CANCELLED"
      ? "bg-red-50 text-red-700"
      : "bg-cyan-50 text-cyan-700";

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${style}`}
    >
      {status || "BOOKED"}
    </span>
  );
}

function EmptyBox({ text }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center">
      <p className="text-sm text-slate-500 font-semibold">
        {text}
      </p>
    </div>
  );
}