import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  ShieldCheck,
  Camera,
  CalendarCheck,
  FileText,
  ClipboardList,
  Bell,
  Brain,
  Stethoscope,
  Lock,
  HeartPulse,
  Activity,
  ArrowRight,
} from "lucide-react";
import api from "../api/axios";

export default function PatientProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    mobile: "",
    gender: "",
    age: "",
    city: "",
    profileImage: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/patient/profile");

      setProfile({
        fullName: res.data.fullName || "",
        email: res.data.email || "",
        mobile: res.data.mobile || "",
        gender: res.data.gender || "",
        age: res.data.age || "",
        city: res.data.city || "",
        profileImage: res.data.profileImage || "",
      });

      setPreviewImage(res.data.profileImage || "");
    } catch (error) {
      console.error("Profile error:", error);
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const profileCompletion = useMemo(() => {
    const fields = [
      profile.fullName,
      profile.email,
      profile.mobile,
      profile.gender,
      profile.age,
      profile.city,
      profile.profileImage,
    ];

    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  }, [profile]);

  const handleImagePreview = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.patch("/patient/profile/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPreviewImage(res.data.profileImage);

      setProfile((prev) => ({
        ...prev,
        profileImage: res.data.profileImage,
      }));

      const storedUser = JSON.parse(
        localStorage.getItem("patientUser") || "{}"
      );

      localStorage.setItem(
        "patientUser",
        JSON.stringify({
          ...storedUser,
          profileImage: res.data.profileImage,
        })
      );

      window.dispatchEvent(new Event("patientProfileUpdated"));
      alert("Photo uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const res = await api.patch("/patient/profile", {
        fullName: profile.fullName,
        mobile: profile.mobile,
        gender: profile.gender,
        age: profile.age ? Number(profile.age) : null,
        city: profile.city,
      });

      localStorage.setItem(
        "patientUser",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("patientUser") || "{}"),
          ...res.data,
        })
      );

      window.dispatchEvent(new Event("patientProfileUpdated"));
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Update profile error:", error);
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4fbff] flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto mb-4">
            <UserRound className="text-cyan-600 animate-pulse" size={34} />
          </div>

          <p className="text-slate-500 font-semibold">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6 py-8">
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-center">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="relative w-28 h-28 shrink-0">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-28 h-28 rounded-[2rem] object-cover border border-slate-100 shadow-sm"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-[2rem] bg-cyan-50 border border-cyan-100 flex items-center justify-center">
                    <UserRound size={48} className="text-cyan-600" />
                  </div>
                )}

                <label className="absolute -bottom-2 -right-2 bg-cyan-600 text-white p-3 rounded-2xl shadow-lg cursor-pointer hover:bg-cyan-700 transition">
                  <Camera size={18} />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImagePreview}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                  <ShieldCheck size={17} />
                  PATIENT PROFILE
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                  {profile.fullName || "My Profile"}
                </h1>

                <p className="text-slate-500 mt-3 text-lg">
                  Manage your healthcare identity, personal details and account
                  security.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl border border-slate-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-semibold">
                    Profile Completion
                  </p>

                  <h3 className="text-3xl font-black text-slate-950 mt-1">
                    {profileCompletion}%
                  </h3>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center">
                  <Activity className="text-cyan-600" size={28} />
                </div>
              </div>

              <div className="mt-5 h-3 bg-white rounded-full overflow-hidden border border-slate-100">
                <div
                  className="h-full bg-cyan-600 rounded-full transition-all"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>

              <p className="text-xs text-slate-500 mt-3">
                Complete all details to improve your healthcare profile.
              </p>
            </div>
          </div>
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <QuickAction
            icon={Stethoscope}
            title="Book Doctor"
            desc="Find verified specialists"
            to="/doctors"
          />

          <QuickAction
            icon={FileText}
            title="Medical Records"
            desc="Upload and manage reports"
            to="/patient/medical-records"
          />

          <QuickAction
            icon={ClipboardList}
            title="Prescriptions"
            desc="View digital prescriptions"
            to="/patient/prescriptions"
          />

          <QuickAction
            icon={Brain}
            title="AI Assistant"
            desc="Check symptoms quickly"
            to="/symptom-checker"
          />
        </section>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <form
            onSubmit={saveProfile}
            className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-7">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
                <UserRound className="text-cyan-600" size={25} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  Personal Information
                </h2>

                <p className="text-slate-500">
                  Keep your profile updated for faster bookings.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <Input
                icon={UserRound}
                label="Full Name"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
              />

              <Input
                icon={Mail}
                label="Email"
                name="email"
                value={profile.email}
                disabled
              />

              <Input
                icon={Phone}
                label="Mobile"
                name="mobile"
                value={profile.mobile}
                onChange={handleChange}
              />

              <Input
                icon={Calendar}
                label="Age"
                name="age"
                type="number"
                value={profile.age}
                onChange={handleChange}
              />

              <Select
                icon={UserRound}
                label="Gender"
                name="gender"
                value={profile.gender}
                onChange={handleChange}
              />

              <Input
                icon={MapPin}
                label="City"
                name="city"
                value={profile.city}
                onChange={handleChange}
              />
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-cyan-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-cyan-700 transition disabled:bg-gray-400"
              >
                <Save size={19} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>

          <aside className="space-y-5">
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <HeartPulse className="text-emerald-600" size={25} />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-950">
                    Health Summary
                  </h2>

                  <p className="text-sm text-slate-500">
                    Basic healthcare profile
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <SummaryItem label="Age" value={profile.age || "Not Set"} />
                <SummaryItem label="Gender" value={profile.gender || "Not Set"} />
                <SummaryItem label="City" value={profile.city || "Not Set"} />
                <SummaryItem
                  label="Mobile"
                  value={profile.mobile || "Not Set"}
                />
              </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                  <Lock className="text-red-600" size={24} />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-950">
                    Security
                  </h2>

                  <p className="text-sm text-slate-500">
                    Protect your account
                  </p>
                </div>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed mb-5">
                Update your password regularly to keep your healthcare account
                secure.
              </p>

              <button
                onClick={() => navigate("/change-password")}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-red-700 transition"
              >
                Change Password
              </button>
            </div>

            <div className="bg-cyan-600 rounded-[2rem] shadow-sm p-6 text-white">
              <Bell className="mb-4" size={28} />

              <h2 className="text-xl font-black">
                Stay Updated
              </h2>

              <p className="text-cyan-100 text-sm mt-2 leading-relaxed">
                View appointment reminders, prescription updates and doctor
                messages.
              </p>

              <Link
                to="/notifications"
                className="mt-5 inline-flex items-center gap-2 bg-white text-cyan-700 px-5 py-3 rounded-2xl font-black"
              >
                View Notifications
                <ArrowRight size={17} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, title, desc, to }) {
  return (
    <Link
      to={to}
      className="bg-white rounded-[1.7rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition p-5"
    >
      <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center mb-4">
        <Icon className="text-cyan-600" size={24} />
      </div>

      <h3 className="font-black text-slate-950">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        {desc}
      </p>
    </Link>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <p className="text-sm text-slate-500 font-semibold">
        {label}
      </p>

      <p className="font-black text-slate-950 text-right">
        {value}
      </p>
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
  disabled = false,
}) {
  return (
    <label>
      <p className="text-sm font-black text-slate-700 mb-2">
        {label}
      </p>

      <div
        className={`flex items-center gap-3 border rounded-2xl px-4 py-3 ${
          disabled
            ? "bg-slate-100 border-slate-200"
            : "bg-slate-50 border-slate-200 focus-within:ring-2 focus-within:ring-cyan-500"
        }`}
      >
        <Icon size={19} className="text-cyan-600" />

        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full bg-transparent outline-none text-slate-800 disabled:text-slate-500"
        />
      </div>
    </label>
  );
}

function Select({ icon: Icon, label, name, value, onChange }) {
  return (
    <label>
      <p className="text-sm font-black text-slate-700 mb-2">
        {label}
      </p>

      <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-cyan-500">
        <Icon size={19} className="text-cyan-600" />

        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent outline-none text-slate-800"
        >
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
    </label>
  );
}