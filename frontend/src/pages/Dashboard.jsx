import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/appointment/my")
      .then((res) => {
        setAppointments(res.data || []);
      })
      .catch((err) => {
        console.error("Dashboard API error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const total = appointments.length;

  const booked = appointments.filter(
    (item) => item.status === "BOOKED"
  ).length;

  const cancelled = appointments.filter(
    (item) => item.status === "CANCELLED"
  ).length;

  const completed = appointments.filter(
    (item) => item.status === "COMPLETED"
  ).length;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">
          Patient Dashboard
        </h1>

        <p className="text-gray-500 mb-8">
          Manage your appointments and bookings.
        </p>

        {loading ? (
          <p className="text-gray-500">Loading dashboard...</p>
        ) : (
          <>
            <div className="grid md:grid-cols-4 gap-5 mb-8">
              <div className="bg-white rounded-2xl shadow p-6">
                <p className="text-gray-500 text-sm">
                  Total Appointments
                </p>
                <h2 className="text-3xl font-bold mt-2">
                  {total}
                </h2>
              </div>

              <div className="bg-white rounded-2xl shadow p-6">
                <p className="text-gray-500 text-sm">
                  Upcoming
                </p>
                <h2 className="text-3xl font-bold text-green-600 mt-2">
                  {booked}
                </h2>
              </div>

              <div className="bg-white rounded-2xl shadow p-6">
                <p className="text-gray-500 text-sm">
                  Cancelled
                </p>
                <h2 className="text-3xl font-bold text-red-600 mt-2">
                  {cancelled}
                </h2>
              </div>

              <div className="bg-white rounded-2xl shadow p-6">
                <p className="text-gray-500 text-sm">
                  Completed
                </p>
                <h2 className="text-3xl font-bold text-blue-600 mt-2">
                  {completed}
                </h2>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold">
                  Recent Appointments
                </h2>

                <Link
                  to="/appointments"
                  className="text-blue-600 font-medium"
                >
                  View All
                </Link>
              </div>

              {appointments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    No appointments yet.
                  </p>

                  <Link
                    to="/doctors"
                    className="bg-blue-600 text-white px-5 py-3 rounded-lg"
                  >
                    Book Appointment
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {appointments.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                      <div>
                        <h3 className="font-bold">
                          {item.doctor?.doctorName}
                        </h3>

                        <p className="text-blue-600">
                          {item.doctor?.specialization}
                        </p>

                        <p className="text-gray-500 text-sm mt-1">
                          {item.slot?.date} |{" "}
                          {item.slot?.startTime} -{" "}
                          {item.slot?.endTime}
                        </p>
                      </div>

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium w-fit ${
                          item.status === "BOOKED"
                            ? "bg-green-100 text-green-700"
                            : item.status === "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}