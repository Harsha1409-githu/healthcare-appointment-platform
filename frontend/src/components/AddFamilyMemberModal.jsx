import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

const relations = [
  "MOTHER",
  "FATHER",
  "SPOUSE",
  "SON",
  "DAUGHTER",
  "OTHER",
];

export default function AddFamilyMemberModal({
  patientId,
  memberCount = 0,
  onClose,
  onSaved,
}) {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    relation: "MOTHER",
    gender: "",
    age: "",
    bloodGroup: "",
    mobile: "",
  });

 const saveMember = async () => {
  if (memberCount >= 3) {
    toast.error("You can add only 3 family members");
    return;
  }

  try {
    await api.post("/family-member", {
      patientId,
      ...form,
    });

    toast.success("Family member added");

    onSaved();
  } catch (error) {
    console.error(error);
    toast.error("Failed to add family member");
  }
};
  return (
    <div className="fixed inset-0 z-[200] bg-black/40 flex items-end">
      <div className="bg-white rounded-t-3xl w-full max-w-md mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-lg">
            Add Family Member
          </h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <input
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) =>
              setForm({
                ...form,
                fullName: e.target.value,
              })
            }
            className="w-full border rounded-2xl p-3"
          />

          <select
            value={form.relation}
            onChange={(e) =>
              setForm({
                ...form,
                relation: e.target.value,
              })
            }
            className="w-full border rounded-2xl p-3"
          >
            {relations.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <input
            placeholder="Age"
            type="number"
            value={form.age}
            onChange={(e) =>
              setForm({
                ...form,
                age: e.target.value,
              })
            }
            className="w-full border rounded-2xl p-3"
          />

          <input
            placeholder="Gender"
            value={form.gender}
            onChange={(e) =>
              setForm({
                ...form,
                gender: e.target.value,
              })
            }
            className="w-full border rounded-2xl p-3"
          />

          <input
            placeholder="Blood Group"
            value={form.bloodGroup}
            onChange={(e) =>
              setForm({
                ...form,
                bloodGroup: e.target.value,
              })
            }
            className="w-full border rounded-2xl p-3"
          />

          <input
            placeholder="Mobile"
            value={form.mobile}
            onChange={(e) =>
              setForm({
                ...form,
                mobile: e.target.value,
              })
            }
            className="w-full border rounded-2xl p-3"
          />

          <button
            onClick={saveMember}
            disabled={saving}
            className="w-full bg-cyan-600 text-white py-3 rounded-2xl font-black"
          >
            {saving ? "Saving..." : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
}