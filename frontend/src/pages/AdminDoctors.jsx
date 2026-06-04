import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/admin/doctors");
      setDoctors(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const activateDoctor = async (id) => {
    try {
      await api.patch(`/admin/doctor/${id}/activate`);
      fetchDoctors();
    } catch (error) {
      alert(error.response?.data?.message || "Activate failed");
    }
  };

  const deactivateDoctor = async (id) => {
    try {
      await api.patch(`/admin/doctor/${id}/deactivate`);
      fetchDoctors();
    } catch (error) {
      alert(error.response?.data?.message || "Deactivate failed");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">
          Doctor Management
        </h1>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Doctor</th>
                <th className="p-4">Specialization</th>
                <th className="p-4">Hospital</th>
                <th className="p-4">Email</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id} className="border-t">
                  <td className="p-4 font-semibold">
                    {doctor.doctorName}
                  </td>

                  <td className="p-4">
                    {doctor.specialization}
                  </td>

                  <td className="p-4">
                    {doctor.hospital?.hospitalName || "-"}
                  </td>

                  <td className="p-4">
                    {doctor.email}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        doctor.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {doctor.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>

                  <td className="p-4">
                    {doctor.isActive ? (
                      <button
                        onClick={() =>
                          deactivateDoctor(doctor.id)
                        }
                        className="bg-red-600 text-white px-3 py-2 rounded-lg"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          activateDoctor(doctor.id)
                        }
                        className="bg-green-600 text-white px-3 py-2 rounded-lg"
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {doctors.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-gray-500"
                  >
                    No doctors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}