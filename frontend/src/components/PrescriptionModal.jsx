import { useState } from "react";
import {
  X,
  Save,
  Sparkles,
  Loader2,
  ClipboardList,
  Pill,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function PrescriptionModal({
  appointment,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState({
    diagnosis: "",
    medicines: "",
    notes: "",
    roughNotes: "",
  });

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const patientName =
    appointment?.patient?.fullName ||
    appointment?.patientName ||
    "Patient";

  const generateAiNotes = async () => {
    if (!form.roughNotes.trim()) {
      toast.error("Please enter rough consultation notes first");
      return;
    }

    try {
      setGenerating(true);

      const res = await api.post("/ai-consultation/generate-notes", {
        symptoms: form.roughNotes,
        doctorNotes: form.notes,
        patientAge: appointment?.patient?.age,
        specialization: appointment?.doctor?.specialization,
      });

      setForm((prev) => ({
        ...prev,
        diagnosis: res.data.assessment || prev.diagnosis,
        medicines: res.data.medicines || prev.medicines,
        notes: `${res.data.plan || ""}\n\nFollow-up:\n${
          res.data.followUp || ""
        }`.trim(),
      }));

      toast.success("AI notes generated");
    } catch (error) {
      console.error("AI notes error:", error);
      toast.error("Failed to generate AI notes");
    } finally {
      setGenerating(false);
    }
  };

  const savePrescription = async () => {
    if (!appointment?.id) {
      toast.error("Appointment not found");
      return;
    }

    if (!form.diagnosis || !form.medicines) {
      toast.error("Diagnosis and medicines are required");
      return;
    }

    try {
      setSaving(true);

      await api.post("/prescription", {
        appointmentId: appointment.id,
        diagnosis: form.diagnosis,
        medicines: form.medicines,
        notes: form.notes,
      });

      toast.success("Prescription created successfully");
      onSaved?.();
      onClose?.();
    } catch (error) {
      console.error("Prescription save error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create prescription"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end justify-center px-4">
      <div className="bg-white rounded-t-[2rem] shadow-2xl border border-slate-100 w-full max-w-md max-h-[92vh] overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-950">
              Create Prescription
            </h2>

            <p className="text-sm text-slate-500">{patientName}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto max-h-[68vh]">
          <TextAreaField
            icon={Sparkles}
            label="Rough Consultation Notes"
            value={form.roughNotes}
            onChange={(e) =>
              setForm({
                ...form,
                roughNotes: e.target.value,
              })
            }
            placeholder="Example: Fever for 3 days, dry cough, no breathing difficulty..."
            rows={3}
          />

          <button
            type="button"
            onClick={generateAiNotes}
            disabled={generating}
            className="w-full bg-violet-600 text-white py-3 rounded-2xl font-black flex items-center justify-center gap-2 disabled:bg-slate-400 active:scale-95 transition"
          >
            {generating ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Sparkles size={18} />
            )}
            {generating ? "Generating AI Notes..." : "Generate AI Notes"}
          </button>

          <TextAreaField
            icon={ClipboardList}
            label="Diagnosis / Assessment"
            value={form.diagnosis}
            onChange={(e) =>
              setForm({
                ...form,
                diagnosis: e.target.value,
              })
            }
            placeholder="Diagnosis or assessment"
            rows={4}
          />

          <TextAreaField
            icon={Pill}
            label="Medicines"
            value={form.medicines}
            onChange={(e) =>
              setForm({
                ...form,
                medicines: e.target.value,
              })
            }
            placeholder="Paracetamol 500mg - twice daily after food"
            rows={4}
          />

          <TextAreaField
            icon={FileText}
            label="Doctor Notes / Plan"
            value={form.notes}
            onChange={(e) =>
              setForm({
                ...form,
                notes: e.target.value,
              })
            }
            placeholder="Additional instructions and follow-up plan"
            rows={4}
          />
        </div>

        <div className="p-4 border-t border-slate-100 grid grid-cols-2 gap-3 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="border border-slate-300 py-3 rounded-2xl font-black"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={savePrescription}
            disabled={saving || generating}
            className="flex items-center justify-center gap-2 bg-cyan-600 text-white py-3 rounded-2xl font-black disabled:bg-slate-400"
          >
            {saving ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Save size={17} />
            )}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TextAreaField({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  rows,
}) {
  return (
    <label className="block">
      <p className="text-xs font-black text-slate-700 mb-1.5 flex items-center gap-1.5">
        <Icon size={15} className="text-cyan-600" />
        {label}
      </p>

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-cyan-500 resize-none text-sm"
      />
    </label>
  );
}