import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AlertTriangle,
  Brain,
  CalendarCheck,
  Clock,
  Download,
  Eye,
  FileText,
  Loader2,
  Mail,
  Phone,
  Pill,
  Plus,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/axios";
import PrescriptionModal from "../components/PrescriptionModal";
import PatientProfileSkeleton from "../components/PatientProfileSkeleton";

const TABS = ["Summary", "Timeline", "Rx", "Reports"];

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const countMedicines = (value) => {
  if (!value) return 0;
  if (Array.isArray(value)) return value.length;
  return String(value).split(",").filter(Boolean).length || 1;
};

export default function DoctorPatientProfile() {
  const { appointmentId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Timeline");

  const [prescriptionAppointment, setPrescriptionAppointment] = useState(null);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showCompleteSheet, setShowCompleteSheet] = useState(false);
  const [savingFollowUp, setSavingFollowUp] = useState(false);
  const [completing, setCompleting] = useState(false);

  const [followUpForm, setFollowUpForm] = useState({
    followUpDate: "",
    notes: "",
  });

  useEffect(() => {
    fetchPatientProfile();
  }, []);

  const fetchPatientProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/appointment/${appointmentId}/patient-profile`);
      setData(res.data);
    } catch (error) {
      console.error("Patient profile error:", error);
      toast.error("Failed to load patient profile");
    } finally {
      setLoading(false);
    }
  };

  const timeline = useMemo(() => {
    if (!data) return [];

    const symptoms = (data.symptomHistory || []).map((item) => ({
      type: "Symptom",
      title: item.condition || "Health Concern",
      desc: item.symptoms || "Symptoms not available",
      date: item.createdAt,
      icon: Brain,
      urgent: item.urgent,
    }));

    const appointments = (data.appointments || []).map((item) => ({
      type: "Appointment",
      title: item.doctor?.doctorName || "Appointment",
      desc: item.status || "Booked",
      date: item.createdAt || item.slot?.date,
      icon: CalendarCheck,
    }));

    const consultations = (data.consultations || []).map((item) => ({
      type: "Consultation",
      title: item.diagnosis || "Consultation Notes",
      desc: item.advice || item.doctorNotes || "Consultation completed",
      date: item.createdAt,
      icon: Stethoscope,
    }));

    const followUps = (data.followUps || []).map((item) => ({
      type: "Follow-up",
      title: item.followUpDate || "Follow-up",
      desc: item.notes || "Follow-up scheduled",
      date: item.createdAt || item.followUpDate,
      icon: Clock,
    }));

    const records = (data.medicalRecords || []).map((item) => ({
      type: "Record",
      title: item.title || "Medical Record",
      desc: item.recordType || item.fileName || "Uploaded record",
      date: item.uploadedAt,
      icon: FileText,
      url: item.fileUrl,
    }));

    const prescriptions = (data.prescriptions || []).map((item) => ({
      type: "Prescription",
      title: item.diagnosis || "Prescription",
      desc: item.medicines || "Medicines not available",
      date: item.createdAt,
      icon: Pill,
    }));

    return [
      ...appointments,
      ...consultations,
      ...followUps,
      ...symptoms,
      ...records,
      ...prescriptions,
    ].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [data]);

  const saveFollowUp = async () => {
    if (!followUpForm.followUpDate) {
      toast.error("Please select follow-up date");
      return;
    }

    const patient = data?.patient;
    const appointment = data?.appointment;

    if (!appointment?.doctor?.id || !patient?.id) {
      toast.error("Doctor or patient not found");
      return;
    }

    try {
      setSavingFollowUp(true);

      await api.post("/follow-up", {
        doctorId: appointment.doctor.id,
        patientId: patient.id,
        appointmentId: appointment.id,
        followUpDate: followUpForm.followUpDate,
        notes: followUpForm.notes,
      });

      toast.success("Follow-up scheduled");
      setShowFollowUpModal(false);
      setFollowUpForm({ followUpDate: "", notes: "" });
      fetchPatientProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create follow-up");
    } finally {
      setSavingFollowUp(false);
    }
  };

  const completeAppointment = async () => {
    try {
      setCompleting(true);
      await api.patch(`/appointment/${data.appointment.id}/complete`);
      toast.success("Appointment completed");
      setShowCompleteSheet(false);
      fetchPatientProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to complete appointment");
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f8fb] px-4 pt-4">
        <div className="mx-auto max-w-md">
          <PatientProfileSkeleton />
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8fb] px-4">
        <div className="rounded-[1.5rem] border border-slate-100 bg-white p-6 text-center shadow-sm">
          <AlertTriangle className="mx-auto mb-3 text-red-600" size={36} />
          <h2 className="text-lg font-black text-slate-950">
            Patient profile not available
          </h2>
        </div>
      </main>
    );
  }

  const {
    patient,
    appointment,
    symptomHistory = [],
    medicalRecords = [],
    prescriptions = [],
    appointments = [],
    followUps = [],
  } = data;

  const patientImage =
    patient?.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      patient?.fullName || "Patient"
    )}&background=0891b2&color=fff&bold=true`;

  const urgentSymptoms = symptomHistory.filter((item) => item.urgent).length;
  const isHighRisk = urgentSymptoms > 0;

  return (
    <main className="min-h-screen bg-[#f6f8fb] pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-md px-3 pt-3">
        <section className="rounded-[1.7rem] border border-slate-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src={patientImage}
              alt={patient?.fullName || "Patient"}
              className="h-16 w-16 rounded-3xl border border-slate-100 object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700">
                Patient Workspace
              </p>

              <h1 className="truncate text-xl font-black text-slate-950">
                {patient?.fullName || "Patient"}
              </h1>

              <p className="truncate text-xs font-semibold text-slate-500">
                {patient?.age || "-"}Y • {patient?.gender || "-"} •{" "}
                {patient?.bloodGroup || "Blood group -"}
              </p>

              <p className="mt-1 truncate text-[11px] font-black text-cyan-700">
                TRD-{String(patient?.id || appointmentId).slice(0, 8)} • Registered Patient
              </p>
            </div>

            <RiskBadge highRisk={isHighRisk} />
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            <MiniStat label="Visits" value={appointments.length} />
            <MiniStat label="Medicines" value={prescriptions.length} />
            <MiniStat label="Reports" value={medicalRecords.length} />
            <MiniStat label="Timeline" value={timeline.length} />
          </div>
        </section>

        <section className="sticky top-0 z-20 mt-3 bg-[#f6f8fb] pb-2 pt-1">
          <div className="grid grid-cols-4 rounded-2xl bg-white p-1 shadow-sm">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl py-2 text-[11px] font-black ${
                  activeTab === tab
                    ? "bg-cyan-600 text-white"
                    : "text-slate-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        {activeTab === "Summary" && (
          <SummaryTab
            patient={patient}
            appointment={appointment}
            isHighRisk={isHighRisk}
            urgentSymptoms={urgentSymptoms}
            symptomHistory={symptomHistory}
            followUps={followUps}
          />
        )}

        {activeTab === "Timeline" && <TimelineTab timeline={timeline} />}

        {activeTab === "Rx" && <PrescriptionTab prescriptions={prescriptions} />}

        {activeTab === "Reports" && (
          <ReportsTab records={medicalRecords} symptomHistory={symptomHistory} />
        )}
      </div>

      <ConsultationBar
        appointment={appointment}
        onPrescription={() => setPrescriptionAppointment(appointment)}
        onFollowUp={() => setShowFollowUpModal(true)}
        onComplete={() => setShowCompleteSheet(true)}
      />

      {showFollowUpModal && (
        <FollowUpSheet
          patient={patient}
          form={followUpForm}
          setForm={setFollowUpForm}
          saving={savingFollowUp}
          onClose={() => setShowFollowUpModal(false)}
          onSave={saveFollowUp}
        />
      )}

      {showCompleteSheet && (
        <CompleteSheet
          appointment={appointment}
          prescriptions={prescriptions}
          followUps={followUps}
          completing={completing}
          onClose={() => setShowCompleteSheet(false)}
          onComplete={completeAppointment}
        />
      )}

      {prescriptionAppointment && (
        <PrescriptionModal
          appointment={prescriptionAppointment}
          onClose={() => setPrescriptionAppointment(null)}
          onSaved={() => {
            setPrescriptionAppointment(null);
            fetchPatientProfile();
          }}
        />
      )}
    </main>
  );
}

