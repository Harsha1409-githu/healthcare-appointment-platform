import { useEffect, useState } from "react";
import {
  Activity,
  Bell,
  CalendarDays,
  Clock,
  Pill,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/40 to-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white p-8 shadow-2xl mb-8">
          <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mb-5">
            <Activity className="text-cyan-300" size={34} />
          </div>

          <h1 className="text-4xl font-black">Health Timeline</h1>

          <p className="text-blue-100 mt-2">
            Your complete medical activity journey in one place.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-[2rem] shadow-xl p-10 text-center text-slate-500">
            Loading timeline...
          </div>
        ) : timeline.length === 0 ? (
          <div className="bg-white rounded-[2rem] shadow-xl p-10 text-center text-slate-500">
            No health activity found yet.
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-7 top-0 bottom-0 w-1 bg-blue-100 rounded-full" />

            <div className="space-y-6">
              {timeline.map((item, index) => {
                const Icon = getIcon(item.type);

                return (
                  <div key={index} className="relative pl-20">
                    <div className="absolute left-0 top-1 w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl z-10">
                      <Icon className="text-white" size={25} />
                    </div>

                    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <p className="text-xs font-black text-blue-600 uppercase">
                            {item.type}
                          </p>

                          <h3 className="text-xl font-black text-slate-900 mt-1">
                            {item.title}
                          </h3>

                          <p className="text-slate-500 mt-2">
                            {item.description}
                          </p>
                        </div>

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 font-bold text-sm">
                          <Clock size={15} />
                          {new Date(item.date).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}