import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@medicare.com");
  const [password, setPassword] = useState("admin@123");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/admin/login", {
        email,
        password,
      });

      localStorage.setItem("adminToken", res.data.access_token);
      localStorage.setItem("adminUser", JSON.stringify(res.data.user));

      navigate("/admin/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Admin login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          Admin Login
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Manage hospitals, doctors and platform analytics
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            className="w-full border p-3 rounded-lg"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full border p-3 rounded-lg"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}