import { useEffect, useState } from "react";
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
} from "lucide-react";
import api from "../api/axios";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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

      setReviewForm({
        appointmentId: null,
        doctorId: "",
        rating: 5,
        comment: "",
      });
    } catch (error) {
      console.error("Review error:", error);
      alert(error.response?.data?.message || "Failed to submit review");
    }
  };

  const stats = {
    total: appointments.length,
    booked: appointments.filter((a) => a.status === "BOOKED").length,
    completed: appointments.filter((a) => a.status === "COMPLETED").length,
    cancelled: appointments.filter((a) => a.status === "CANCELLED").length,
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-7xl mx-auto px-5">
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 font-black text-sm mb-3">
                <CalendarCheck size={16} />
                Appointment Center
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-slate-950">
                My Appointments
              </h1>

              <p className="text-slate-500 mt-2 max-w-2xl">
                Manage your consultations, chats, video calls, cancellations and
                reviews in one simple view.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <MiniStat title="Total" value={stats.total} icon={Activity} />
              <MiniStat title="Booked" value={stats.booked} icon={CalendarCheck} />
              <MiniStat title="Done" value={stats.completed} icon={ShieldCheck} />
              <MiniStat title="Cancel" value={stats.cancelled} icon={CalendarX} />
            </div>
          </div>
        </section>

        {loading ? (
          <EmptyCard text="Loading appointments..." />
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <CalendarCheck className="text-blue-600" size={32} />
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              No appointments found
            </h3>

            <p className="text-slate-500 mt-2">
              Your booked appointments will appear here.
            </p>

            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 mt-6 bg-blue-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-blue-700"
            >
              <Stethoscope size={18} />
              Find Doctors
            </Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-5">
                  <div className="grid xl:grid-cols-[1fr_260px] gap-5">
                    <div className="grid md:grid-cols-3 gap-4">
                      <InfoBlock
                        icon={Stethoscope}
                        image={
                          appointment.doctor?.profileImage ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            appointment.doctor?.doctorName || "Doctor"
                          )}&background=0f172a&color=fff&bold=true`
                        }
                        title="Doctor"
                        main={appointment.doctor?.doctorName || "Doctor"}
                        sub={
                          appointment.doctor?.specialization ||
                          "Specialization"
                        }
                        extra={appointment.doctor?.hospital?.hospitalName}
                      />

                      <InfoBlock
                        icon={UserRound}
                        title="Patient"
                        main={appointment.patientName}
                        sub={appointment.patientPhone}
                      />

                      <InfoBlock
                        icon={Clock}
                        title="Schedule"
                        main={appointment.slot?.date}
                        sub={`${appointment.slot?.startTime || ""} - ${
                          appointment.slot?.endTime || ""
                        }`}
                        extra={`Appointment #${appointment.id}`}
                      />
                    </div>

                    <StatusCard status={appointment.status} />
                  </div>
                </div>

                {appointment.status === "CANCELLED" && (
                  <div className="mx-5 mb-4 text-sm text-red-600 font-semibold bg-red-50 border border-red-100 rounded-2xl p-3">
                    Slot released and available again.
                  </div>
                )}

                <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    {appointment.status !== "CANCELLED" && (
                      <Link
                        to={`/chat/${appointment.id}`}
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-white font-black hover:bg-blue-700 transition"
                      >
                        <MessageSquare size={18} />
                        {appointment.status === "COMPLETED"
                          ? "View Conversation"
                          : "Chat with Doctor"}
                      </Link>
                    )}

                    {appointment.status === "BOOKED" &&
                      appointment.videoRoomId && (
                        <Link
                          to={`/video-call/${appointment.id}`}
                          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-white font-black hover:bg-blue-700 transition"
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

                    {appointment.status === "CANCELLED" && (
                      <Link
                        to={`/doctor/${appointment.doctor?.id}`}
                        className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-5 py-3 text-white font-black hover:bg-purple-700 transition"
                      >
                        <RefreshCcw size={18} />
                        Book Again
                      </Link>
                    )}
                  </div>
                </div>

                {reviewForm.appointmentId === appointment.id && (
                  <form
                    onSubmit={submitReview}
                    className="border-t border-slate-100 bg-white p-5"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-yellow-500 flex items-center justify-center">
                        <MessageSquare className="text-white" size={22} />
                      </div>

                      <div>
                        <h3 className="text-xl font-black text-slate-900">
                          Write a Review
                        </h3>

                        <p className="text-sm text-slate-500">
                          Share your consultation experience.
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-[200px_1fr] gap-4">
                      <select
                        value={reviewForm.rating}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            rating: e.target.value,
                          })
                        }
                        className="border border-slate-200 bg-white rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
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
                        className="border border-slate-200 bg-white rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4">
                      <button
                        type="submit"
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold hover:bg-blue-700"
                      >
                        <Send size={18} />
                        Submit Review
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setReviewForm({
                            appointmentId: null,
                            doctorId: "",
                            rating: 5,
                            comment: "",
                          })
                        }
                        className="border border-slate-300 px-5 py-3 rounded-2xl font-bold hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyCard({ text }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center text-slate-500">
      {text}
    </div>
  );
}

function MiniStat({ title, value, icon: Icon }) {
  return (
    <div className="min-w-[90px] bg-slate-50 rounded-2xl border border-slate-100 p-3">
      <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center mb-2">
        <Icon className="text-blue-600" size={18} />
      </div>
      <p className="text-xl font-black text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 font-bold">{title}</p>
    </div>
  );
}

function InfoBlock({ icon: Icon, image, title, main, sub, extra }) {
  return (
    <div className="flex gap-3 bg-slate-50 rounded-2xl border border-slate-100 p-4">
      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
        {image ? (
          <img
            src={image}
            alt={main || title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon className="text-blue-600" size={23} />
        )}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold text-slate-400 uppercase">
          {title}
        </p>
        <p className="font-black text-slate-900 truncate">{main || "-"}</p>
        {sub && <p className="text-sm text-slate-500 truncate">{sub}</p>}
        {extra && <p className="text-xs text-slate-400 mt-1 truncate">{extra}</p>}
      </div>
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
          wrap: "bg-emerald-50 border-emerald-200",
          iconBg: "bg-emerald-600",
          text: "text-emerald-700",
        }
      : status === "COMPLETED"
      ? {
          icon: ShieldCheck,
          title: "Completed",
          subtitle: "Consultation completed",
          wrap: "bg-blue-50 border-blue-200",
          iconBg: "bg-blue-600",
          text: "text-blue-700",
        }
      : {
          icon: CalendarX,
          title: "Cancelled",
          subtitle: "Appointment cancelled",
          wrap: "bg-red-50 border-red-200",
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