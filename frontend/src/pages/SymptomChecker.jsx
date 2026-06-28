import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Stethoscope,
  Search,
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  IndianRupee,
  BadgeCheck,
  Clock,
  ArrowRight,
} from "lucide-react";
import api from "../api/axios";

const rules = [
  {
    keywords: ["fever", "cough", "cold", "headache", "body pain", "flu"],
    condition: "Viral Fever / Flu-like Illness",
    specialization: "General Physician",
    advice:
      "Drink fluids, take rest, monitor temperature and consult a doctor if symptoms continue.",
  },
  {
    keywords: [
      "chest pain",
      "heart pain",
      "breathless",
      "shortness of breath",
      "palpitation",
    ],
    condition: "Possible Heart / Respiratory Concern",
    specialization: "Cardiology",
    advice:
      "This may need urgent medical attention. Please consult a doctor immediately.",
    urgent: true,
  },
  {
    keywords: ["skin rash", "itching", "acne", "allergy", "red spots"],
    condition: "Skin Allergy / Dermatology Concern",
    specialization: "Dermatology",
    advice:
      "Avoid scratching, keep the area clean and consult a dermatologist.",
  },
  {
    keywords: [
      "child fever",
      "baby fever",
      "child cough",
      "vomiting child",
      "baby cough",
    ],
    condition: "Pediatric Concern",
    specialization: "Pediatrics",
    advice:
      "Children need careful monitoring. Please consult a pediatrician.",
  },
  {
    keywords: [
      "joint pain",
      "knee pain",
      "back pain",
      "bone pain",
      "shoulder pain",
    ],
    condition: "Orthopedic Concern",
    specialization: "Orthopedics",
    advice:
      "Avoid strain, rest the affected area and consult an orthopedic doctor.",
  },
  {
    keywords: [
      "ear pain",
      "throat pain",
      "nose block",
      "sinus",
      "tonsil",
      "hearing problem",
    ],
    condition: "ENT Concern",
    specialization: "ENT",
    advice:
      "Steam inhalation may help, but consult an ENT specialist if symptoms persist.",
  },
  {
    keywords: [
      "migraine",
      "dizziness",
      "fits",
      "seizure",
      "numbness",
      "nerve pain",
    ],
    condition: "Neurology Concern",
    specialization: "Neurology",
    advice:
      "Avoid stress, stay hydrated and consult a neurologist if symptoms are frequent or severe.",
  },
];

