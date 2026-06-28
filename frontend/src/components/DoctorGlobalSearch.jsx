import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  X,
  UserRound,
  CalendarCheck,
  FileText,
  Clock,
  ChevronRight,
} from "lucide-react";

export default function DoctorGlobalSearch({
  appointments = [],
  followUps = [],
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const searchText = query.toLowerCase().trim();
    const items = [];

    appointments.forEach((item) => {
      const patientName =
        item.patient?.fullName || item.patientName || "Patient";

      const text = `${patientName} ${item.patientPhone || ""} ${
        item.status || ""
      } ${item.slot?.date || ""}`.toLowerCase();

      if (text.includes(searchText)) {
        items.push({
          type: "Appointment",
          icon: CalendarCheck,
          title: patientName,
          subtitle: `${item.status || "BOOKED"} • ${
            item.slot?.date || "-"
          } • ${item.slot?.startTime || "--"}`,
          to: `/doctor/appointment/${item.id}/patient-profile`,
        });
      }
    });

    followUps.forEach((item) => {
      const patientName = item.patient?.fullName || "Patient";

      const text = `${patientName} ${item.notes || ""} ${
        item.followUpDate || ""
      } ${item.status || ""}`.toLowerCase();

      if (text.includes(searchText)) {
        items.push({
          type: "Follow-up",
          icon: Clock,
          title: patientName,
          subtitle: `${item.status || "PENDING"} • ${
            item.followUpDate || "-"
          }`,
          to: "/doctor/follow-ups",
        });
      }
    });

    const uniquePatients = new Map();

    appointments.forEach((item) => {
      const patient = item.patient;
      const patientName =
        patient?.fullName || item.patientName || "Patient";

      const text = `${patientName} ${item.patientPhone || ""}`.toLowerCase();

      if (text.includes(searchText)) {
        uniquePatients.set(patient?.id || patientName, {
          type: "Patient",
          icon: UserRound,
          title: patientName,
          subtitle: item.patientPhone || patient?.mobile || "Patient record",
          to: `/doctor/appointment/${item.id}/patient-profile`,
        });
      }
    });

    items.unshift(...Array.from(uniquePatients.values()));

    return items.slice(0, 8);
  }, [query, appointments, followUps]);

  return (
    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
      <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3">
        <Search className="text-cyan-600 shrink-0" size={18} />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search patient, appointment, follow-up"
          className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-slate-400"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {query && (
        <div className="mt-3">
          {results.length === 0 ? (
            <div className="bg-slate-50 rounded-2xl p-4 text-center">
              <FileText className="text-cyan-600 mx-auto mb-2" size={26} />
              <p className="text-sm font-bold text-slate-600">
                No matching results
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={`${item.type}-${index}`}
                    to={item.to}
                    className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-3 active:scale-[0.99] transition"
                    onClick={() => setQuery("")}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-cyan-600" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-black text-cyan-700">
                        {item.type}
                      </p>

                      <h3 className="text-sm font-black text-slate-950 truncate">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-500 truncate">
                        {item.subtitle}
                      </p>
                    </div>

                    <ChevronRight className="text-slate-400" size={17} />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}