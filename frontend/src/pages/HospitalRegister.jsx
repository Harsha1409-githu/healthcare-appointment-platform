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
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
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

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const registerHospital = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await api.post("/hospital/register", form);

      alert("Hospital registered successfully. Please wait for admin approval.");

      navigate("/hospital/login");
    } catch (error) {
      alert(error.response?.data?.message || "Hospital registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f8fb] px-4 pt-6 pb-10">
      <div className="max-w-md mx-auto">
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
          <div className="text-center">
            <div className="w-18 h-18 mx-auto rounded-3xl bg-cyan-50 flex items-center justify-center mb-4">
              <Building2 size={36} className="text-cyan-600" />
            </div>

            <div className="inline-flex items-center gap-1.5 text-cyan-700 font-black text-xs">
              <ShieldCheck size={14} />
              HOSPITAL ONBOARDING
            </div>

            <h1 className="text-2xl font-black text-slate-950 mt-2">
              Register Hospital
            </h1>

            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              Submit your hospital details for admin approval.
            </p>
          </div>

          <form onSubmit={registerHospital} className="space-y-4 mt-6">
            <Input
              icon={Building2}
              name="hospitalName"
              value={form.hospitalName}
              onChange={handleChange}
              placeholder="Hospital Name"
            />

            <Input
              icon={Mail}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Hospital Email"
            />

            <PasswordInput
              value={form.password}
              onChange={handleChange}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />

            <Input
              icon={Phone}
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Mobile Number"
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                icon={MapPin}
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
              />

              <Input
                icon={MapPin}
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
              />
            </div>

            <Input
              icon={FileText}
              name="licenseNumber"
              value={form.licenseNumber}
              onChange={handleChange}
              placeholder="License Number"
            />

            <label>
              <div className="flex gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-cyan-500">
                <MapPin size={18} className="text-cyan-600 shrink-0 mt-0.5" />

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows="3"
                  required
                  placeholder="Full Hospital Address"
                  className="w-full bg-transparent outline-none resize-none text-sm text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </label>

            <button
              disabled={loading}
              type="submit"
              className="w-full h-14 rounded-2xl bg-cyan-600 text-white font-black flex items-center justify-center gap-2 disabled:bg-slate-400 active:scale-95 transition"
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus size={19} />
                  Register Hospital
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 bg-cyan-50 border border-cyan-100 rounded-2xl p-3 flex gap-3">
            <ShieldCheck size={19} className="text-cyan-600 shrink-0 mt-0.5" />

            <div>
              <p className="font-black text-slate-900 text-sm">
                Admin Approval Required
              </p>

              <p className="text-xs text-slate-500 mt-0.5">
                Hospital dashboard access starts after approval.
              </p>
            </div>
          </div>

          <div className="text-center mt-5">
            <p className="text-sm text-slate-500">
              Already registered?
            </p>

            <Link
              to="/hospital/login"
              className="text-cyan-600 font-black text-sm"
            >
              Login here
            </Link>
          </div>

          <div className="text-center mt-4">
            <Link to="/" className="text-cyan-600 font-black text-sm">
              ← Back to Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function Input({
  icon: Icon,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}) {
  return (
    <div className="relative">
      <Icon
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-600"
      />

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none text-sm text-slate-800 placeholder:text-slate-400"
      />
    </div>
  );
}

function PasswordInput({
  value,
  onChange,
  showPassword,
  setShowPassword,
}) {
  return (
    <div className="relative">
      <Lock
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-600"
      />

      <input
        name="password"
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        required
        placeholder="Create Password"
        className="w-full h-14 pl-12 pr-12 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none text-sm text-slate-800 placeholder:text-slate-400"
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
      >
        {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
      </button>
    </div>
  );
}