import { useEffect, useState } from "react";
import {
  HeartPulse,
  Save,
  
} from "lucide-react";
import toast from "react-hot-toast";


import api from "../api/axios";
import PageHeader from "../components/PageHeader";





export default function EmergencyProfile() {
  const patient =
    JSON.parse(localStorage.getItem("patientUser") || "null") ||
    JSON.parse(localStorage.getItem("user") || "null");

  const selectedProfile = JSON.parse(
    localStorage.getItem("selectedProfile") || "null"
  );
  

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    bloodGroup: "",
    allergies: "",
    chronicDiseases: "",
    currentMedications: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    insuranceNumber: "",
    organDonor: false,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const url = selectedProfile?.isSelf
        ? `/emergency-profile/patient/${patient.id}/selected`
        : `/emergency-profile/patient/${patient.id}/selected?familyMemberId=${selectedProfile.id}`;

      const res = await api.get(url);

      if (res.data) {
        setForm({
          bloodGroup: res.data.bloodGroup || "",
          allergies: res.data.allergies || "",
          chronicDiseases: res.data.chronicDiseases || "",
          currentMedications: res.data.currentMedications || "",
          emergencyContactName:
            res.data.emergencyContactName || "",
          emergencyContactPhone:
            res.data.emergencyContactPhone || "",
          insuranceNumber:
            res.data.insuranceNumber || "",
          organDonor: res.data.organDonor || false,
        });
      }
    } catch (error) {
      console.log("No emergency profile yet");
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);

      await api.post("/emergency-profile", {
        patientId: patient.id,

        familyMemberId:
          selectedProfile?.isSelf
            ? undefined
            : selectedProfile?.id,

        ...form,
      });

      toast.success("Emergency profile saved");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f8fb]">
        <PageHeader title="Emergency Profile" />

        <div className="max-w-md mx-auto px-4 animate-pulse">
          <div className="h-32 bg-white rounded-3xl" />

          <div className="space-y-3 mt-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 bg-white rounded-3xl"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-28">
      <PageHeader
        title="Emergency Profile"
        subtitle="Critical health information"
      />

      <div className="max-w-md mx-auto px-4">
        <section className="bg-red-50 border border-red-100 rounded-3xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center">
              <HeartPulse
                className="text-red-600"
                size={28}
              />
            </div>

            <div>
              <p className="text-xs font-black text-red-700">
                CURRENT PROFILE
              </p>

              <h2 className="font-black text-slate-950">
                {selectedProfile?.fullName ||
                  patient?.fullName}
              </h2>

              <p className="text-xs text-slate-500">
                {selectedProfile?.relation || "SELF"}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 p-4 mt-3">
          <h2 className="font-black text-slate-950 mb-3">
            Medical Information
          </h2>

          <Input
            label="Blood Group"
            value={form.bloodGroup}
            onChange={(v) =>
              updateField("bloodGroup", v)
            }
            placeholder="O+"
          />

          <Input
            label="Allergies"
            value={form.allergies}
            onChange={(v) =>
              updateField("allergies", v)
            }
            placeholder="Penicillin"
          />

          <Input
            label="Chronic Diseases"
            value={form.chronicDiseases}
            onChange={(v) =>
              updateField("chronicDiseases", v)
            }
            placeholder="Diabetes"
          />

          <Input
            label="Current Medications"
            value={form.currentMedications}
            onChange={(v) =>
              updateField("currentMedications", v)
            }
            placeholder="Metformin"
          />
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 p-4 mt-3">
          <h2 className="font-black text-slate-950 mb-3">
            Emergency Contact
          </h2>

          <Input
            label="Contact Name"
            value={form.emergencyContactName}
            onChange={(v) =>
              updateField("emergencyContactName", v)
            }
            placeholder="Ravi Kumar"
          />

          <Input
            label="Phone Number"
            value={form.emergencyContactPhone}
            onChange={(v) =>
              updateField(
                "emergencyContactPhone",
                v
              )
            }
            placeholder="9876543210"
          />
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 p-4 mt-3">
          <h2 className="font-black text-slate-950 mb-3">
            Insurance
          </h2>

          <Input
            label="Insurance Number"
            value={form.insuranceNumber}
            onChange={(v) =>
              updateField("insuranceNumber", v)
            }
            placeholder="INS123456"
          />
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 p-4 mt-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-950">
                Organ Donor
              </h3>

              <p className="text-xs text-slate-500">
                Registered organ donor
              </p>
            </div>

            <input
              type="checkbox"
              checked={form.organDonor}
              onChange={(e) =>
                updateField(
                  "organDonor",
                  e.target.checked
                )
              }
              className="w-5 h-5"
            />
          </div>
        </section>

        <button
          onClick={saveProfile}
          disabled={saving}
          className="w-full mt-4 bg-red-600 text-white py-4 rounded-3xl font-black flex items-center justify-center gap-2"
        >
          <Save size={18} />

          {saving
            ? "Saving..."
            : "Save Emergency Profile"}
        </button>
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-black text-slate-500 mb-2">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-red-400"
      />
    </div>
  );
}