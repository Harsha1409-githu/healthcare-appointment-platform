import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Save,
  ShieldCheck,
  Camera,
  Stethoscope,
  GraduationCap,
  BadgeIndianRupee,
  BriefcaseMedical,
  Building2,
} from "lucide-react";
import api from "../api/axios";

export default function DoctorMyProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    doctorName: "",
    email: "",
    mobile: "",
    specialization: "",
    qualification: "",
    experience: "",
    consultationFee: "",
    city: "",
    state: "",
    hospitalName: "",
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
      const res = await api.get("/doctor/profile/me");

      setProfile({
        doctorName: res.data.doctorName || "",
        email: res.data.email || "",
        mobile: res.data.mobile || "",
        specialization: res.data.specialization || "",
        qualification: res.data.qualification || "",
        experience: res.data.experience || "",
        consultationFee: res.data.consultationFee || "",
        city: res.data.city || "",
        state: res.data.state || "",
        hospitalName: res.data.hospital?.hospitalName || "",
        profileImage: res.data.profileImage || "",
      });

      setPreviewImage(res.data.profileImage || "");
    } catch (error) {
      console.error("Doctor profile error:", error);
      alert("Failed to load doctor profile");
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
        "/doctor/profile/photo",
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
        "doctorUser",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("doctorUser") || "{}"),
          ...res.data,
        })
      );

      window.dispatchEvent(new Event("doctorProfileUpdated"));

      alert("Doctor photo uploaded successfully");
    } catch (error) {
      console.error("Doctor photo upload error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to upload doctor photo"
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

      const res = await api.patch("/doctor/profile/me", {
        doctorName: profile.doctorName,
        mobile: profile.mobile,
        specialization: profile.specialization,
        qualification: profile.qualification,
        experience: profile.experience
          ? Number(profile.experience)
          : null,
        consultationFee: profile.consultationFee
          ? Number(profile.consultationFee)
          : null,
        city: profile.city,
        state: profile.state,
      });

      localStorage.setItem(
        "doctorUser",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("doctorUser") || "{}"),
          ...res.data,
        })
      );

      window.dispatchEvent(new Event("doctorProfileUpdated"));

      alert("Doctor profile updated successfully");
    } catch (error) {
      console.error("Update doctor profile error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to update doctor profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        Loading doctor profile...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-emerald-50/40 to-white py-10">
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl" />
      <div className="absolute top-40 right-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-emerald-950 to-cyan-900 p-8 md:p-10 text-white shadow-2xl mb-8">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative w-24 h-24">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Doctor"
                  className="w-24 h-24 rounded-3xl object-cover border-4 border-white/20 shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <Stethoscope size={44} className="text-emerald-300" />
                </div>
              )}

              <label className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-3 rounded-2xl shadow-lg cursor-pointer hover:bg-emerald-700">
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
                <ShieldCheck size={17} className="text-emerald-300" />
                <span className="text-sm font-semibold">
                  Doctor Profile
                </span>
              </div>

              <h1 className="text-4xl font-black">
                {profile.doctorName || "Doctor Profile"}
              </h1>

              <p className="text-emerald-100 mt-2">
                Manage your professional healthcare profile.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={saveProfile}
          className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6 md:p-8"
        >
          <h2 className="text-2xl font-black text-slate-900 mb-6">
            Professional Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <Input
              icon={UserRound}
              label="Doctor Name"
              name="doctorName"
              value={profile.doctorName}
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
              icon={Stethoscope}
              label="Specialization"
              name="specialization"
              value={profile.specialization}
              onChange={handleChange}
            />

            <Input
              icon={GraduationCap}
              label="Qualification"
              name="qualification"
              value={profile.qualification}
              onChange={handleChange}
            />

            <Input
              icon={BriefcaseMedical}
              label="Experience"
              name="experience"
              type="number"
              value={profile.experience}
              onChange={handleChange}
            />

            <Input
              icon={BadgeIndianRupee}
              label="Consultation Fee"
              name="consultationFee"
              type="number"
              value={profile.consultationFee}
              onChange={handleChange}
            />

            <Input
              icon={Building2}
              label="Hospital"
              name="hospitalName"
              value={profile.hospitalName}
              disabled
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
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-cyan-500 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:scale-[1.02] transition disabled:bg-gray-400 disabled:scale-100"
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
            Update your doctor account password securely.
          </p>

          <button
            onClick={() => navigate("/doctor/change-password")}
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
            : "bg-slate-50 border-slate-200 focus-within:ring-2 focus-within:ring-emerald-500"
        }`}
      >
        <Icon size={19} className="text-emerald-600" />

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