import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Search,
  Pill,
  ClipboardList,
  CalendarCheck,
  UserRound,
  Download,
  Eye,
  Stethoscope,
  Loader2,
  X,
  NotebookPen,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import api from "../api/axios";

export default function DoctorPrescriptions() {
  const doctor = JSON.parse(localStorage.getItem("doctorUser") || "null");

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
  try {
    const res = await api.get("/prescription");

    const doctorId =
      doctor?.id ||
      doctor?.doctorId ||
      doctor?._id ||
      doctor?.userId ||
      doctor?.doctor?.id;

    const doctorPrescriptions = (res.data || []).filter((item) => {
      const itemDoctorId =
        item.doctor?.id ||
        item.appointment?.doctor?.id ||
        item.doctorId;

      return !doctorId || itemDoctorId === doctorId;
    });

    setPrescriptions(doctorPrescriptions);
  } catch (error) {
    console.error("Doctor prescriptions error:", error);
    setPrescriptions([]);
  } finally {
    setLoading(false);
  }
};

  const filtered = prescriptions.filter((item) =>
    `${item.patient?.fullName || ""} ${item.patientName || ""} ${
      item.diagnosis || ""
    } ${item.medicines || ""} ${item.notes || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const stats = useMemo(
    () => ({
      total: prescriptions.length,
      patients: new Set(
        prescriptions.map(
          (p) => p.patient?.id || p.patient?.fullName || p.patientName
        )
      ).size,
      notes: prescriptions.filter((p) => p.notes).length,
    }),
    [prescriptions]
  );

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-36">
      <PageHeader
        title="Prescriptions"
        subtitle={`${filtered.length} prescriptions found`}
      />

      <div className="max-w-md mx-auto px-4">
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center">
              <FileText className="text-cyan-600" size={28} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-cyan-700 font-black">
                DOCTOR RECORDS
              </p>

              <h1 className="text-xl font-black text-slate-950 truncate">
                Prescriptions Created
              </h1>

              <p className="text-sm text-slate-500 truncate">
                View and download patient prescriptions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <MiniStat icon={ClipboardList} label="Total" value={stats.total} />
            <MiniStat icon={UserRound} label="Patients" value={stats.patients} />
            <MiniStat icon={NotebookPen} label="Notes" value={stats.notes} />
          </div>
        </section>

        <section className="sticky top-[72px] z-20 bg-[#f4f8fb]/95 backdrop-blur-md pt-3 pb-3">
          <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-3 py-3 shadow-sm">
            <Search className="text-cyan-600 shrink-0" size={18} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient, diagnosis, medicine"
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
          <LoadingState />
        ) : prescriptions.length === 0 ? (
          <EmptyState
            title="No prescriptions yet"
            text="Create prescriptions from completed appointments."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No matching prescriptions"
            text="Try searching with patient name, diagnosis or medicine."
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

  const patientName =
    prescription.patient?.fullName ||
    prescription.appointment?.patientName ||
    prescription.patientName ||
    "Patient";

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
        <div className="w-13 h-13 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0">
          <FileText className="text-cyan-600" size={25} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-[10px]">
            <Stethoscope size={12} />
            Doctor Issued
          </div>

          <h2 className="text-lg font-black text-slate-950 truncate mt-2">
            {patientName}
          </h2>

          <p className="text-xs text-slate-500 font-bold flex items-center gap-1.5 mt-1">
            <CalendarCheck size={13} className="text-cyan-600" />
            {dateLabel}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-[10px] text-slate-400 font-black">
            ID
          </p>

          <p className="text-xs text-slate-700 font-black">
            #{String(prescription.id).slice(0, 6)}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
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
            icon={FileText}
            title="Doctor Notes"
            content={prescription.notes}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
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
        <p className="text-slate-700 text-sm leading-relaxed">
          {content}
        </p>
      )}
    </div>
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
      <Loader2 className="text-cyan-600 animate-spin mx-auto mb-3" size={34} />

      <h3 className="text-lg font-black text-slate-950">
        Loading prescriptions
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        Please wait while we fetch records.
      </p>
    </div>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
      <FileText className="text-cyan-600 mx-auto mb-3" size={36} />

      <h3 className="text-lg font-black text-slate-950">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        {text}
      </p>
    </div>
  );
}