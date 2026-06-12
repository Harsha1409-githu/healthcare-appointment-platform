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
  IndianRupee,
  BadgeCheck,
  ShieldCheck,
  Clock,
  ArrowRight,
  Sparkles,
  Activity,
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

      const doctors = res.data?.data || [];

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
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6 py-8">
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                <Brain size={17} />
                AI SYMPTOM CHECKER
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                Understand Your Symptoms
              </h1>

              <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
                Describe symptoms and get suggested care guidance, urgency
                level and recommended doctors for faster booking.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <MiniStat title="Analyze" value="AI" icon={Brain} />
              <MiniStat title="Specialist" value="Match" icon={Stethoscope} />
              <MiniStat title="Care" value="Guide" icon={ShieldCheck} />
            </div>
          </div>
        </section>

        <section className="grid xl:grid-cols-[1fr_460px] gap-8">
          <main className="space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
                  <HeartPulse className="text-cyan-600" size={25} />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-950">
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
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-cyan-500 resize-none text-slate-800"
              />

              <button
                onClick={analyzeSymptoms}
                disabled={!symptoms.trim()}
                className="mt-5 w-full flex items-center justify-center gap-2 bg-cyan-600 text-white py-4 rounded-2xl font-black hover:bg-cyan-700 transition disabled:bg-slate-400"
              >
                <Search size={19} />
                Analyze Symptoms
                <ArrowRight size={18} />
              </button>

              <div className="mt-5 bg-yellow-50 border border-yellow-100 rounded-2xl p-4 flex gap-3">
                <ShieldAlert
                  className="text-yellow-600 shrink-0 mt-0.5"
                  size={22}
                />

                <p className="text-sm text-yellow-800 leading-relaxed">
                  This tool is only for guidance and is not a medical diagnosis.
                  For severe symptoms such as chest pain, breathing difficulty,
                  fainting, or heavy bleeding, seek urgent medical care.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <StepCard
                icon={Search}
                title="Describe"
                desc="Tell us your symptoms"
              />

              <StepCard
                icon={Brain}
                title="Analyze"
                desc="Get smart guidance"
              />

              <StepCard
                icon={Stethoscope}
                title="Book"
                desc="Find matching doctors"
              />
            </div>
          </main>

          <aside className="space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8">
              {!result ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-20 h-20 rounded-3xl bg-cyan-50 flex items-center justify-center mb-5">
                    <Stethoscope size={42} className="text-cyan-600" />
                  </div>

                  <h3 className="text-2xl font-black text-slate-950">
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

                        <h3 className="text-xl font-black text-slate-950">
                          {result.condition}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <Info
                    label="Recommended Specialization"
                    value={result.specialization}
                  />

                  <Info label="Suggested Advice" value={result.advice} />

                  <button
                    onClick={findDoctors}
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-cyan-600 text-white py-4 rounded-2xl font-black hover:bg-cyan-700 transition"
                  >
                    <Stethoscope size={19} />
                    Find {result.specialization} Doctors
                  </button>

                  {result.urgent && (
                    <p className="text-sm text-red-600 font-bold mt-4 text-center">
                      Urgent symptoms detected. Please do not delay medical
                      help.
                    </p>
                  )}
                </div>
              )}
            </div>

            {result && (
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
                <h3 className="text-xl font-black text-slate-950 mb-4">
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
                      className="mt-3 text-cyan-700 font-black"
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
              </div>
            )}
          </aside>
        </section>
      </div>
    </div>
  );
}

function RecommendedDoctor({ doctor, navigate }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <img
          src={
            doctor.profileImage ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              doctor.doctorName || "Doctor"
            )}&background=0891b2&color=fff&bold=true`
          }
          alt={doctor.doctorName}
          className="w-14 h-14 rounded-2xl object-cover"
        />

        <div className="flex-1 min-w-0">
          <p className="font-black text-slate-950 truncate">
            {doctor.doctorName}
          </p>

          <p className="text-sm text-slate-500 truncate">
            {doctor.specialization}
          </p>

          <div className="inline-flex items-center gap-1 mt-1 text-emerald-700 text-xs font-black">
            <BadgeCheck size={13} />
            Verified
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-white rounded-xl p-3 border border-slate-100">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
            <Clock size={14} />
            Experience
          </div>

          <p className="font-black text-slate-950">
            {doctor.experience}+ yrs
          </p>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-100">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
            <IndianRupee size={14} />
            Fee
          </div>

          <p className="font-black text-slate-950">
            ₹{doctor.consultationFee}
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate(`/doctor/${doctor.id}`)}
        className="mt-4 w-full bg-cyan-600 text-white py-3 rounded-2xl font-black hover:bg-cyan-700 transition"
      >
        View & Book
      </button>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mt-4">
      <p className="text-xs font-bold text-slate-400 uppercase">
        {label}
      </p>

      <p className="font-black text-slate-950 mt-1">
        {value}
      </p>
    </div>
  );
}

function StepCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <Icon className="text-cyan-600 mb-3" size={24} />

      <h3 className="font-black text-slate-950">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        {desc}
      </p>
    </div>
  );
}

function MiniStat({ title, value, icon: Icon }) {
  return (
    <div className="min-w-[90px] bg-slate-50 rounded-2xl border border-slate-100 p-3">
      <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center mb-2">
        <Icon className="text-cyan-600" size={18} />
      </div>

      <p className="text-xl font-black text-slate-950">
        {value}
      </p>

      <p className="text-xs text-slate-500 font-bold">
        {title}
      </p>
    </div>
  );
}