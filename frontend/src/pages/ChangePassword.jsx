import { useMemo, useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Save,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import api from "../api/axios";

export default function ChangePassword() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const accountType = useMemo(() => {
    if (localStorage.getItem("patientUser")) return "Patient";
    if (localStorage.getItem("doctorUser")) return "Doctor";
    if (localStorage.getItem("hospitalUser")) return "Hospital";
    if (localStorage.getItem("adminUser")) return "Admin";
    return "Account";
  }, []);

  const passwordStrength = useMemo(() => {
    const password = form.newPassword;

    let score = 0;

    if (password.length >= 6) score += 25;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;

    if (score >= 80) return { label: "Strong", score, color: "bg-emerald-500" };
    if (score >= 50) return { label: "Medium", score, color: "bg-yellow-500" };
    if (score > 0) return { label: "Weak", score, color: "bg-red-500" };

    return { label: "Not set", score: 0, color: "bg-slate-300" };
  }, [form.newPassword]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const getEndpoint = () => {
    if (localStorage.getItem("patientUser")) {
      return "/patient/change-password";
    }

    if (localStorage.getItem("doctorUser")) {
      return "/doctor/change-password";
    }

    if (localStorage.getItem("hospitalUser")) {
      return "/hospital/change-password";
    }

    if (localStorage.getItem("adminUser")) {
      return "/admin/change-password";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = getEndpoint();

    if (!endpoint) {
      alert("Please login again");
      return;
    }

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (form.newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await api.patch(endpoint, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      alert("Password changed successfully");

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                <ShieldCheck size={17} />
                SECURITY SETTINGS
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                Change Password
              </h1>

              <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
                Update your {accountType.toLowerCase()} account password and
                keep your MediCare profile secure.
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl border border-slate-100 p-5 min-w-[240px]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
                  <KeyRound className="text-cyan-600" size={25} />
                </div>

                <div>
                  <p className="text-sm text-slate-500 font-semibold">
                    Account Type
                  </p>

                  <p className="text-xl font-black text-slate-950">
                    {accountType}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-7">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
                <Lock className="text-cyan-600" size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  Update Password
                </h2>

                <p className="text-slate-500">
                  Enter current password and choose a new password.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <PasswordField
                label="Current Password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                show={showCurrent}
                setShow={setShowCurrent}
              />

              <PasswordField
                label="New Password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                show={showNew}
                setShow={setShowNew}
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
              </div>

              <PasswordField
                label="Confirm Password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                show={showConfirm}
                setShow={setShowConfirm}
              />

              {form.confirmPassword &&
                form.newPassword !== form.confirmPassword && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 font-bold text-sm">
                    <AlertCircle size={18} />
                    Passwords do not match
                  </div>
                )}

              {form.confirmPassword &&
                form.newPassword === form.confirmPassword && (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl p-4 font-bold text-sm">
                    <CheckCircle2 size={18} />
                    Passwords match
                  </div>
                )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black hover:bg-cyan-700 transition flex items-center justify-center gap-2 disabled:bg-slate-400"
              >
                {loading ? (
                  <>
                    <Loader2 size={19} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={19} />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>

          <aside className="space-y-5">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center mb-4">
                <ShieldCheck className="text-cyan-600" size={25} />
              </div>

              <h3 className="text-xl font-black text-slate-950">
                Password Tips
              </h3>

              <div className="mt-4 space-y-3 text-sm text-slate-600 font-semibold">
                <Tip text="Use at least 8 characters." />
                <Tip text="Include uppercase letters." />
                <Tip text="Add numbers and symbols." />
                <Tip text="Avoid using your name or phone number." />
              </div>
            </div>

            <div className="bg-cyan-600 rounded-[2rem] p-6 text-white">
              <Lock className="mb-4" size={30} />

              <h3 className="text-xl font-black">
                Secure Healthcare Account
              </h3>

              <p className="text-cyan-100 text-sm mt-2 leading-relaxed">
                Your password protects sensitive healthcare information,
                appointments, prescriptions, and profile details.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  name,
  value,
  onChange,
  show,
  setShow,
}) {
  return (
    <div>
      <label className="block text-sm font-black text-slate-700 mb-2">
        {label}
      </label>

      <div className="flex items-center border border-slate-200 rounded-2xl px-4 py-3 bg-slate-50 focus-within:ring-2 focus-within:ring-cyan-500">
        <Lock size={18} className="text-cyan-600 mr-3 shrink-0" />

        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="flex-1 bg-transparent outline-none text-slate-800"
          placeholder={label}
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="text-slate-400 hover:text-cyan-600"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

function Tip({ text }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 size={16} className="text-cyan-600 shrink-0" />
      <span>{text}</span>
    </div>
  );
}