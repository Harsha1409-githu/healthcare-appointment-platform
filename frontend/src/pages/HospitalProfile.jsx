import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Save,
  Camera,
  Loader2,
  Lock,
  Activity,
  ChevronRight,
} from "lucide-react";
import api from "../api/axios";

export default function HospitalProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    hospitalName: "",
    email: "",
    mobile: "",
    city: "",
    state: "",
    address: "",
    licenseNumber: "",
    profileImage: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/hospital/profile/me");

      setProfile({
        hospitalName: res.data.hospitalName || "",
        email: res.data.email || "",
        mobile: res.data.mobile || "",
        city: res.data.city || "",
        state: res.data.state || "",
        address: res.data.address || "",
        licenseNumber: res.data.licenseNumber || "",
        profileImage: res.data.profileImage || "",
      });

      setPreviewImage(res.data.profileImage || "");
    } catch (error) {
      console.error("Hospital profile error:", error);
      alert("Failed to load hospital profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImagePreview = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.patch("/hospital/profile/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPreviewImage(res.data.profileImage);

      setProfile((prev) => ({
        ...prev,
        profileImage: res.data.profileImage,
      }));

      localStorage.setItem(
        "hospitalUser",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("hospitalUser") || "{}"),
          ...res.data,
        })
      );

      window.dispatchEvent(new Event("hospitalProfileUpdated"));
      alert("Hospital logo uploaded successfully");
    } catch (error) {
      console.error("Hospital logo upload error:", error);
      alert(error.response?.data?.message || "Failed to upload hospital logo");
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

      const res = await api.patch("/hospital/profile/me", {
        hospitalName: profile.hospitalName,
        mobile: profile.mobile,
        city: profile.city,
        state: profile.state,
        address: profile.address,
        licenseNumber: profile.licenseNumber,
      });

      localStorage.setItem(
        "hospitalUser",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("hospitalUser") || "{}"),
          ...res.data,
        })
      );

      window.dispatchEvent(new Event("hospitalProfileUpdated"));
      alert("Hospital profile updated successfully");
    } catch (error) {
      console.error("Update hospital profile error:", error);
      alert(error.response?.data?.message || "Failed to update hospital profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f8fb] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
          <Loader2 className="mx-auto text-cyan-600 animate-spin" size={34} />

          <p className="text-slate-500 font-bold mt-3">
            Loading hospital profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <form onSubmit={saveProfile} className="min-h-screen bg-[#f4f8fb] pb-32">
      <div className="max-w-md mx-auto px-4 pt-4">
        <header className="mb-3">
          <div className="inline-flex items-center gap-1.5 text-cyan-700 font-black text-xs">
            <Building2 size={15} />
            HOSPITAL PROFILE
          </div>

          <h1 className="text-2xl font-black text-slate-950 mt-1">
            Hospital Profile
          </h1>

          <p className="text-sm text-slate-500 font-semibold">
            Manage hospital details
          </p>
        </header>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="relative w-20 h-20 shrink-0">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Hospital Logo"
                  className="w-20 h-20 rounded-3xl object-cover border border-slate-100"
                />
              ) : (
                <div className="w-20 h-20 rounded-3xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">
                  <Building2 size={36} className="text-cyan-600" />
                </div>
              )}

              <label className="absolute -bottom-1 -right-1 bg-cyan-600 text-white p-2 rounded-2xl shadow cursor-pointer active:scale-95">
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
              <h2 className="text-lg font-black text-slate-950 truncate">
                {profile.hospitalName || "Hospital Name"}
              </h2>

              <p className="text-sm text-slate-500 truncate mt-1">
                {profile.email || "hospital@example.com"}
              </p>

              <p className="text-xs text-cyan-700 font-black truncate mt-1">
                {profile.city || "City not set"}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <h2 className="text-lg font-black text-slate-950 mb-4">
            Hospital Information
          </h2>

          <div className="space-y-3">
            <Input
              icon={Building2}
              label="Hospital Name"
              name="hospitalName"
              value={profile.hospitalName}
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
              icon={FileText}
              label="License Number"
              name="licenseNumber"
              value={profile.licenseNumber}
              onChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                icon={MapPin}
                label="City"
                name="city"
                value={profile.city}
                onChange={handleChange}
              />

              <Input
                icon={MapPin}
                label="State"
                name="state"
                value={profile.state}
                onChange={handleChange}
              />
            </div>

            <label className="block">
              <p className="text-xs font-black text-slate-700 mb-1.5">
                Address
              </p>

              <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 focus-within:ring-2 focus-within:ring-cyan-500">
                <MapPin size={17} className="text-cyan-600 mt-0.5 shrink-0" />

                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-transparent outline-none text-sm text-slate-800 resize-none"
                  placeholder="Hospital full address"
                />
              </div>
            </label>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <MenuItem
            icon={Activity}
            title="Dashboard"
            subtitle="View hospital dashboard"
            onClick={() => navigate("/hospital/dashboard")}
          />

          <MenuItem
            icon={Lock}
            title="Change Password"
            subtitle="Update account security"
            onClick={() => navigate("/hospital/change-password")}
          />
        </section>
      </div>

      <div className="fixed bottom-4 left-0 right-0 z-40 px-4">
        <div className="max-w-md mx-auto">
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-cyan-600 text-white py-4 rounded-2xl font-black shadow-lg disabled:bg-slate-400 active:scale-95 transition"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

function MenuItem({ icon: Icon, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3 border-b border-slate-100 last:border-b-0 text-left"
    >
      <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
        <Icon className="text-cyan-600" size={20} />
      </div>

      <div className="flex-1">
        <h3 className="font-black text-slate-900 text-sm">
          {title}
        </h3>

        <p className="text-xs text-slate-500">
          {subtitle}
        </p>
      </div>

      <ChevronRight size={18} className="text-slate-400" />
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