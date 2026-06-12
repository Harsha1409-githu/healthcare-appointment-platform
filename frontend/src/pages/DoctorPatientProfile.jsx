import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  UserRound,
  Brain,
  FileText,
  Pill,
  Download,
  Video,
  ArrowLeft,
  AlertTriangle,
  Mail,
  Phone,
  ClipboardList,
  ShieldCheck,
  Activity,
  CalendarCheck,
  Clock,
  Stethoscope,
  Search,
  Filter,
  Eye,
  HeartPulse,
} from "lucide-react";
import api from "../api/axios";

export default function DoctorPatientProfile() {
  const { appointmentId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [recordSearch, setRecordSearch] = useState("");
  const [symptomSearch, setSymptomSearch] = useState("");

  useEffect(() => {
    fetchPatientProfile();
  }, []);

  const fetchPatientProfile = async () => {
    try {
      const res = await api.get(`/appointment/${appointmentId}/patient-profile`);
      setData(res.data);
    } catch (error) {
      console.error("Patient profile error:", error);
      alert("Failed to load patient profile");
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = useMemo(() => {
    const records = data?.medicalRecords || [];

    return records.filter((record) =>
      `${record.title || ""} ${record.recordType || ""} ${record.fileName || ""}`
        .toLowerCase()
        .includes(recordSearch.toLowerCase())
    );
  }, [data, recordSearch]);

  const filteredSymptoms = useMemo(() => {
    const symptoms = data?.symptomHistory || [];

    return symptoms.filter((item) =>
      `${item.symptoms || ""} ${item.condition || ""} ${
        item.specialization || ""
      }`
        .toLowerCase()
        .includes(symptomSearch.toLowerCase())
    );
  }, [data, symptomSearch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4fbff] flex items-center justify-center">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto mb-4">
            <UserRound className="text-cyan-600 animate-pulse" size={34} />
          </div>

          <p className="text-slate-500 font-semibold">
            Loading patient health profile...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#f4fbff] flex items-center justify-center">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 text-center">
          <AlertTriangle className="mx-auto text-red-600 mb-4" size={36} />

          <h2 className="text-2xl font-black text-slate-950">
            Patient profile not available
          </h2>

          <Link
            to="/doctor/dashboard"
            className="inline-flex items-center gap-2 mt-5 bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { patient, symptomHistory = [], medicalRecords = [], prescriptions = [] } =
    data;

  const patientImage =
    patient?.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      patient?.fullName || "Patient"
    )}&background=0891b2&color=fff&bold=true`;

  const urgentSymptoms = symptomHistory.filter((item) => item.urgent).length;

  return (
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6 py-8">
        <Link
          to="/doctor/dashboard"
          className="inline-flex items-center gap-2 text-cyan-700 font-black mb-6 hover:text-cyan-800"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <img
                src={patientImage}
                alt={patient?.fullName || "Patient"}
                className="w-24 h-24 rounded-[2rem] object-cover border border-slate-100 shadow-sm"
              />

              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                  <ShieldCheck size={17} />
                  PATIENT HEALTH PROFILE
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                  {patient?.fullName || "Patient"}
                </h1>

                <p className="text-slate-500 mt-2 text-lg">
                  Complete health context before consultation.
                </p>

                <div className="flex flex-wrap gap-3 mt-4">
                  <ProfileChip icon={Mail} text={patient?.email || "Email not available"} />
                  <ProfileChip icon={Phone} text={patient?.mobile || "Mobile not available"} />
                </div>
              </div>
            </div>

            <Link
              to={`/video-call/${appointmentId}`}
              className="inline-flex items-center justify-center gap-2 bg-cyan-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-cyan-700 transition"
            >
              <Video size={19} />
              Start Video Call
            </Link>
          </div>
        </section>

        <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <MiniStat title="Symptoms" value={symptomHistory.length} icon={Brain} />
          <MiniStat title="Urgent" value={urgentSymptoms} icon={AlertTriangle} />
          <MiniStat title="Records" value={medicalRecords.length} icon={FileText} />
          <MiniStat title="Prescriptions" value={prescriptions.length} icon={Pill} />
        </section>

        <div className="grid xl:grid-cols-[360px_1fr] gap-8">
          <aside className="space-y-6">
            <Card title="Patient Information" icon={UserRound}>
              <Info label="Name" value={patient?.fullName} />
              <Info label="Email" value={patient?.email} />
              <Info label="Mobile" value={patient?.mobile} />
            </Card>

            <Card title="Health Summary" icon={HeartPulse}>
              <Info label="Symptom Checks" value={symptomHistory.length} />
              <Info label="Medical Records" value={medicalRecords.length} />
              <Info label="Prescriptions" value={prescriptions.length} />
              <Info label="Urgent Flags" value={urgentSymptoms} />
            </Card>

            <div className="bg-cyan-600 rounded-[2rem] shadow-sm p-6 text-white">
              <Stethoscope className="mb-4" size={30} />

              <h2 className="text-xl font-black">
                Doctor Review Tip
              </h2>

              <p className="text-cyan-100 text-sm mt-2 leading-relaxed">
                Review symptoms, records and past prescriptions before starting
                consultation.
              </p>
            </div>
          </aside>

          <main className="space-y-8">
            <Card title="Recent Symptom History" icon={Brain}>
              <SearchBox
                value={symptomSearch}
                onChange={(e) => setSymptomSearch(e.target.value)}
                placeholder="Search symptoms or conditions..."
              />

              {filteredSymptoms.length === 0 ? (
                <Empty text="No symptom history found." />
              ) : (
                <div className="space-y-4 mt-5">
                  {filteredSymptoms.map((item) => (
                    <SymptomCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </Card>

            <Card title="Medical Records" icon={FileText}>
              <SearchBox
                value={recordSearch}
                onChange={(e) => setRecordSearch(e.target.value)}
                placeholder="Search records..."
              />

              {filteredRecords.length === 0 ? (
                <Empty text="No medical records uploaded." />
              ) : (
                <div className="grid md:grid-cols-2 gap-4 mt-5">
                  {filteredRecords.map((record) => (
                    <RecordCard key={record.id} record={record} />
                  ))}
                </div>
              )}
            </Card>

            <Card title="Previous Prescriptions" icon={Pill}>
              {prescriptions.length === 0 ? (
                <Empty text="No previous prescriptions found." />
              ) : (
                <div className="space-y-4">
                  {prescriptions.map((prescription) => (
                    <PrescriptionCard
                      key={prescription.id}
                      prescription={prescription}
                    />
                  ))}
                </div>
              )}
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}

function Card({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center">
          <Icon className="text-cyan-600" size={22} />
        </div>

        <h2 className="text-xl font-black text-slate-950">
          {title}
        </h2>
      </div>

      {children}
    </div>
  );
}

function ProfileChip({ icon: Icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-600 border border-slate-100 text-sm font-bold">
      <Icon size={15} className="text-cyan-600" />
      {text}
    </span>
  );
}

function SearchBox({ value, onChange, placeholder }) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
      <Search size={18} className="text-cyan-600" />

      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
      />

      <Filter size={17} className="text-slate-400" />
    </div>
  );
}

function SymptomCard({ item }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
      <div className="flex items-start gap-3">
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
            item.urgent ? "bg-red-50" : "bg-emerald-50"
          }`}
        >
          {item.urgent ? (
            <AlertTriangle size={22} className="text-red-600" />
          ) : (
            <ShieldCheck size={22} className="text-emerald-600" />
          )}
        </div>

        <div>
          <h3 className="font-black text-slate-950 text-lg">
            {item.condition || "Health Concern"}
          </h3>

          <p className="text-slate-500 mt-1">
            {item.symptoms || "Symptoms not available"}
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 text-cyan-700 font-black text-xs border border-cyan-100">
              <Stethoscope size={14} />
              {item.specialization || "General Physician"}
            </span>

            {item.urgent && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-700 font-black text-xs border border-red-100">
                Urgent
              </span>
            )}
          </div>

          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            {item.advice || "Doctor review recommended."}
          </p>
        </div>
      </div>
    </div>
  );
}

