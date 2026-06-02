import { useEffect, useState } from "react";
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
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

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

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">
          My Appointments
        </h1>

        {loading ? (
          <p className="text-gray-500">
            Loading appointments...
          </p>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-500">
              No appointments found.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-2xl shadow p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">
                      {appointment.doctor?.doctorName}
                    </h2>

                    <p className="text-blue-600 font-medium">
                      {appointment.doctor?.specialization}
                    </p>

                    <p className="text-gray-600 mt-2">
                      Patient: {appointment.patientName}
                    </p>

                    <p className="text-gray-600">
                      Phone: {appointment.patientPhone}
                    </p>

                    {appointment.patient?.email && (
                      <p className="text-gray-500 text-sm mt-1">
                        Logged in as: {appointment.patient.email}
                      </p>
                    )}
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 min-w-[220px]">
                    <p className="text-sm text-gray-500">
                      Appointment Date
                    </p>

                    <p className="font-semibold">
                      {appointment.slot?.date}
                    </p>

                    <p className="text-sm text-gray-500 mt-2">
                      Time
                    </p>

                    <p className="font-semibold">
                      {appointment.slot?.startTime} -{" "}
                      {appointment.slot?.endTime}
                    </p>
                  </div>

                  <div className="flex flex-col items-start md:items-end">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        appointment.status === "BOOKED"
                          ? "bg-green-100 text-green-700"
                          : appointment.status === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {appointment.status}
                    </span>

                    {appointment.status === "CANCELLED" && (
                      <p className="mt-3 text-sm text-red-500 text-left md:text-right">
                        Slot released and available again
                      </p>
                    )}

                    {appointment.status === "BOOKED" && (
                      <button
                        onClick={() =>
                          cancelAppointment(appointment.id)
                        }
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                      >
                        Cancel Appointment
                      </button>
                    )}

                    {appointment.status === "COMPLETED" && (
                      <button
                        onClick={() =>
                          openReviewForm(appointment)
                        }
                        className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                      >
                        Leave Review
                      </button>
                    )}
                  </div>
                </div>

                {reviewForm.appointmentId === appointment.id && (
                  <form
                    onSubmit={submitReview}
                    className="mt-6 border-t pt-5"
                  >
                    <h3 className="font-bold mb-3">
                      Write a Review
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <select
                        value={reviewForm.rating}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            rating: e.target.value,
                          })
                        }
                        className="border rounded-lg p-3"
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
                        className="border rounded-lg p-3"
                      />
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                      >
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
                        className="border px-5 py-2 rounded-lg"
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