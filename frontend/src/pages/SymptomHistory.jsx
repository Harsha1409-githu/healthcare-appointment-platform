import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  AlertTriangle,
  CheckCircle2,
  Search,
  Stethoscope,
  CalendarDays,
  ShieldCheck,
  Filter,
  ClipboardList,
  Activity,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import api from "../api/axios";

export default function SymptomHistory() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("ALL");
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

  const filtered = history.filter((item) => {
    const matchesSearch = `${item.symptoms || ""} ${item.condition || ""} ${
      item.specialization || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesUrgency =
      urgencyFilter === "ALL" ||
      (urgencyFilter === "URGENT" && item.urgent) ||
      (urgencyFilter === "NORMAL" && !item.urgent);

    return matchesSearch && matchesUrgency;
  });

  const stats = useMemo(() => {
    return {
      total: history.length,
      urgent: history.filter((item) => item.urgent).length,
      normal: history.filter((item) => !item.urgent).length,
      specialists: new Set(history.map((item) => item.specialization).filter(Boolean))
        .size,
    };
  }, [history]);

  return (
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6 py-8">
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                <Brain size={17} />
                SYMPTOM HISTORY
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                Previous Symptom Checks
              </h1>

              <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
                Review your past symptom analysis, suggested specializations,
                care advice and urgency history.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MiniStat title="Total" value={stats.total} icon={ClipboardList} />
              <MiniStat title="Urgent" value={stats.urgent} icon={AlertTriangle} />
              <MiniStat title="Normal" value={stats.normal} icon={CheckCircle2} />
              <MiniStat title="Specialists" value={stats.specialists} icon={Stethoscope} />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 mb-8">
          <div className="grid lg:grid-cols-[1fr_260px] gap-4">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
              <Search size={20} className="text-cyan-600" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search symptoms, condition or specialization..."
                className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
              <Filter size={20} className="text-cyan-600" />

              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-800 font-semibold"
              >
                <option value="ALL">All Results</option>
                <option value="URGENT">Urgent Only</option>
                <option value="NORMAL">Normal Only</option>
              </select>
            </div>
          </div>
        </section>

        {loading ? (
          <EmptyState text="Loading symptom history..." />
        ) : history.length === 0 ? (
          <EmptyState
            title="No symptom history found"
            text="Your symptom checks will appear here after using AI Symptom Checker."
            action
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No matching history"
            text="Try changing search or urgency filter."
          />
        ) : (
          <section className="grid xl:grid-cols-[1fr_340px] gap-8">
            <main className="space-y-5">
              {filtered.map((item) => (
                <HistoryCard key={item.id} item={item} />
              ))}
            </main>

            <aside className="space-y-5">
              <InfoCard
                icon={Sparkles}
                title="AI Guidance"
                desc="Your symptom checks help you identify the right doctor specialization faster."
              />

              <InfoCard
                icon={ShieldCheck}
                title="Care Reminder"
                desc="AI results are guidance only. Always consult a qualified doctor for diagnosis."
              />

              <InfoCard
                icon={Activity}
                title="Track Patterns"
                desc="Use this history to notice repeated symptoms and share them during consultations."
              />
            </aside>
          </section>
        )}
      </div>
    </div>
  );
}

function HistoryCard({ item }) {
  const urgent = Boolean(item.urgent);

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 hover:shadow-xl transition">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
        <div className="flex gap-4 min-w-0">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              urgent ? "bg-red-50" : "bg-emerald-50"
            }`}
          >
            {urgent ? (
              <AlertTriangle className="text-red-600" size={28} />
            ) : (
              <CheckCircle2 className="text-emerald-600" size={28} />
            )}
          </div>

          <div className="min-w-0">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-black text-xs mb-3 ${
                urgent
                  ? "bg-red-50 text-red-700 border border-red-100"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-100"
              }`}
            >
              {urgent ? "Urgent Attention" : "Routine Guidance"}
            </div>

            <h3 className="text-2xl font-black text-slate-950">
              {item.condition || "Health Concern"}
            </h3>

            <p className="text-slate-500 mt-2 leading-relaxed">
              {item.symptoms || "Symptoms not available"}
            </p>

            <div className="flex flex-wrap gap-3 mt-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm border border-cyan-100">
                <Stethoscope size={16} />
                {item.specialization || "General Physician"}
              </span>

              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-600 font-bold text-sm border border-slate-100">
                <CalendarDays size={16} />
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleString()
                  : "Date not available"}
              </span>
            </div>
          </div>
        </div>

        <Link
          to={`/doctors?specialization=${encodeURIComponent(
            item.specialization || "General Physician"
          )}`}
          className="inline-flex items-center justify-center gap-2 bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-cyan-700 transition shrink-0"
        >
          Find Doctors
          <ArrowRight size={18} />
        </Link>
      </div>

      <div className="mt-5 bg-slate-50 rounded-2xl p-4 border border-slate-100">
        <p className="text-xs font-black text-slate-400 uppercase">
          Advice
        </p>

        <p className="font-semibold text-slate-700 mt-1 leading-relaxed">
          {item.advice || "Consult a qualified doctor for proper diagnosis."}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ title = "Please wait", text, action }) {
  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto mb-4">
        <Brain className="text-cyan-600" size={34} />
      </div>

      <h3 className="text-2xl font-black text-slate-950">
        {title}
      </h3>

      <p className="text-slate-500 mt-2">
        {text}
      </p>

      {action && (
        <Link
          to="/symptom-checker"
          className="inline-flex items-center gap-2 mt-6 bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-cyan-700"
        >
          Open Symptom Checker
          <ArrowRight size={18} />
        </Link>
      )}
    </div>
  );
}

function InfoCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-white rounded-[1.7rem] border border-slate-100 shadow-sm p-5">
      <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center mb-4">
        <Icon className="text-cyan-600" size={22} />
      </div>

      <h3 className="font-black text-slate-950">
        {title}
      </h3>

      <p className="text-slate-500 text-sm mt-2 leading-relaxed">
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