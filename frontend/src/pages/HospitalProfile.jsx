import { useEffect, useMemo, useState } from "react";
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
  Loader2,
  Lock,
  Activity,
  BadgeCheck,
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

  const profileCompletion = useMemo(() => {
    const fields = [
      profile.hospitalName,
      profile.email,
      profile.mobile,
      profile.city,
      profile.state,
      profile.address,
      profile.licenseNumber,
      profile.profileImage,
    ];

    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  }, [profile]);

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
      <div className="min-h-screen bg-[#f4fbff] flex items-center justify-center">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 text-center">
          <Loader2 className="mx-auto text-cyan-600 animate-spin mb-4" size={38} />

          <p className="text-slate-500 font-semibold">
            Loading hospital profile...
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
                    alt="Hospital Logo"
                    className="w-28 h-28 rounded-[2rem] object-cover border border-slate-100 shadow-sm"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-[2rem] bg-cyan-50 border border-cyan-100 flex items-center justify-center">
                    <Building2 size={48} className="text-cyan-600" />
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
                  HOSPITAL PROFILE
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                  {profile.hospitalName || "Hospital Profile"}
                </h1>

                <p className="text-slate-500 mt-3 text-lg">
                  Manage hospital information, contact details, license data and
                  account security.
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
                Complete your hospital profile to improve trust and visibility.
              </p>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <form
            onSubmit={saveProfile}
            className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-7">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
                <Building2 className="text-cyan-600" size={25} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  Hospital Information
                </h2>

                <p className="text-slate-500">
                  Keep your hospital profile updated for patients and doctors.
                </p>
              </div>
            </div>

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
                  <p className="text-sm font-black text-slate-700 mb-2">
                    Address
                  </p>

                  <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-cyan-500">
                    <MapPin size={19} className="text-cyan-600 mt-1" />

                    <textarea
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      rows="4"
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
                  <BadgeCheck className="text-emerald-600" size={25} />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-950">
                    Hospital Summary
                  </h2>

                  <p className="text-sm text-slate-500">
                    Public hospital details
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <SummaryItem label="Hospital" value={profile.hospitalName || "Not Set"} />
                <SummaryItem label="Mobile" value={profile.mobile || "Not Set"} />
                <SummaryItem label="License" value={profile.licenseNumber || "Not Set"} />
                <SummaryItem
                  label="Location"
                  value={
                    profile.city || profile.state
                      ? `${profile.city || "-"}, ${profile.state || "-"}`
                      : "Not Set"
                  }
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
                    Protect your hospital account
                  </p>
                </div>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed mb-5">
                Update your password regularly to keep hospital data secure.
              </p>

              <button
                onClick={() => navigate("/hospital/change-password")}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-red-700 transition"
              >
                Change Password
              </button>
            </div>

            <div className="bg-cyan-600 rounded-[2rem] shadow-sm p-6 text-white">
              <ShieldCheck className="mb-4" size={28} />

              <h2 className="text-xl font-black">
                Verified Hospital Profile
              </h2>

              <p className="text-cyan-100 text-sm mt-2 leading-relaxed">
                Updated hospital profiles help patients trust your hospital,
                doctors and appointment availability.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
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