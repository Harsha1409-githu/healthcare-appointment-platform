import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

export default function HospitalLogin() {
  const [email, setEmail] = useState("admin@apollo.com");
  const [password, setPassword] = useState("admin@123");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/hospital/login", {
        email,
        password,
      });

      localStorage.removeItem("patientToken");
localStorage.removeItem("patientUser");
localStorage.removeItem("doctorToken");
localStorage.removeItem("doctorUser");
localStorage.removeItem("adminToken");
localStorage.removeItem("adminUser");

localStorage.setItem("hospitalToken", res.data.access_token);
localStorage.setItem("hospitalUser", JSON.stringify(res.data.user));

      navigate("/hospital/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Hospital login failed");
    }
    
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          Hospital Portal
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Login to manage doctors, slots and appointments
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            className="w-full border p-3 rounded-lg"
            placeholder="Hospital Email"
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

          <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
  New hospital?{" "}
  <Link
    to="/hospital/register"
    className="text-blue-600 font-bold"
  >
    Register here
  </Link>
</p>
      </div>
    </div>
  );
}