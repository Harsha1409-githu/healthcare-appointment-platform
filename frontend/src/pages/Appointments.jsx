import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  Clock,
  Stethoscope,
  UserRound,
  XCircle,
  Star,
  Send,
  MessageSquare,
  Video,
  ShieldCheck,
  Activity,
  CalendarX,
  RefreshCcw,
  Search,
  BadgeCheck,
  Phone,
  Building2,
  ArrowRight,
  Filter,
  ClipboardList,
} from "lucide-react";
import api from "../api/axios";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const [reviewForm, setReviewForm] = useState({
    appointmentId: null,
    doctorId: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    setLoading(true);

    api
      .get("/appointment/my")
      .then((res) => setAppointments(res.data || []))
      .catch((err) => {
        console.error("Appointment API error:", err);

        if (err.response?.status === 401) {
          alert("Please login again");
          localStorage.removeItem("patientToken");
          localStorage.removeItem("patientUser");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      })
      .finally(() => setLoading(false));
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await api.patch(`/appointment/${id}/cancel`);

      setAppointments((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "CANCELLED" } : item
        )
      );
    } catch (error) {
      console.error("Cancel error:", error);
      alert(error.response?.data?.message || "Failed to cancel appointment");
    }
  };

  const openReviewForm = (appointment) => {
    setReviewForm({
      appointmentId: appointment.id,
      doctorId: appointment.doctor?.id,
      rating: 5,
      comment: "",
    });
  };

  const closeReviewForm = () => {
    setReviewForm({
      appointmentId: null,
      doctorId: "",
      rating: 5,
      comment: "",
    });
  };

  const submitReview = async (e) => {
    e.preventDefault();

    if (!reviewForm.comment.trim()) {
      alert("Please enter review comment");
      return;
    }

    try {
      await api.post("/review", {
        doctorId: reviewForm.doctorId,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });

      alert("Review submitted successfully");
      closeReviewForm();
    } catch (error) {
      console.error("Review error:", error);
      alert(error.response?.data?.message || "Failed to submit review");
    }
  };

  const stats = useMemo(
    () => ({
      total: appointments.length,
      booked: appointments.filter((a) => a.status === "BOOKED").length,
      completed: appointments.filter((a) => a.status === "COMPLETED").length,
      cancelled: appointments.filter((a) => a.status === "CANCELLED").length,
    }),
    [appointments]
  );

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesStatus =
      statusFilter === "ALL" || appointment.status === statusFilter;

    const text = `${appointment.doctor?.doctorName || ""} ${
      appointment.doctor?.specialization || ""
    } ${appointment.patientName || ""} ${
      appointment.doctor?.hospital?.hospitalName || ""
    }`
      .toLowerCase()
      .trim();

    const matchesSearch = text.includes(search.toLowerCase().trim());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6 py-8">
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-7">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                <CalendarCheck size={17} />
                APPOINTMENT CENTER
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                My Appointments
              </h1>

              <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
                Track consultations, join video calls, chat with doctors,
                manage cancellations and submit reviews.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MiniStat title="Total" value={stats.total} icon={Activity} />
              <MiniStat title="Booked" value={stats.booked} icon={CalendarCheck} />
              <MiniStat title="Done" value={stats.completed} icon={ShieldCheck} />
              <MiniStat title="Cancel" value={stats.cancelled} icon={CalendarX} />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 mb-7">
          <div className="grid lg:grid-cols-[1fr_260px] gap-4">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
              <Search className="text-cyan-600" size={20} />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctor, patient, hospital..."
                className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
              <Filter className="text-cyan-600" size={20} />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-800 font-semibold"
              >
                <option value="ALL">All Appointments</option>
                <option value="BOOKED">Booked</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </section>

        {loading ? (
          <EmptyCard text="Loading appointments..." />
        ) : appointments.length === 0 ? (
          <EmptyAppointments />
        ) : filteredAppointments.length === 0 ? (
          <EmptyCard text="No appointments match your search or filter." />
        ) : (
          <div className="space-y-5">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                reviewForm={reviewForm}
                openReviewForm={openReviewForm}
                closeReviewForm={closeReviewForm}
                submitReview={submitReview}
                setReviewForm={setReviewForm}
                cancelAppointment={cancelAppointment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AppointmentCard({
  appointment,
  reviewForm,
  openReviewForm,
  closeReviewForm,
  submitReview,
  setReviewForm,
  cancelAppointment,
}) {
  const doctorImage =
    appointment.doctor?.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      appointment.doctor?.doctorName || "Doctor"
    )}&background=0891b2&color=fff&bold=true`;

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition overflow-hidden">
      <div className="p-6">
        <div className="grid xl:grid-cols-[1fr_260px] gap-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex gap-4 min-w-0 flex-1">
              <div className="relative shrink-0">
                <img
                  src={doctorImage}
                  alt={appointment.doctor?.doctorName || "Doctor"}
                  className="w-24 h-24 rounded-3xl object-cover border border-slate-100 shadow-sm"
                />

                <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-white">
                  <BadgeCheck size={17} className="text-white" />
                </div>
              </div>

              <div className="min-w-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs mb-3">
                  <ShieldCheck size={14} />
                  Verified Doctor
                </div>

                <h3 className="text-2xl font-black text-slate-950 truncate">
                  {appointment.doctor?.doctorName || "Doctor"}
                </h3>

                <p className="text-cyan-700 font-black mt-1">
                  {appointment.doctor?.specialization || "Specialization"}
                </p>

                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  <InfoLine
                    icon={Building2}
                    text={
                      appointment.doctor?.hospital?.hospitalName ||
                      "Hospital Not Available"
                    }
                  />

                  <InfoLine
                    icon={UserRound}
                    text={appointment.patientName || "Patient"}
                  />

                  <InfoLine
                    icon={Phone}
                    text={appointment.patientPhone || "Phone Not Available"}
                  />

                  <InfoLine
                    icon={Clock}
                    text={`${appointment.slot?.date || "-"} | ${
                      appointment.slot?.startTime || ""
                    } - ${appointment.slot?.endTime || ""}`}
                  />
                </div>
              </div>
            </div>
          </div>

          <StatusCard status={appointment.status} />
        </div>
      </div>

      {appointment.status === "CANCELLED" && (
        <div className="mx-6 mb-5 text-sm text-red-600 font-semibold bg-red-50 border border-red-100 rounded-2xl p-3">
          Slot released and available again.
        </div>
      )}

      <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-4">
        <div className="flex flex-wrap items-center gap-3">
          {appointment.status !== "CANCELLED" && (
            <Link
              to={`/chat/${appointment.id}`}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-white font-black hover:bg-cyan-700 transition"
            >
              <MessageSquare size={18} />
              {appointment.status === "COMPLETED"
                ? "View Conversation"
                : "Chat with Doctor"}
            </Link>
          )}

          {appointment.status === "BOOKED" && appointment.videoRoomId && (
            <Link
              to={`/video-call/${appointment.id}`}
              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-5 py-3 text-white font-black hover:bg-cyan-700 transition"
            >
              <Video size={18} />
              Join Video Call
            </Link>
          )}

          {appointment.status === "BOOKED" && (
            <button
              onClick={() => cancelAppointment(appointment.id)}
              className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-white font-black hover:bg-red-700 transition"
            >
              <XCircle size={18} />
              Cancel Appointment
            </button>
          )}

          {appointment.status === "COMPLETED" && (
            <button
              onClick={() => openReviewForm(appointment)}
              className="inline-flex items-center gap-2 rounded-2xl bg-yellow-500 px-5 py-3 text-white font-black hover:bg-yellow-600 transition"
            >
              <Star size={18} />
              Leave Review
            </button>
          )}

          {appointment.status === "CANCELLED" && appointment.doctor?.id && (
            <Link
              to={`/doctor/${appointment.doctor.id}`}
              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-5 py-3 text-white font-black hover:bg-cyan-700 transition"
            >
              <RefreshCcw size={18} />
              Book Again
            </Link>
          )}

          {appointment.doctor?.id && (
            <Link
              to={`/doctor/${appointment.doctor.id}`}
              className="inline-flex items-center gap-2 rounded-2xl border border-cyan-600 px-5 py-3 text-cyan-700 font-black hover:bg-cyan-50 transition"
            >
              View Doctor
              <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </div>

      {reviewForm.appointmentId === appointment.id && (
        <form
          onSubmit={submitReview}
          className="border-t border-slate-100 bg-white p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-yellow-50 flex items-center justify-center">
              <MessageSquare className="text-yellow-600" size={22} />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-950">
                Write a Review
              </h3>

              <p className="text-sm text-slate-500">
                Share your consultation experience.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-[220px_1fr] gap-4">
            <select
              value={reviewForm.rating}
              onChange={(e) =>
                setReviewForm({
                  ...reviewForm,
                  rating: e.target.value,
                })
              }
              className="border border-slate-200 bg-slate-50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-cyan-500 font-bold"
            >
              <option value={5}>⭐⭐⭐⭐⭐ 5</option>
              <option value={4}>⭐⭐⭐⭐ 4</option>
              <option value={3}>⭐⭐⭐ 3</option>
              <option value={2}>⭐⭐ 2</option>
              <option value={1}>⭐ 1</option>
            </select>

            <input
              value={reviewForm.comment}
              onChange={(e) =>
                setReviewForm({
                  ...reviewForm,
                  comment: e.target.value,
                })
              }
              placeholder="Write your feedback"
              className="border border-slate-200 bg-slate-50 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              type="submit"
              className="flex items-center gap-2 bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-cyan-700"
            >
              <Send size={18} />
              Submit Review
            </button>

            <button
              type="button"
              onClick={closeReviewForm}
              className="border border-slate-300 px-5 py-3 rounded-2xl font-black hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function EmptyAppointments() {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto mb-4">
        <CalendarCheck className="text-cyan-600" size={32} />
      </div>

      <h3 className="text-2xl font-black text-slate-950">
        No appointments found
      </h3>

      <p className="text-slate-500 mt-2">
        Your booked appointments will appear here.
      </p>

      <Link
        to="/doctors"
        className="inline-flex items-center gap-2 mt-6 bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-cyan-700"
      >
        <Stethoscope size={18} />
        Find Doctors
      </Link>
    </div>
  );
}

function EmptyCard({ text }) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10 text-center text-slate-500 font-semibold">
      {text}
    </div>
  );
}

function MiniStat({ title, value, icon: Icon }) {
  return (
    <div className="min-w-[95px] bg-slate-50 rounded-2xl border border-slate-100 p-3">
      <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center mb-2">
        <Icon className="text-cyan-600" size={18} />
      </div>

      <p className="text-xl font-black text-slate-950">{value}</p>
      <p className="text-xs text-slate-500 font-bold">{title}</p>
    </div>
  );
}

function InfoLine({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-2xl px-3 py-2 border border-slate-100 min-w-0">
      <Icon className="text-cyan-600 shrink-0" size={16} />
      <span className="truncate">{text || "-"}</span>
    </div>
  );
}

function StatusCard({ status }) {
  const config =
    status === "BOOKED"
      ? {
          icon: CalendarCheck,
          title: "Booked",
          subtitle: "Consultation confirmed",
          wrap: "bg-emerald-50 border-emerald-100",
          iconBg: "bg-emerald-600",
          text: "text-emerald-700",
        }
      : status === "COMPLETED"
      ? {
          icon: ShieldCheck,
          title: "Completed",
          subtitle: "Consultation completed",
          wrap: "bg-cyan-50 border-cyan-100",
          iconBg: "bg-cyan-600",
          text: "text-cyan-700",
        }
      : {
          icon: CalendarX,
          title: "Cancelled",
          subtitle: "Appointment cancelled",
          wrap: "bg-red-50 border-red-100",
          iconBg: "bg-red-600",
          text: "text-red-700",
        };

  const Icon = config.icon;

  return (
    <div className={`rounded-2xl border ${config.wrap} p-4 h-full`}>
      <div className="flex items-center gap-3">
        <div
          className={`w-11 h-11 rounded-xl ${config.iconBg} flex items-center justify-center`}
        >
          <Icon className="text-white" size={21} />
        </div>

        <div>
          <p className={`font-black ${config.text}`}>{config.title}</p>
          <p className="text-xs text-slate-500 font-semibold">
            {config.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}