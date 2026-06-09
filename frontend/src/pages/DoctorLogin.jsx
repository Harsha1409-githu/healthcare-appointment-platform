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

      localStorage.removeItem("patientToken");
      localStorage.removeItem("patientUser");
      localStorage.removeItem("hospitalToken");
      localStorage.removeItem("hospitalUser");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      localStorage.setItem(
        "doctorToken",
        res.data.access_token
      );

      localStorage.setItem(
        "doctorUser",
        JSON.stringify(res.data.user)
      );

      window.dispatchEvent(
        new Event("doctorProfileUpdated")
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/40 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8">
        <h1 className="text-3xl font-black text-center text-slate-900 mb-2">
          Doctor Login
        </h1>

        <p className="text-center text-slate-500 mb-6">
          Sign in to access your doctor dashboard
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Doctor Email"
            className="w-full border border-slate-200 bg-slate-50 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-slate-200 bg-slate-50 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-cyan-500 text-white p-4 rounded-2xl font-black hover:scale-[1.02] transition"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-sm text-slate-500 text-center">
          Doctor accounts are created by Hospital/Admin.
        </div>
      </div>
    </div>
  );
}