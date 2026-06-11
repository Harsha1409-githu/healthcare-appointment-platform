import { useEffect, useState } from "react";
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
} from "lucide-react";
import api from "../api/axios";

export default function DoctorPatientProfile() {
  const { appointmentId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientProfile();
  }, []);

  const fetchPatientProfile = async () => {
    try {
      const res = await api.get(
        `/appointment/${appointmentId}/patient-profile`
      );

      setData(res.data);
    } catch (error) {
      console.error("Patient profile error:", error);
      alert("Failed to load patient profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        Loading patient health profile...
      </div>
    );
  }

  if (!data) return null;

  const { patient, symptomHistory, medicalRecords, prescriptions } = data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/40 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/doctor/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 font-bold mb-6"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white p-8 shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center">
                <UserRound size={34} className="text-cyan-300" />
              </div>

              <div>
                <h1 className="text-4xl font-black">
                  Patient Health Profile
                </h1>
                <p className="text-blue-100 mt-1">
                  Complete health context before consultation.
                </p>
              </div>
            </div>

            <Link
              to={`/video-call/${appointmentId}`}
              className="flex items-center justify-center gap-2 bg-white text-blue-700 px-5 py-3 rounded-2xl font-black"
            >
              <Video size={19} />
              Start Video Call
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-[360px_1fr] gap-6">
          <div className="space-y-6">
            <Card title="Patient Information" icon={UserRound}>
              <Info label="Name" value={patient?.fullName} />
              <Info label="Email" value={patient?.email} />
              <Info label="Mobile" value={patient?.mobile} />
            </Card>

            <Card title="Summary" icon={FileText}>
              <Info label="Symptom Checks" value={symptomHistory?.length} />
              <Info label="Medical Records" value={medicalRecords?.length} />
              <Info label="Prescriptions" value={prescriptions?.length} />
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Recent Symptom History" icon={Brain}>
              {symptomHistory?.length === 0 ? (
                <Empty text="No symptom history found." />
              ) : (
                <div className="space-y-4">
                  {symptomHistory.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 rounded-2xl p-4 border border-slate-100"
                    >
                      <div className="flex items-start gap-3">
                        {item.urgent && (
                          <AlertTriangle
                            size={22}
                            className="text-red-600 shrink-0"
                          />
                        )}

                        <div>
                          <h3 className="font-black text-slate-900">
                            {item.condition}
                          </h3>

                          <p className="text-slate-500 mt-1">
                            {item.symptoms}
                          </p>

                          <p className="text-sm text-blue-600 font-bold mt-2">
                            {item.specialization}
                          </p>

                          <p className="text-sm text-slate-500 mt-2">
                            {item.advice}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card title="Medical Records" icon={FileText}>
              {medicalRecords?.length === 0 ? (
                <Empty text="No medical records uploaded." />
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {medicalRecords.map((record) => (
                    <div
                      key={record.id}
                      className="bg-slate-50 rounded-2xl p-4 border border-slate-100"
                    >
                      <h3 className="font-black text-slate-900">
                        {record.title}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {record.recordType}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(record.uploadedAt).toLocaleString()}
                      </p>

                      <a
                        href={record.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold"
                      >
                        <Download size={16} />
                        Open Record
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card title="Previous Prescriptions" icon={Pill}>
              {prescriptions?.length === 0 ? (
                <Empty text="No previous prescriptions found." />
              ) : (
                <div className="space-y-4">
                  {prescriptions.map((prescription) => (
                    <div
                      key={prescription.id}
                      className="bg-slate-50 rounded-2xl p-4 border border-slate-100"
                    >
                      <h3 className="font-black text-slate-900">
                        Diagnosis: {prescription.diagnosis}
                      </h3>

                      <p className="text-slate-600 mt-2">
                        <b>Medicines:</b> {prescription.medicines}
                      </p>

                      <p className="text-slate-500 mt-1">
                        <b>Notes:</b> {prescription.notes || "-"}
                      </p>

                      <p className="text-xs text-slate-400 mt-2">
                        {new Date(prescription.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
          <Icon className="text-blue-600" size={22} />
        </div>

        <h2 className="text-xl font-black text-slate-900">
          {title}
        </h2>
      </div>

      {children}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-4 mb-3">
      <p className="text-xs font-bold text-slate-400 uppercase">
        {label}
      </p>
      <p className="font-black text-slate-900 mt-1">{value || "-"}</p>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-8 text-center text-slate-500">
      {text}
    </div>
  );
}