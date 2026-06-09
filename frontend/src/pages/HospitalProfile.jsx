import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Save,
  ShieldCheck,
  Camera,
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
      const res = await api.patch(
        "/hospital/profile/photo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
      alert(
        error.response?.data?.message ||
          "Failed to upload hospital logo"
      );
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
      alert(
        error.response?.data?.message ||
          "Failed to update hospital profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        Loading hospital profile...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/40 to-white py-10">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      <div className="absolute top-40 right-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-8 md:p-10 text-white shadow-2xl mb-8">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative w-24 h-24">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Hospital Logo"
                  className="w-24 h-24 rounded-3xl object-cover border-4 border-white/20 shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <Building2 size={44} className="text-cyan-300" />
                </div>
              )}

              <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-2xl shadow-lg cursor-pointer hover:bg-blue-700">
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur mb-3">
                <ShieldCheck size={17} className="text-cyan-300" />
                <span className="text-sm font-semibold">
                  Hospital Profile
                </span>
              </div>

              <h1 className="text-4xl font-black">
                {profile.hospitalName || "Hospital Profile"}
              </h1>

              <p className="text-blue-100 mt-2">
                Manage hospital information, contact details and license data.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={saveProfile}
          className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6 md:p-8"
        >
          <h2 className="text-2xl font-black text-slate-900 mb-6">
            Hospital Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
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

            <div className="md:col-span-2">
              <label>
                <p className="text-sm font-bold text-slate-600 mb-2">
                  Address
                </p>

                <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
                  <MapPin size={19} className="text-blue-600 mt-1" />

                  <textarea
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-transparent outline-none text-slate-800 resize-none"
                  />
                </div>
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:scale-[1.02] transition disabled:bg-gray-400 disabled:scale-100"
            >
              <Save size={19} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        <div className="mt-8 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6 md:p-8">
          <h2 className="text-2xl font-black text-slate-900 mb-4">
            Security Settings
          </h2>

          <p className="text-slate-500 mb-6">
            Update your hospital account password securely.
          </p>

          <button
            onClick={() => navigate("/hospital/change-password")}
            className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-red-700"
          >
            Change Password
          </button>
        </div>
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
  disabled = false,
}) {
  return (
    <label>
      <p className="text-sm font-bold text-slate-600 mb-2">
        {label}
      </p>

      <div
        className={`flex items-center gap-3 border rounded-2xl px-4 py-3 ${
          disabled
            ? "bg-slate-100 border-slate-200"
            : "bg-slate-50 border-slate-200 focus-within:ring-2 focus-within:ring-blue-500"
        }`}
      >
        <Icon size={19} className="text-blue-600" />

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