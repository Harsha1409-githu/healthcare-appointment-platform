import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function DoctorDashboard() {
  const navigate = useNavigate();

  const doctor = JSON.parse(
    localStorage.getItem("doctorUser") || "null"
  );

  const [appointments, setAppointments] = useState([]);
  const [reviewSummary, setReviewSummary] = useState({
    totalReviews: 0,
    averageRating: 0,
  });

  const [showPrescriptionForm, setShowPrescriptionForm] =
    useState(null);

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
      setReviewSummary(reviewRes.data || {
        totalReviews: 0,
        averageRating: 0,
      });
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
      alert(
        error.response?.data?.message ||
          "Failed to complete appointment"
      );
    }
  };

  const savePrescription = async (appointmentId) => {
    if (!form.diagnosis || !form.medicines) {
      alert("Diagnosis and medicines are required");
      return;
    }

    try {
      await api.post("/prescription", {
        appointmentId,
        diagnosis: form.diagnosis,
        medicines: form.medicines,
        notes: form.notes,
      });

      alert("Prescription created successfully");

      setForm({
        diagnosis: "",
        medicines: "",
        notes: "",
      });

      setShowPrescriptionForm(null);
      fetchDashboardData();
    } catch (error) {
      console.error("Prescription error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to create prescription"
      );
    }
  };

  const completedCount = appointments.filter(
    (a) => a.status === "COMPLETED"
  ).length;

  const pendingCount = appointments.filter(
    (a) => a.status === "BOOKED"
  ).length;

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
  ).length;

  const completionRate = appointments.length
    ? Math.round((completedCount / appointments.length) * 100)
    : 0;

  const monthlyMap = {};

  appointments.forEach((appointment) => {
    const rawDate =
      appointment.createdAt ||
      appointment.slot?.date ||
      appointment.date;

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

  const monthlyStats = monthOrder
    .map((month) => ({
      month,
      count: monthlyMap[month] || 0,
    }))
    .filter((item) => item.count > 0);

  const maxMonthlyCount =
    monthlyStats.length > 0
      ? Math.max(...monthlyStats.map((m) => m.count))
      : 0;

  const cards = [
    {
      title: "Revenue",
      value: `₹${revenue}`,
      desc: "Completed consultations",
      icon: IndianRupee,
      gradient: "from-green-600 to-emerald-500",
    },
    {
      title: "Appointments",
      value: appointments.length,
      desc: "Total bookings",
      icon: CalendarCheck,
      gradient: "from-blue-600 to-cyan-500",
    },
    {
      title: "Today",
      value: todayAppointments,
      desc: "Appointments today",
      icon: Clock,
      gradient: "from-orange-500 to-amber-500",
    },
    {
      title: "Completed",
      value: completedCount,
      desc: `${completionRate}% completion rate`,
      icon: CheckCircle2,
      gradient: "from-emerald-600 to-teal-500",
    },
    {
      title: "Pending",
      value: pendingCount,
      desc: "Awaiting consultation",
      icon: Activity,
      gradient: "from-purple-600 to-fuchsia-500",
    },
    {
      title: "Cancelled",
      value: cancelledCount,
      desc: "Cancelled bookings",
      icon: XCircle,
      gradient: "from-red-600 to-rose-500",
    },
    {
      title: "Rating",
      value: reviewSummary.averageRating
        ? `⭐ ${Number(reviewSummary.averageRating).toFixed(1)}`
        : "0",
      desc: `${reviewSummary.totalReviews || 0} reviews`,
      icon: Star,
      gradient: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-emerald-50/40 to-white">
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl" />
      <div className="absolute top-40 right-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto p-6 md:p-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-emerald-950 to-cyan-900 p-8 md:p-10 text-white shadow-2xl mb-8">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center">
                {doctor?.profileImage ? (
                  <img
                    src={doctor.profileImage}
                    alt={doctor.doctorName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserRound size={42} className="text-emerald-300" />
                )}
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur mb-3">
                  <TrendingUp size={18} className="text-emerald-300" />
                  <span className="text-sm font-semibold">
                    Doctor Analytics Center
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black">
                  Dr. {doctor?.doctorName}
                </h1>

                <p className="text-emerald-100 mt-2">
                  {doctor?.specialization || "Medical Specialist"}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-2xl font-bold transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div key={card.title} className="group relative">
                <div
                  className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-40 blur transition duration-500`}
                />

                <div className="relative h-full bg-white/95 backdrop-blur-xl rounded-[2rem] p-6 border border-white shadow-xl group-hover:-translate-y-1 transition duration-500">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="text-white" size={27} />
                  </div>

                  <p className="text-slate-500 text-sm mt-5">
                    {card.title}
                  </p>

                  <h2 className="text-4xl font-black mt-1 text-slate-950">
                    {card.value}
                  </h2>

                  <p className="text-sm text-slate-500 mt-2">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6">
            <h2 className="text-xl font-black text-slate-900 mb-6">
              Monthly Appointments
            </h2>

            {monthlyStats.length === 0 ? (
              <div className="text-slate-500 bg-slate-50 rounded-2xl p-6">
                No appointment trend available.
              </div>
            ) : (
              <div className="flex items-end gap-4 h-64">
                {monthlyStats.map((item) => {
                  const height =
                    maxMonthlyCount === 0
                      ? 0
                      : Math.max(
                          12,
                          (item.count / maxMonthlyCount) * 190
                        );

                  return (
                    <div
                      key={item.month}
                      className="flex-1 flex flex-col items-center justify-end gap-3"
                    >
                      <div className="text-sm font-black text-slate-700">
                        {item.count}
                      </div>

                      <div
                        className="w-full rounded-t-2xl bg-gradient-to-t from-emerald-600 to-cyan-400 shadow-lg transition-all duration-700"
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

          <div className="relative overflow-hidden bg-slate-950 text-white rounded-[2rem] p-6 shadow-2xl">
            <TrendingUp className="text-emerald-300" size={34} />

            <h2 className="text-2xl font-black mt-5">
              Performance Score
            </h2>

            <p className="text-slate-300 mt-2 text-sm">
              Based on completion rate and patient rating.
            </p>

            <p className="text-5xl font-black mt-7">
              {Math.min(
                100,
                completionRate +
                  Math.round(
                    (Number(reviewSummary.averageRating || 0) / 5) * 20
                  )
              )}
              %
            </p>

            <p className="text-emerald-300 font-semibold mt-1">
              Doctor performance
            </p>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6">
          <h2 className="text-2xl font-black text-slate-900 mb-6">
            My Appointments
          </h2>

          {appointments.length === 0 ? (
            <div className="bg-slate-50 rounded-2xl p-6">
              <p className="text-slate-500">
                No appointments found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-[2rem] border border-slate-100 bg-white shadow p-5"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center overflow-hidden">
                        {appointment.patient?.profileImage ? (
                          <img
                            src={appointment.patient.profileImage}
                            alt={
                              appointment.patient?.fullName ||
                              appointment.patientName
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserRound
                            size={28}
                            className="text-emerald-600"
                          />
                        )}
                      </div>

                      <div>
                        <h3 className="font-black text-lg text-slate-900">
                          {appointment.patient?.fullName ||
                            appointment.patientName}
                        </h3>

                        <p className="text-slate-500 flex items-center gap-2">
                          <Phone size={15} />
                          {appointment.patientPhone}
                        </p>

                        <p className="text-slate-500">
                          {appointment.slot?.date} |{" "}
                          {appointment.slot?.startTime} -{" "}
                          {appointment.slot?.endTime}
                        </p>

                        <p className="mt-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              appointment.status === "COMPLETED"
                                ? "bg-emerald-100 text-emerald-700"
                                : appointment.status === "CANCELLED"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 flex-wrap">
<Link
  to={`/doctor/appointment/${appointment.id}/patient-profile`}
  className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800"
>
  View Patient
</Link> 

  {appointment.status === "BOOKED" &&
    appointment.videoRoomId && (

      <a
        href={`/video-call/${appointment.id}`}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Join Video Call
      </a>
    )}

  {appointment.status === "BOOKED" && (
    <button
      onClick={() =>
        completeAppointment(appointment.id)
      }
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
    >
      Complete
    </button>
  )}

  {appointment.status === "COMPLETED" && (
    <button
      onClick={() =>
        setShowPrescriptionForm(
          showPrescriptionForm === appointment.id
            ? null
            : appointment.id
        )
      }
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
    >
      Create Prescription
    </button>
  )}
</div>
                  </div>

                  {showPrescriptionForm === appointment.id && (
                    <div className="mt-5 border-t pt-5">
                      <h3 className="font-black mb-4">
                        Create Prescription
                      </h3>

                      <input
                        type="text"
                        placeholder="Diagnosis"
                        value={form.diagnosis}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            diagnosis: e.target.value,
                          })
                        }
                        className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl mb-3 outline-none focus:ring-2 focus:ring-emerald-500"
                      />

                      <textarea
                        placeholder="Medicines"
                        rows="4"
                        value={form.medicines}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            medicines: e.target.value,
                          })
                        }
                        className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl mb-3 outline-none focus:ring-2 focus:ring-emerald-500"
                      />

                      <textarea
                        placeholder="Notes"
                        rows="3"
                        value={form.notes}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            notes: e.target.value,
                          })
                        }
                        className="w-full border border-slate-200 bg-slate-50 p-3 rounded-xl mb-3 outline-none focus:ring-2 focus:ring-emerald-500"
                      />

                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            savePrescription(appointment.id)
                          }
                          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-emerald-700"
                        >
                          <Save size={18} />
                          Save Prescription
                        </button>

                        <button
                          onClick={() =>
                            setShowPrescriptionForm(null)
                          }
                          className="border border-slate-300 px-5 py-2 rounded-xl font-bold hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}