import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminHospitals() {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const res = await api.get("/admin/hospitals");
      setHospitals(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const approveHospital = async (id) => {
    try {
      await api.patch(`/admin/hospital/${id}/approve`);
      fetchHospitals();
    } catch (error) {
      alert(error.response?.data?.message || "Approve failed");
    }
  };

  const rejectHospital = async (id) => {
    try {
      await api.patch(`/admin/hospital/${id}/reject`);
      fetchHospitals();
    } catch (error) {
      alert(error.response?.data?.message || "Reject failed");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">
          Hospital Management
        </h1>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Hospital</th>
                <th className="p-4">Email</th>
                <th className="p-4">City</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {hospitals.map((hospital) => (
                <tr key={hospital.id} className="border-t">
                  <td className="p-4 font-semibold">
                    {hospital.hospitalName}
                  </td>

                  <td className="p-4">{hospital.email}</td>

                  <td className="p-4">{hospital.city}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        hospital.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : hospital.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {hospital.status}
                    </span>
                  </td>

                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => approveHospital(hospital.id)}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => rejectHospital(hospital.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-lg"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}

              {hospitals.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No hospitals found.
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