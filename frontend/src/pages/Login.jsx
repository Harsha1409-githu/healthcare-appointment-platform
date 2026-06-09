import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "admin@fortis.com",
    password: "admin@123",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/login", form);

    localStorage.removeItem("doctorToken");
localStorage.removeItem("doctorUser");
localStorage.removeItem("hospitalToken");
localStorage.removeItem("hospitalUser");
localStorage.removeItem("adminToken");
localStorage.removeItem("adminUser");

localStorage.setItem("patientToken", res.data.access_token);
localStorage.setItem("patientUser", JSON.stringify(res.data.user));

      navigate("/appointments");
      window.location.reload();
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={login}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center mb-2">
          Login
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Access your appointment dashboard
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Email
          </label>

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Password
          </label>

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}