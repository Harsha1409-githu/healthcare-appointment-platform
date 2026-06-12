import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Stethoscope,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Loader2,
} from "lucide-react";
import api from "../api/axios";

export default function DoctorLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post(
        "/doctor/login",
        {
          email,
          password,
        }
      );

      localStorage.removeItem(
        "patientToken"
      );
      localStorage.removeItem(
        "patientUser"
      );

      localStorage.removeItem(
        "hospitalToken"
      );
      localStorage.removeItem(
        "hospitalUser"
      );

      localStorage.removeItem(
        "adminToken"
      );
      localStorage.removeItem(
        "adminUser"
      );

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4fbff] flex items-center justify-center px-6 py-10">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100">

        {/* Left Side */}
        <div className="hidden lg:flex bg-gradient-to-br from-cyan-600 via-blue-600 to-slate-900 p-10 text-white flex-col justify-center">
          <div className="w-20 h-20 rounded-[2rem] bg-white/10 flex items-center justify-center mb-8">
            <Stethoscope size={42} />
          </div>

          <h1 className="text-5xl font-black leading-tight">
            Doctor
            <br />
            Portal
          </h1>

          <p className="text-cyan-100 mt-6 text-lg leading-relaxed">
            Manage appointments, prescriptions,
            consultations and patient records
            securely through the MediCare Doctor
            Dashboard.
          </p>

          <div className="mt-10 space-y-4">
            <Feature text="Manage Appointments" />
            <Feature text="Digital Prescriptions" />
            <Feature text="Patient Records" />
            <Feature text="Video Consultations" />
          </div>
        </div>

        {/* Right Side */}
        <div className="p-8 md:p-12 flex items-center">
          <div className="w-full">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-[2rem] bg-cyan-50 flex items-center justify-center mx-auto mb-5">
                <Stethoscope
                  size={38}
                  className="text-cyan-600"
                />
              </div>

              <h2 className="text-4xl font-black text-slate-950">
                Doctor Login
              </h2>

              <p className="text-slate-500 mt-3">
                Access your doctor workspace
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    placeholder="doctor@example.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                    className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    required
                    className="w-full h-14 pl-12 pr-12 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full h-14 rounded-2xl bg-cyan-600 text-white font-black hover:bg-cyan-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />
                    Signing In...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 bg-cyan-50 border border-cyan-100 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck
                  size={20}
                  className="text-cyan-600"
                />

                <div>
                  <p className="font-black text-slate-900 text-sm">
                    Verified Doctors Only
                  </p>

                  <p className="text-xs text-slate-500">
                    Accounts are created and approved
                    by Hospital or Admin.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <Link
                to="/"
                className="text-cyan-600 font-bold hover:text-cyan-700"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
        <ShieldCheck size={16} />
      </div>

      <span className="font-semibold">
        {text}
      </span>
    </div>
  );
}