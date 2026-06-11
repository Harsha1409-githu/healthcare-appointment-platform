import { useState } from "react";
import {
  Brain,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Stethoscope,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function AIHealthAssistant() {
  const navigate = useNavigate();

  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      alert("Please enter symptoms");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/symptom-checker/analyze", {
        symptoms,
      });

      setResult({
        condition:
          res.data.condition || "General Health Concern",
        specialist:
          res.data.specialization ||
          res.data.specialist ||
          "General Physician",
        urgency: res.data.urgent ? "High" : "Low",
        advice:
          res.data.advice ||
          "Please consult a qualified doctor for further review.",
      });
    } catch (error) {
      console.error("AI health assistant error:", error);

      const text = symptoms.toLowerCase();

      if (
        text.includes("fever") ||
        text.includes("cold") ||
        text.includes("cough")
      ) {
        setResult({
          condition: "Viral Fever / Flu-like Illness",
          specialist: "General Physician",
          urgency: "Low",
          advice:
            "Drink fluids, take rest, monitor temperature and consult a doctor if symptoms continue.",
        });
      } else if (
        text.includes("chest") ||
        text.includes("heart") ||
        text.includes("breath")
      ) {
        setResult({
          condition: "Possible Heart / Respiratory Concern",
          specialist: "Cardiology",
          urgency: "High",
          advice:
            "This may need urgent medical attention. Please consult a doctor immediately.",
        });
      } else if (
        text.includes("skin") ||
        text.includes("allergy") ||
        text.includes("rash")
      ) {
        setResult({
          condition: "Skin Allergy / Dermatology Concern",
          specialist: "Dermatology",
          urgency: "Medium",
          advice:
            "Avoid scratching, keep the area clean and consult a dermatologist.",
        });
      } else {
        setResult({
          condition: "General Health Concern",
          specialist: "General Physician",
          urgency: "Medium",
          advice:
            "Your symptoms need a doctor's review. Please consult a general physician.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const bookRecommendedDoctor = () => {
    if (!result?.specialist) {
      navigate("/doctors");
      return;
    }

    navigate(
      `/doctors?specialization=${encodeURIComponent(
        result.specialist
      )}`
    );
  };

  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-blue-50/30 to-slate-50 overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
            <Brain size={18} className="text-blue-600" />
            <span className="font-semibold text-blue-700">
              AI Health Assistant
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-6">
            Describe Your Symptoms
          </h2>

          <p className="text-slate-500 text-lg mt-4 max-w-3xl mx-auto">
            Get instant guidance, suggested specialization and book the right
            doctor in seconds.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
                  <Sparkles className="text-cyan-500" size={28} />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    Symptom Analysis
                  </h3>

                  <p className="text-sm text-slate-500">
                    Example: fever, headache, body pain, chest pain
                  </p>
                </div>
              </div>

              <textarea
                rows="6"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Example: I have fever, headache and body pain for 3 days..."
                className="w-full border border-slate-200 rounded-2xl p-5 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-800"
              />

              <button
                onClick={analyzeSymptoms}
                disabled={loading}
                className="mt-5 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black hover:scale-[1.02] transition disabled:bg-slate-400 disabled:scale-100"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={19} />
                ) : (
                  <Brain size={19} />
                )}
                {loading ? "Analyzing..." : "Analyze Symptoms"}
                {!loading && <ArrowRight size={18} />}
              </button>

              <p className="text-xs text-slate-400 mt-4">
                This tool is for guidance only and is not a medical diagnosis.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white p-8 lg:p-10">
              <h3 className="text-2xl font-black mb-6">
                AI Recommendation
              </h3>

              {!result ? (
                <div className="h-full min-h-[340px] flex items-center justify-center text-center text-blue-100">
                  Enter symptoms and let MediCare guide you to the right
                  specialist.
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
                    <p className="text-sm text-blue-100">
                      Possible Condition
                    </p>

                    <h4 className="text-2xl font-black mt-2">
                      {result.condition}
                    </h4>

                    {result.advice && (
                      <p className="text-blue-100 mt-3 leading-relaxed">
                        {result.advice}
                      </p>
                    )}
                  </div>

                  <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
                    <p className="text-sm text-blue-100">
                      Recommended Specialist
                    </p>

                    <h4 className="text-2xl font-black mt-2 flex items-center gap-2">
                      <Stethoscope size={22} />
                      {result.specialist}
                    </h4>
                  </div>

                  <div
                    className={`rounded-2xl p-5 border ${
                      result.urgency === "High"
                        ? "bg-red-500/20 border-red-300/30"
                        : result.urgency === "Medium"
                        ? "bg-yellow-500/20 border-yellow-300/30"
                        : "bg-emerald-500/20 border-emerald-300/30"
                    }`}
                  >
                    <p className="text-sm text-blue-100">
                      Urgency Level
                    </p>

                    <h4 className="text-2xl font-black mt-2 flex items-center gap-2">
                      <AlertCircle size={22} />
                      {result.urgency}
                    </h4>
                  </div>

                  <button
                    onClick={bookRecommendedDoctor}
                    className="w-full mt-3 bg-white text-blue-700 py-4 rounded-2xl font-black hover:bg-blue-50 transition"
                  >
                    Book {result.specialist} Doctor
                  </button>

                  <button
                    onClick={() => navigate("/symptom-checker")}
                    className="w-full bg-white/10 border border-white/20 text-white py-4 rounded-2xl font-black hover:bg-white/20 transition"
                  >
                    Open Full Symptom Checker
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}