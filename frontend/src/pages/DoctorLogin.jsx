import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function DoctorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/doctor/login", {
        email,
        password,
      });

      localStorage.setItem(
        "doctorToken",
        res.data.access_token
      );

      localStorage.setItem(
        "doctorUser",
        JSON.stringify(res.data.user)
      );

      navigate("/doctor/dashboard");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          Doctor Login
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Sign in to access your dashboard
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Doctor Email"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-500 text-center">
          Doctor accounts are created by Hospital/Admin.
        </div>
      </div>
    </div>
  );
}