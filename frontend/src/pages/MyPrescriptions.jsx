import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Download,
  Search,
  Stethoscope,
  CalendarCheck,
  ClipboardList,
  Pill,
  NotebookPen,
  ShieldCheck,
  Eye,
  X,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/axios";
import usePullToRefresh from "../hooks/usePullToRefresh";
import PageHeader from "../components/PageHeader";

export default function MyPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const selectedProfile = JSON.parse(
    localStorage.getItem("selectedProfile") || "null"
  );

  const patient = JSON.parse(localStorage.getItem("patientUser") || "null");

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      const res = await api.get("/prescription/my");
      setPrescriptions(res.data || []);
    } catch (error) {
      console.error("Prescription API error:", error);
      toast.error("Unable to load prescriptions");
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const { pullDistance, refreshing, visible } = usePullToRefresh(async () => {
    await fetchPrescriptions(false);
    toast.success("Prescriptions refreshed");
  });

  const profilePrescriptions = useMemo(() => {
    return prescriptions.filter((item) => {
      const familyMember =
        item.familyMember || item.appointment?.familyMember || null;

      if (!selectedProfile) return true;

      if (selectedProfile.isSelf) {
        return !familyMember;
      }

      return familyMember?.id === selectedProfile.id;
    });
  }, [prescriptions, selectedProfile]);

  const filtered = profilePrescriptions.filter((item) =>
    `${item.doctor?.doctorName || ""} ${item.doctor?.specialization || ""} ${
      item.diagnosis || ""
    } ${item.medicines || ""} ${item.notes || ""}`
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  const stats = useMemo(
    () => ({
      total: profilePrescriptions.length,
      doctors: new Set(
        profilePrescriptions.map((p) => p.doctor?.id || p.doctor?.doctorName)
      ).size,
      notes: profilePrescriptions.filter((p) => p.notes).length,
    }),
    [profilePrescriptions]
  );

  return (
    <main className="min-h-screen bg-[#f4f8fb] pt-4 pb-28">
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
  title="My Prescriptions"
  subtitle={`${filtered.length} prescriptions found`}
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
            <PlainStat label="Doctors" value={stats.doctors} color="text-cyan-600" />
            <PlainStat label="Notes" value={stats.notes} color="text-emerald-600" />
          </div>
        </section>

        <section className="pt-3 pb-3">
          <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-3 py-3 shadow-sm">
            <Search className="text-cyan-600 shrink-0" size={18} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctor, diagnosis, medicine"
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
        </section>

        {loading ? (
          <PrescriptionsSkeleton />
        ) : profilePrescriptions.length === 0 ? (
          <EmptyState
            title="No prescriptions found"
            text="Prescriptions for this profile will appear after consultations."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No matching prescriptions"
            text="Try searching with doctor name, diagnosis or medicine."
          />
        ) : (
          <section className="space-y-3">
            {filtered.map((prescription) => (
              <PrescriptionCard
                key={prescription.id}
                prescription={prescription}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

function PrescriptionCard({ prescription }) {
  const pdfUrl = `${import.meta.env.VITE_API_URL}/prescription/${
    prescription.id
  }/pdf`;

  const doctorName = prescription.doctor?.doctorName || "Doctor";
  const specialization = prescription.doctor?.specialization || "Specialist";
  const familyMember =
    prescription.familyMember || prescription.appointment?.familyMember || null;

  const dateLabel = prescription.createdAt
    ? new Date(prescription.createdAt).toLocaleDateString([], {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Prescription Date";

  return (
    <article className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 active:scale-[0.99] transition">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0">
          <FileText className="text-cyan-600" size={24} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-[10px]">
            <ShieldCheck size={12} />
            Doctor Verified
          </div>

          <h2 className="text-lg font-black text-slate-950 truncate mt-2">
            {doctorName}
          </h2>

          <p className="text-sm text-cyan-700 font-black truncate">
            {specialization}
          </p>

          <p className="text-xs text-slate-500 font-bold flex items-center gap-1.5 mt-1">
            <CalendarCheck size={13} className="text-cyan-600" />
            {dateLabel}
          </p>

          {familyMember && (
            <span className="inline-flex mt-2 px-2 py-1 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-black">
              {familyMember.fullName} • {familyMember.relation}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-3">
        <InfoBlock
          icon={ClipboardList}
          title="Diagnosis"
          content={prescription.diagnosis || "Not mentioned"}
        />

        <InfoBlock
          icon={Pill}
          title="Medicines"
          content={prescription.medicines || "Not mentioned"}
          pre
        />

        {prescription.notes && (
          <InfoBlock
            icon={NotebookPen}
            title="Doctor Notes"
            content={prescription.notes}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <a
          href={pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="border border-cyan-600 text-cyan-700 py-3 rounded-2xl text-sm font-black flex items-center justify-center gap-1.5 active:scale-95 transition"
        >
          <Eye size={16} />
          View PDF
        </a>

        <a
          href={pdfUrl}
          download
          className="bg-cyan-600 text-white py-3 rounded-2xl text-sm font-black flex items-center justify-center gap-1.5 active:scale-95 transition"
        >
          <Download size={16} />
          Download
        </a>
      </div>
    </article>
  );
}

function InfoBlock({ icon: Icon, title, content, pre }) {
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-3">
      <div className="flex items-center gap-2 text-xs font-black text-slate-500 mb-2">
        <Icon className="text-cyan-600 shrink-0" size={16} />
        {title}
      </div>

      {pre ? (
        <pre className="whitespace-pre-wrap text-slate-700 font-sans text-sm leading-relaxed">
          {content}
        </pre>
      ) : (
        <p className="text-slate-700 text-sm leading-relaxed">{content}</p>
      )}
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

function PrescriptionsSkeleton() {
  return (
    <section className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 animate-pulse"
        >
          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100" />

            <div className="flex-1">
              <div className="h-4 bg-slate-100 rounded-full w-32" />
              <div className="h-5 bg-slate-100 rounded-full w-44 mt-3" />
              <div className="h-3 bg-slate-100 rounded-full w-28 mt-2" />
            </div>
          </div>

          <div className="h-20 bg-slate-100 rounded-2xl mt-3" />
          <div className="h-20 bg-slate-100 rounded-2xl mt-3" />

          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="h-12 bg-slate-100 rounded-2xl" />
            <div className="h-12 bg-slate-100 rounded-2xl" />
          </div>
        </div>
      ))}
    </section>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
      <FileText className="text-cyan-600 mx-auto mb-3" size={36} />

      <h3 className="text-lg font-black text-slate-950">{title}</h3>

      <p className="text-sm text-slate-500 mt-1">{text}</p>
    </div>
  );
}