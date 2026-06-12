import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HeartPulse,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserRound,
  Phone,
  MapPin,
  CalendarDays,
  ArrowRight,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    gender: "",
    age: "",
    city: "",
  });

  const clearOtherUsers = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorUser");
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

      const res = await api.post("/auth/login", loginForm);

      clearOtherUsers();

      localStorage.setItem("patientToken", res.data.access_token);
      localStorage.setItem("patientUser", JSON.stringify(res.data.user));

      window.dispatchEvent(new Event("patientProfileUpdated"));

      navigate("/patient/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/register", registerForm);

      clearOtherUsers();

      localStorage.setItem("patientToken", res.data.access_token);
      localStorage.setItem("patientUser", JSON.stringify(res.data.user));

      window.dispatchEvent(new Event("patientProfileUpdated"));

      navigate("/patient/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4fbff] flex items-center justify-center px-6 py-10">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100">
        <aside className="hidden lg:flex bg-slate-950 text-white p-10 flex-col justify-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="w-20 h-20 rounded-[2rem] bg-white/10 flex items-center justify-center mb-8">
              <HeartPulse size={42} className="text-cyan-300" />
            </div>

            <h1 className="text-5xl font-black leading-tight">
              Welcome to
              <span className="block text-cyan-300">MediCare</span>
            </h1>

            <p className="text-cyan-100 mt-6 text-lg leading-relaxed">
              Book doctors, manage appointments, prescriptions, medical records
              and AI health insights from one secure account.
            </p>

            <div className="mt-10 space-y-4">
              <Feature text="Book appointments instantly" />
              <Feature text="Access digital prescriptions" />
              <Feature text="Upload medical records" />
              <Feature text="Use AI symptom checker" />
            </div>
          </div>
        </aside>

        <main className="p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-[2rem] bg-cyan-50 flex items-center justify-center mx-auto mb-5">
              <UserRound size={38} className="text-cyan-600" />
            </div>

            <h2 className="text-4xl font-black text-slate-950">
              Patient Account
            </h2>

            <p className="text-slate-500 mt-3">
              Login or create your MediCare account
            </p>
          </div>

          <div className="grid grid-cols-2 bg-slate-100 rounded-2xl p-1 mb-7">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`py-3 rounded-xl font-black transition ${
                mode === "login"
                  ? "bg-white text-cyan-700 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`py-3 rounded-xl font-black transition ${
                mode === "signup"
                  ? "bg-white text-cyan-700 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Sign Up
            </button>
          </div>

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <Input
                icon={Mail}
                label="Email"
                name="email"
                type="email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                placeholder="patient@example.com"
              />

              <PasswordInput
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                show={showPassword}
                setShow={setShowPassword}
              />

              <SubmitButton loading={loading} text="Login" />
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                icon={UserRound}
                label="Full Name"
                name="fullName"
                value={registerForm.fullName}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    fullName: e.target.value,
                  })
                }
                placeholder="Full name"
              />

              <Input
                icon={Mail}
                label="Email"
                name="email"
                type="email"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    email: e.target.value,
                  })
                }
                placeholder="patient@example.com"
              />

              <Input
                icon={Phone}
                label="Mobile"
                name="mobile"
                value={registerForm.mobile}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    mobile: e.target.value,
                  })
                }
                placeholder="+91 98765 43210"
              />

              <PasswordInput
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    password: e.target.value,
                  })
                }
                show={showPassword}
                setShow={setShowPassword}
              />

              <div className="grid md:grid-cols-3 gap-4">
                <select
                  name="gender"
                  value={registerForm.gender}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      gender: e.target.value,
                    })
                  }
                  className="h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>

                <InputSmall
                  icon={CalendarDays}
                  type="number"
                  placeholder="Age"
                  value={registerForm.age}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      age: e.target.value,
                    })
                  }
                />

                <InputSmall
                  icon={MapPin}
                  placeholder="City"
                  value={registerForm.city}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      city: e.target.value,
                    })
                  }
                />
              </div>

              <SubmitButton loading={loading} text="Create Account" />
            </form>
          )}

          <div className="mt-6 bg-cyan-50 border border-cyan-100 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-cyan-600" />

              <p className="text-sm text-slate-600">
                Secure patient access for appointments, prescriptions and
                medical records.
              </p>
            </div>
          </div>

          <div className="text-center mt-5">
            <Link to="/" className="text-slate-500 font-bold hover:text-cyan-600">
              ← Back to Home
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

function Input({ icon: Icon, label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-sm font-black text-slate-700 mb-2">
        {label}
      </label>

      <div className="relative">
        <Icon
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={type}
          value={value}
          onChange={onChange}
          required
          placeholder={placeholder}
          className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none"
        />
      </div>
    </div>
  );
}

function InputSmall({ icon: Icon, value, onChange, type = "text", placeholder }) {
  return (
    <div className="relative">
      <Icon
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none"
      />
    </div>
  );
}

function PasswordInput({ value, onChange, show, setShow }) {
  return (
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
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          required
          placeholder="Enter password"
          className="w-full h-14 pl-12 pr-12 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}

function SubmitButton({ loading, text }) {
  return (
    <button
      disabled={loading}
      className="w-full h-14 rounded-2xl bg-cyan-600 text-white font-black hover:bg-cyan-700 transition flex items-center justify-center gap-2 disabled:bg-slate-400"
    >
      {loading ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          Please wait...
        </>
      ) : (
        <>
          {text}
          <ArrowRight size={18} />
        </>
      )}
    </button>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
        <ShieldCheck size={16} className="text-cyan-300" />
      </div>

      <span className="font-semibold text-cyan-50">{text}</span>
    </div>
  );
}