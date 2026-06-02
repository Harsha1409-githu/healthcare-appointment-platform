import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function DoctorProfile() {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDoctorProfile = async () => {
      try {
        const doctorRes = await api.get(`/doctor/${id}`);
        setDoctor(doctorRes.data);

        try {
          const slotRes = await api.get(
            `/slot/doctor/${id}/available`
          );
          setSlots(slotRes.data || []);
        } catch (slotErr) {
          console.error("Slot API error:", slotErr);
          setSlots([]);
        }

        try {
          const reviewRes = await api.get(
            `/review/doctor/${id}`
          );
          setReviews(reviewRes.data || []);
        } catch (reviewErr) {
          console.error("Review API error:", reviewErr);
          setReviews([]);
        }

        try {
          const summaryRes = await api.get(
            `/review/doctor/${id}/summary`
          );
          setRatingSummary(
            summaryRes.data || {
              averageRating: 0,
              totalReviews: 0,
            }
          );
        } catch (summaryErr) {
          console.error("Summary API error:", summaryErr);
          setRatingSummary({
            averageRating: 0,
            totalReviews: 0,
          });
        }
      } catch (doctorErr) {
        console.error("Doctor API error:", doctorErr);
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    loadDoctorProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading doctor profile...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="p-10 text-center text-red-500">
        Doctor not found
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-6">
          <img
            src={`https://ui-avatars.com/api/?name=${doctor.doctorName}&background=2563eb&color=fff&size=200`}
            alt={doctor.doctorName}
            className="w-32 h-32 rounded-full border"
          />

          <div className="flex-1">
            <h1 className="text-3xl font-bold">
              {doctor.doctorName}
            </h1>

            <p className="text-blue-600 text-lg mt-1">
              {doctor.specialization}
            </p>

            <p className="text-gray-600 mt-2">
              🎓 {doctor.qualification}
            </p>

            <p className="text-gray-600">
              🧑‍⚕️ {doctor.experience} years experience
            </p>

            <p className="text-gray-600">
              🏥 {doctor.hospital?.hospitalName}
            </p>

            <p className="text-gray-600">
              📍 {doctor.city}, {doctor.state}
            </p>

            <p className="text-green-600 font-bold text-xl mt-3">
              ₹{doctor.consultationFee}
            </p>

            <div className="bg-yellow-50 rounded-xl p-4 mt-6">
              <h3 className="font-bold text-lg">
                Patient Ratings
              </h3>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl">⭐</span>

                <span className="text-xl font-bold">
                  {ratingSummary.averageRating}
                </span>

                <span className="text-gray-500">
                  ({ratingSummary.totalReviews} Reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">
            Available Slots
          </h2>

          {slots.length === 0 ? (
            <p className="text-gray-500">
              No slots available
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="border rounded-lg p-4"
                >
                  <p className="font-medium">
                    ⏰ {slot.date} | {slot.startTime} -{" "}
                    {slot.endTime}
                  </p>

                  <Link to={`/book/${doctor.id}/${slot.id}`}>
                    <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                      Book Appointment
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">
            Patient Reviews
          </h2>

          {reviews.length === 0 ? (
            <p className="text-gray-500">
              No reviews yet.
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-500">
                      {"⭐".repeat(review.rating)}
                    </span>

                    <span className="text-sm text-gray-500">
                      {review.rating}/5
                    </span>
                  </div>

                  <p className="text-gray-700">
                    {review.comment}
                  </p>

                  <p className="text-sm text-gray-400 mt-2">
                    {review.patient?.fullName || "Anonymous"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}