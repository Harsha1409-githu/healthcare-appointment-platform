import { useMemo, useState } from "react";
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
  CheckCircle2,
  ClipboardCheck,
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

  const profileCompletion = useMemo(() => {
    const fields = Object.values(form);
    const completed = fields.filter((value) => String(value).trim()).length;
    return Math.round((completed / fields.length) * 100);
  }, [form]);

  const passwordStrength = useMemo(() => {
    const password = form.password;

    let score = 0;

    if (password.length >= 6) score += 30;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;

    if (score >= 80) return { label: "Strong", score, color: "bg-emerald-500" };
    if (score >= 50) return { label: "Medium", score, color: "bg-yellow-500" };
    if (score > 0) return { label: "Weak", score, color: "bg-red-500" };

    return { label: "Not Set", score: 0, color: "bg-slate-300" };
  }, [form.password]);

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
    <div className="min-h-screen bg-[#f4fbff] flex items-center justify-center px-6 py-10">
      <div className="max-w-7xl w-full grid xl:grid-cols-[460px_1fr] bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100">
        <aside className="relative overflow-hidden bg-slate-950 text-white p-8 md:p-10">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="w-20 h-20 rounded-[2rem] bg-white/10 border border-white/20 flex items-center justify-center mb-8">
              <Building2 size={42} className="text-cyan-300" />
            </div>

            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              Hospital
              <span className="block text-cyan-300">Registration</span>
            </h1>

            <p className="text-cyan-100 mt-6 text-lg leading-relaxed">
              Register your hospital with MediCare. Admin approval is required
              before accessing the hospital dashboard.
            </p>

            <div className="mt-10 space-y-4">
              <Feature text="Admin approval workflow" />
              <Feature text="Manage doctors and availability" />
              <Feature text="Track appointments and analytics" />
              <Feature text="Secure hospital profile access" />
            </div>

            <div className="mt-10 bg-white/10 border border-white/10 rounded-[2rem] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-100 text-sm">
                    Form Completion
                  </p>

                  <p className="text-3xl font-black mt-1">
                    {profileCompletion}%
                  </p>
                </div>

                <ClipboardCheck className="text-cyan-300" size={34} />
              </div>

              <div className="h-3 bg-white/10 rounded-full mt-5 overflow-hidden">
                <div
                  className="h-full bg-cyan-300 rounded-full transition-all"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>
          </div>
        </aside>

        <main className="p-6 md:p-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
              <ShieldCheck size={17} />
              HOSPITAL ONBOARDING
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-slate-950">
              Create Hospital Account
            </h2>

            <p className="text-slate-500 mt-3">
              Fill the details below to submit your hospital for verification.
            </p>
          </div>

          <form onSubmit={registerHospital}>
            <div className="grid md:grid-cols-2 gap-5">
              <Input
                icon={Building2}
                label="Hospital Name"
                name="hospitalName"
                value={form.hospitalName}
                onChange={handleChange}
                placeholder="Example: Apollo Hospital"
              />

              <Input
                icon={Mail}
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="hospital@example.com"
              />

              <PasswordInput
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />

              <Input
                icon={Phone}
                label="Mobile"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />

              <Input
                icon={MapPin}
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Chennai"
              />

              <Input
                icon={MapPin}
                label="State"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="Tamil Nadu"
              />

              <Input
                icon={FileText}
                label="License Number"
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={handleChange}
                placeholder="Hospital license number"
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-black text-slate-700">
                    Password Strength
                  </p>

                  <p className="text-sm font-black text-slate-500">
                    {passwordStrength.label}
                  </p>
                </div>

                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${passwordStrength.color} rounded-full transition-all`}
                    style={{ width: `${passwordStrength.score}%` }}
                  />
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  Use at least 6 characters with numbers or symbols.
                </p>
              </div>

              <div className="md:col-span-2">
                <label>
                  <p className="text-sm font-black text-slate-700 mb-2">
                    Address
                  </p>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows="4"
                    required
                    placeholder="Full hospital address"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500 resize-none text-slate-800"
                  />
                </label>
              </div>
            </div>

            <button
              disabled={loading}
              className="mt-7 w-full flex items-center justify-center gap-2 bg-cyan-600 text-white py-4 rounded-2xl font-black hover:bg-cyan-700 transition disabled:bg-slate-400"
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

            <p className="text-center text-slate-500 mt-6">
              Already registered?{" "}
              <Link
                to="/hospital/login"
                className="text-cyan-600 font-black hover:text-cyan-700"
              >
                Login here
              </Link>
            </p>

            <p className="text-center text-slate-400 text-sm mt-3">
              Hospital accounts remain pending until admin approval.
            </p>
          </form>
        </main>
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
  placeholder,
}) {
  return (
    <label>
      <p className="text-sm font-black text-slate-700 mb-2">
        {label}
      </p>

      <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-cyan-500">
        <Icon size={19} className="text-cyan-600 shrink-0" />

        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-slate-800"
        />
      </div>
    </label>
  );
}

function PasswordInput({
  label,
  name,
  value,
  onChange,
  showPassword,
  setShowPassword,
}) {
  return (
    <label>
      <p className="text-sm font-black text-slate-700 mb-2">
        {label}
      </p>

      <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-cyan-500">
        <Lock size={19} className="text-cyan-600 shrink-0" />

        <input
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          required
          placeholder="Create secure password"
          className="w-full bg-transparent outline-none text-slate-800"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-slate-400 hover:text-cyan-600"
        >
          {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
    </label>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
        <CheckCircle2 size={16} className="text-cyan-300" />
      </div>

      <span className="font-semibold text-cyan-50">
        {text}
      </span>
    </div>
  );
}