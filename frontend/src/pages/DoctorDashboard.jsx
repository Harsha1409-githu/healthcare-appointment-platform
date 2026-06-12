import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  IndianRupee,
  Star,
  TrendingUp,
  LogOut,
  UserRound,
  Phone,
  FileText,
  Save,
  XCircle,
  Activity,
  Video,
  ClipboardList,
  Stethoscope,
  ShieldCheck,
  Search,
  Filter,
  MessageSquare,
  ArrowRight,
  X,
} from "lucide-react";
import api from "../api/axios";

export default function DoctorDashboard() {
  const navigate = useNavigate();

  const doctor = JSON.parse(localStorage.getItem("doctorUser") || "null");

  const [appointments, setAppointments] = useState([]);
  const [reviewSummary, setReviewSummary] = useState({
    totalReviews: 0,
    averageRating: 0,
  });

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    diagnosis: "",
    medicines: "",
    notes: "",
  });

  useEffect(() => {
    if (!doctor) {
      navigate("/doctor/login");
      return;
    }

    fetchDashboardData();
  }, []);

  const logout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorUser");
    navigate("/doctor/login");
  };

  const fetchDashboardData = async () => {
    try {
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
      console.error("Doctor dashboard error:", error);
    }
  };

  const completeAppointment = async (id) => {
    try {
      await api.patch(`/appointment/${id}/complete`);
      fetchDashboardData();
    } catch (error) {
      console.error("Complete error:", error);
      alert(error.response?.data?.message || "Failed to complete appointment");
    }
  };

  const openPrescriptionModal = (appointment) => {
    setSelectedAppointment(appointment);
    setForm({
      diagnosis: "",
      medicines: "",
      notes: "",
    });
  };

  const closePrescriptionModal = () => {
    setSelectedAppointment(null);
    setForm({
      diagnosis: "",
      medicines: "",
      notes: "",
    });
  };

  const savePrescription = async () => {
    if (!selectedAppointment) return;

    if (!form.diagnosis || !form.medicines) {
      alert("Diagnosis and medicines are required");
      return;
    }

    try {
      await api.post("/prescription", {
        appointmentId: selectedAppointment.id,
        diagnosis: form.diagnosis,
        medicines: form.medicines,
        notes: form.notes,
      });

      alert("Prescription created successfully");
      closePrescriptionModal();
      fetchDashboardData();
    } catch (error) {
      console.error("Prescription error:", error);
      alert(error.response?.data?.message || "Failed to create prescription");
    }
  };

  const completedCount = appointments.filter(
    (a) => a.status === "COMPLETED"
  ).length;

  const pendingCount = appointments.filter((a) => a.status === "BOOKED").length;

  const cancelledCount = appointments.filter(
    (a) => a.status === "CANCELLED"
  ).length;

  const revenue = appointments
    .filter((a) => a.status === "COMPLETED")
    .reduce(
      (sum, a) =>
        sum + (a.doctor?.consultationFee || doctor?.consultationFee || 0),
      0
    );

  const today = new Date().toISOString().split("T")[0];

  const todayAppointments = appointments.filter(
    (a) => a.slot?.date === today
  );

  const completionRate = appointments.length
    ? Math.round((completedCount / appointments.length) * 100)
    : 0;

  const performanceScore = Math.min(
    100,
    completionRate +
      Math.round((Number(reviewSummary.averageRating || 0) / 5) * 20)
  );

  const monthlyStats = useMemo(() => {
    const monthlyMap = {};

    appointments.forEach((appointment) => {
      const rawDate =
        appointment.createdAt || appointment.slot?.date || appointment.date;

      if (!rawDate) return;

      const month = new Date(rawDate).toLocaleString("default", {
        month: "short",
      });

      monthlyMap[month] = (monthlyMap[month] || 0) + 1;
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

    return monthOrder
      .map((month) => ({
        month,
        count: monthlyMap[month] || 0,
      }))
      .filter((item) => item.count > 0);
  }, [appointments]);

  const maxMonthlyCount =
    monthlyStats.length > 0
      ? Math.max(...monthlyStats.map((m) => m.count))
      : 0;

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesStatus =
      statusFilter === "ALL" || appointment.status === statusFilter;

    const text = `${appointment.patient?.fullName || ""} ${
      appointment.patientName || ""
    } ${appointment.patientPhone || ""} ${appointment.status || ""}`
      .toLowerCase()
      .trim();

    const matchesSearch = text.includes(search.toLowerCase().trim());

    return matchesStatus && matchesSearch;
  });

  const cards = [
    {
      title: "Revenue",
      value: `₹${revenue}`,
      desc: "Completed consultations",
      icon: IndianRupee,
      tone: "emerald",
    },
    {
      title: "Appointments",
      value: appointments.length,
      desc: "Total bookings",
      icon: CalendarCheck,
      tone: "cyan",
    },
    {
      title: "Today",
      value: todayAppointments.length,
      desc: "Appointments today",
      icon: Clock,
      tone: "amber",
    },
    {
      title: "Completed",
      value: completedCount,
      desc: `${completionRate}% completion rate`,
      icon: CheckCircle2,
      tone: "emerald",
    },
    {
      title: "Booked",
      value: pendingCount,
      desc: "Awaiting consultation",
      icon: Activity,
      tone: "purple",
    },
    {
      title: "Cancelled",
      value: cancelledCount,
      desc: "Cancelled bookings",
      icon: XCircle,
      tone: "red",
    },
    {
      title: "Rating",
      value: reviewSummary.averageRating
        ? `⭐ ${Number(reviewSummary.averageRating).toFixed(1)}`
        : "0",
      desc: `${reviewSummary.totalReviews || 0} reviews`,
      icon: Star,
      tone: "yellow",
    },
    {
      title: "Performance",
      value: `${performanceScore}%`,
      desc: "Overall score",
      icon: TrendingUp,
      tone: "cyan",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6 py-8">
        <section className="relative overflow-hidden bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-100 rounded-full blur-3xl" />

          <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <div className="w-24 h-24 rounded-[2rem] bg-cyan-50 border border-cyan-100 overflow-hidden flex items-center justify-center shrink-0">
                {doctor?.profileImage ? (
                  <img
                    src={doctor.profileImage}
                    alt={doctor.doctorName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserRound size={44} className="text-cyan-600" />
                )}
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                  <TrendingUp size={17} />
                  DOCTOR ANALYTICS CENTER
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                  Dr. {doctor?.doctorName}
                </h1>

                <p className="text-slate-500 mt-2 text-lg">
                  {doctor?.specialization || "Medical Specialist"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/doctor/profile"
                className="inline-flex items-center justify-center gap-2 border border-cyan-600 text-cyan-700 px-5 py-3 rounded-2xl font-black hover:bg-cyan-50 transition"
              >
                <UserRound size={18} />
                My Profile
              </Link>

              <Link
                to="/doctor/calendar"
                className="inline-flex items-center justify-center gap-2 bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-cyan-700 transition"
              >
                <CalendarCheck size={18} />
                Calendar
              </Link>

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

        <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {cards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </section>

        <section className="grid xl:grid-cols-[1fr_360px] gap-8 mb-8">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  Monthly Appointments
                </h2>

                <p className="text-slate-500">
                  Consultation trend by month
                </p>
              </div>

              <div className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm">
                <Activity size={16} />
                {appointments.length} Total
              </div>
            </div>

            {monthlyStats.length === 0 ? (
              <EmptyMini text="No appointment trend available." />
            ) : (
              <div className="flex items-end gap-4 h-64">
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
                        className="w-full rounded-t-2xl bg-gradient-to-t from-cyan-600 to-emerald-400 shadow-sm transition-all duration-700"
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

          <aside className="space-y-5">
            <div className="relative overflow-hidden bg-slate-950 text-white rounded-[2rem] p-6 shadow-sm">
              <div className="absolute -top-16 -right-16 w-52 h-52 bg-cyan-400/20 rounded-full blur-3xl" />

              <div className="relative">
                <TrendingUp className="text-cyan-300" size={34} />

                <h2 className="text-2xl font-black mt-5">
                  Performance Score
                </h2>

                <p className="text-slate-300 mt-2 text-sm">
                  Based on completion rate and patient rating.
                </p>

                <p className="text-6xl font-black mt-7">
                  {performanceScore}%
                </p>

                <div className="w-full h-3 bg-white/10 rounded-full mt-5 overflow-hidden">
                  <div
                    className="h-full bg-cyan-300 rounded-full"
                    style={{ width: `${performanceScore}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
              <h3 className="text-xl font-black text-slate-950 mb-4">
                Today's Schedule
              </h3>

              {todayAppointments.length === 0 ? (
                <p className="text-slate-500">No appointments today.</p>
              ) : (
                <div className="space-y-3">
                  {todayAppointments.slice(0, 4).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="bg-slate-50 border border-slate-100 rounded-2xl p-3"
                    >
                      <p className="font-black text-slate-950">
                        {appointment.slot?.startTime} -{" "}
                        {appointment.patient?.fullName ||
                          appointment.patientName}
                      </p>

                      <p className="text-sm text-slate-500">
                        {appointment.status}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </section>

        <section className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                My Appointments
              </h2>

              <p className="text-slate-500">
                Manage patients, consultations and prescriptions.
              </p>
            </div>

            <div className="grid lg:grid-cols-[1fr_220px] gap-3 xl:w-[600px]">
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                <Search className="text-cyan-600" size={20} />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search patient or phone..."
                  className="w-full bg-transparent outline-none"
                />
              </div>

              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                <Filter className="text-cyan-600" size={20} />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-transparent outline-none font-semibold text-slate-800"
                >
                  <option value="ALL">All</option>
                  <option value="BOOKED">Booked</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <EmptyAppointments />
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  completeAppointment={completeAppointment}
                  openPrescriptionModal={openPrescriptionModal}
                />
              ))}
            </div>
          )}
        </section>

        {selectedAppointment && (
          <PrescriptionModal
            appointment={selectedAppointment}
            form={form}
            setForm={setForm}
            onClose={closePrescriptionModal}
            onSave={savePrescription}
          />
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, desc, icon: Icon, tone }) {
  const styles = {
    emerald: "bg-emerald-50 text-emerald-600",
    cyan: "bg-cyan-50 text-cyan-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
    red: "bg-red-50 text-red-600",
    yellow: "bg-yellow-50 text-yellow-600",
  };

  return (
    <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition">
      <div
        className={`w-12 h-12 rounded-2xl ${
          styles[tone] || styles.cyan
        } flex items-center justify-center mb-4`}
      >
        <Icon size={24} />
      </div>

      <p className="text-sm text-slate-500 font-bold">
        {title}
      </p>

      <h2 className="text-3xl font-black mt-1 text-slate-950">
        {value}
      </h2>

      <p className="text-sm text-slate-500 mt-2">
        {desc}
      </p>
    </div>
  );
}

function AppointmentCard({
  appointment,
  completeAppointment,
  openPrescriptionModal,
}) {
  return (
    <div className="rounded-[2rem] border border-slate-100 bg-slate-50 p-5">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center overflow-hidden border border-slate-100 shrink-0">
            {appointment.patient?.profileImage ? (
              <img
                src={appointment.patient.profileImage}
                alt={appointment.patient?.fullName || appointment.patientName}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserRound size={30} className="text-cyan-600" />
            )}
          </div>

          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-100 text-emerald-700 font-black text-xs mb-2">
              <ShieldCheck size={14} />
              Patient
            </div>

            <h3 className="font-black text-xl text-slate-950 truncate">
              {appointment.patient?.fullName || appointment.patientName}
            </h3>

            <div className="flex flex-wrap gap-3 mt-3">
              <InfoBadge icon={Phone} text={appointment.patientPhone} />

              <InfoBadge
                icon={Clock}
                text={`${appointment.slot?.date || "-"} | ${
                  appointment.slot?.startTime || ""
                } - ${appointment.slot?.endTime || ""}`}
              />

              <StatusBadge status={appointment.status} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link
            to={`/doctor/appointment/${appointment.id}/patient-profile`}
            className="inline-flex items-center gap-2 bg-slate-950 text-white px-4 py-3 rounded-2xl font-black hover:bg-cyan-700 transition"
          >
            <UserRound size={17} />
            Patient
          </Link>

          {appointment.status === "BOOKED" && appointment.videoRoomId && (
            <Link
              to={`/video-call/${appointment.id}`}
              className="inline-flex items-center gap-2 bg-cyan-600 text-white px-4 py-3 rounded-2xl font-black hover:bg-cyan-700 transition"
            >
              <Video size={17} />
              Video
            </Link>
          )}

          {appointment.status === "BOOKED" && (
            <button
              onClick={() => completeAppointment(appointment.id)}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-2xl font-black hover:bg-emerald-700 transition"
            >
              <CheckCircle2 size={17} />
              Complete
            </button>
          )}

          {appointment.status === "COMPLETED" && (
            <button
              onClick={() => openPrescriptionModal(appointment)}
              className="inline-flex items-center gap-2 bg-cyan-600 text-white px-4 py-3 rounded-2xl font-black hover:bg-cyan-700 transition"
            >
              <FileText size={17} />
              Prescription
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PrescriptionModal({ appointment, form, setForm, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              Create Prescription
            </h2>

            <p className="text-slate-500">
              Patient:{" "}
              {appointment.patient?.fullName || appointment.patientName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center"
          >
            <X size={21} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <InputField
            label="Diagnosis"
            value={form.diagnosis}
            onChange={(e) =>
              setForm({
                ...form,
                diagnosis: e.target.value,
              })
            }
            placeholder="Example: Viral fever"
          />

          <TextAreaField
            label="Medicines"
            value={form.medicines}
            onChange={(e) =>
              setForm({
                ...form,
                medicines: e.target.value,
              })
            }
            placeholder="Example: Paracetamol 500mg - twice daily after food"
            rows={5}
          />

          <TextAreaField
            label="Notes"
            value={form.notes}
            onChange={(e) =>
              setForm({
                ...form,
                notes: e.target.value,
              })
            }
            placeholder="Additional instructions"
            rows={3}
          />
        </div>

        <div className="p-6 border-t border-slate-100 flex flex-wrap justify-end gap-3">
          <button
            onClick={onClose}
            className="border border-slate-300 px-5 py-3 rounded-2xl font-black hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="flex items-center gap-2 bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-cyan-700"
          >
            <Save size={18} />
            Save Prescription
          </button>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <p className="text-sm font-black text-slate-700 mb-2">
        {label}
      </p>

      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-cyan-500"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows }) {
  return (
    <label className="block">
      <p className="text-sm font-black text-slate-700 mb-2">
        {label}
      </p>

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
      />
    </label>
  );
}

function InfoBadge({ icon: Icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-slate-100 text-slate-600 text-sm font-bold">
      <Icon size={15} className="text-cyan-600" />
      {text || "-"}
    </span>
  );
}

function StatusBadge({ status }) {
  const style =
    status === "COMPLETED"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : status === "CANCELLED"
      ? "bg-red-50 text-red-700 border-red-100"
      : "bg-cyan-50 text-cyan-700 border-cyan-100";

  return (
    <span
      className={`inline-flex items-center px-3 py-2 rounded-full border text-sm font-black ${style}`}
    >
      {status}
    </span>
  );
}

function EmptyMini({ text }) {
  return (
    <div className="text-slate-500 bg-slate-50 border border-slate-100 rounded-2xl p-6">
      {text}
    </div>
  );
}

function EmptyAppointments() {
  return (
    <div className="bg-slate-50 rounded-[2rem] border border-slate-100 p-10 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto mb-4">
        <CalendarCheck className="text-cyan-600" size={32} />
      </div>

      <h3 className="text-2xl font-black text-slate-950">
        No appointments found
      </h3>

      <p className="text-slate-500 mt-2">
        Appointments assigned to you will appear here.
      </p>
    </div>
  );
}