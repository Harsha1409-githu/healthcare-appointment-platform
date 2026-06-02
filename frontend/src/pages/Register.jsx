import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    gender: "",
    age: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const register = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post(
        "/auth/register",
        form
      );

      localStorage.setItem(
        "token",
        res.data.access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      navigate("/appointments");
      window.location.reload();
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={register}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg"
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h1>

        <div className="grid gap-4">

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile"
            value={form.mobile}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="border rounded-lg p-3"
          >
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="border rounded-lg p-3"
          />

          <button
            disabled={loading}
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            {loading
              ? "Creating Account..."
              : "Register"}
          </button>
        </div>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}