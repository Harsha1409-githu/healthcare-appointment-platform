import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  FileText,
  Loader2,
  Stethoscope,
  UserRound,
  Video,
} from "lucide-react";
import api from "@/api/axios";

export default function DoctorAppointmentDetails() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointment();
  }, [appointmentId]);

  const loadAppointment = async () => {
    try {
      const res = await api.get(`/appointment/${appointmentId}`);
      setAppointment(res.data);
    } catch (error) {
      console.error(error);
      alert("Unable to load appointment");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8fb]">
        <Loader2 className="animate-spin text-cyan-600" size={36} />
      </main>
    );
  }

  const patient =
    appointment?.familyMember ||
    appointment?.patient ||
    {};

  const patientName =
    patient?.fullName ||
    appointment?.patientName ||
    "Patient";

  const isVideo = appointment?.appointmentType === "VIDEO";

  return (
    <main className="min-h-screen bg-[#f6f8fb] pb-28">
      <div className="mx-auto max-w-md px-4 pt-4">
        <header className="rounded-[1.7rem] bg-white p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <p className="text-[11px] font-black uppercase text-cyan-700">
                Appointment Details
              </p>
              <h1 className="text-lg font-black text-slate-950">
                {patientName}
              </h1>
            </div>
          </div>
        </header>

        <section className="mt-3 rounded-[1.7rem] bg-white p-4 shadow-sm border border-slate-100">
          <Info icon={UserRound} label="Patient" value={patientName} />
          <Info icon={CalendarDays} label="Date" value={appointment?.slot?.date || "-"} />
          <Info
            icon={Clock}
            label="Time"
            value={`${appointment?.slot?.startTime || "-"} - ${
              appointment?.slot?.endTime || "-"
            }`}
          />
          <Info
            icon={isVideo ? Video : Stethoscope}
            label="Type"
            value={isVideo ? "Video Consultation" : "In-clinic Visit"}
          />
          <Info label="Status" value={appointment?.status || "BOOKED"} />
        </section>

        <section className="mt-3 rounded-[1.7rem] bg-white p-4 shadow-sm border border-slate-100">
          <h2 className="font-black text-slate-950 mb-3">
            Patient Info
          </h2>

          <Info label="Age" value={patient?.age || "-"} />
          <Info label="Gender" value={patient?.gender || "-"} />
          <Info label="Mobile" value={patient?.mobile || appointment?.mobile || "-"} />
        </section>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            to={`/doctor/appointment/${appointmentId}/patient-profile`}
            className="rounded-2xl bg-white py-3 text-center text-sm font-black text-slate-800 border border-slate-100"
          >
            Patient Profile
          </Link>

          <Link
            to={`/doctor/consultation/${appointmentId}`}
            className="rounded-2xl bg-cyan-600 py-3 text-center text-sm font-black text-white"
          >
            Consult
          </Link>
        </div>
      </div>
    </main>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="mb-3 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
      {Icon && <Icon size={18} className="text-cyan-600" />}
      <div>
        <p className="text-[10px] font-black uppercase text-slate-500">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}