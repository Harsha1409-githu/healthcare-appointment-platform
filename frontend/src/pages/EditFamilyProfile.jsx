import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Trash2, UserRound } from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/axios";
import PageHeader from "../components/PageHeader";

export default function EditFamilyProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const patient =
    JSON.parse(localStorage.getItem("patientUser") || "null") ||
    JSON.parse(localStorage.getItem("user") || "null");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    relation: "OTHER",
    gender: "",
    age: "",
    mobile: "",
    bloodGroup: "",
    profileImage: "",
  });

  useEffect(() => {
    loadMember();
  }, []);

  const loadMember = async () => {
    try {
      const res = await api.get(`/family-member/${id}`);
      setForm({
        fullName: res.data.fullName || "",
        relation: res.data.relation || "OTHER",
        gender: res.data.gender || "",
        age: res.data.age || "",
        mobile: res.data.mobile || "",
        bloodGroup: res.data.bloodGroup || "",
        profileImage: res.data.profileImage || "",
      });
    } catch (error) {
      toast.error("Unable to load profile");
      navigate("/patient/manage-profiles");
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!form.fullName.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setSaving(true);

      const res = await api.patch(`/family-member/${id}`, {
        ...form,
        age: form.age ? Number(form.age) : null,
      });

      const selectedProfile = JSON.parse(
        localStorage.getItem("selectedProfile") || "null"
      );

      if (selectedProfile?.id === id) {
        localStorage.setItem(
          "selectedProfile",
          JSON.stringify({
            ...res.data,
            isSelf: false,
          })
        );
        window.dispatchEvent(new Event("patientProfileUpdated"));
      }

      toast.success("Profile updated");
      navigate("/patient/manage-profiles");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const deleteProfile = async () => {
    if (!window.confirm("Delete this profile?")) return;

    try {
      await api.delete(`/family-member/${id}`);

      const selectedProfile = JSON.parse(
        localStorage.getItem("selectedProfile") || "null"
      );

      if (selectedProfile?.id === id && patient?.id) {
        localStorage.setItem(
          "selectedProfile",
          JSON.stringify({
            id: patient.id,
            fullName: patient.fullName,
            relation: "SELF",
            gender: patient.gender,
            age: patient.age,
            mobile: patient.mobile,
            profileImage: patient.profileImage,
            isSelf: true,
          })
        );
      }

      toast.success("Profile deleted");
      navigate("/patient/manage-profiles");
    } catch (error) {
      toast.error("Failed to delete profile");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f8fb] pb-28">
        <PageHeader title="Edit Profile" subtitle="Manage family profile" />

        <div className="max-w-md mx-auto px-4 animate-pulse">
          <div className="h-32 bg-white rounded-3xl" />
          <div className="h-80 bg-white rounded-3xl mt-3" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-28">
      <PageHeader title="Edit Profile" subtitle="Manage family profile" />

      <div className="max-w-md mx-auto px-4">
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 text-center">
          <div className="w-24 h-24 mx-auto rounded-[2rem] bg-cyan-50 border border-cyan-100 flex items-center justify-center overflow-hidden">
            {form.profileImage ? (
              <img
                src={form.profileImage}
                alt={form.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserRound className="text-cyan-600" size={42} />
            )}
          </div>

          <p className="text-xs text-slate-500 font-bold mt-3">
            Family Profile
          </p>

          <h2 className="text-xl font-black text-slate-950 mt-1">
            {form.fullName || "Profile"}
          </h2>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <Input
            label="Name"
            value={form.fullName}
            onChange={(value) => setForm({ ...form, fullName: value })}
            placeholder="Mother"
          />

          <label className="block mb-3">
            <p className="text-xs font-black text-slate-600 mb-1.5">
              Relation
            </p>

            <select
              value={form.relation}
              onChange={(e) =>
                setForm({ ...form, relation: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 outline-none text-sm font-bold"
            >
              <option value="FATHER">Father</option>
              <option value="MOTHER">Mother</option>
              <option value="SPOUSE">Spouse</option>
              <option value="SON">Son</option>
              <option value="DAUGHTER">Daughter</option>
              <option value="OTHER">Other</option>
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Age"
              type="number"
              value={form.age}
              onChange={(value) => setForm({ ...form, age: value })}
              placeholder="58"
            />

            <label className="block mb-3">
              <p className="text-xs font-black text-slate-600 mb-1.5">
                Gender
              </p>

              <select
                value={form.gender}
                onChange={(e) =>
                  setForm({ ...form, gender: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 outline-none text-sm font-bold"
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          <Input
            label="Mobile"
            value={form.mobile}
            onChange={(value) => setForm({ ...form, mobile: value })}
            placeholder="9876543210"
          />

          <Input
            label="Blood Group"
            value={form.bloodGroup}
            onChange={(value) => setForm({ ...form, bloodGroup: value })}
            placeholder="O+"
          />
        </section>

        <button
          type="button"
          onClick={saveProfile}
          disabled={saving}
          className="w-full mt-3 bg-cyan-600 text-white py-4 rounded-3xl font-black flex items-center justify-center gap-2 disabled:bg-slate-400"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={deleteProfile}
          className="w-full mt-3 bg-red-50 text-red-600 py-4 rounded-3xl font-black flex items-center justify-center gap-2"
        >
          <Trash2 size={18} />
          Delete Profile
        </button>
      </div>
    </main>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block mb-3">
      <p className="text-xs font-black text-slate-600 mb-1.5">{label}</p>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 outline-none text-sm"
      />
    </label>
  );
}