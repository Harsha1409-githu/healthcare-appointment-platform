import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardCheck,
  Thermometer,
  HeartPulse,
  Weight,
  FileText,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/api/axios";

export default function AppointmentCheckIn() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    temperature: "",
    bloodPressure: "",
    weight: "",
    symptoms: "",
    notes: "",
  });

  const symptomOptions = [
  { label: "Fever", icon: "🤒" },
  { label: "Headache", icon: "🤕" },
  { label: "Cough", icon: "😷" },
  { label: "Cold", icon: "🤧" },
  { label: "Body Pain", icon: "💪" },
  { label: "Vomiting", icon: "🤮" },
  { label: "Diarrhea", icon: "🚽" },
  { label: "Breathing Issue", icon: "🫁" },
];

const toggleSymptom = (symptom) => {
  const current = form.symptoms
    ? form.symptoms.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const updated = current.includes(symptom)
    ? current.filter((item) => item !== symptom)
    : [...current, symptom];

  setForm({
    ...form,
    symptoms: updated.join(", "),
  });
};

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitCheckIn = async (e) => {
    e.preventDefault();

    if (!form.symptoms.trim()) {
      toast.error("Please enter symptoms");
      return;
    }

    try {
      setLoading(true);

      await api.post("/check-in", {
        appointmentId: Number(id),
        ...form,
      });

      toast.success("Check-in completed");
      navigate(`/patient/appointments/${id}`);
    } catch (error) {
      console.error("Check-in error:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit check-in"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f8fb] px-4 py-4 pb-28">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <Link
            to={`/patient/appointments/${id}`}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center"
          >
            <ArrowLeft size={19} className="text-slate-700" />
          </Link>

          <div>
            <p className="text-xs font-black text-cyan-700">
              PRE-CONSULTATION
            </p>
            <h1 className="text-xl font-black text-slate-950">
              Check-In
            </h1>
          </div>
        </div>

        <section className="bg-cyan-600 text-white rounded-3xl p-5 shadow-sm">
          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <ClipboardCheck size={24} />
            </div>

            <div>
              <h2 className="font-black text-lg">
                Help your doctor prepare
              </h2>
              <p className="text-sm text-cyan-100 mt-1">
                Share symptoms, vitals and notes before consultation.
              </p>
            </div>
          </div>
        </section>

        <form onSubmit={submitCheckIn} className="space-y-3 mt-3">
          <Field
            icon={Thermometer}
            label="Temperature"
            name="temperature"
            value={form.temperature}
            onChange={handleChange}
            placeholder="Example: 98.6°F"
          />

          <Field
            icon={HeartPulse}
            label="Blood Pressure"
            name="bloodPressure"
            value={form.bloodPressure}
            onChange={handleChange}
            placeholder="Example: 120/80"
          />

          <Field
            icon={Weight}
            label="Weight"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            placeholder="Example: 72 kg"
          />

          <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm">
  <label className="flex items-center gap-2 text-xs font-black text-slate-500 mb-3">
    <FileText size={16} className="text-cyan-600" />
    Select Symptoms
  </label>

  <div className="flex flex-wrap gap-2">
    {symptomOptions.map((item) => {
  const symptom = item.label;
      const selected = form.symptoms
        .split(",")
        .map((s) => s.trim())
        .includes(symptom);

      return (
        <button
          key={symptom}
          type="button"
          onClick={() => toggleSymptom(symptom)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-black border ${
            selected
              ? "bg-cyan-600 text-white border-cyan-600"
              : "bg-slate-50 text-slate-600 border-slate-200"
          }`}
        >
          <span>{item.icon}</span>
<span>{item.label}</span>
        </button>
      );
    })}
  </div>

  <p className="text-xs text-slate-500 mt-3">
    Selected: {form.symptoms || "None"}
  </p>
</div>

          <TextArea
            icon={FileText}
            label="Additional Notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Anything else the doctor should know?"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 disabled:bg-slate-400 active:scale-95 transition"
          >
            <Send size={18} />
            {loading ? "Submitting..." : "Submit Check-In"}
          </button>
        </form>
      </div>
    </main>
  );
}

function Field({ icon: Icon, label, ...props }) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm">
      <label className="flex items-center gap-2 text-xs font-black text-slate-500 mb-2">
        <Icon size={16} className="text-cyan-600" />
        {label}
      </label>

      <input
        {...props}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none text-sm font-semibold"
      />
    </div>
  );
}

function TextArea({ icon: Icon, label, ...props }) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm">
      <label className="flex items-center gap-2 text-xs font-black text-slate-500 mb-2">
        <Icon size={16} className="text-cyan-600" />
        {label}
      </label>

      <textarea
        {...props}
        rows={4}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none text-sm font-semibold resize-none"
      />
    </div>
  );
}