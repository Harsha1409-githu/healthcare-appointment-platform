import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Building2,
  Stethoscope,
  BarChart3,
  UsersRound,
} from "lucide-react";
import api from "../api/axios";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const clearOtherUsers = () => {
    localStorage.removeItem("patientToken");
    localStorage.removeItem("patientUser");
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorUser");
    localStorage.removeItem("hospitalToken");
    localStorage.removeItem("hospitalUser");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter admin email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/admin/login", {
        email,
        password,
      });

      clearOtherUsers();

      localStorage.setItem("adminToken", res.data.access_token);
      localStorage.setItem("adminUser", JSON.stringify(res.data.user));

      navigate("/admin/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4fbff] flex items-center justify-center px-6 py-10">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100">
        <aside className="hidden lg:flex relative overflow-hidden bg-slate-950 text-white p-10 flex-col justify-center">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="w-20 h-20 rounded-[2rem] bg-white/10 border border-white/20 flex items-center justify-center mb-8">
              <ShieldCheck size={42} className="text-cyan-300" />
            </div>

            <h1 className="text-5xl font-black leading-tight">
              Admin
              <span className="block text-cyan-300">Control Center</span>
            </h1>

            <p className="text-cyan-100 mt-6 text-lg leading-relaxed">
              Manage hospitals, doctors, approvals, platform analytics and
              TryDoc operations from one secure workspace.
            </p>

            <div className="mt-10 space-y-4">
              <Feature icon={Building2} text="Approve and monitor hospitals" />
              <Feature icon={Stethoscope} text="Manage doctor profiles" />
              <Feature icon={UsersRound} text="Track patient platform growth" />
              <Feature icon={BarChart3} text="View revenue and analytics" />
            </div>

            <div className="mt-10 bg-white/10 border border-white/10 rounded-[2rem] p-5">
              <p className="text-sm text-cyan-100">
                Secure Access
              </p>

              <h3 className="text-2xl font-black mt-1">
                Admin Only Portal
              </h3>

              <p className="text-cyan-100 text-sm mt-2 leading-relaxed">
                This dashboard is protected for authorized TryDoc platform
                administrators.
              </p>
            </div>
          </div>
        </aside>

        <main className="p-8 md:p-12 flex items-center">
          <div className="w-full">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-[2rem] bg-cyan-50 flex items-center justify-center mx-auto mb-5">
                <ShieldCheck size={38} className="text-cyan-600" />
              </div>

              <h2 className="text-4xl font-black text-slate-950">
                Admin Login
              </h2>

              <p className="text-slate-500 mt-3">
                Access your TryDoc admin dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">
                  Admin Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-14 pl-12 pr-12 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none text-slate-800"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full h-14 rounded-2xl bg-cyan-600 text-white font-black hover:bg-cyan-700 transition flex items-center justify-center gap-2 disabled:bg-slate-400"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Logging in...
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
                <ShieldCheck size={20} className="text-cyan-600" />

                <div>
                  <p className="font-black text-slate-900 text-sm">
                    Protected Admin Access
                  </p>

                  <p className="text-xs text-slate-500">
                    Only authorized platform admins can access this dashboard.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <Link
                to="/"
                className="text-slate-500 font-bold hover:text-cyan-600"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
        <Icon size={17} className="text-cyan-300" />
      </div>

      <span className="font-semibold text-cyan-50">
        {text}
      </span>
    </div>
  );
}