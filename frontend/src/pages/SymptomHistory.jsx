import { useEffect, useState } from "react";
import {
  Brain,
  AlertTriangle,
  CheckCircle2,
  Search,
  Stethoscope,
  CalendarDays,
} from "lucide-react";
import api from "../api/axios";

export default function SymptomHistory() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/symptom-history/my");
      setHistory(res.data || []);
    } catch (error) {
      console.error("Symptom history error:", {
  status: error.response?.status,
  data: error.response?.data,
  message: error.message,
});
      alert("Failed to load symptom history");
    } finally {
      setLoading(false);
    }
  };

  const filtered = history.filter((item) =>
    `${item.symptoms} ${item.condition} ${item.specialization}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/40 to-white py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white p-8 shadow-2xl mb-8">
          <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mb-5">
            <Brain className="text-cyan-300" size={34} />
          </div>

          <h1 className="text-4xl font-black">
            Symptom History
          </h1>

          <p className="text-blue-100 mt-2">
            Review your previous symptom checks and recommended specializations.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 mb-8">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
            <Search size={19} className="text-blue-600" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search symptoms, condition or specialization..."
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-[2rem] shadow-xl p-10 text-center text-slate-500">
            Loading symptom history...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-[2rem] shadow-xl p-12 text-center">
            <Brain className="text-slate-300 mx-auto mb-4" size={46} />

            <h3 className="text-2xl font-black text-slate-900">
              No symptom history found
            </h3>

            <p className="text-slate-500 mt-2">
              Your symptom checks will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                  <div className="flex gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                        item.urgent
                          ? "bg-red-50"
                          : "bg-emerald-50"
                      }`}
                    >
                      {item.urgent ? (
                        <AlertTriangle
                          className="text-red-600"
                          size={28}
                        />
                      ) : (
                        <CheckCircle2
                          className="text-emerald-600"
                          size={28}
                        />
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        {item.condition}
                      </h3>

                      <p className="text-slate-500 mt-1">
                        {item.symptoms}
                      </p>

                      <div className="flex flex-wrap gap-3 mt-4">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                          <Stethoscope size={16} />
                          {item.specialization}
                        </span>

                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 font-bold text-sm">
                          <CalendarDays size={16} />
                          {new Date(item.createdAt).toLocaleString()}
                        </span>

                        {item.urgent && (
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 font-bold text-sm">
                            Urgent
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Advice
                  </p>
                  <p className="font-semibold text-slate-700 mt-1">
                    {item.advice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}