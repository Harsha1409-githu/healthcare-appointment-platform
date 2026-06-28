import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  Search,
  Mic,
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  Clock,
  IndianRupee,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import api from "../api/axios";

const fallbackRules = [
  {
    keywords: ["fever", "cold", "cough", "headache", "body pain", "flu"],
    specialization: "General Physician",
    condition: "Viral Fever / Flu-like Illness",
    advice:
      "Drink fluids, take rest, monitor temperature and consult a doctor if symptoms continue.",
  },
  {
    keywords: ["chest", "heart", "breath", "breathless"],
    specialization: "Cardiology",
    condition: "Possible Heart / Respiratory Concern",
    advice:
      "This may need urgent medical attention. Please consult a cardiologist immediately.",
    urgent: true,
  },
  {
    keywords: ["skin", "rash", "itching", "allergy", "acne"],
    specialization: "Dermatology",
    condition: "Skin / Allergy Concern",
    advice:
      "Avoid scratching and consult a dermatologist if symptoms persist.",
  },
  {
    keywords: ["joint", "knee", "back pain", "bone", "shoulder"],
    specialization: "Orthopedics",
    condition: "Orthopedic Concern",
    advice:
      "Avoid strain and consult an orthopedic specialist.",
  },
  {
    keywords: ["child", "baby", "kid"],
    specialization: "Pediatrics",
    condition: "Pediatric Concern",
    advice:
      "Children need careful monitoring. Please consult a pediatrician.",
  },
  {
    keywords: ["ear", "throat", "nose", "sinus"],
    specialization: "ENT",
    condition: "ENT Concern",
    advice:
      "Consult an ENT specialist if symptoms continue.",
  },
];

