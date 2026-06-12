import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Stethoscope,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Star,
  Activity,
  ArrowRight,
  Building2,
  Clock,
  UsersRound,
  TrendingUp,
  LogOut,
  IndianRupee,
  Trophy,
  Loader2,
  RefreshCw,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import api from "../api/axios";

export default function HospitalDashboard() {
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
    cancelled: 0,
    pending: 0,
    reviews: 0,
    avgRating: 0,
    revenue: 0,
  });

  const [topDoctors, setTopDoctors] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const logout = () => {
    localStorage.removeItem("hospitalToken");
    localStorage.removeItem("hospitalUser");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/hospital/login");
    window.location.reload();
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

      const completedAppointments = hospitalAppointments.filter(
        (appointment) => appointment.status === "COMPLETED"
      );

      const completed = completedAppointments.length;

      const cancelled = hospitalAppointments.filter(
        (appointment) => appointment.status === "CANCELLED"
      ).length;

      const pending = hospitalAppointments.filter(
        (appointment) => appointment.status === "BOOKED"
      ).length;

      const revenue = completedAppointments.reduce(
        (sum, appointment) =>
          sum + Number(appointment.doctor?.consultationFee || 0),
        0
      );

      let totalReviews = 0;
      let totalRating = 0;

      for (const doctor of hospitalDoctors) {
        try {
          const summary = await api.get(`/review/doctor/${doctor.id}/summary`);

          const reviewCount = Number(summary.data.totalReviews || 0);
          const average = Number(summary.data.averageRating || 0);

          totalReviews += reviewCount;
          totalRating += average * reviewCount;
        } catch (error) {
          console.error("Review summary error:", error);
        }
      }

      const avgRating =
        totalReviews === 0 ? 0 : Number((totalRating / totalReviews).toFixed(1));

      const rankedDoctors = hospitalDoctors
        .map((doctor) => {
          const doctorAppointments = hospitalAppointments.filter(
            (appointment) => appointment.doctor?.id === doctor.id
          );

          return {
            id: doctor.id,
            name: doctor.doctorName,
            specialization: doctor.specialization,
            image: doctor.profileImage,
            appointments: doctorAppointments.length,
            revenue: doctorAppointments
              .filter((appointment) => appointment.status === "COMPLETED")
              .reduce(
                (sum, appointment) =>
                  sum + Number(appointment.doctor?.consultationFee || 0),
                0
              ),
          };
        })
        .sort((a, b) => b.appointments - a.appointments)
        .slice(0, 5);

      const monthMap = {};

      hospitalAppointments.forEach((appointment) => {
        const rawDate =
          appointment.createdAt || appointment.slot?.date || appointment.date;

        if (!rawDate) return;

        const month = new Date(rawDate).toLocaleString("default", {
          month: "short",
        });

        monthMap[month] = (monthMap[month] || 0) + 1;
      });

      const monthOrder = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const monthly = monthOrder
        .map((month) => ({
          month,
          count: monthMap[month] || 0,
        }))
        .filter((item) => item.count > 0);

      setTopDoctors(rankedDoctors);
      setMonthlyStats(monthly);

      setStats({
        doctors: hospitalDoctors.length,
        activeDoctors: hospitalDoctors.filter((doctor) => doctor.isActive)
          .length,
        appointments: hospitalAppointments.length,
        completed,
        cancelled,
        pending,
        reviews: totalReviews,
        avgRating,
        revenue,
      });
    } catch (error) {
      console.error("Hospital dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const completedPercent = stats.appointments
    ? Math.round((stats.completed / stats.appointments) * 100)
    : 0;

  const cancelledPercent = stats.appointments
    ? Math.round((stats.cancelled / stats.appointments) * 100)
    : 0;

  const pendingPercent = stats.appointments
    ? Math.round((stats.pending / stats.appointments) * 100)
    : 0;

  const maxMonthlyCount =
    monthlyStats.length > 0
      ? Math.max(...monthlyStats.map((month) => month.count))
      : 0;

  const healthScore = Math.min(
    100,
    completedPercent + Math.min(stats.activeDoctors * 4, 30)
  );

  const cards = useMemo(
    () => [
      {
        title: "Revenue",
        value: `₹${stats.revenue}`,
        desc: "Completed consultations",
        icon: IndianRupee,
        gradient: "from-emerald-600 to-teal-500",
      },
      {
        title: "Doctors",
        value: stats.doctors,
        desc: `${stats.activeDoctors} active doctors`,
        icon: Stethoscope,
        gradient: "from-cyan-600 to-blue-500",
      },
      {
        title: "Appointments",
        value: stats.appointments,
        desc: "Total hospital bookings",
        icon: CalendarCheck,
        gradient: "from-purple-600 to-fuchsia-500",
      },
      {
        title: "Completed",
        value: stats.completed,
        desc: `${completedPercent}% completion rate`,
        icon: CheckCircle2,
        gradient: "from-green-600 to-emerald-500",
      },
      {
        title: "Pending",
        value: stats.pending,
        desc: `${pendingPercent}% awaiting consultation`,
        icon: Clock,
        gradient: "from-orange-500 to-amber-500",
      },
      {
        title: "Cancelled",
        value: stats.cancelled,
        desc: `${cancelledPercent}% cancelled bookings`,
        icon: XCircle,
        gradient: "from-red-600 to-rose-500",
      },
      {
        title: "Avg Rating",
        value: stats.avgRating ? `⭐ ${stats.avgRating}` : "0",
        desc: `${stats.reviews} patient reviews`,
        icon: Star,
        gradient: "from-yellow-500 to-orange-500",
      },
      {
        title: "Health Score",
        value: `${healthScore}%`,
        desc: "Operational strength",
        icon: Activity,
        gradient: "from-slate-800 to-cyan-600",
      },
    ],
    [
      stats,
      completedPercent,
      pendingPercent,
      cancelledPercent,
      healthScore,
    ]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4fbff] flex items-center justify-center">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 text-center">
          <Loader2 className="mx-auto text-cyan-600 animate-spin mb-4" size={38} />
          <p className="text-slate-500 font-semibold">
            Loading hospital dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6 py-8">
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                <Building2 size={17} />
                Hospital Analytics Center
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                {hospital?.hospitalName || "Hospital Dashboard"}
              </h1>

              <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
                Monitor revenue, appointments, doctor performance, patient
                reviews and operational health from one dashboard.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={loadDashboard}
                className="inline-flex items-center justify-center gap-2 bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-cyan-700 transition"
              >
                <RefreshCw size={18} />
                Refresh
              </button>

              <button
                onClick={logout}
                className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-red-700 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {cards.map((card) => (
            <StatCard key={card.title} card={card} />
          ))}
        </section>

        <section className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
            <SectionTitle
              icon={BarChart3}
              title="Appointment Overview"
              desc="Current booking performance"
            />

            <div className="space-y-5 mt-6">
              <ProgressRow
                label="Completed"
                value={completedPercent}
                color="from-emerald-500 to-teal-500"
              />

              <ProgressRow
                label="Pending"
                value={pendingPercent}
                color="from-orange-500 to-amber-500"
              />

              <ProgressRow
                label="Cancelled"
                value={cancelledPercent}
                color="from-red-500 to-rose-500"
              />
            </div>
          </div>

          <div className="relative overflow-hidden bg-slate-950 text-white rounded-[2rem] p-6 shadow-sm">
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-cyan-400/20 rounded-full blur-3xl" />

            <div className="relative">
              <TrendingUp className="text-cyan-300" size={34} />

              <h2 className="text-2xl font-black mt-5">
                Hospital Health Score
              </h2>

              <p className="text-slate-300 mt-2 text-sm leading-relaxed">
                Based on completion rate, active doctors and patient reviews.
              </p>

              <div className="mt-7">
                <p className="text-5xl font-black">{healthScore}%</p>

                <p className="text-cyan-300 font-semibold mt-1">
                  Operational strength
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
            <SectionTitle
              icon={TrendingUp}
              title="Monthly Appointments"
              desc="Booking trend based on appointment records"
            />

            {monthlyStats.length === 0 ? (
              <EmptyBox text="No monthly appointment data available." />
            ) : (
              <div className="flex items-end gap-4 h-64 mt-6">
                {monthlyStats.map((item) => {
                  const height =
                    maxMonthlyCount === 0
                      ? 0
                      : Math.max(12, (item.count / maxMonthlyCount) * 190);

                  return (
                    <div
                      key={item.month}
                      className="flex-1 flex flex-col items-center justify-end gap-3"
                    >
                      <div className="text-sm font-black text-slate-700">
                        {item.count}
                      </div>

                      <div
                        className="w-full rounded-t-2xl bg-gradient-to-t from-purple-600 to-cyan-400 shadow-sm transition-all duration-700"
                        style={{ height: `${height}px` }}
                      />

                      <div className="text-xs font-bold text-slate-500">
                        {item.month}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
            <SectionTitle
              icon={Trophy}
              title="Top Doctors"
              desc="Ranked by appointments"
            />

            {topDoctors.length === 0 ? (
              <EmptyBox text="No doctor ranking available." />
            ) : (
              <div className="space-y-4 mt-6">
                {topDoctors.map((doctor, index) => (
                  <TopDoctorItem key={doctor.id} doctor={doctor} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <ActionCard
            to="/hospital/doctors"
            icon={UsersRound}
            title="Manage Doctors"
            desc="Add, deactivate and manage hospital doctors."
            gradient="from-cyan-600 to-blue-500"
          />

          <ActionCard
            to="/hospital/availability"
            icon={Clock}
            title="Manage Availability"
            desc="Configure doctor schedules and available timings."
            gradient="from-emerald-600 to-teal-500"
          />

          <ActionCard
            to="/hospital/appointments"
            icon={CalendarCheck}
            title="Appointments"
            desc="Monitor bookings and consultation status."
            gradient="from-purple-600 to-fuchsia-500"
          />
        </section>
      </div>
    </div>
  );
}

function StatCard({ card }) {
  const Icon = card.icon;

  return (
    <div className="group relative">
      <div
        className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-40 blur transition duration-500`}
      />

      <div className="relative h-full bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm group-hover:-translate-y-1 group-hover:shadow-xl transition duration-500">
        <div className="flex items-start justify-between">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-sm`}
          >
            <Icon className="text-white" size={27} />
          </div>

          <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-black border border-cyan-100">
            Live
          </span>
        </div>

        <p className="text-slate-500 text-sm mt-5">{card.title}</p>

        <h2 className="text-4xl font-black mt-1 text-slate-950">
          {card.value}
        </h2>

        <p className="text-sm text-slate-500 mt-2">{card.desc}</p>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center">
        <Icon className="text-cyan-600" size={22} />
      </div>

      <div>
        <h2 className="text-xl font-black text-slate-950">{title}</h2>
        <p className="text-sm text-slate-500">{desc}</p>
      </div>
    </div>
  );
}

function ProgressRow({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-bold mb-2">
        <span className="text-slate-700">{label}</span>
        <span className="text-slate-500">{value}%</span>
      </div>

      <div className="h-4 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function TopDoctorItem({ doctor, index }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-3">
      <div className="w-8 h-8 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center font-black">
        {index + 1}
      </div>

      <img
        src={
          doctor.image ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            doctor.name || "Doctor"
          )}&background=0891b2&color=fff&bold=true`
        }
        alt={doctor.name}
        className="w-11 h-11 rounded-2xl object-cover"
      />

      <div className="flex-1 min-w-0">
        <p className="font-black text-slate-950 truncate">
          {doctor.name}
        </p>

        <p className="text-xs text-slate-500 truncate">
          {doctor.specialization || "Specialist"}
        </p>
      </div>

      <div className="text-right">
        <p className="font-black text-cyan-600">
          {doctor.appointments}
        </p>

        <p className="text-[11px] text-slate-400">
          appts
        </p>
      </div>
    </div>
  );
}

function ActionCard({ to, icon: Icon, title, desc, gradient }) {
  return (
    <Link to={to} className="group relative">
      <div
        className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-40 blur transition duration-500`}
      />

      <div className="relative h-full bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 group-hover:-translate-y-1 group-hover:shadow-xl transition duration-500">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-sm mb-5`}
        >
          <Icon className="text-white" size={26} />
        </div>

        <h2 className="text-xl font-black text-slate-950">
          {title}
        </h2>

        <p className="text-slate-500 mt-2">
          {desc}
        </p>

        <div className="mt-5 flex items-center gap-2 text-cyan-600 font-black">
          Open
          <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
        </div>
      </div>
    </Link>
  );
}

function EmptyBox({ text }) {
  return (
    <div className="text-slate-500 bg-slate-50 rounded-2xl p-6 mt-6 border border-slate-100">
      {text}
    </div>
  );
}