function RiskBadge({ highRisk }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black ${
        highRisk
          ? "bg-red-100 text-red-700"
          : "bg-emerald-100 text-emerald-700"
      }`}
    >
      {highRisk ? "RISK" : "LOW"}
    </span>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-2.5 text-center">
      <p className="text-lg font-black leading-none text-slate-950">{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase text-slate-500">
        {label}
      </p>
    </div>
  );
}

function SummaryTab({
  patient,
  appointment,
  isHighRisk,
  urgentSymptoms,
  symptomHistory,
  followUps,
}) {
  const latestSymptom = symptomHistory?.[0];
  const latestFollowUp = followUps?.[0];

  return (
    <section className="space-y-3">
      <div className={`rounded-[1.5rem] p-4 text-white shadow-sm ${isHighRisk ? "bg-red-600" : "bg-emerald-600"}`}>
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            {isHighRisk ? <AlertTriangle size={22} /> : <ShieldCheck size={22} />}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-base font-black">
              {isHighRisk ? "High Risk Alert" : "Low Risk Patient"}
            </h2>
            <p className="mt-1 text-sm leading-relaxed opacity-90">
              {isHighRisk
                ? `${urgentSymptoms} urgent symptom flag detected. Review carefully before consultation.`
                : "No urgent symptom flags detected from patient history."}
            </p>
          </div>
        </div>
      </div>

      <Card title="Patient Summary">
        <div className="grid grid-cols-2 gap-2">
          <InfoTile label="Age" value={patient?.age ? `${patient.age} years` : "-"} />
          <InfoTile label="Blood Group" value={patient?.bloodGroup || "-"} />
          <InfoTile label="Allergy" value={patient?.allergies || patient?.allergy || "-"} />
          <InfoTile label="Weight" value={patient?.weight ? `${patient.weight} kg` : "-"} />
        </div>
      </Card>

      <Card title="Current Appointment">
        <div className="space-y-2">
          <InfoLine label="Date" value={appointment?.slot?.date || appointment?.date || "-"} />
          <InfoLine
            label="Time"
            value={`${appointment?.slot?.startTime || "--"} - ${appointment?.slot?.endTime || "--"}`}
          />
          <InfoLine label="Status" value={appointment?.status || "-"} />
          <InfoLine
            label="Type"
            value={appointment?.appointmentType === "VIDEO" ? "Video Consultation" : "In-clinic Visit"}
          />
        </div>
      </Card>

      <Card title="Contact">
        <div className="space-y-2">
          <ContactLine icon={Phone} label="Mobile" value={patient?.mobile} />
          <ContactLine icon={Mail} label="Email" value={patient?.email} />
        </div>
      </Card>

      <Card title="Latest Concern">
        {!latestSymptom ? <Empty text="No symptom history found." /> : <SymptomRow item={latestSymptom} />}
      </Card>

      <Card title="Next Follow-up">
        {!latestFollowUp ? <Empty text="No follow-ups scheduled." /> : <FollowUpRow item={latestFollowUp} />}
      </Card>
    </section>
  );
}

function TimelineTab({ timeline }) {
  const [filter, setFilter] = useState("ALL");

  const filters = [
    { key: "ALL", label: "All" },
    { key: "Appointment", label: "🏥 Appointment" },
    { key: "Consultation", label: "🩺 Consultation" },
    { key: "Prescription", label: "💊 Prescription" },
    { key: "Follow-up", label: "⏰ Follow-up" },
    { key: "Record", label: "📄 Record" },
    { key: "Symptom", label: "⚠️ Symptom" },
  ];

  const filtered =
    filter === "ALL" ? timeline : timeline.filter((item) => item.type === filter);

  return (
    <section className="rounded-[1.5rem] border border-slate-100 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700">
            Medical History
          </p>
          <h2 className="text-base font-black text-slate-950">Timeline</h2>
          <p className="text-xs font-semibold text-slate-500">
            {filtered.length} events
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
          <Clock size={20} />
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {filters.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key)}
            className={`whitespace-nowrap rounded-2xl px-3 py-2 text-xs font-black ${
              filter === item.key
                ? "bg-cyan-600 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-3">
          <Empty text="No medical timeline available." />
        </div>
      ) : (
        <div className="mt-3 space-y-1">
          {filtered.map((item, index) => (
            <TimelineItem key={`${item.type}-${index}`} item={item} last={index === filtered.length - 1} />
          ))}
        </div>
      )}
    </section>
  );
}