function RecordCard({ record }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black text-slate-950">
            {record.title || "Medical Record"}
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            {record.recordType || "Record"}
          </p>

          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <CalendarCheck size={13} />
            {record.uploadedAt
              ? new Date(record.uploadedAt).toLocaleString()
              : "Uploaded"}
          </p>
        </div>

        <FileText className="text-cyan-600 shrink-0" size={24} />
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <a
          href={record.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-cyan-600 text-white px-4 py-2.5 rounded-2xl font-black hover:bg-cyan-700 transition"
        >
          <Eye size={16} />
          Open
        </a>

        <a
          href={record.fileUrl}
          download
          className="inline-flex items-center gap-2 bg-slate-950 text-white px-4 py-2.5 rounded-2xl font-black hover:bg-cyan-700 transition"
        >
          <Download size={16} />
          Download
        </a>
      </div>
    </div>
  );
}

function PrescriptionCard({ prescription }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center shrink-0">
          <Pill className="text-cyan-600" size={22} />
        </div>

        <div>
          <h3 className="font-black text-slate-950">
            Diagnosis: {prescription.diagnosis || "-"}
          </h3>

          <p className="text-slate-600 mt-2">
            <b>Medicines:</b> {prescription.medicines || "-"}
          </p>

          <p className="text-slate-500 mt-1">
            <b>Notes:</b> {prescription.notes || "-"}
          </p>

          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <Clock size={13} />
            {prescription.createdAt
              ? new Date(prescription.createdAt).toLocaleString()
              : "Date not available"}
          </p>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-4 mb-3 border border-slate-100">
      <p className="text-xs font-black text-slate-400 uppercase">
        {label}
      </p>

      <p className="font-black text-slate-950 mt-1">
        {value || "-"}
      </p>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-500 border border-slate-100 mt-5">
      {text}
    </div>
  );
}

function MiniStat({ title, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center mb-3">
        <Icon className="text-cyan-600" size={20} />
      </div>

      <p className="text-2xl font-black text-slate-950">
        {value}
      </p>

      <p className="text-xs text-slate-500 font-bold">
        {title}
      </p>
    </div>
  );
}