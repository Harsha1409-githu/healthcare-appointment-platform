import { useMemo, useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import api from "../api/axios";

export default function ChangePassword() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const passwordStrength = useMemo(() => {
    const password = form.newPassword;
    let score = 0;

    if (password.length >= 6) score += 30;
    if (password.length >= 8) score += 30;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 10;

    if (score >= 80) return { label: "Strong", color: "bg-green-500", score };
    if (score >= 50) return { label: "Good", color: "bg-yellow-500", score };
    if (score > 0) return { label: "Weak", color: "bg-red-500", score };

    return { label: "", color: "bg-slate-200", score: 0 };
  }, [form.newPassword]);

  const getEndpoint = () => {
    if (localStorage.getItem("patientUser")) return "/patient/change-password";
    if (localStorage.getItem("doctorUser")) return "/doctor/change-password";
    if (localStorage.getItem("hospitalUser")) return "/hospital/change-password";
    if (localStorage.getItem("adminUser")) return "/admin/change-password";
    return null;
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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

  const passwordsMatch =
    form.confirmPassword && form.newPassword === form.confirmPassword;

  const passwordsNotMatch =
    form.confirmPassword && form.newPassword !== form.confirmPassword;

  return (
    <div className="min-h-screen bg-[#f4f8fb] px-4 py-4">
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-black text-slate-950">
            Change Password
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Update your account password safely.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4"
        >
          <div className="space-y-4">
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

            {form.newPassword && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-500">
                    Strength
                  </span>
                  <span className="font-black text-slate-700">
                    {passwordStrength.label}
                  </span>
                </div>

                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${passwordStrength.color} rounded-full transition-all`}
                    style={{ width: `${passwordStrength.score}%` }}
                  />
                </div>
              </div>
            )}

            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              show={showConfirm}
              setShow={setShowConfirm}
            />

            {passwordsNotMatch && (
              <Message type="error" text="Passwords do not match" />
            )}

            {passwordsMatch && (
              <Message type="success" text="Passwords match" />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-cyan-600 text-white py-3.5 rounded-2xl font-black disabled:bg-slate-400"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-xs text-center text-slate-400 mt-4">
          Use a password you don’t use anywhere else.
        </p>
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
      <label className="block text-xs font-black text-slate-700 mb-1.5">
        {label}
      </label>

      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 focus-within:ring-2 focus-within:ring-cyan-500">
        <Lock size={17} className="text-cyan-600 mr-2 shrink-0" />

        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={label}
          className="w-full bg-transparent outline-none text-sm text-slate-800"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="text-slate-400"
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}

function Message({ type, text }) {
  const success = type === "success";

  return (
    <div
      className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-bold ${
        success
          ? "bg-green-50 text-green-700"
          : "bg-red-50 text-red-700"
      }`}
    >
      {success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      {text}
    </div>
  );
}