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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const clearOtherSessions = () => {
    localStorage.removeItem("patientToken");
    localStorage.removeItem("patientUser");
    localStorage.removeItem("hospitalToken");
    localStorage.removeItem("hospitalUser");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/doctor/login", {
        email,
        password,
      });

      clearOtherSessions();

      localStorage.setItem("doctorToken", res.data.access_token);
      localStorage.setItem("doctorUser", JSON.stringify(res.data.user));

      window.dispatchEvent(new Event("doctorProfileUpdated"));

      navigate("/doctor/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f8fb] px-4 pt-6 pb-10 flex items-center">
      <div className="max-w-md mx-auto w-full">
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
          <div className="text-center">
            <div className="w-18 h-18 mx-auto rounded-3xl bg-cyan-50 flex items-center justify-center mb-4">
              <Stethoscope size={36} className="text-cyan-600" />
            </div>

            <div className="inline-flex items-center gap-1.5 text-cyan-700 font-black text-xs">
              <ShieldCheck size={14} />
              DOCTOR PORTAL
            </div>

            <h1 className="text-2xl font-black text-slate-950 mt-2">
              Doctor Login
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Manage appointments and consultations
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 mt-6">
            <InputField
              icon={Mail}
              type="email"
              placeholder="Doctor email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-14 pl-12 pr-12 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full h-14 rounded-2xl bg-cyan-600 text-white font-black flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95 transition"
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
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

          <div className="mt-4 bg-cyan-50 border border-cyan-100 rounded-2xl p-3 flex gap-3">
            <ShieldCheck size={19} className="text-cyan-600 shrink-0 mt-0.5" />

            <div>
              <p className="font-black text-slate-900 text-sm">
                Verified Doctors Only
              </p>

              <p className="text-xs text-slate-500 mt-0.5">
                Accounts are approved by hospital or admin.
              </p>
            </div>
          </div>

          <div className="text-center mt-5">
            <Link to="/" className="text-cyan-600 font-black text-sm">
              ← Back to Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function InputField({ icon: Icon, type, placeholder, value, onChange }) {
  return (
    <div className="relative">
      <Icon
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
      />
    </div>
  );
}