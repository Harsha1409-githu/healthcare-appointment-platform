import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500">
              Platform overview and management
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Hospitals</p>
            <h2 className="text-3xl font-bold mt-2">
              {stats?.hospitals || 0}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Doctors</p>
            <h2 className="text-3xl font-bold mt-2">
              {stats?.doctors || 0}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Patients</p>
            <h2 className="text-3xl font-bold mt-2">
              {stats?.patients || 0}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">Appointments</p>
            <h2 className="text-3xl font-bold mt-2">
              {stats?.appointments || 0}
            </h2>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-5">
          <Link
            to="/admin/hospitals"
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg"
          >
            <h2 className="text-xl font-bold">Manage Hospitals</h2>
            <p className="text-gray-500 mt-2">
              Approve or reject registered hospitals.
            </p>
          </Link>
        </div>

        <Link
  to="/admin/doctors"
  className="bg-white p-6 rounded-2xl shadow hover:shadow-lg"
>
  <h2 className="text-xl font-bold">
    Manage Doctors
  </h2>

  <p className="text-gray-500 mt-2">
    Activate or deactivate doctors.
  </p>
</Link>
      </div>
    </div>
  );
}