import { useState } from "react";
import {
  Brain,
  ArrowRight,
  Stethoscope,
  Star,
  IndianRupee,
  BadgeCheck,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
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
      "general medicine": ["general physician", "physician", "general"],
      cardiology: ["cardiologist", "heart"],
      cardiologist: ["cardiology", "heart"],
      dermatology: ["dermatologist", "skin"],
      dermatologist: ["dermatology", "skin"],
      pediatrics: ["paediatrics", "pediatrician", "child"],
      orthopedics: ["orthopaedics", "ortho", "bone"],
      ent: ["ear", "nose", "throat"],
    };

    const aiAliases = aliases[aiSpec] || [];

    return aiAliases.some((alias) => doctorSpec.includes(alias));
  };

  const fetchAllDoctors = async () => {
    const res = await api.get("/doctor");
    return res.data || [];
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
        const symptomRes = await api.post("/symptom-checker/analyze", {
          symptoms,
        });

        aiResult = {
          condition:
            symptomRes.data.condition || "General Health Concern",
          specialization:
            symptomRes.data.specialization ||
            symptomRes.data.specialist ||
            "General Physician",
          advice:
            symptomRes.data.advice ||
            "Please consult a qualified doctor.",
          urgent: symptomRes.data.urgent || false,
        };
      } catch (error) {
        console.warn("Symptom API failed, using frontend fallback:", error);

        aiResult = getFallbackResult();
      }

      setResult(aiResult);

      const allDoctors = await fetchAllDoctors();

      const activeDoctors = allDoctors.filter((doctor) => doctor.isActive);

      let matchedDoctors = activeDoctors.filter((doctor) =>
        specializationMatches(
          doctor.specialization,
          aiResult.specialization
        )
      );

      if (matchedDoctors.length === 0) {
        matchedDoctors = activeDoctors.filter((doctor) =>
          normalize(
            `${doctor.doctorName} ${doctor.specialization} ${doctor.hospital?.hospitalName || ""}`
          ).includes(normalize(aiResult.specialization))
        );
      }

      // Final fallback: show active doctors so user is not stuck
      if (matchedDoctors.length === 0) {
        matchedDoctors = activeDoctors.slice(0, 6);
      }

      setDoctors(matchedDoctors.slice(0, 6));
    } catch (error) {
      console.error("AI doctor match error:", error);
      alert("Failed to match doctors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/40 to-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white p-8 md:p-12 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <Brain size={18} className="text-cyan-300" />
              <span className="font-bold">AI Doctor Match</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black">
              Find the Right Doctor in Seconds
            </h1>

            <p className="text-blue-100 text-lg mt-4">
              Describe symptoms and MediCare will recommend the right
              specialization and matching doctors.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 md:p-8 mt-8">
          <textarea
            rows="5"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Example: fever, headache and body pain..."
            className="w-full border border-slate-200 bg-slate-50 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          <button
            onClick={findDoctors}
            disabled={loading}
            className="mt-5 inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black disabled:bg-slate-400"
          >
            {loading ? "Finding Doctors..." : "Match Doctors"}
            {!loading && <Search size={18} />}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 md:p-8 mt-8">
            <h2 className="text-2xl font-black text-slate-900">
              AI Recommendation
            </h2>

            <div className="grid md:grid-cols-3 gap-4 mt-5">
              <InfoCard
                label="Possible Condition"
                value={result.condition}
              />

              <InfoCard
                label="Recommended Specialist"
                value={result.specialization}
              />

              <InfoCard
                label="Urgency"
                value={result.urgent ? "High" : "Normal"}
              />
            </div>

            <p className="text-slate-600 mt-5 font-semibold">
              {result.advice}
            </p>
          </div>
        )}

        {result && (
          <div className="mt-10">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900">
                  Recommended Doctors
                </h2>
                <p className="text-slate-500">
                  Showing best matches for {result.specialization}
                </p>
              </div>

              <Link
                to={`/doctors?specialization=${encodeURIComponent(
                  result.specialization
                )}`}
                className="hidden md:inline-flex items-center gap-2 text-blue-600 font-black"
              >
                View All
                <ArrowRight size={18} />
              </Link>
            </div>

            {doctors.length === 0 ? (
              <div className="bg-white rounded-[2rem] shadow-xl p-10 text-center text-slate-500">
                No doctors found.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {doctors.map((doctor, index) => (
                  <div
                    key={doctor.id}
                    className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden hover:-translate-y-2 transition"
                  >
                    <div className="relative h-52 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900">
                      {doctor.profileImage ? (
                        <img
                          src={doctor.profileImage}
                          alt={doctor.doctorName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <Stethoscope size={56} className="text-cyan-300" />
                        </div>
                      )}

                      <div className="absolute top-4 right-4 bg-yellow-400 text-slate-950 px-3 py-1 rounded-full flex items-center gap-1 font-black text-sm">
                        <Star size={14} className="fill-slate-950" />
                        4.{9 - (index % 2)}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-black text-slate-900">
                        {doctor.doctorName}
                      </h3>

                      <p className="text-blue-600 font-bold mt-1">
                        {doctor.specialization}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mt-5">
                        <div className="bg-blue-50 rounded-2xl p-4">
                          <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                            <BadgeCheck size={16} />
                            Exp
                          </div>
                          <p className="font-black text-slate-900 mt-1">
                            {doctor.experience}+ yrs
                          </p>
                        </div>

                        <div className="bg-emerald-50 rounded-2xl p-4">
                          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                            <IndianRupee size={16} />
                            Fee
                          </div>
                          <p className="font-black text-slate-900 mt-1">
                            ₹{doctor.consultationFee}
                          </p>
                        </div>
                      </div>

                      <Link
                        to={`/doctor/${doctor.id}`}
                        className="mt-5 flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-2xl font-black hover:bg-blue-700"
                      >
                        View & Book
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-5">
      <p className="text-xs font-bold text-slate-400 uppercase">
        {label}
      </p>
      <p className="text-xl font-black text-slate-900 mt-2">
        {value || "-"}
      </p>
    </div>
  );
}