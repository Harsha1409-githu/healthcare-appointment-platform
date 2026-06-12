import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Pill,
  ClipboardList,
  CalendarCheck,
  UserRound,
  Download,
  Eye,
  Stethoscope,
} from "lucide-react";
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
      if (!doctor?.id) return;

      const res = await api.get(`/prescription/doctor/${doctor.id}`);
      setPrescriptions(res.data || []);
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
    } ${item.medicines || ""}`
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
      withNotes: prescriptions.filter((p) => p.notes).length,
    }),
    [prescriptions]
  );

  return (
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6 py-8">
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                <FileText size={17} />
                DOCTOR PRESCRIPTIONS
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                Prescriptions Created
              </h1>

              <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
                View prescriptions you created for patients after completed
                consultations.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <MiniStat title="Total" value={stats.total} icon={ClipboardList} />
              <MiniStat title="Patients" value={stats.patients} icon={UserRound} />
              <MiniStat title="Notes" value={stats.withNotes} icon={FileText} />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 mb-8">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
            <Search className="text-cyan-600" size={20} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient, diagnosis or medicines..."
              className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
            />

            <Filter className="text-slate-400" size={19} />
          </div>
        </section>

        {loading ? (
          <EmptyState text="Loading prescriptions..." />
        ) : prescriptions.length === 0 ? (
          <EmptyState
            title="No prescriptions created yet"
            text="Create prescriptions from completed appointments in your dashboard."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No matching prescriptions"
            text="Try searching with patient name, diagnosis or medicine."
          />
        ) : (
          <div className="grid gap-5">
            {filtered.map((prescription) => (
              <PrescriptionCard
                key={prescription.id}
                prescription={prescription}
              />
            ))}
          </div>
        )}
      </div>
    </div>
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

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition overflow-hidden">
      <div className="p-6">
        <div className="grid xl:grid-cols-[1fr_260px] gap-6">
          <div>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center shrink-0 border border-cyan-100">
                <FileText className="text-cyan-600" size={30} />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs mb-2">
                  <Stethoscope size={14} />
                  Doctor Issued
                </div>

                <h2 className="text-2xl font-black text-slate-950">
                  {patientName}
                </h2>

                <p className="text-slate-500 mt-2 flex items-center gap-2">
                  <CalendarCheck size={16} className="text-cyan-600" />
                  {prescription.createdAt
                    ? new Date(prescription.createdAt).toLocaleDateString()
                    : "Prescription Date"}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <InfoBox
                icon={ClipboardList}
                title="Diagnosis"
                content={prescription.diagnosis || "Not mentioned"}
              />

              <InfoBox
                icon={Pill}
                title="Medicines"
                content={prescription.medicines || "Not mentioned"}
                pre
              />
            </div>

            {prescription.notes && (
              <div className="mt-4">
                <InfoBox
                  icon={FileText}
                  title="Doctor Notes"
                  content={prescription.notes}
                />
              </div>
            )}
          </div>

          <div className="xl:border-l border-slate-100 xl:pl-6 flex flex-col justify-between">
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
              <p className="text-sm text-slate-500 font-semibold">
                Prescription ID
              </p>

              <p className="font-black text-slate-950 mt-1 break-all">
                #{String(prescription.id).slice(0, 8)}
              </p>

              <p className="text-sm text-emerald-700 font-black mt-4">
                Available as PDF
              </p>
            </div>

            <div className="grid gap-3 mt-5">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black hover:bg-cyan-700 transition flex items-center justify-center gap-2"
              >
                <Eye size={18} />
                View PDF
              </a>

              <a
                href={pdfUrl}
                download
                className="w-full bg-slate-950 text-white py-4 rounded-2xl font-black hover:bg-cyan-700 transition flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ icon: Icon, title, content, pre }) {
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
      <div className="flex items-center gap-2 text-slate-500 text-sm font-black mb-3">
        <Icon className="text-cyan-600" size={18} />
        {title}
      </div>

      {pre ? (
        <pre className="whitespace-pre-wrap text-slate-700 font-sans leading-relaxed">
          {content}
        </pre>
      ) : (
        <p className="text-slate-700 leading-relaxed">{content}</p>
      )}
    </div>
  );
}

function MiniStat({ title, value, icon: Icon }) {
  return (
    <div className="min-w-[90px] bg-slate-50 rounded-2xl border border-slate-100 p-3">
      <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center mb-2">
        <Icon className="text-cyan-600" size={18} />
      </div>

      <p className="text-xl font-black text-slate-950">{value}</p>
      <p className="text-xs text-slate-500 font-bold">{title}</p>
    </div>
  );
}

function EmptyState({ title = "Please wait", text }) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto mb-4">
        <FileText className="text-cyan-600" size={34} />
      </div>

      <h3 className="text-2xl font-black text-slate-950">{title}</h3>
      <p className="text-slate-500 mt-2">{text}</p>
    </div>
  );
}