export default function SymptomChecker() {
  const navigate = useNavigate();

  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [recommendedDoctors, setRecommendedDoctors] = useState([]);
  const [doctorLoading, setDoctorLoading] = useState(false);

  const fetchRecommendedDoctors = async (specialization) => {
    try {
      setDoctorLoading(true);

      const res = await api.get(
        `/doctor/search?specialization=${encodeURIComponent(specialization)}`
      );

      const doctors = res.data?.data || res.data || [];

      setRecommendedDoctors(
        doctors.filter((doctor) => doctor.isActive).slice(0, 3)
      );
    } catch (error) {
      console.error("Recommended doctor error:", error);
      setRecommendedDoctors([]);
    } finally {
      setDoctorLoading(false);
    }
  };

  const saveSymptomHistory = async (data) => {
    const token = localStorage.getItem("patientToken");

    if (!token) return;

    try {
      await api.post("/symptom-history", {
        symptoms,
        condition: data.condition,
        specialization: data.specialization,
        advice: data.advice,
        urgent: data.urgent || false,
      });
    } catch (error) {
      console.error("History save failed", error);
    }
  };

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      alert("Please enter symptoms");
      return;
    }

    const text = symptoms.toLowerCase();

    const matched = rules.find((rule) =>
      rule.keywords.some((keyword) => text.includes(keyword))
    );

    const finalResult =
      matched || {
        condition: "General Health Concern",
        specialization: "General Physician",
        advice:
          "Your symptoms need a doctor's review. Please consult a general physician.",
        urgent: false,
      };

    setResult(finalResult);
    fetchRecommendedDoctors(finalResult.specialization);
    saveSymptomHistory(finalResult);
  };

  const findDoctors = () => {
    if (!result?.specialization) return;

    navigate(
      `/doctors?specialization=${encodeURIComponent(result.specialization)}`
    );
  };

  return (
    <main className="min-h-screen bg-[#f4f8fb] px-4 pt-4 pb-24">
      <div className="max-w-md mx-auto">
        <header className="mb-4">
          <div className="inline-flex items-center gap-1.5 text-cyan-700 font-black text-xs">
            <Brain size={15} />
            AI SYMPTOM CHECKER
          </div>

          <h1 className="text-2xl font-black text-slate-950 mt-1">
            Check Symptoms
          </h1>

          <p className="text-sm text-slate-500 font-semibold">
            Get guidance and find the right specialist.
          </p>
        </header>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center">
              <HeartPulse className="text-cyan-600" size={22} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-950">
                Describe symptoms
              </h2>

              <p className="text-xs text-slate-500">
                Example: fever, cough, chest pain
              </p>
            </div>
          </div>

          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows="5"
            placeholder="Type your symptoms here..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-cyan-500 resize-none text-sm text-slate-800"
          />

          <button
            onClick={analyzeSymptoms}
            disabled={!symptoms.trim()}
            className="mt-3 w-full flex items-center justify-center gap-2 bg-cyan-600 text-white py-3.5 rounded-2xl font-black active:scale-95 transition disabled:bg-slate-400"
          >
            <Search size={18} />
            Analyze Symptoms
            <ArrowRight size={17} />
          </button>
        </section>

        <section className="mt-3 bg-yellow-50 border border-yellow-100 rounded-3xl p-4 flex gap-3">
          <AlertTriangle
            className="text-yellow-600 shrink-0 mt-0.5"
            size={20}
          />

          <p className="text-xs text-yellow-800 leading-relaxed font-semibold">
            This is not a medical diagnosis. For chest pain, breathing
            difficulty, fainting, heavy bleeding or emergencies, seek urgent
            medical care immediately.
          </p>
        </section>

        {result && (
          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
            <div
              className={`rounded-2xl p-4 mb-3 ${
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
                    Possible Concern
                  </p>

                  <h3 className="text-base font-black text-slate-950 mt-1">
                    {result.condition}
                  </h3>
                </div>
              </div>
            </div>

            <Info label="Recommended Specialist" value={result.specialization} />
            <Info label="Advice" value={result.advice} />

            <button
              onClick={findDoctors}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-950 text-white py-3.5 rounded-2xl font-black active:scale-95 transition"
            >
              <Stethoscope size={18} />
              Find {result.specialization} Doctors
            </button>
          </section>
        )}

        {result && (
          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-black text-slate-950">
                Recommended Doctors
              </h3>

              <button
                onClick={findDoctors}
                className="text-cyan-600 font-black text-xs"
              >
                View All
              </button>
            </div>

            {doctorLoading ? (
              <p className="text-sm text-slate-500">
                Loading doctors...
              </p>
            ) : recommendedDoctors.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl p-4 text-center">
                <p className="text-sm font-bold text-slate-600">
                  No doctors found for {result.specialization}
                </p>

                <button
                  onClick={findDoctors}
                  className="mt-2 text-cyan-700 font-black text-sm"
                >
                  Search all doctors
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recommendedDoctors.map((doctor) => (
                  <RecommendedDoctor
                    key={doctor.id}
                    doctor={doctor}
                    navigate={navigate}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

function RecommendedDoctor({ doctor, navigate }) {
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
            {doctor.doctorName}
          </p>

          <p className="text-xs text-cyan-700 font-black truncate">
            {doctor.specialization}
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

      <button
        onClick={() => navigate(`/doctor/${doctor.id}`)}
        className="mt-3 w-full bg-cyan-600 text-white py-3 rounded-2xl font-black active:scale-95 transition"
      >
        View & Book
      </button>
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