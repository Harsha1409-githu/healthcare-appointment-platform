import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function HospitalDashboard() {
  const [stats, setStats] = useState({
    doctors: 0,
    appointments: 0,
    completed: 0,
    cancelled: 0,
    reviews: 0,
    avgRating: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [doctorRes, appointmentRes] =
        await Promise.all([
          api.get("/doctor"),
          api.get("/appointment"),
        ]);

      const doctors = doctorRes.data || [];
      const appointments = appointmentRes.data || [];

      const completed = appointments.filter(
        (a) => a.status === "COMPLETED"
      ).length;

      const cancelled = appointments.filter(
        (a) => a.status === "CANCELLED"
      ).length;

      let totalReviews = 0;
      let totalRating = 0;

      for (const doctor of doctors) {
        try {
          const summary = await api.get(
            `/review/doctor/${doctor.id}/summary`
          );

          totalReviews +=
            summary.data.totalReviews || 0;

          totalRating +=
            (summary.data.averageRating || 0) *
            (summary.data.totalReviews || 0);
        } catch (err) {
          console.log(err);
        }
      }

      const avgRating =
        totalReviews === 0
          ? 0
          : (totalRating / totalReviews).toFixed(1);

      setStats({
        doctors: doctors.length,
        appointments: appointments.length,
        completed,
        cancelled,
        reviews: totalReviews,
        avgRating,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">
          Hospital Dashboard
        </h1>

        <p className="text-gray-500 mb-8">
          Manage doctors, availability,
          appointments and reviews.
        </p>

        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">
              Doctors
            </p>
            <h2 className="text-3xl font-bold mt-2">
              {stats.doctors}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">
              Appointments
            </p>
            <h2 className="text-3xl font-bold mt-2 text-blue-600">
              {stats.appointments}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">
              Completed
            </p>
            <h2 className="text-3xl font-bold mt-2 text-green-600">
              {stats.completed}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">
              Cancelled
            </p>
            <h2 className="text-3xl font-bold mt-2 text-red-600">
              {stats.cancelled}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">
              Reviews
            </p>
            <h2 className="text-3xl font-bold mt-2 text-purple-600">
              {stats.reviews}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">
              Avg Rating
            </p>
            <h2 className="text-3xl font-bold mt-2 text-yellow-500">
              ⭐ {stats.avgRating}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">
            Appointment Overview
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm mb-1">
                Completed
              </p>

              <div className="bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{
                    width: `${
                      stats.appointments
                        ? (stats.completed /
                            stats.appointments) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <p className="text-sm mb-1">
                Cancelled
              </p>

              <div className="bg-gray-200 rounded-full h-4">
                <div
                  className="bg-red-500 h-4 rounded-full"
                  style={{
                    width: `${
                      stats.appointments
                        ? (stats.cancelled /
                            stats.appointments) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/hospital/doctors"
            className="bg-white rounded-2xl shadow p-6 hover:shadow-lg"
          >
            <h2 className="text-xl font-bold mb-2">
              Manage Doctors
            </h2>

            <p className="text-gray-500">
              Add, deactivate and manage doctors.
            </p>
          </Link>

          <Link
            to="/hospital/availability"
            className="bg-white rounded-2xl shadow p-6 hover:shadow-lg"
          >
            <h2 className="text-xl font-bold mb-2">
              Manage Availability
            </h2>

            <p className="text-gray-500">
              Configure working schedules.
            </p>
          </Link>

          <Link
            to="/hospital/appointments"
            className="bg-white rounded-2xl shadow p-6 hover:shadow-lg"
          >
            <h2 className="text-xl font-bold mb-2">
              Appointments
            </h2>

            <p className="text-gray-500">
              Monitor and complete bookings.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}