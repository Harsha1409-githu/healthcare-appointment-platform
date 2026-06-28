import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bell,
  CalendarDays,
  Clock,
  Pill,
  Search,
  Filter,
  X,
  UserRound,
  FileText,
  ClipboardList,
} from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../components/PageHeader";
import api from "../api/axios";
import usePullToRefresh from "../hooks/usePullToRefresh";

export default function HealthTimeline() {
  const patient =
    JSON.parse(localStorage.getItem("patientUser") || "null") ||
    JSON.parse(localStorage.getItem("user") || "null");

  const selectedProfile = JSON.parse(
    localStorage.getItem("selectedProfile") || "null"
  );

  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const fetchTimeline = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      if (!patient?.id) {
        setTimeline([]);
        return;
      }

      const res = await api.get(`/patient/${patient.id}/timeline`);
      setTimeline(res.data || []);
    } catch (error) {
      console.error("Timeline error:", error);
      toast.error("Unable to load timeline");
      setTimeline([]);
    } finally {
      setLoading(false);
    }
  };

  const { pullDistance, refreshing, visible } = usePullToRefresh(async () => {
    await fetchTimeline(false);
    toast.success("Timeline refreshed");
  });

  useEffect(() => {
    fetchTimeline();
  }, []);

  const profileTimeline = useMemo(() => {
    return timeline.filter((item) => {
      const familyMember =
        item.familyMember || item.appointment?.familyMember || null;

      if (!selectedProfile) return true;

      if (selectedProfile.isSelf) {
        return !familyMember;
      }

      return familyMember?.id === selectedProfile.id;
    });
  }, [timeline, selectedProfile]);

  const timelineTypes = useMemo(() => {
    return [
      "ALL",
      ...new Set(profileTimeline.map((item) => item.type).filter(Boolean)),
    ];
  }, [profileTimeline]);

  const filteredTimeline = profileTimeline.filter((item) => {
    const matchesSearch = `${item.title || ""} ${item.description || ""} ${
      item.type || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase().trim());

    const matchesType = typeFilter === "ALL" || item.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const stats = useMemo(
    () => ({
      total: profileTimeline.length,
      appointments: profileTimeline.filter((i) => i.type === "APPOINTMENT")
        .length,
      medicines: profileTimeline.filter((i) => i.type === "REMINDER").length,
    }),
    [profileTimeline]
  );

  const getIcon = (type) => {
    if (type === "REMINDER") return Pill;
    if (type === "APPOINTMENT") return CalendarDays;
    if (type === "PRESCRIPTION") return FileText;
    if (type === "MEDICAL_RECORD") return ClipboardList;
    return Bell;
  };

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-28">
      {visible && (
        <div
          className="fixed top-0 left-0 right-0 z-[100] flex justify-center transition-all duration-300"
          style={{ transform: `translateY(${pullDistance}px)` }}
        >
          <div className="mt-3 bg-white border border-slate-200 shadow-lg rounded-full px-4 py-2 flex items-center gap-2">
            <div
              className={`w-4 h-4 border-2 border-cyan-600 border-t-transparent rounded-full ${
                refreshing ? "animate-spin" : ""
              }`}
            />

            <span className="text-xs font-black text-cyan-700">
              {refreshing
                ? "Refreshing..."
                : pullDistance > 70
                ? "Release to refresh"
                : "Pull to refresh"}
            </span>
          </div>
        </div>
      )}

      <PageHeader
        title="Health Timeline"
        subtitle={`${filteredTimeline.length} activities`}
      />

      <div className="max-w-md mx-auto px-4">
        <section>
          <p className="text-xs text-cyan-700 font-black">CURRENT PROFILE</p>

          <div className="flex items-center justify-between mt-1">
            <div>
              <h1 className="text-xl font-black text-slate-950">
                {selectedProfile?.fullName || patient?.fullName || "Patient"}
              </h1>

              <p className="text-xs text-slate-500">
                {selectedProfile?.relation || "SELF"}
                {selectedProfile?.age ? ` • ${selectedProfile.age}Y` : ""}
                {selectedProfile?.gender ? ` • ${selectedProfile.gender}` : ""}
              </p>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center">
              <UserRound className="text-cyan-600" size={21} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-3">
            <PlainStat label="Total" value={stats.total} color="text-slate-950" />
            <PlainStat
              label="Visits"
              value={stats.appointments}
              color="text-cyan-600"
            />
            <PlainStat
              label="Meds"
              value={stats.medicines}
              color="text-emerald-600"
            />
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3 mt-3">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3">
            <Search className="text-cyan-600 shrink-0" size={18} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search health activity..."
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

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 mt-2">
            <Filter className="text-cyan-600 shrink-0" size={18} />

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-slate-800 font-bold"
            >
              {timelineTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "ALL" ? "All Activity" : type}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-slate-950">Timeline</h2>

            <span className="text-xs font-black text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
              {filteredTimeline.length}
            </span>
          </div>

          {loading ? (
            <TimelineSkeleton />
          ) : profileTimeline.length === 0 ? (
            <EmptyState
              title="No activity yet"
              text="Appointments, reminders and health updates for this profile will appear here."
            />
          ) : filteredTimeline.length === 0 ? (
            <EmptyState
              title="No matching activity"
              text="Try changing your search or filter."
            />
          ) : (
            <div className="space-y-3">
              {filteredTimeline.map((item, index) => (
                <TimelineItem
                  key={item.id || index}
                  item={item}
                  icon={getIcon(item.type)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function TimelineItem({ item, icon: Icon }) {
  const tone =
    item.type === "REMINDER"
      ? {
          bg: "bg-emerald-50",
          text: "text-emerald-600",
          tag: "bg-emerald-50 text-emerald-700",
        }
      : item.type === "APPOINTMENT"
      ? {
          bg: "bg-cyan-50",
          text: "text-cyan-600",
          tag: "bg-cyan-50 text-cyan-700",
        }
      : item.type === "PRESCRIPTION"
      ? {
          bg: "bg-purple-50",
          text: "text-purple-600",
          tag: "bg-purple-50 text-purple-700",
        }
      : item.type === "MEDICAL_RECORD"
      ? {
          bg: "bg-orange-50",
          text: "text-orange-600",
          tag: "bg-orange-50 text-orange-700",
        }
      : {
          bg: "bg-slate-100",
          text: "text-slate-600",
          tag: "bg-slate-100 text-slate-700",
        };

  const familyMember =
    item.familyMember || item.appointment?.familyMember || null;

  return (
    <div className="flex gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-3">
      <div
        className={`w-11 h-11 rounded-2xl ${tone.bg} flex items-center justify-center shrink-0`}
      >
        <Icon className={tone.text} size={21} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-black ${tone.tag}`}
          >
            {item.type || "ACTIVITY"}
          </span>

          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 font-bold shrink-0">
            <Clock size={11} />
            {item.date ? new Date(item.date).toLocaleDateString() : "Date"}
          </span>
        </div>

        <h3 className="font-black text-slate-950 text-sm mt-2 truncate">
          {item.title || "Health Activity"}
        </h3>

        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          {item.description || "No description available."}
        </p>

        {familyMember && (
          <span className="inline-flex mt-2 px-2 py-1 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-black">
            {familyMember.fullName} • {familyMember.relation}
          </span>
        )}
      </div>
    </div>
  );
}

function PlainStat({ label, value, color }) {
  return (
    <div className="text-center">
      <p className={`text-2xl font-black leading-none ${color}`}>{value}</p>
      <p className="text-[10px] text-slate-500 font-black mt-1">{label}</p>
    </div>
  );
}

function TimelineSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="bg-slate-50 rounded-2xl border border-slate-100 p-3 animate-pulse flex gap-3"
        >
          <div className="w-11 h-11 rounded-2xl bg-slate-200" />
          <div className="flex-1">
            <div className="h-4 w-24 bg-slate-200 rounded-full" />
            <div className="h-4 w-44 bg-slate-200 rounded-full mt-3" />
            <div className="h-3 w-56 bg-slate-200 rounded-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ title = "Please wait", text }) {
  return (
    <div className="text-center py-8">
      <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto mb-3">
        <Activity className="text-cyan-600" size={28} />
      </div>

      <h3 className="text-lg font-black text-slate-950">{title}</h3>

      <p className="text-sm text-slate-500 mt-1 leading-relaxed">{text}</p>
    </div>
  );
}