export default function AIDoctorMatch() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const normalize = (text = "") =>
    text.toLowerCase().replace(/\s+/g, " ").trim();

  const getFallbackResult = () => {
    const text = normalize(symptoms);

    const matched = fallbackRules.find((rule) =>
      rule.keywords.some((keyword) => text.includes(keyword))
    );

    return (
      matched || {
        specialization: "General Physician",
        condition: "General Health Concern",
        advice:
          "Your symptoms need a doctor's review. Please consult a general physician.",
        urgent: false,
      }
    );
  };

  const specializationMatches = (doctorSpecialization, aiSpecialization) => {
    const doctorSpec = normalize(doctorSpecialization);
    const aiSpec = normalize(aiSpecialization);

    if (!doctorSpec || !aiSpec) return false;

    if (doctorSpec.includes(aiSpec) || aiSpec.includes(doctorSpec)) {
      return true;
    }

    const aliases = {
      "general physician": ["general medicine", "physician", "general"],
      cardiology: ["cardiologist", "heart"],
      dermatologist: ["dermatology", "skin"],
      dermatology: ["dermatologist", "skin"],
      pediatrics: ["paediatrics", "pediatrician", "child"],
      orthopedics: ["orthopaedics", "ortho", "bone"],
      ent: ["ear", "nose", "throat"],
    };

    const aiAliases = aliases[aiSpec] || [];

    return aiAliases.some((alias) => doctorSpec.includes(alias));
  };

  const saveSymptomHistory = async (aiResult) => {
    try {
      await api.post("/symptom-history", {
        symptoms,
        condition: aiResult.condition,
        specialization: aiResult.specialization,
        advice: aiResult.advice,
        urgent: aiResult.urgent || false,
      });
    } catch (error) {
      console.log("Symptom history save skipped");
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const text = event.results?.[0]?.[0]?.transcript || "";
      setSymptoms((prev) => `${prev} ${text}`.trim());
    };

    recognition.start();
  };

  const findDoctors = async () => {
    if (!symptoms.trim()) {
      alert("Please enter symptoms");
      return;
    }

    try {
      setLoading(true);
      setDoctors([]);

      let aiResult;

      try {
        const res = await api.post("/symptom-checker/analyze", {
          symptoms,
        });

        aiResult = {
          condition: res.data.condition || "General Health Concern",
          specialization:
            res.data.specialization ||
            res.data.specialist ||
            "General Physician",
          advice: res.data.advice || "Please consult a qualified doctor.",
          urgent: res.data.urgent || false,
        };
      } catch (error) {
        aiResult = getFallbackResult();
      }

      setResult(aiResult);
      saveSymptomHistory(aiResult);

      const doctorRes = await api.get("/doctor");
      const allDoctors = doctorRes.data || [];

      const activeDoctors = allDoctors.filter((doctor) => doctor.isActive);

      let matchedDoctors = activeDoctors.filter((doctor) =>
        specializationMatches(doctor.specialization, aiResult.specialization)
      );

      if (matchedDoctors.length === 0) {
        matchedDoctors = activeDoctors.slice(0, 5);
      }

      setDoctors(matchedDoctors.slice(0, 5));
    } catch (error) {
      console.error("AI doctor match error:", error);
      alert("Failed to match doctors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f8fb] px-4 pt-4 pb-24">
      <div className="max-w-md mx-auto">
        <header className="mb-4">
          <div className="inline-flex items-center gap-1.5 text-cyan-700 font-black text-xs">
            <Brain size={15} />
            AI DOCTOR MATCH
          </div>

          <h1 className="text-2xl font-black text-slate-950 mt-1">
            Find Right Doctor
          </h1>

          <p className="text-sm text-slate-500 font-semibold">
            Describe symptoms and get matched with a specialist.
          </p>
        </header>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
          <textarea
            rows="5"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Example: fever, headache and body pain..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-cyan-500 resize-none text-sm text-slate-800"
          />

          <div className="grid grid-cols-[1fr_auto] gap-3 mt-3">
            <button
              onClick={findDoctors}
              disabled={loading || !symptoms.trim()}
              className="flex items-center justify-center gap-2 bg-cyan-600 text-white py-3.5 rounded-2xl font-black active:scale-95 transition disabled:bg-slate-400"
            >
              {loading ? (
                "Finding..."
              ) : (
                <>
                  <Search size={18} />
                  Find Doctor
                </>
              )}
            </button>

            <button
              type="button"
              onClick={startVoiceInput}
              className="w-14 h-14 rounded-2xl bg-slate-950 text-white flex items-center justify-center active:scale-95 transition"
            >
              <Mic size={20} />
            </button>
          </div>
        </section>

        <section className="mt-3 bg-yellow-50 border border-yellow-100 rounded-3xl p-4 flex gap-3">
          <AlertTriangle
            className="text-yellow-600 shrink-0 mt-0.5"
            size={20}
          />

          <p className="text-xs text-yellow-800 leading-relaxed font-semibold">
            AI suggestions are for guidance only. For emergencies, chest pain,
            breathing difficulty or fainting, seek urgent medical care.
          </p>
        </section>

        {result && (
          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
            <div
              className={`rounded-2xl p-4 ${
                result.urgent
                  ? "bg-red-50 border border-red-100"
                  : "bg-emerald-50 border border-emerald-100"
              }`}
            >
              <div className="flex items-start gap-3">
                {result.urgent ? (
                  <AlertTriangle
                    className="text-red-600 shrink-0 mt-0.5"
                    size={24}
                  />
                ) : (
                  <CheckCircle2
                    className="text-emerald-600 shrink-0 mt-0.5"
                    size={24}
                  />
                )}

                <div>
                  <p className="text-xs font-bold text-slate-500">
                    Possible Condition
                  </p>

                  <h3 className="text-base font-black text-slate-950 mt-1">
                    {result.condition}
                  </h3>
                </div>
              </div>
            </div>

            <Info label="Recommended Specialist" value={result.specialization} />
            <Info label="Advice" value={result.advice} />
          </section>
        )}

        {result && (
          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-black text-slate-950">
                Recommended Doctors
              </h2>

              <Link
                to={`/doctors?specialization=${encodeURIComponent(
                  result.specialization
                )}`}
                className="text-cyan-600 font-black text-xs"
              >
                View All
              </Link>
            </div>

            {loading ? (
              <p className="text-sm text-slate-500">
                Loading doctors...
              </p>
            ) : doctors.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-4 text-center">
                <p className="text-sm text-slate-500">
                  No matching doctors found.
                </p>

                <Link
                  to="/doctors"
                  className="inline-flex mt-3 bg-cyan-600 text-white px-4 py-2.5 rounded-2xl font-black text-sm"
                >
                  Browse Doctors
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {doctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

function DoctorCard({ doctor }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
      <div className="flex items-center gap-3">
        <img
          src={
            doctor.profileImage ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              doctor.doctorName || "Doctor"
            )}&background=0891b2&color=fff&bold=true`
          }
          alt={doctor.doctorName || "Doctor"}
          className="w-14 h-14 rounded-2xl object-cover border border-slate-100"
        />

        <div className="min-w-0 flex-1">
          <p className="font-black text-slate-950 truncate">
            {doctor.doctorName || "Doctor"}
          </p>

          <p className="text-xs text-cyan-700 font-black truncate">
            {doctor.specialization || "Specialist"}
          </p>

          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-semibold">
            <span className="inline-flex items-center gap-1">
              <Clock size={12} />
              {doctor.experience || 0} yrs
            </span>

            <span className="inline-flex items-center gap-1">
              <IndianRupee size={12} />
              {doctor.consultationFee || 0}
            </span>
          </div>

          <div className="inline-flex items-center gap-1 mt-1 text-emerald-700 text-xs font-black">
            <BadgeCheck size={13} />
            Verified
          </div>
        </div>
      </div>

      <Link
        to={`/doctor/${doctor.id}`}
        className="mt-3 w-full bg-cyan-600 text-white py-3 rounded-2xl font-black active:scale-95 transition flex items-center justify-center gap-2"
      >
        View & Book
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 mt-3">
      <p className="text-[11px] font-black text-slate-400 uppercase">
        {label}
      </p>

      <p className="font-black text-slate-950 mt-1 text-sm leading-relaxed">
        {value}
      </p>
    </div>
  );
}