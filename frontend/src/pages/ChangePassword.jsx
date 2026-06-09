import { useState } from "react";
import { Lock, Eye, EyeOff, Save } from "lucide-react";
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

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      form.newPassword !== form.confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    }

    if (form.newPassword.length < 6) {
      alert(
        "Password must be at least 6 characters"
      );
      return;
    }

    try {
      setLoading(true);

      const endpoint = getEndpoint();

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

      alert(
        error.response?.data?.message ||
          "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-xl mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-black mb-2">
            Change Password
          </h1>

          <p className="text-slate-500 mb-8">
            Update your account password.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
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

            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              show={showConfirm}
              setShow={setShowConfirm}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition"
            >
              {loading
                ? "Updating..."
                : "Update Password"}
            </button>
          </form>
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
      <label className="block text-sm font-bold mb-2">
        {label}
      </label>

      <div className="flex items-center border rounded-2xl px-4 py-3 bg-slate-50">
        <Lock
          size={18}
          className="text-slate-500 mr-3"
        />

        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="flex-1 bg-transparent outline-none"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
        >
          {show ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>
    </div>
  );
}