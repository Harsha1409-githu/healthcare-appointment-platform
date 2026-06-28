import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Save,
  Camera,
  Stethoscope,
  GraduationCap,
  IndianRupee,
  BriefcaseMedical,
  Building2,
  Lock,
  Activity,
  Loader2,
  LogOut,
  ChevronRight,
  CalendarCheck,
  Clock,
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

  const syncDoctorUser = (doctorData) => {
    const currentDoctor = JSON.parse(
      localStorage.getItem("doctorUser") || "{}"
    );

    const updatedDoctor = {
      ...currentDoctor,
      ...doctorData,
    };

    localStorage.setItem("doctorUser", JSON.stringify(updatedDoctor));
    window.dispatchEvent(new Event("doctorProfileUpdated"));
  };

  const loadProfile = async () => {
    try {
      const res = await api.get("/doctor/profile/me");

      const data = {
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
      };

      setProfile(data);
      setPreviewImage(data.profileImage);
      syncDoctorUser(res.data);
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

      const uploadedImage =
        res.data.profileImage ||
        res.data.url ||
        res.data.secure_url ||
        res.data?.data?.profileImage ||
        "";

      setPreviewImage(uploadedImage);

      setProfile((prev) => ({
        ...prev,
        profileImage: uploadedImage,
      }));

      syncDoctorUser({
        ...res.data,
        profileImage: uploadedImage,
      });

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

      syncDoctorUser({
        ...res.data,
        profileImage: profile.profileImage,
      });

      alert("Doctor profile updated successfully");
    } catch (error) {
      console.error("Update doctor profile error:", error);
      alert(error.response?.data?.message || "Failed to update doctor profile");
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorUser");
    navigate("/doctor/login");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f8fb] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
          <Loader2 className="text-cyan-600 animate-spin mx-auto" size={36} />
          <p className="text-slate-500 font-semibold mt-3">
            Loading doctor profile...
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
            <Stethoscope size={15} />
            DOCTOR PROFILE
          </div>

          <h1 className="text-2xl font-black text-slate-950 mt-1">
            My Profile
          </h1>

          <p className="text-sm text-slate-500 font-semibold">
            Manage your professional details.
          </p>
        </header>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
          <div className="flex gap-4">
            <div className="relative w-20 h-20 shrink-0">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Doctor"
                  className="w-20 h-20 rounded-3xl object-cover border border-slate-100"
                />
              ) : (
                <div className="w-20 h-20 rounded-3xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">
                  <Stethoscope size={36} className="text-cyan-600" />
                </div>
              )}

              <label className="absolute -bottom-2 -right-2 bg-cyan-600 text-white p-2 rounded-xl shadow cursor-pointer active:scale-95 transition">
                <Camera size={16} />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagePreview}
                  className="hidden"
                />
              </label>
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-black text-slate-950 truncate">
                Dr. {profile.doctorName || "Doctor"}
              </h2>

              <p className="text-sm text-cyan-700 font-black truncate mt-1">
                {profile.specialization || "Specialization not set"}
              </p>

              <p className="text-xs text-slate-500 truncate mt-1">
                {profile.hospitalName || "Hospital not linked"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <MiniStat
              label="Experience"
              value={profile.experience ? `${profile.experience} Yrs` : "0 Yrs"}
            />

            <MiniStat
              label="Fee"
              value={
                profile.consultationFee ? `₹${profile.consultationFee}` : "₹0"
              }
            />

            <MiniStat label="City" value={profile.city || "Not Set"} />
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-500">
                Profile completion
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
        </section>

        <section className="grid grid-cols-3 gap-2 mt-3">
          <QuickLink
            icon={Activity}
            title="Dashboard"
            onClick={() => navigate("/doctor/dashboard")}
          />

          <QuickLink
            icon={CalendarCheck}
            title="Bookings"
            onClick={() => navigate("/doctor/appointments")}
          />

          <QuickLink
            icon={Clock}
            title="Calendar"
            onClick={() => navigate("/doctor/calendar")}
          />
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <h2 className="text-lg font-black text-slate-950 mb-4">
            Professional Details
          </h2>

          <div className="space-y-3">
            <Input
              icon={UserRound}
              label="Doctor Name"
              name="doctorName"
              value={profile.doctorName}
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

            <div className="grid grid-cols-2 gap-3">
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
                label="Fee"
                name="consultationFee"
                type="number"
                value={profile.consultationFee}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <h2 className="text-lg font-black text-slate-950 mb-4">
            Contact & Location
          </h2>

          <div className="space-y-3">
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
              icon={Building2}
              label="Hospital"
              name="hospitalName"
              value={profile.hospitalName}
              disabled
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
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <MenuItem
            icon={Lock}
            title="Change Password"
            subtitle="Update account security"
            onClick={() => navigate("/doctor/change-password")}
          />

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 py-3 text-left border-t border-slate-100 mt-2"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <LogOut className="text-red-600" size={20} />
            </div>

            <div className="flex-1">
              <h3 className="font-black text-red-600 text-sm">Logout</h3>
              <p className="text-xs text-slate-500">
                Sign out from doctor account
              </p>
            </div>

            <ChevronRight size={18} className="text-slate-400" />
          </button>
        </section>
      </div>

      <div className="fixed bottom-4 left-0 right-0 z-40 px-4">
        <div className="max-w-md mx-auto">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black shadow-lg disabled:bg-gray-400 flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Save size={18} />
            {saving ? "Updating..." : "Save Profile"}
          </button>
        </div>
      </div>
    </form>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-3 text-center">
      <p className="text-sm font-black text-slate-950 truncate">{value}</p>

      <p className="text-[10px] text-slate-500 font-bold mt-1">{label}</p>
    </div>
  );
}

function QuickLink({ icon: Icon, title, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 text-center active:scale-95 transition"
    >
      <Icon className="text-cyan-600 mx-auto" size={21} />

      <p className="text-[11px] font-black text-slate-800 mt-2">{title}</p>
    </button>
  );
}

function MenuItem({ icon: Icon, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3 text-left"
    >
      <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
        <Icon className="text-cyan-600" size={20} />
      </div>

      <div className="flex-1">
        <h3 className="font-black text-slate-900 text-sm">{title}</h3>
        <p className="text-xs text-slate-500">{subtitle}</p>
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
    <label>
      <p className="text-xs font-black text-slate-700 mb-1.5">{label}</p>

      <div
        className={`flex items-center gap-3 border rounded-2xl px-3 py-3 ${
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