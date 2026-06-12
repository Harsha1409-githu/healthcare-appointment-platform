import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bell,
  CalendarDays,
  Clock,
  Pill,
  Search,
  Filter,
  CalendarCheck,
  ClipboardList,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import api from "../api/axios";

export default function HealthTimeline() {
  const patient = JSON.parse(
    localStorage.getItem("patientUser") ||
      localStorage.getItem("user") ||
      "null"
  );

  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      if (!patient?.id) {
        setTimeline([]);
        return;
      }

      const res = await api.get(`/patient/${patient.id}/timeline`);
      setTimeline(res.data || []);
    } catch (error) {
      console.error("Timeline error:", error);
      setTimeline([]);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    if (type === "REMINDER") return Pill;
    if (type === "APPOINTMENT") return CalendarDays;
    return Bell;
  };

  const filteredTimeline = timeline.filter((item) => {
    const matchesSearch = `${item.title || ""} ${item.description || ""} ${
      item.type || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType =
      typeFilter === "ALL" || item.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const stats = useMemo(() => {
    return {
      total: timeline.length,
      appointments: timeline.filter((item) => item.type === "APPOINTMENT")
        .length,
      reminders: timeline.filter((item) => item.type === "REMINDER").length,
      other: timeline.filter(
        (item) => !["APPOINTMENT", "REMINDER"].includes(item.type)
      ).length,
    };
  }, [timeline]);

  const timelineTypes = useMemo(() => {
    return ["ALL", ...new Set(timeline.map((item) => item.type).filter(Boolean))];
  }, [timeline]);

  return (
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6 py-8">
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                <Activity size={17} />
                HEALTH TIMELINE
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                Your Medical Activity
              </h1>

              <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
                Track appointments, reminders and healthcare activity in one
                chronological timeline.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MiniStat title="Total" value={stats.total} icon={ClipboardList} />
              <MiniStat
                title="Visits"
                value={stats.appointments}
                icon={CalendarCheck}
              />
              <MiniStat title="Meds" value={stats.reminders} icon={Pill} />
              <MiniStat title="Other" value={stats.other} icon={Bell} />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 mb-8">
          <div className="grid lg:grid-cols-[1fr_260px] gap-4">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
              <Search className="text-cyan-600" size={20} />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search timeline activity..."
                className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
              <Filter className="text-cyan-600" size={20} />

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-800 font-semibold"
              >
                {timelineTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "ALL" ? "All Activity" : type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {loading ? (
          <EmptyState text="Loading timeline..." />
        ) : timeline.length === 0 ? (
          <EmptyState
            title="No health activity found yet"
            text="Your appointments, reminders and health events will appear here."
          />
        ) : filteredTimeline.length === 0 ? (
          <EmptyState
            title="No matching activity"
            text="Try changing search or activity filter."
          />
        ) : (
          <section className="grid lg:grid-cols-[1fr_340px] gap-8">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
                  <Activity className="text-cyan-600" size={24} />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    Timeline
                  </h2>

                  <p className="text-slate-500">
                    Latest health activity first
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-7 top-0 bottom-0 w-1 bg-cyan-100 rounded-full" />

                <div className="space-y-6">
                  {filteredTimeline.map((item, index) => (
                    <TimelineItem
                      key={index}
                      item={item}
                      icon={getIcon(item.type)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-5">
              <InfoCard
                icon={Sparkles}
                title="Smart Timeline"
                desc="Your healthcare events are grouped by appointments, reminders and updates."
              />

              <InfoCard
                icon={ShieldCheck}
                title="Secure History"
                desc="Your activity history stays connected to your patient account."
              />

              <InfoCard
                icon={Clock}
                title="Track Progress"
                desc="Use this timeline to understand your care journey over time."
              />
            </aside>
          </section>
        )}
      </div>
    </div>
  );
}

function TimelineItem({ item, icon: Icon }) {
  const tone =
    item.type === "REMINDER"
      ? {
          bg: "bg-emerald-50",
          text: "text-emerald-600",
          border: "border-emerald-100",
        }
      : item.type === "APPOINTMENT"
      ? {
          bg: "bg-cyan-50",
          text: "text-cyan-600",
          border: "border-cyan-100",
        }
      : {
          bg: "bg-slate-50",
          text: "text-slate-600",
          border: "border-slate-100",
        };

  return (
    <div className="relative pl-20">
      <div
        className={`absolute left-0 top-1 w-14 h-14 rounded-2xl ${tone.bg} ${tone.border} border flex items-center justify-center shadow-sm z-10`}
      >
        <Icon className={tone.text} size={25} />
      </div>

      <div className="bg-slate-50 rounded-[1.7rem] border border-slate-100 p-5 hover:bg-white hover:shadow-sm transition">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <p
              className={`inline-flex px-3 py-1 rounded-full ${tone.bg} ${tone.text} font-black text-xs mb-3`}
            >
              {item.type || "ACTIVITY"}
            </p>

            <h3 className="text-xl font-black text-slate-950">
              {item.title}
            </h3>

            <p className="text-slate-500 mt-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 text-slate-600 font-bold text-sm shrink-0">
            <Clock size={15} className="text-cyan-600" />
            {item.date ? new Date(item.date).toLocaleString() : "Date"}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title = "Please wait", text }) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto mb-4">
        <Activity className="text-cyan-600" size={32} />
      </div>

      <h3 className="text-2xl font-black text-slate-950">
        {title}
      </h3>

      <p className="text-slate-500 mt-2">
        {text}
      </p>
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