import {
  ClipboardList,
  FlaskConical,
  Search,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react";

import PageHeader from "@/components/PageHeader";
import { PatientRecommendationCard } from "@/modules/recommendation/components";
import { usePatientRecommendations } from "@/modules/recommendation/hooks";

const filters = [
  { label: "All", value: "ALL" },
  { label: "Lab Tests", value: "LAB_TEST" },
  { label: "Scans", value: "RADIOLOGY" },
  { label: "Referrals", value: "SPECIALIST" },
  { label: "Vaccines", value: "VACCINATION" },
];

export default function PatientRecommendationsPage() {
  const {
    patient,
    filteredRecommendations,
    loading,
    typeFilter,
    setTypeFilter,
    stats,
  } = usePatientRecommendations();

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-28">
      <PageHeader
        title="Doctor Recommendations"
        subtitle={`${filteredRecommendations.length} care actions`}
      />

      <div className="mx-auto max-w-md px-4">
        <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50">
              <ShieldCheck className="text-cyan-600" size={28} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-cyan-700">CARE PLAN</p>
              <h1 className="truncate text-xl font-black text-slate-950">
                {patient?.fullName || "Patient"}
              </h1>
              <p className="truncate text-sm text-slate-500">
                Doctor advised next steps
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <MiniStat icon={ClipboardList} label="Total" value={stats.total} />
            <MiniStat icon={FlaskConical} label="Labs" value={stats.lab} />
            <MiniStat icon={Stethoscope} label="Pending" value={stats.pending} />
          </div>
        </section>

        <section className="sticky top-[72px] z-20 bg-[#f4f8fb]/95 py-3 backdrop-blur-md">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setTypeFilter(filter.value)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black ${
                  typeFilter === filter.value
                    ? "border-cyan-600 bg-cyan-600 text-white"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        {loading ? (
          <LoadingState />
        ) : filteredRecommendations.length === 0 ? (
          <EmptyState />
        ) : (
          <section className="space-y-3">
            {filteredRecommendations.map((recommendation) => (
              <PatientRecommendationCard
  key={recommendation.id}
  recommendation={recommendation}
/>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
      <Icon className="mx-auto text-cyan-600" size={18} />
      <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
      <p className="text-[10px] font-bold text-slate-500">{label}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent" />
      <h3 className="mt-3 text-lg font-black text-slate-950">
        Loading recommendations
      </h3>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
      <ShieldCheck className="mx-auto mb-3 text-cyan-600" size={36} />
      <h3 className="text-lg font-black text-slate-950">
        No doctor recommendations
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Recommended tests, scans or referrals will appear here after consultation.
      </p>
    </div>
  );
}
