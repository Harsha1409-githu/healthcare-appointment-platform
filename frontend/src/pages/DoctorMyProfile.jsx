import { useEffect, useMemo, useState } from "react";
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
  IndianRupee,
  BriefcaseMedical,
  Building2,
  Lock,
  Activity,
  BadgeCheck,
  Loader2,
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

  const profileCompletion = useMemo(() => {
    const fields = [
      profile.doctorName,
      profile.email,
      profile.mobile,
      profile.specialization,
      profile.qualification,
      profile.experience,
      profile.consultationFee,
      profile.city,
      profile.state,
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
      const res = await api.patch("/doctor/profile/photo", formData, {
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
      alert(error.response?.data?.message || "Failed to upload doctor photo");
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
        experience: profile.experience ? Number(profile.experience) : null,
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
      alert(error.response?.data?.message || "Failed to update doctor profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4fbff] flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="text-cyan-600 animate-spin" size={34} />
          </div>

          <p className="text-slate-500 font-semibold">
            Loading doctor profile...
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
                    alt="Doctor"
                    className="w-28 h-28 rounded-[2rem] object-cover border border-slate-100 shadow-sm"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-[2rem] bg-cyan-50 border border-cyan-100 flex items-center justify-center">
                    <Stethoscope size={48} className="text-cyan-600" />
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
                  DOCTOR PROFILE
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                  {profile.doctorName || "Doctor Profile"}
                </h1>

                <p className="text-slate-500 mt-3 text-lg">
                  Manage your professional healthcare profile, consultation
                  details and account security.
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
                Complete all details to improve your doctor visibility.
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
                <Stethoscope className="text-cyan-600" size={25} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  Professional Information
                </h2>

                <p className="text-slate-500">
                  Keep your doctor profile updated for better patient trust.
                </p>
              </div>
            </div>

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
                icon={IndianRupee}
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
                    Profile Summary
                  </h2>

                  <p className="text-sm text-slate-500">
                    Public doctor details
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <SummaryItem
                  label="Specialization"
                  value={profile.specialization || "Not Set"}
                />

                <SummaryItem
                  label="Experience"
                  value={
                    profile.experience
                      ? `${profile.experience} Years`
                      : "Not Set"
                  }
                />

                <SummaryItem
                  label="Fee"
                  value={
                    profile.consultationFee
                      ? `₹${profile.consultationFee}`
                      : "Not Set"
                  }
                />

                <SummaryItem
                  label="Hospital"
                  value={profile.hospitalName || "Not Set"}
                />

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
                    Protect your account
                  </p>
                </div>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed mb-5">
                Update your password regularly to keep your doctor account
                secure.
              </p>

              <button
                onClick={() => navigate("/doctor/change-password")}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-red-700 transition"
              >
                Change Password
              </button>
            </div>

            <div className="bg-cyan-600 rounded-[2rem] shadow-sm p-6 text-white">
              <ShieldCheck className="mb-4" size={28} />

              <h2 className="text-xl font-black">
                Verified Doctor Profile
              </h2>

              <p className="text-cyan-100 text-sm mt-2 leading-relaxed">
                Updated profiles help patients trust your consultation details
                and book appointments faster.
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