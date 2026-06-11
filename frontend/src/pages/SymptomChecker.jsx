import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Stethoscope,
  Search,
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  ShieldAlert,
  Star,
  IndianRupee,
  BadgeCheck,
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
        `/doctor/search?specialization=${encodeURIComponent(
          specialization
        )}`
      );

      const doctors = res.data?.data || [];

      setRecommendedDoctors(
        doctors
          .filter((doctor) => doctor.isActive)
          .slice(0, 3)
      );
    } catch (error) {
      console.error("Recommended doctor error:", error);
      setRecommendedDoctors([]);
    } finally {
      setDoctorLoading(false);
    }
  };

  const analyzeSymptoms = async () => {
    const text = symptoms.toLowerCase();

    const matched = rules.find((rule) =>
      rule.keywords.some((keyword) => text.includes(keyword))
    );

    if (matched) {
      setResult(matched);
      fetchRecommendedDoctors(matched.specialization);
      return;
    }
    const token = localStorage.getItem("patientToken");

if (token) {
  try {
    await api.post("/symptom-history", {
      symptoms,
      condition: matched.condition,
      specialization: matched.specialization,
      advice: matched.advice,
      urgent: matched.urgent || false,
    });
  } catch (error) {
    console.error("History save failed", error);
  }
}

    const fallback = {
      condition: "General Health Concern",
      specialization: "General Physician",
      advice:
        "Your symptoms need a doctor's review. Please consult a general physician.",
    };

const analyzeSymptoms = async () => {
  const text = symptoms.toLowerCase();

  const matched = rules.find((rule) =>
    rule.keywords.some((keyword) => text.includes(keyword))
  );

  const token = localStorage.getItem("patientToken");

  if (matched) {
    setResult(matched);
    fetchRecommendedDoctors(matched.specialization);

    if (token) {
      try {
        await api.post("/symptom-history", {
          symptoms,
          condition: matched.condition,
          specialization: matched.specialization,
          advice: matched.advice,
          urgent: matched.urgent || false,
        });
      } catch (error) {
        console.error("History save failed", error);
      }
    }

    return;
  }

  const fallback = {
    condition: "General Health Concern",
    specialization: "General Physician",
    advice:
      "Your symptoms need a doctor's review. Please consult a general physician.",
  };

  setResult(fallback);
  fetchRecommendedDoctors(fallback.specialization);

  if (token) {
    try {
      await api.post("/symptom-history", {
        symptoms,
        condition: fallback.condition,
        specialization: fallback.specialization,
        advice: fallback.advice,
        urgent: false,
      });
    } catch (error) {
      console.error("History save failed", error);
    }
  }
};
  };
  
  const findDoctors = () => {
    if (!result?.specialization) return;

    navigate(
      `/doctors?specialization=${encodeURIComponent(
        result.specialization
      )}`
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/40 to-white py-10 px-6">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      <div className="absolute top-48 right-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white p-8 md:p-10 shadow-2xl mb-8">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mb-5">
              <Brain size={34} className="text-cyan-300" />
            </div>

            <h1 className="text-4xl md:text-5xl font-black">
              AI Symptom Checker
            </h1>

            <p className="text-blue-100 mt-3 max-w-2xl">
              Describe your symptoms and get a suggested doctor specialization
              with recommended doctors for faster appointment booking.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_460px] gap-6">
          <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <HeartPulse className="text-blue-600" size={25} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Describe Your Symptoms
                </h2>
                <p className="text-sm text-slate-500">
                  Example: fever, cough, headache, chest pain, skin rash
                </p>
              </div>
            </div>

            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows="9"
              placeholder="Type your symptoms here..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-800"
            />

            <button
              onClick={analyzeSymptoms}
              disabled={!symptoms.trim()}
              className="mt-5 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-2xl font-black hover:scale-[1.01] transition disabled:bg-slate-400 disabled:scale-100"
            >
              <Search size={19} />
              Analyze Symptoms
            </button>

            <div className="mt-5 bg-yellow-50 border border-yellow-100 rounded-2xl p-4 flex gap-3">
              <ShieldAlert
                className="text-yellow-600 shrink-0 mt-0.5"
                size={22}
              />

              <p className="text-sm text-yellow-800">
                This tool is only for guidance and is not a medical diagnosis.
                For severe symptoms such as chest pain, breathing difficulty,
                fainting, or heavy bleeding, seek urgent medical care.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6 md:p-8">
              {!result ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mb-5">
                    <Stethoscope size={42} className="text-blue-600" />
                  </div>

                  <h3 className="text-2xl font-black text-slate-900">
                    Result will appear here
                  </h3>

                  <p className="text-slate-500 mt-2">
                    Enter symptoms and click analyze.
                  </p>
                </div>
              ) : (
                <div>
                  <div
                    className={`rounded-2xl p-5 mb-5 ${
                      result.urgent
                        ? "bg-red-50 border border-red-100"
                        : "bg-emerald-50 border border-emerald-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {result.urgent ? (
                        <AlertTriangle
                          className="text-red-600 shrink-0"
                          size={30}
                        />
                      ) : (
                        <CheckCircle2
                          className="text-emerald-600 shrink-0"
                          size={30}
                        />
                      )}

                      <div>
                        <p className="text-sm font-bold text-slate-500">
                          Possible Concern
                        </p>

                        <h3 className="text-xl font-black text-slate-900">
                          {result.condition}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Info
                      label="Recommended Specialization"
                      value={result.specialization}
                    />

                    <Info label="Suggested Advice" value={result.advice} />
                  </div>

                  <button
                    onClick={findDoctors}
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-2xl font-black hover:scale-[1.01] transition"
                  >
                    <Stethoscope size={19} />
                    Find {result.specialization} Doctors
                  </button>

                  {result.urgent && (
                    <p className="text-sm text-red-600 font-bold mt-4 text-center">
                      Urgent symptoms detected. Please do not delay medical help.
                    </p>
                  )}
                </div>
              )}
            </div>

            {result && (
              <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6">
                <h3 className="text-xl font-black text-slate-900 mb-4">
                  Recommended Doctors
                </h3>

                {doctorLoading ? (
                  <p className="text-slate-500">
                    Loading recommended doctors...
                  </p>
                ) : recommendedDoctors.length === 0 ? (
                  <div className="bg-slate-50 rounded-2xl p-5 text-center">
                    <p className="font-bold text-slate-700">
                      No doctors found for {result.specialization}
                    </p>
                    <button
                      onClick={findDoctors}
                      className="mt-3 text-blue-600 font-black"
                    >
                      Search all doctors
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recommendedDoctors.map((doctor, index) => (
                      <div
                        key={doctor.id}
                        className="bg-slate-50 border border-slate-100 rounded-2xl p-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              doctor.profileImage ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                doctor.doctorName
                              )}&background=2563eb&color=fff&bold=true`
                            }
                            alt={doctor.doctorName}
                            className="w-14 h-14 rounded-2xl object-cover"
                          />

                          <div className="flex-1 min-w-0">
                            <p className="font-black text-slate-900 truncate">
                              {doctor.doctorName}
                            </p>

                            <p className="text-sm text-slate-500 truncate">
                              {doctor.specialization}
                            </p>
                          </div>

                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-black">
                            <Star size={13} />
                            4.{9 - (index % 2)}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className="bg-white rounded-xl p-3">
                            <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                              <BadgeCheck size={14} />
                              Experience
                            </div>
                            <p className="font-black text-slate-900">
                              {doctor.experience}+ yrs
                            </p>
                          </div>

                          <div className="bg-white rounded-xl p-3">
                            <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                              <IndianRupee size={14} />
                              Fee
                            </div>
                            <p className="font-black text-slate-900">
                              ₹{doctor.consultationFee}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/doctor/${doctor.id}`)}
                          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-2xl font-black hover:bg-blue-700"
                        >
                          View & Book
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-4">
      <p className="text-xs font-bold text-slate-400 uppercase">
        {label}
      </p>
      <p className="font-black text-slate-900 mt-1">{value}</p>
    </div>
  );
}