import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CalendarCheck,
  CheckCircle2,
  Clock,
  IndianRupee,
  Star,
  TrendingUp,
  XCircle,
  RefreshCw,
  Loader2,
  BarChart3,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import api from "../api/axios";

export default function DoctorAnalytics() {
  const doctor = JSON.parse(localStorage.getItem("doctorUser") || "null");

  const [appointments, setAppointments] = useState([]);
  const [reviewSummary, setReviewSummary] = useState({
    totalReviews: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      if (!doctor?.id) return;

      const [appointmentRes, reviewRes] = await Promise.all([
        api.get(`/appointment/doctor/${doctor.id}`),
        api.get(`/review/doctor/${doctor.id}/summary`),
      ]);

      setAppointments(appointmentRes.data || []);
      setReviewSummary(
        reviewRes.data || {
          totalReviews: 0,
          averageRating: 0,
        }
      );
    } catch (error) {
      console.error("Doctor analytics error:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const completed = appointments.filter((a) => a.status === "COMPLETED");
    const booked = appointments.filter((a) => a.status === "BOOKED");
    const cancelled = appointments.filter((a) => a.status === "CANCELLED");

    const fee = Number(doctor?.consultationFee || 0);
    const revenue = completed.length * fee;

    const uniquePatients = new Set(
      appointments.map(
        (a) =>
          a.patient?.id ||
          a.patient?.mobile ||
          a.patientPhone ||
          a.patientName ||
          a.id
      )
    ).size;

    const today = new Date().toISOString().split("T")[0];

    return {
      total: appointments.length,
      booked: booked.length,
      completed: completed.length,
      cancelled: cancelled.length,
      revenue,
      patients: uniquePatients,
      today: appointments.filter((a) => a.slot?.date === today).length,
    };
  }, [appointments, doctor]);

  const completedPercent = stats.total
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  const bookedPercent = stats.total
    ? Math.round((stats.booked / stats.total) * 100)
    : 0;

  const cancelledPercent = stats.total
    ? Math.round((stats.cancelled / stats.total) * 100)
    : 0;

  const monthlyStats = useMemo(() => {
    const map = new Map();

    appointments.forEach((appointment) => {
      const dateValue = appointment.slot?.date || appointment.date;
      if (!dateValue) return;

      const date = new Date(dateValue);
      const key = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (!map.has(key)) {
        map.set(key, {
          month: key,
          appointments: 0,
          completed: 0,
          revenue: 0,
        });
      }

      const item = map.get(key);
      item.appointments += 1;

      if (appointment.status === "COMPLETED") {
        item.completed += 1;
        item.revenue += Number(doctor?.consultationFee || 0);
      }
    });

    return Array.from(map.values()).slice(-6);
  }, [appointments, doctor]);

  const maxRevenue = monthlyStats.length
    ? Math.max(...monthlyStats.map((m) => Number(m.revenue || 0)))
    : 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f8fb] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
          <Loader2
            className="mx-auto text-cyan-600 animate-spin mb-4"
            size={38}
          />

          <p className="text-slate-500 font-bold">
            Loading doctor analytics...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-28">
      <PageHeader
        title="Analytics"
        subtitle="Your consultation performance"
      />

      <div className="max-w-md mx-auto px-4">
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-cyan-700 font-black">
                DOCTOR INSIGHTS
              </p>

              <h1 className="text-xl font-black text-slate-950">
                Performance Overview
              </h1>

              <p className="text-sm text-slate-500">
                Bookings, revenue, patients and rating
              </p>
            </div>

            <button
              type="button"
              onClick={fetchAnalytics}
              className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 active:scale-95"
            >
              <RefreshCw size={20} />
            </button>
          </div>

          <div className="mt-4 rounded-3xl bg-slate-950 text-white p-4 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl" />

            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                <IndianRupee className="text-cyan-300" size={26} />
              </div>

              <p className="text-sm text-slate-300 font-bold">
                Estimated Revenue
              </p>

              <h2 className="text-4xl font-black mt-1">
                ₹{stats.revenue}
              </h2>

              <p className="text-xs text-slate-400 mt-2">
                Based on completed consultations
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <MiniStat icon={CalendarCheck} label="Total" value={stats.total} />
            <MiniStat icon={Clock} label="Today" value={stats.today} />
            <MiniStat icon={CheckCircle2} label="Done" value={stats.completed} />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2">
            <MiniStat icon={Activity} label="Booked" value={stats.booked} />
            <MiniStat icon={UsersRound} label="Patients" value={stats.patients} />
            <MiniStat
              icon={Star}
              label="Rating"
              value={
                reviewSummary.averageRating
                  ? Number(reviewSummary.averageRating).toFixed(1)
                  : "0.0"
              }
            />
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <SectionTitle
            icon={ShieldCheck}
            title="Appointment Health"
            desc="Status distribution"
          />

          <div className="space-y-4 mt-4">
            <ProgressRow label="Completed" value={completedPercent} />
            <ProgressRow label="Booked" value={bookedPercent} />
            <ProgressRow label="Cancelled" value={cancelledPercent} danger />
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <SectionTitle
            icon={Star}
            title="Patient Rating"
            desc="Review summary"
          />

          <div className="mt-4 bg-cyan-50 border border-cyan-100 rounded-3xl p-4">
            <p className="text-xs text-cyan-700 font-black">
              AVERAGE RATING
            </p>

            <h3 className="text-4xl font-black text-slate-950 mt-2">
              {reviewSummary.averageRating
                ? Number(reviewSummary.averageRating).toFixed(1)
                : "0.0"}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Based on {reviewSummary.totalReviews || 0} patient reviews
            </p>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <SectionTitle
            icon={BarChart3}
            title="Monthly Performance"
            desc="Revenue and bookings by month"
          />

          {monthlyStats.length === 0 ? (
            <Empty text="No monthly data available yet." />
          ) : (
            <div className="space-y-4 mt-4">
              {monthlyStats.map((item) => {
                const revenue = Number(item.revenue || 0);
                const width =
                  maxRevenue === 0
                    ? 0
                    : Math.max(8, (revenue / maxRevenue) * 100);

                return (
                  <div
                    key={item.month}
                    className="bg-slate-50 rounded-2xl border border-slate-100 p-3"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div>
                        <p className="font-black text-slate-950">
                          {item.month}
                        </p>

                        <p className="text-xs text-slate-500 font-bold">
                          {item.appointments} appointments • {item.completed} completed
                        </p>
                      </div>

                      <p className="font-black text-emerald-600">
                        ₹{revenue}
                      </p>
                    </div>

                    <div className="h-3 bg-white rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-cyan-600"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="bg-cyan-600 rounded-3xl p-4 text-white mt-3">
          <div className="flex gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">
              <TrendingUp size={22} />
            </div>

            <div>
              <h3 className="text-sm font-black">
                Growth Tip
              </h3>

              <p className="text-xs text-cyan-100 mt-1 leading-relaxed">
                Keep availability updated and complete appointments on time to
                improve patient trust and booking conversion.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionTitle({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center">
        <Icon className="text-cyan-600" size={22} />
      </div>

      <div>
        <h2 className="text-lg font-black text-slate-950">
          {title}
        </h2>

        <p className="text-xs text-slate-500">
          {desc}
        </p>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center">
      <Icon className="text-cyan-600 mx-auto" size={18} />

      <p className="text-sm font-black text-slate-950 mt-1">
        {value}
      </p>

      <p className="text-[10px] text-slate-500 font-bold">
        {label}
      </p>
    </div>
  );
}

function ProgressRow({ label, value, danger = false }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-bold mb-2">
        <span className="text-slate-700">{label}</span>
        <span className="text-slate-500">{value}%</span>
      </div>

      <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${
            danger ? "bg-red-500" : "bg-cyan-600"
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-6 text-center text-sm text-slate-500 mt-4 border border-slate-100">
      {text}
    </div>
  );
}