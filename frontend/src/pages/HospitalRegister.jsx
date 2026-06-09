import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Lock,
  UserPlus,
} from "lucide-react";
import api from "../api/axios";

export default function HospitalRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    hospitalName: "",
    email: "",
    password: "",
    mobile: "",
    city: "",
    state: "",
    address: "",
    licenseNumber: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const registerHospital = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/hospital/register", form);

      alert(
        "Hospital registered successfully. Please wait for admin approval."
      );

      navigate("/hospital/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Hospital registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/40 to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl border border-white overflow-hidden">
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-8 text-white">
          <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mb-5">
            <Building2 size={34} className="text-cyan-300" />
          </div>

          <h1 className="text-4xl font-black">
            Hospital Registration
          </h1>

          <p className="text-blue-100 mt-2">
            Register your hospital. Admin approval is required before login.
          </p>
        </div>

        <form onSubmit={registerHospital} className="p-8">
          <div className="grid md:grid-cols-2 gap-5">
            <Input
              icon={Building2}
              label="Hospital Name"
              name="hospitalName"
              value={form.hospitalName}
              onChange={handleChange}
            />

            <Input
              icon={Mail}
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />

            <Input
              icon={Lock}
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />

            <Input
              icon={Phone}
              label="Mobile"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
            />

            <Input
              icon={MapPin}
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
            />

            <Input
              icon={MapPin}
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
            />

            <Input
              icon={FileText}
              label="License Number"
              name="licenseNumber"
              value={form.licenseNumber}
              onChange={handleChange}
            />

            <div className="md:col-span-2">
              <label>
                <p className="text-sm font-bold text-slate-600 mb-2">
                  Address
                </p>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows="3"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          <button
            disabled={loading}
            className="mt-7 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-2xl font-black hover:scale-[1.01] transition disabled:bg-slate-400"
          >
            <UserPlus size={19} />
            {loading ? "Registering..." : "Register Hospital"}
          </button>

          <p className="text-center text-slate-500 mt-5">
            Already registered?{" "}
            <Link
              to="/hospital/login"
              className="text-blue-600 font-bold"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Input({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  type = "text",
}) {
  return (
    <label>
      <p className="text-sm font-bold text-slate-600 mb-2">
        {label}
      </p>

      <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
        <Icon size={19} className="text-blue-600" />

        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required
          className="w-full bg-transparent outline-none text-slate-800"
        />
      </div>
    </label>
  );
}