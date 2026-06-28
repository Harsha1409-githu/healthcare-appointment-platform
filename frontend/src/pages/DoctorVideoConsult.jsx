import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Video,
  Clock,
  UserRound,
  Stethoscope,
  ExternalLink,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function DoctorVideoConsult() {
  const { appointmentId } = useParams();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [callStarted, setCallStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    fetchAppointment();
  }, []);

  useEffect(() => {
    if (!callStarted) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [callStarted]);

  const fetchAppointment = async () => {
    try {
      const res = await api.get(`/appointment/${appointmentId}`);
      setAppointment(res.data);
    } catch (error) {
      toast.error("Unable to load video consultation");
    } finally {
      setLoading(false);
    }
  };

  const completeAppointment = async () => {
    try {
      await api.patch(`/appointment/${appointmentId}/complete`);
      toast.success("Consultation completed");
      fetchAppointment();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to complete consultation"
      );
    }
  };

  const formatDuration = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f8fb] p-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-5">
          Loading video consultation...
        </div>
      </main>
    );
  }

  if (!appointment) return null;

  const patientName =
    appointment.familyMember?.fullName ||
    appointment.patient?.fullName ||
    appointment.patientName ||
    "Patient";

  return (
    <main className="min-h-screen bg-[#f4f8fb] p-4 pb-28">
      <div className="max-w-md mx-auto">
        <Link
          to="/doctor/dashboard"
          className="inline-flex items-center gap-2 text-sm font-black text-cyan-700 mb-3"
        >
          <ArrowLeft size={17} />
          Back
        </Link>

        <section className="bg-cyan-600 text-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-cyan-100">
                VIDEO CONSULTATION
              </p>

              <h1 className="text-2xl font-black mt-1">
                Control Center
              </h1>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Video size={26} />
            </div>
          </div>

          <div className="mt-5 bg-white/15 rounded-2xl p-3">
            <p className="text-xs text-cyan-100 font-black">
              CALL DURATION
            </p>

            <p className="text-3xl font-black mt-1">
              {formatDuration()}
            </p>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <Info icon={UserRound} label="Patient" value={patientName} />
          <Info
            icon={Stethoscope}
            label="Doctor"
            value={appointment.doctor?.doctorName}
          />
          <Info
            icon={Clock}
            label="Time"
            value={`${formatTime(appointment.slot?.startTime) || "--"} - ${
              formatTime(appointment.slot?.endTime) || "--"
            }`}
          />
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <button
            type="button"
            onClick={() => setCallStarted(true)}
            className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-black flex items-center justify-center gap-2"
          >
            <Video size={18} />
            Start Tracking
          </button>

          {appointment.meetingLink && (
            <a
              href={appointment.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="mt-3 w-full bg-cyan-600 text-white py-3 rounded-2xl font-black flex items-center justify-center gap-2"
            >
              <ExternalLink size={18} />
              Join Video Call
            </a>
          )}

          <button
            type="button"
            onClick={completeAppointment}
            disabled={appointment.status === "COMPLETED"}
            className="mt-3 w-full bg-slate-950 text-white py-3 rounded-2xl font-black flex items-center justify-center gap-2 disabled:bg-slate-400"
          >
            <CheckCircle2 size={18} />
            {appointment.status === "COMPLETED"
              ? "Completed"
              : "Complete Consultation"}
          </button>
        </section>
      </div>
    </main>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-b-0">
      <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
        <Icon size={18} className="text-cyan-600" />
      </div>

      <div>
        <p className="text-xs text-slate-500 font-bold">{label}</p>
        <p className="text-sm font-black text-slate-950">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}