import { useState } from "react";
import {
  Brain,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Stethoscope,
  Loader2,
  ShieldCheck,
  Search,
  CalendarCheck,
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
        condition: res.data.condition || "General Health Concern",
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
      `/doctors?specialization=${encodeURIComponent(result.specialist)}`
    );
  };

  return (
    <section className="py-20 bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-5">
              <Brain size={17} />
              AI HEALTH ASSISTANT
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-slate-950 leading-tight">
              Get smart guidance
              <span className="block text-cyan-600">
                for your symptoms
              </span>
            </h2>

            <p className="text-slate-500 text-lg mt-5 max-w-2xl leading-relaxed">
              Describe your symptoms and MediCare helps you understand the
              possible concern, urgency level and the right specialist to visit.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              <StepCard
                icon={Search}
                title="Describe"
                desc="Enter symptoms"
              />

              <StepCard
                icon={Brain}
                title="Analyze"
                desc="Get guidance"
              />

              <StepCard
                icon={CalendarCheck}
                title="Book"
                desc="Find doctor"
              />
            </div>

            <p className="mt-6 text-sm text-slate-400 leading-relaxed">
              This tool is for guidance only and is not a medical diagnosis.
              Always consult a qualified doctor for treatment decisions.
            </p>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
            <div className="grid xl:grid-cols-2">
              <div className="p-7 lg:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
                    <Sparkles className="text-cyan-600" size={26} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-950">
                      Symptom Analysis
                    </h3>

                    <p className="text-sm text-slate-500">
                      Example: fever, headache, body pain
                    </p>
                  </div>
                </div>

                <textarea
                  rows="7"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Example: I have fever, headache and body pain for 3 days..."
                  className="w-full border border-slate-200 rounded-2xl p-5 bg-slate-50 outline-none focus:ring-2 focus:ring-cyan-500 resize-none text-slate-800"
                />

                <button
                  onClick={analyzeSymptoms}
                  disabled={loading}
                  className="mt-5 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-cyan-600 text-white font-black hover:bg-cyan-700 transition disabled:bg-slate-400"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={19} />
                  ) : (
                    <Brain size={19} />
                  )}

                  {loading ? "Analyzing..." : "Analyze Symptoms"}

                  {!loading && <ArrowRight size={18} />}
                </button>

                <button
                  onClick={() => navigate("/symptom-checker")}
                  className="mt-3 w-full border border-cyan-600 text-cyan-700 py-4 rounded-2xl font-black hover:bg-cyan-50 transition"
                >
                  Open Full Symptom Checker
                </button>
              </div>

              <div className="bg-slate-50 border-t xl:border-t-0 xl:border-l border-slate-100 p-7 lg:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-100">
                    <ShieldCheck className="text-emerald-600" size={26} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-950">
                      Recommendation
                    </h3>

                    <p className="text-sm text-slate-500">
                      Suggested care path
                    </p>
                  </div>
                </div>

                {!result ? (
                  <div className="min-h-[330px] flex items-center justify-center text-center border border-dashed border-slate-200 rounded-3xl bg-white p-8">
                    <div>
                      <Brain
                        size={42}
                        className="text-cyan-600 mx-auto mb-4"
                      />

                      <p className="font-black text-slate-950">
                        Enter symptoms to get guidance
                      </p>

                      <p className="text-sm text-slate-500 mt-2">
                        MediCare will suggest a specialist and next step.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ResultCard
                      label="Possible Condition"
                      value={result.condition}
                      desc={result.advice}
                    />

                    <ResultCard
                      label="Recommended Specialist"
                      value={result.specialist}
                      icon={Stethoscope}
                    />

                    <div
                      className={`rounded-2xl p-5 border ${
                        result.urgency === "High"
                          ? "bg-red-50 border-red-100 text-red-700"
                          : result.urgency === "Medium"
                          ? "bg-yellow-50 border-yellow-100 text-yellow-700"
                          : "bg-emerald-50 border-emerald-100 text-emerald-700"
                      }`}
                    >
                      <p className="text-sm font-semibold">
                        Urgency Level
                      </p>

                      <h4 className="text-2xl font-black mt-2 flex items-center gap-2">
                        <AlertCircle size={22} />
                        {result.urgency}
                      </h4>
                    </div>

                    <button
                      onClick={bookRecommendedDoctor}
                      className="w-full bg-slate-950 text-white py-4 rounded-2xl font-black hover:bg-cyan-700 transition"
                    >
                      Book {result.specialist} Doctor
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
      <Icon className="text-cyan-600 mb-3" size={23} />
      <p className="font-black text-slate-950">{title}</p>
      <p className="text-xs text-slate-500 font-semibold mt-1">
        {desc}
      </p>
    </div>
  );
}

function ResultCard({ label, value, desc, icon: Icon }) {
  return (
    <div className="rounded-2xl p-5 bg-white border border-slate-100">
      <p className="text-sm text-slate-500 font-semibold">
        {label}
      </p>

      <h4 className="text-2xl font-black mt-2 text-slate-950 flex items-center gap-2">
        {Icon && <Icon size={22} className="text-cyan-600" />}
        {value}
      </h4>

      {desc && (
        <p className="text-slate-500 mt-3 leading-relaxed">
          {desc}
        </p>
      )}
    </div>
  );
}