function TimelineItem({ item, last }) {
  const Icon = item.icon;

  const badgeClass =
    item.type === "Appointment"
      ? "bg-blue-100 text-blue-700"
      : item.type === "Prescription"
      ? "bg-cyan-100 text-cyan-700"
      : item.type === "Consultation"
      ? "bg-emerald-100 text-emerald-700"
      : item.type === "Follow-up"
      ? "bg-violet-100 text-violet-700"
      : item.type === "Record"
      ? "bg-orange-100 text-orange-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="relative grid grid-cols-[22px_1fr] gap-2">
      <div className="relative flex justify-center">
        <div className="mt-4 h-3 w-3 rounded-full bg-cyan-600 ring-4 ring-cyan-50" />
        {!last && <div className="absolute bottom-0 top-7 w-[2px] bg-slate-200" />}
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.urgent ? "bg-red-50" : "bg-cyan-50"}`}>
            <Icon size={18} className={item.urgent ? "text-red-600" : "text-cyan-600"} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-black text-slate-950">
                  {item.title}
                </h3>
                <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-black ${badgeClass}`}>
                  {item.type}
                </span>
              </div>

              <span className="shrink-0 text-[10px] font-bold text-slate-400">
                {formatDate(item.date)}
              </span>
            </div>

            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
              {item.desc}
            </p>

            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 rounded-xl bg-cyan-600 px-3 py-1.5 text-[10px] font-black text-white"
              >
                <Eye size={12} />
                View Record
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PrescriptionTab({ prescriptions }) {
  const active = prescriptions.filter((p) => !p.completed).length;
  const completed = prescriptions.filter((p) => p.completed).length;

  return (
    <section className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <MiniStat label="Total" value={prescriptions.length} />
        <MiniStat label="Active" value={active} />
        <MiniStat label="Done" value={completed} />
      </div>

      <Card title="Prescription History">
        {prescriptions.length === 0 ? (
          <Empty text="No prescriptions available." />
        ) : (
          <div className="space-y-2">
            {prescriptions.map((item) => (
              <PrescriptionRow key={item.id} prescription={item} />
            ))}
          </div>
        )}
      </Card>
    </section>
  );
}

