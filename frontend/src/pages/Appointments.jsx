import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Clock,
  Phone,
  Stethoscope,
  UserRound,
  XCircle,
  Star,
  Send,
  MessageSquare,
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
      .then((res) => {
        setAppointments(res.data || []);
      })
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
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) return;

    try {
      await api.patch(`/appointment/${id}/cancel`);

      setAppointments((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: "CANCELLED" }
            : item
        )
      );
    } catch (error) {
      console.error("Cancel error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to cancel appointment"
      );
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
      alert(
        error.response?.data?.message ||
          "Failed to submit review"
      );
    }
  };

  const statusStyle = (status) => {
    if (status === "BOOKED") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (status === "CANCELLED") {
      return "bg-red-100 text-red-700";
    }

    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/40 to-white py-10">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      <div className="absolute top-40 right-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-8 md:p-10 text-white shadow-2xl mb-8">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur mb-5">
              <CalendarCheck size={18} className="text-cyan-300" />
              <span className="text-sm font-semibold">
                Patient Appointment Center
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              My Appointments
            </h1>

            <p className="text-blue-100 mt-3 max-w-2xl">
              View your bookings, cancel upcoming appointments and leave
              reviews after completed consultations.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-[2rem] shadow-xl p-10 text-center text-slate-500">
            Loading appointments...
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-[2rem] shadow-xl p-12 text-center">
            <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
              <CalendarCheck className="text-blue-600" size={36} />
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              No appointments found
            </h3>

            <p className="text-slate-500 mt-2">
              Your booked appointments will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="group relative">
                <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-40 blur transition duration-500" />

                <div className="relative bg-white rounded-[2rem] shadow-xl border border-white overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="grid md:grid-cols-3 gap-6 flex-1">
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
  sub={appointment.doctor?.specialization || "Specialization"}
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

                      <div className="flex flex-col items-start lg:items-end gap-3">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-bold ${statusStyle(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>

                        {appointment.status === "CANCELLED" && (
                          <p className="text-sm text-red-500 max-w-[220px] lg:text-right">
                            Slot released and available again.
                          </p>
                        )}

                       <div className="flex flex-wrap gap-3">

  {appointment.status === "BOOKED" &&
    appointment.videoRoomId && (
      <a
        href={`/video-call/${appointment.id}`}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition"
      >
        📹 Join Video Call
      </a>
    )}

  {appointment.status === "BOOKED" && (
    <button
      onClick={() =>
        cancelAppointment(appointment.id)
      }
      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-700 transition"
    >
      <XCircle size={18} />
      Cancel
    </button>
  )}

</div>

                        {appointment.status === "COMPLETED" && (
                          <button
                            onClick={() =>
                              openReviewForm(appointment)
                            }
                            className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-yellow-600 transition"
                          >
                            <Star size={18} />
                            Leave Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {reviewForm.appointmentId === appointment.id && (
                    <form
                      onSubmit={submitReview}
                      className="border-t bg-slate-50 p-6"
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                          <MessageSquare
                            className="text-white"
                            size={22}
                          />
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

                      <div className="grid md:grid-cols-2 gap-4">
                        <select
                          value={reviewForm.rating}
                          onChange={(e) =>
                            setReviewForm({
                              ...reviewForm,
                              rating: e.target.value,
                            })
                          }
                          className="border border-slate-200 bg-white rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
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

                      <div className="flex gap-3 mt-5">
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
                          className="border border-slate-300 px-5 py-3 rounded-2xl font-bold hover:bg-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoBlock({ icon: Icon, image, title, main, sub, extra }) {
  return (
    <div className="flex gap-3">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 overflow-hidden">
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

      <div>
        <p className="text-xs font-bold text-slate-400 uppercase">
          {title}
        </p>

        <p className="font-black text-slate-900">
          {main || "-"}
        </p>

        {sub && (
          <p className="text-sm text-slate-500">
            {sub}
          </p>
        )}

        {extra && (
          <p className="text-xs text-slate-400 mt-1">
            {extra}
          </p>
        )}
      </div>
    </div>
  );
}