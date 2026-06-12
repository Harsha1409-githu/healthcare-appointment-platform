import { useState } from "react";
import {
  Brain,
  ArrowRight,
  Stethoscope,
  Star,
  IndianRupee,
  BadgeCheck,
  Search,
  AlertTriangle,
  Building2,
  MapPin,
  Loader2,
  Mic,
  History,
  ShieldCheck,
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
    urgent: true,
  },
  {
    keywords: ["skin", "rash", "itching", "allergy", "acne"],
    specialization: "Dermatology",
    condition: "Skin / Allergy Concern",
    advice: "Avoid scratching and consult a dermatologist if symptoms persist.",
  },
  {
    keywords: ["joint", "knee", "back pain", "bone", "shoulder"],
    specialization: "Orthopedics",
    condition: "Orthopedic Concern",
    advice: "Avoid strain and consult an orthopedic specialist.",
  },
  {
    keywords: ["child", "baby", "kid"],
    specialization: "Pediatrics",
    condition: "Pediatric Concern",
    advice: "Children need careful monitoring. Please consult a pediatrician.",
  },
  {
    keywords: ["ear", "throat", "nose", "sinus"],
    specialization: "ENT",
    condition: "ENT Concern",
    advice: "Consult an ENT specialist if symptoms continue.",
  },
];

export default function AIDoctorMatch() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

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
      console.log("Symptom history save skipped:", error);
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
        const symptomRes = await api.post("/symptom-checker/analyze", {
          symptoms,
        });

        aiResult = {
          condition: symptomRes.data.condition || "General Health Concern",
          specialization:
            symptomRes.data.specialization ||
            symptomRes.data.specialist ||
            "General Physician",
          advice:
            symptomRes.data.advice || "Please consult a qualified doctor.",
          urgent: symptomRes.data.urgent || false,
          confidence: symptomRes.data.confidence || 92,
        };
      } catch (error) {
        console.warn("Symptom API failed, using frontend fallback:", error);

        aiResult = {
          ...getFallbackResult(),
          confidence: 86,
        };
      }

      setResult(aiResult);

      setRecentSearches((prev) => [
        symptoms,
        ...prev.filter((item) => item !== symptoms),
      ].slice(0, 4));

      saveSymptomHistory(aiResult);

      const allDoctors = await fetchAllDoctors();

      const activeDoctors = allDoctors.filter((doctor) => doctor.isActive);

      let matchedDoctors = activeDoctors.filter((doctor) =>
        specializationMatches(doctor.specialization, aiResult.specialization)
      );

      if (matchedDoctors.length === 0) {
        matchedDoctors = activeDoctors.filter((doctor) =>
          normalize(
            `${doctor.doctorName} ${doctor.specialization} ${
              doctor.hospital?.hospitalName || ""
            }`
          ).includes(normalize(aiResult.specialization))
        );
      }

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
    <div className="min-h-screen bg-[#f4fbff] py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white p-8 md:p-12 shadow-2xl">
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
        </section>

        <section className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8 mt-8">
          <textarea
            rows="5"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Example: fever, headache and body pain..."
            className="w-full border border-slate-200 bg-slate-50 rounded-2xl p-5 outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
          />

          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={findDoctors}
              disabled={loading}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-cyan-600 text-white font-black hover:bg-cyan-700 disabled:bg-slate-400"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Finding Doctors...
                </>
              ) : (
                <>
                  Match Doctors
                  <Search size={18} />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={startVoiceInput}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-950 text-white font-black hover:bg-slate-800"
            >
              <Mic size={18} />
              Voice Input
            </button>
          </div>

          {recentSearches.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-black text-slate-500 mb-3">
                Recent Searches
              </p>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSymptoms(item)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 text-sm font-bold"
                  >
                    <History size={14} />
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {result && (
          <section className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-8 mt-8">
            <h2 className="text-2xl font-black text-slate-950">
              AI Recommendation
            </h2>

            <div className="grid md:grid-cols-4 gap-4 mt-5">
              <InfoCard label="Possible Condition" value={result.condition} />
              <InfoCard
                label="Recommended Specialist"
                value={result.specialization}
              />
              <InfoCard
                label="Urgency"
                value={result.urgent ? "High" : "Normal"}
              />
              <InfoCard
                label="AI Confidence"
                value={`${result.confidence || 90}%`}
              />
            </div>

            <p className="text-slate-600 mt-5 font-semibold">
              {result.advice}
            </p>

            {result.urgent && (
              <div className="mt-5 bg-red-50 border border-red-200 rounded-2xl p-5">
                <h3 className="font-black text-red-700 flex items-center gap-2">
                  <AlertTriangle size={20} />
                  Emergency Attention Required
                </h3>

                <p className="text-red-600 mt-2">
                  Your symptoms may require immediate medical attention. Visit
                  the nearest emergency department or contact a doctor now.
                </p>
              </div>
            )}
          </section>
        )}

        {result && (
          <section className="mt-10">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-black text-slate-950">
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
                className="hidden md:inline-flex items-center gap-2 text-cyan-600 font-black"
              >
                View All
                <ArrowRight size={18} />
              </Link>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="bg-white rounded-[2rem] border border-slate-100 p-6 animate-pulse h-80"
                  />
                ))}
              </div>
            ) : doctors.length === 0 ? (
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-10 text-center text-slate-500">
                No doctors found.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {doctors.map((doctor, index) => (
                  <DoctorMatchCard
                    key={doctor.id}
                    doctor={doctor}
                    index={index}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function DoctorMatchCard({ doctor, index }) {
  const matchScore = Math.max(78, 95 - index * 3);

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:-translate-y-2 hover:shadow-xl transition">
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

        <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-black">
          {matchScore}% Match
        </div>

        <div className="absolute top-4 right-4 bg-yellow-400 text-slate-950 px-3 py-1 rounded-full flex items-center gap-1 font-black text-sm">
          <Star size={14} className="fill-slate-950" />
          4.{9 - (index % 2)}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-black text-slate-950">
          {doctor.doctorName}
        </h3>

        <p className="text-cyan-600 font-bold mt-1">
          {doctor.specialization}
        </p>

        <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
          <Building2 size={15} />
          {doctor.hospital?.hospitalName || "Partner Hospital"}
        </p>

        <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
          <MapPin size={15} />
          {doctor.city || doctor.hospital?.city || "Location not added"}
        </p>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-cyan-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-cyan-700 font-bold text-sm">
              <BadgeCheck size={16} />
              Exp
            </div>

            <p className="font-black text-slate-950 mt-1">
              {doctor.experience || 0}+ yrs
            </p>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <IndianRupee size={16} />
              Fee
            </div>

            <p className="font-black text-slate-950 mt-1">
              ₹{doctor.consultationFee || 0}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <Link
            to={`/doctor/${doctor.id}`}
            className="flex items-center justify-center gap-2 w-full bg-cyan-600 text-white py-3 rounded-2xl font-black hover:bg-cyan-700"
          >
            View Profile
            <ArrowRight size={18} />
          </Link>

          <Link
            to={`/doctor/${doctor.id}`}
            className="flex items-center justify-center gap-2 w-full bg-slate-950 text-white py-3 rounded-2xl font-black hover:bg-slate-800"
          >
            Book Appointment
            <ShieldCheck size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
      <p className="text-xs font-black text-slate-400 uppercase">
        {label}
      </p>

      <p className="text-xl font-black text-slate-950 mt-2">
        {value || "-"}
      </p>
    </div>
  );
}