function PrescriptionRow({ prescription }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-black text-slate-900">
            {prescription.diagnosis || "Prescription"}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {countMedicines(prescription.medicines)} medicines • {formatDate(prescription.createdAt)}
          </p>

          <p className="mt-1 line-clamp-1 text-xs text-slate-400">
            {prescription.medicines || "Medicine list unavailable"}
          </p>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-600 text-white"
        >
          <Eye size={18} />
        </button>
      </div>
    </div>
  );
}

function ReportsTab({ records, symptomHistory }) {
  return (
    <section className="space-y-3">
      <Card title="Medical Reports">
        {records.length === 0 ? (
          <Empty text="No uploaded reports." />
        ) : (
          <div className="space-y-2">
            {records.map((record) => (
              <ReportRow key={record.id} record={record} />
            ))}
          </div>
        )}
      </Card>

      <Card title="Previous Symptoms">
        {symptomHistory.length === 0 ? (
          <Empty text="No symptom history." />
        ) : (
          <div className="space-y-2">
            {symptomHistory.map((item) => (
              <SymptomRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </Card>
    </section>
  );
}

function ReportRow({ record }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50">
          <FileText size={20} className="text-cyan-600" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-black">
            {record.title || "Medical Report"}
          </h3>
          <p className="truncate text-xs text-slate-500">
            {record.recordType || "Report"}
          </p>
        </div>

        {record.fileUrl && (
          <div className="flex gap-2">
            <a
              href={record.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-white"
            >
              <Eye size={17} />
            </a>

            <a
              href={record.fileUrl}
              download
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white"
            >
              <Download size={17} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function SymptomRow({ item }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            item.urgent ? "bg-red-50" : "bg-emerald-50"
          }`}
        >
          {item.urgent ? (
            <AlertTriangle size={18} className="text-red-600" />
          ) : (
            <ShieldCheck size={18} className="text-emerald-600" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-black">
            {item.condition || "Health Concern"}
          </h3>

          <p className="mt-1 line-clamp-2 text-xs text-slate-500">
            {item.symptoms || "Symptoms not available"}
          </p>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] font-black text-cyan-700">
              {item.specialization || "General"}
            </span>

            <span
              className={`rounded-full px-2 py-1 text-[10px] font-black ${
                item.urgent
                  ? "bg-red-100 text-red-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {item.urgent ? "URGENT" : "NORMAL"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FollowUpRow({ item }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50">
          <Clock className="text-violet-600" size={19} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-black text-slate-950">
            {item.followUpDate || "Follow-up"}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-slate-500">
            {item.notes || "No notes added"}
          </p>
          <p className="mt-2 text-[10px] font-black text-violet-700">
            {item.status || "PENDING"}
          </p>
        </div>
      </div>
    </div>
  );
}

function ConsultationBar({ appointment, onPrescription, onFollowUp, onComplete }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto max-w-md p-3">
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onPrescription}
            className="h-12 rounded-2xl bg-cyan-600 text-xs font-black text-white active:scale-95"
          >
            Prescription
          </button>

          <button
            type="button"
            onClick={onFollowUp}
            className="h-12 rounded-2xl bg-violet-600 text-xs font-black text-white active:scale-95"
          >
            Follow-up
          </button>

          <button
            type="button"
            disabled={appointment?.status === "COMPLETED"}
            onClick={onComplete}
            className="h-12 rounded-2xl bg-emerald-600 text-xs font-black text-white active:scale-95 disabled:bg-slate-300"
          >
            {appointment?.status === "COMPLETED" ? "Completed" : "Complete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CompleteSheet({ prescriptions, followUps, completing, onClose, onComplete }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 px-3 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-t-[2rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <div>
            <h2 className="text-lg font-black text-slate-950">
              Complete Consultation
            </h2>
            <p className="text-sm font-semibold text-slate-500">
              Confirm before closing appointment
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2 p-4">
          <CheckLine label="Diagnosis / consultation reviewed" done />
          <CheckLine label="Prescription added" done={prescriptions.length > 0} />
          <CheckLine label="Follow-up added if required" done={followUps.length > 0} />
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-300 py-3 font-black"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onComplete}
            disabled={completing}
            className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 font-black text-white disabled:bg-slate-400"
          >
            {completing && <Loader2 size={17} className="animate-spin" />}
            Complete
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckLine({ label, done }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-3">
      <p className="text-sm font-black text-slate-800">{label}</p>
      <span
        className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
          done ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
        }`}
      >
        {done ? "DONE" : "PENDING"}
      </span>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <section className="rounded-[1.5rem] border border-slate-100 bg-white p-3 shadow-sm">
      <h2 className="mb-3 text-base font-black text-slate-950">{title}</h2>
      {children}
    </section>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-[10px] font-black uppercase text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}

function InfoLine({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2.5">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}

function ContactLine({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
        <Icon size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-black uppercase text-slate-500">{label}</p>
        <p className="truncate text-sm font-black text-slate-950">{value || "-"}</p>
      </div>
    </div>
  );
}

function FollowUpSheet({ patient, form, setForm, saving, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 px-3 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-t-[2rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <div>
            <h2 className="text-lg font-black text-slate-950">Schedule Follow-up</h2>
            <p className="text-sm font-semibold text-slate-500">
              {patient?.fullName || "Patient"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 p-4">
          <InputField
            label="Follow-up Date"
            type="date"
            value={form.followUpDate}
            onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
          />

          <label className="block">
            <p className="mb-1.5 text-xs font-black text-slate-700">Notes</p>
            <textarea
              rows={4}
              placeholder="Example: Review medicine progress after 7 days"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-300 py-3 font-black"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-2xl bg-cyan-600 py-3 font-black text-white disabled:bg-slate-400"
          >
            {saving && <Loader2 size={17} className="animate-spin" />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, type = "text", value, onChange }) {
  return (
    <label className="block">
      <p className="mb-1.5 text-xs font-black text-slate-700">{label}</p>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
      />
    </label>
  );
}

function Empty({ text }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-center">
      <p className="text-sm font-semibold text-slate-500">{text}</p>
    </div>
  );
}