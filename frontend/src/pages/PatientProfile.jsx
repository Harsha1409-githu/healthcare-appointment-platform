import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  Camera,
  FileText,
  ClipboardList,
  Bell,
  Lock,
  LogOut,
  ChevronRight,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
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

  const updateLocalUser = (data) => {
    const oldUser =
      JSON.parse(localStorage.getItem("patientUser") || "null") ||
      JSON.parse(localStorage.getItem("user") || "null") ||
      {};

    const updatedUser = {
      ...oldUser,
      ...data,
    };

    localStorage.setItem("patientUser", JSON.stringify(updatedUser));
    localStorage.setItem("user", JSON.stringify(updatedUser));

    window.dispatchEvent(new Event("patientProfileUpdated"));
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/patient/profile");

      const data = {
        fullName: res.data.fullName || "",
        email: res.data.email || "",
        mobile: res.data.mobile || "",
        gender: res.data.gender || "",
        age: res.data.age || "",
        city: res.data.city || "",
        profileImage: res.data.profileImage || "",
      };

      setProfile(data);
      setPreviewImage(data.profileImage);
      updateLocalUser(data);
    } catch (error) {
      console.error("Profile error:", error);
      alert(error.response?.data?.message || "Failed to load profile");
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

      const profileImage = res.data.profileImage;

      setPreviewImage(profileImage);

      setProfile((prev) => ({
        ...prev,
        profileImage,
      }));

      updateLocalUser({
        profileImage,
      });

      alert("Photo uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.response?.data?.message || "Upload failed");
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

      const updatedProfile = {
        ...profile,
        ...res.data,
      };

      setProfile(updatedProfile);
      updateLocalUser(updatedProfile);

      alert("Profile updated successfully");
    } catch (error) {
      console.error("Update profile error:", error);
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("patientToken");
    localStorage.removeItem("patientUser");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("patientProfileUpdated"));
    navigate("/welcome", { replace: true });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f8fb] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
          <UserRound className="text-cyan-600 animate-pulse mx-auto" size={34} />

          <p className="text-slate-500 font-bold mt-3">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-24">
      <PageHeader
        title="Edit Profile"
        subtitle="Update your personal details"
      />

      <div className="max-w-md mx-auto px-4">
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="relative w-20 h-20 shrink-0">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border border-slate-100"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-cyan-50 flex items-center justify-center">
                  <UserRound size={36} className="text-cyan-600" />
                </div>
              )}

              <label className="absolute -bottom-1 -right-1 bg-cyan-600 text-white p-2 rounded-2xl shadow cursor-pointer active:scale-95 transition">
                <Camera size={15} />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagePreview}
                  className="hidden"
                />
              </label>
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-black text-slate-950 truncate">
                {profile.fullName || "My Profile"}
              </h1>

              <p className="text-sm text-slate-500 truncate">
                {profile.email || "Complete your profile"}
              </p>

              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-500">
                    Completed
                  </span>

                  <span className="font-black text-cyan-700">
                    {profileCompletion}%
                  </span>
                </div>

                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-600 rounded-full"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-4 gap-2 mt-3">
          <QuickAction
            icon={ClipboardList}
            title="Bookings"
            onClick={() => navigate("/patient/appointments")}
          />

          <QuickAction
            icon={FileText}
            title="Records"
            onClick={() => navigate("/patient/medical-records")}
          />

          <QuickAction
            icon={Bell}
            title="Alerts"
            onClick={() => navigate("/patient/notifications")}
          />

          <QuickAction
            icon={Lock}
            title="Password"
            onClick={() => navigate("/patient/change-password")}
          />
        </section>

        <form
          onSubmit={saveProfile}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3"
        >
          <h2 className="text-lg font-black text-slate-950 mb-3">
            Personal Details
          </h2>

          <div className="space-y-3">
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

            <div className="grid grid-cols-2 gap-3">
              <Input
                icon={Calendar}
                label="Age"
                name="age"
                type="number"
                value={profile.age}
                onChange={handleChange}
              />

              <Select
                label="Gender"
                name="gender"
                value={profile.gender}
                onChange={handleChange}
              />
            </div>

            <Input
              icon={MapPin}
              label="City"
              name="city"
              value={profile.city}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-cyan-600 text-white py-3.5 rounded-2xl font-black disabled:bg-slate-400 active:scale-95 transition"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-2 mt-3">
          <MenuItem
            icon={Phone}
            title="Emergency Contact"
            onClick={() => navigate("/patient/emergency-contact")}
          />

          <MenuItem icon={LogOut} title="Logout" danger onClick={logout} />
        </section>
      </div>
    </main>
  );
}

function QuickAction({ icon: Icon, title, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm px-2 py-3 text-center active:scale-95 transition"
    >
      <Icon className="text-cyan-600 mx-auto" size={22} />

      <p className="text-[11px] font-black text-slate-900 mt-1 leading-tight">
        {title}
      </p>
    </button>
  );
}

function MenuItem({ icon: Icon, title, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl active:bg-slate-50 text-left"
    >
      <div
        className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
          danger ? "bg-red-50" : "bg-cyan-50"
        }`}
      >
        <Icon className={danger ? "text-red-600" : "text-cyan-600"} size={19} />
      </div>

      <p
        className={`flex-1 text-sm font-black ${
          danger ? "text-red-600" : "text-slate-900"
        }`}
      >
        {title}
      </p>

      <ChevronRight size={17} className="text-slate-400" />
    </button>
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
    <label className="block">
      <p className="text-xs font-black text-slate-700 mb-1.5">
        {label}
      </p>

      <div
        className={`flex items-center gap-2 border rounded-2xl px-3 py-3 ${
          disabled
            ? "bg-slate-100 border-slate-200"
            : "bg-slate-50 border-slate-200 focus-within:ring-2 focus-within:ring-cyan-500"
        }`}
      >
        <Icon size={17} className="text-cyan-600 shrink-0" />

        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full bg-transparent outline-none text-sm text-slate-800 disabled:text-slate-500"
        />
      </div>
    </label>
  );
}

function Select({ label, name, value, onChange }) {
  return (
    <label className="block">
      <p className="text-xs font-black text-slate-700 mb-1.5">
        {label}
      </p>

      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 focus-within:ring-2 focus-within:ring-cyan-500">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent outline-none text-sm text-slate-800"
        >
          <option value="">Select</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
    </label>
  );
}