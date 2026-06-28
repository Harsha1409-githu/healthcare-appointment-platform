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
  ClipboardList,
  ArrowRight,
  Sparkles,
  Activity,
  X,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
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
      console.error("Symptom history error:", error);
      alert("Failed to load symptom history");
    } finally {
      setLoading(false);
    }
  };

  const filtered = history.filter((item) => {
    const matchesSearch = `${item.symptoms || ""} ${item.condition || ""} ${
      item.specialization || ""
    } ${item.advice || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesUrgency =
      urgencyFilter === "ALL" ||
      (urgencyFilter === "URGENT" && item.urgent) ||
      (urgencyFilter === "NORMAL" && !item.urgent);

    return matchesSearch && matchesUrgency;
  });

  const stats = useMemo(
    () => ({
      total: history.length,
      urgent: history.filter((item) => item.urgent).length,
      normal: history.filter((item) => !item.urgent).length,
    }),
    [history]
  );

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-28">
      <PageHeader
        title="Symptom History"
        subtitle={`${filtered.length} health checks found`}
      />

      <div className="max-w-md mx-auto px-4">
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center">
              <Brain className="text-cyan-600" size={28} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-cyan-700 font-black">
                AI HEALTH RECORDS
              </p>

              <h1 className="text-xl font-black text-slate-950 truncate">
                Previous Symptom Checks
              </h1>

              <p className="text-sm text-slate-500 truncate">
                Track symptoms and recommended specialists
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <MiniStat icon={ClipboardList} label="Total" value={stats.total} />
            <MiniStat icon={AlertTriangle} label="Urgent" value={stats.urgent} />
            <MiniStat icon={CheckCircle2} label="Normal" value={stats.normal} />
          </div>
        </section>

        <section className="sticky top-[72px] z-20 bg-[#f4f8fb]/95 backdrop-blur-md pt-3 pb-3">
          <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-3 py-3 shadow-sm">
            <Search className="text-cyan-600 shrink-0" size={18} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search symptoms, condition, specialist"
              className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-slate-400"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <FilterChip
              label="All"
              active={urgencyFilter === "ALL"}
              onClick={() => setUrgencyFilter("ALL")}
            />

            <FilterChip
              label="Urgent"
              active={urgencyFilter === "URGENT"}
              onClick={() => setUrgencyFilter("URGENT")}
            />

            <FilterChip
              label="Normal"
              active={urgencyFilter === "NORMAL"}
              onClick={() => setUrgencyFilter("NORMAL")}
            />
          </div>
        </section>

        {loading ? (
          <LoadingState />
        ) : history.length === 0 ? (
          <EmptyState
            title="No symptom history"
            text="Your symptom checks will appear here after using AI Symptom Checker."
            action
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No matching history"
            text="Try changing search or urgency filter."
          />
        ) : (
          <section className="space-y-3">
            {filtered.map((item) => (
              <HistoryCard key={item.id} item={item} />
            ))}
          </section>
        )}

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <div className="flex gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center shrink-0">
              <ShieldCheck className="text-cyan-600" size={22} />
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-950">
                Medical Disclaimer
              </h3>

              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                AI results are guidance only. Always consult a qualified doctor
                for diagnosis and treatment.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function HistoryCard({ item }) {
  const urgent = Boolean(item.urgent);

  const dateLabel = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString([], {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Date not available";

  const doctorLink = `/doctors?specialization=${encodeURIComponent(
    item.specialization || "General Physician"
  )}`;

  return (
    <article className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 active:scale-[0.99] transition">
      <div className="flex items-start gap-3">
        <div
          className={`w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 border ${
            urgent
              ? "bg-red-50 border-red-100"
              : "bg-emerald-50 border-emerald-100"
          }`}
        >
          {urgent ? (
            <AlertTriangle className="text-red-600" size={25} />
          ) : (
            <CheckCircle2 className="text-emerald-600" size={25} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black ${
              urgent
                ? "bg-red-50 text-red-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {urgent ? "Urgent Attention" : "Routine Guidance"}
          </span>

          <h2 className="text-lg font-black text-slate-950 truncate mt-2">
            {item.condition || "Health Concern"}
          </h2>

          <p className="text-xs text-slate-500 font-bold flex items-center gap-1.5 mt-1">
            <CalendarDays size={13} className="text-cyan-600" />
            {dateLabel}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <InfoBlock
          icon={Activity}
          title="Symptoms"
          content={item.symptoms || "Symptoms not available"}
        />

        <InfoBlock
          icon={Stethoscope}
          title="Recommended Specialist"
          content={item.specialization || "General Physician"}
        />

        <InfoBlock
          icon={Sparkles}
          title="Advice"
          content={
            item.advice || "Consult a qualified doctor for proper diagnosis."
          }
        />
      </div>

      <Link
        to={doctorLink}
        className="mt-4 w-full bg-cyan-600 text-white py-3 rounded-2xl text-sm font-black flex items-center justify-center gap-2 active:scale-95 transition"
      >
        Find Doctors
        <ArrowRight size={16} />
      </Link>
    </article>
  );
}

function InfoBlock({ icon: Icon, title, content }) {
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-3">
      <div className="flex items-center gap-2 text-xs font-black text-slate-500 mb-2">
        <Icon className="text-cyan-600 shrink-0" size={16} />
        {title}
      </div>

      <p className="text-slate-700 text-sm leading-relaxed">
        {content}
      </p>
    </div>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-2.5 rounded-2xl text-xs font-black transition ${
        active ? "bg-cyan-600 text-white" : "bg-white text-slate-600 border border-slate-100"
      }`}
    >
      {label}
    </button>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center">
      <Icon className="text-cyan-600 mx-auto" size={18} />

      <p className="text-sm font-black text-slate-950 mt-1">
        {value}
      </p>

      <p className="text-[10px] text-slate-500 font-bold">
        {label}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
      <Brain className="text-cyan-600 animate-pulse mx-auto mb-3" size={36} />

      <h3 className="text-lg font-black text-slate-950">
        Loading history
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        Please wait while we fetch your symptom checks.
      </p>
    </div>
  );
}

function EmptyState({ title, text, action }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
      <Brain className="text-cyan-600 mx-auto mb-3" size={36} />

      <h3 className="text-lg font-black text-slate-950">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        {text}
      </p>

      {action && (
        <Link
          to="/symptom-checker"
          className="inline-flex items-center gap-2 mt-5 bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black text-sm"
        >
          Open Symptom Checker
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}