import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Video,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  PhoneOff,
  UserRound,
  Stethoscope,
  Clock,
  Wifi,
  AlertTriangle,
  RefreshCw,
  FileText,
  ClipboardList,
  Pill,
  CalendarDays,
  Mic,
  Activity,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function VideoCall() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const apiRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    loadMeeting();

    const timer = setInterval(() => {
      setDuration((prev) => (joined ? prev + 1 : prev));
    }, 1000);

    return () => {
      clearInterval(timer);
      disposeMeeting();
    };
  }, [appointmentId, joined]);

  const disposeMeeting = () => {
    if (apiRef.current) {
      apiRef.current.dispose();
      apiRef.current = null;
    }
  };

  const loadJitsiScript = () => {
    return new Promise((resolve, reject) => {
      if (window.JitsiMeetExternalAPI) {
        resolve();
        return;
      }

      const existingScript = document.querySelector(
        'script[src="https://meet.jit.si/external_api.js"]'
      );

      if (existingScript) {
        existingScript.onload = resolve;
        existingScript.onerror = reject;
        return;
      }

      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;

      document.body.appendChild(script);
    });
  };

  const getDisplayName = (data) => {
    const patientName = data?.patient?.fullName || data?.patientName || "Patient";
    const doctorName = data?.doctor?.doctorName || data?.doctorName || "Doctor";

    if (localStorage.getItem("doctorToken")) return `Dr. ${doctorName}`;
    return patientName;
  };

  const loadMeeting = async () => {
    try {
      setLoading(true);
      setError("");
      setJoined(false);
      disposeMeeting();

      const appointmentRes = await api.get(`/appointment/${appointmentId}`);
      const appointmentData = appointmentRes.data;
      setAppointment(appointmentData);

      try {
        const checkInRes = await api.get(
          `/check-in/doctor/appointment/${appointmentId}`
        );
        setCheckIn(checkInRes.data);
      } catch {
        setCheckIn(null);
      }

      try {
        const rxRes = await api.get(`/prescription/appointment/${appointmentId}`);
        setPrescription(rxRes.data || null);
      } catch {
        setPrescription(null);
      }

      const roomName =
        appointmentData.videoRoomId || `TryDoc-appointment-${appointmentId}`;

      await loadJitsiScript();

      if (!window.JitsiMeetExternalAPI) {
        throw new Error("Video service failed to load");
      }

      if (!containerRef.current) {
        throw new Error("Video container not ready");
      }

      apiRef.current = new window.JitsiMeetExternalAPI("meet.jit.si", {
        roomName,
        parentNode: containerRef.current,
        width: "100%",
        height: "100%",
        userInfo: {
          displayName: getDisplayName(appointmentData),
        },
        configOverwrite: {
          prejoinPageEnabled: false,
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableDeepLinking: true,
          enableWelcomePage: false,
          disableInviteFunctions: true,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_POWERED_BY: false,
          MOBILE_APP_PROMO: false,
        },
      });

      apiRef.current.addEventListener("videoConferenceJoined", () => {
        setJoined(true);
        setLoading(false);
      });

      apiRef.current.addEventListener("videoConferenceLeft", () => {
        navigate(-1);
      });

      apiRef.current.addEventListener("readyToClose", () => {
        navigate(-1);
      });

      setTimeout(() => setLoading(false), 3000);
    } catch (error) {
      console.error("Video call error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load video consultation"
      );
      setLoading(false);
    }
  };

  const completeAppointment = async () => {
    try {
      await api.patch(`/appointment/${appointmentId}/complete`);
      toast.success("Consultation completed");
      navigate(`/doctor/appointment/${appointmentId}/patient-profile`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to complete");
    }
  };

  const endCall = () => {
    disposeMeeting();
    navigate(-1);
  };

  const doctorName =
    appointment?.doctor?.doctorName || appointment?.doctorName || "Doctor";

  const patientName =
    appointment?.patient?.fullName || appointment?.patientName || "Patient";

  const patientMeta = [
    appointment?.patient?.age ? `${appointment.patient.age} yrs` : null,
    appointment?.patient?.gender,
    appointment?.patient?.bloodGroup,
  ]
    .filter(Boolean)
    .join(" • ");

  const slotText = appointment?.slot
    ? `${appointment.slot.date || "-"} • ${appointment.slot.startTime || ""} - ${
        appointment.slot.endTime || ""
      }`
    : "Scheduled consultation";

  const durationText = `${String(Math.floor(duration / 60)).padStart(
    2,
    "0"
  )}:${String(duration % 60).padStart(2, "0")}`;

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden">
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-3 md:px-6 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="w-11 h-11 rounded-2xl bg-cyan-600 flex items-center justify-center shrink-0">
            <Video className="text-white" size={22} />
          </div>

          <div className="min-w-0">
            <h1 className="font-black text-slate-950 truncate">
              Video Consultation
            </h1>

            <p className="text-xs md:text-sm text-slate-500 truncate">
              {patientName} • {durationText}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-xs">
            <ShieldCheck size={16} />
            Secure
          </div>

          <button
            onClick={endCall}
            className="flex items-center gap-2 bg-red-600 text-white px-3 py-3 rounded-2xl font-black"
          >
            <PhoneOff size={18} />
            <span className="hidden md:inline">End</span>
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[330px_1fr_330px] flex-1 min-h-0">
        <aside className="hidden lg:block bg-white border-r border-slate-200 p-4 overflow-y-auto">
          <PanelTitle title="Patient Summary" />

          <PatientCard
            patientName={patientName}
            patientMeta={patientMeta}
            slotText={slotText}
          />

          <InfoSection icon={Activity} title="Check-In">
            {checkIn ? (
              <div className="space-y-2">
                <MiniInfo label="Temperature" value={checkIn.temperature} />
                <MiniInfo label="Blood Pressure" value={checkIn.bloodPressure} />
                <MiniInfo label="Weight" value={checkIn.weight} />
              </div>
            ) : (
              <EmptyNote text="No check-in submitted yet." />
            )}
          </InfoSection>

          <InfoSection icon={ClipboardList} title="Symptoms">
            {checkIn?.symptoms ? (
              <div className="flex flex-wrap gap-2">
                {checkIn.symptoms
                  .split(",")
                  .filter(Boolean)
                  .map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700"
                    >
                      {item.trim()}
                    </span>
                  ))}
              </div>
            ) : (
              <EmptyNote text="No symptoms added." />
            )}
          </InfoSection>

          <InfoSection icon={FileText} title="Notes">
            <p className="text-sm font-semibold text-slate-700">
              {checkIn?.notes || "No patient notes."}
            </p>
          </InfoSection>
        </aside>

        <main className="relative min-h-0 bg-slate-950">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-slate-950">
              <Loader2 className="animate-spin text-cyan-300" size={42} />

              <h2 className="text-2xl font-black mt-5 text-center px-4">
                Preparing secure consultation room...
              </h2>

              <p className="text-slate-400 mt-2 text-center px-4">
                Please allow camera and microphone access.
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-slate-950 px-6">
              <div className="max-w-md w-full bg-white rounded-[2rem] p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="text-red-600" size={34} />
                </div>

                <h2 className="text-2xl font-black text-slate-950">
                  Video call failed
                </h2>

                <p className="text-slate-500 mt-3">{error}</p>

                <div className="grid gap-3 mt-6">
                  <button
                    onClick={loadMeeting}
                    className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={18} />
                    Retry
                  </button>

                  <button
                    onClick={() => navigate(-1)}
                    className="w-full bg-slate-950 text-white py-4 rounded-2xl font-black"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          )}

          <div ref={containerRef} className="w-full h-full" />

          <div className="absolute left-3 right-3 bottom-3 lg:hidden">
            <div className="rounded-3xl bg-white/95 backdrop-blur-xl p-3 shadow-xl">
              <p className="text-xs font-black text-cyan-700">
                {patientName}
              </p>
              <p className="text-[11px] text-slate-500 font-semibold truncate">
                {checkIn?.symptoms || "No symptoms submitted"}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <Link
                  to={`/doctor/consultation/${appointmentId}`}
                  className="rounded-2xl bg-cyan-600 py-3 text-center text-xs font-black text-white"
                >
                  Open Notes
                </Link>

                <button
                  type="button"
                  onClick={completeAppointment}
                  className="rounded-2xl bg-slate-950 py-3 text-xs font-black text-white"
                >
                  Complete
                </button>
              </div>
            </div>
          </div>
        </main>

        <aside className="hidden lg:block bg-white border-l border-slate-200 p-4 overflow-y-auto">
          <PanelTitle title="Clinical Actions" />

          <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center">
                <Wifi className="text-cyan-600" size={22} />
              </div>

              <div>
                <p className="font-black text-slate-950">
                  {joined ? "Live Now" : "Preparing Room"}
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  Duration {durationText}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 grid gap-2">
            <Link
              to={`/doctor/consultation/${appointmentId}`}
              className="ActionButton bg-cyan-600 text-white"
            >
              <Stethoscope size={18} />
              Open Consultation Workspace
            </Link>

            {prescription?.id ? (
              <a
                href={`${import.meta.env.VITE_API_URL}/prescription/${
                  prescription.id
                }/pdf`}
                target="_blank"
                rel="noreferrer"
                className="ActionButton bg-emerald-50 text-emerald-700"
              >
                <FileText size={18} />
                View Prescription PDF
              </a>
            ) : (
              <Link
                to={`/doctor/consultation/${appointmentId}`}
                className="ActionButton bg-slate-50 text-slate-800"
              >
                <Pill size={18} />
                Generate Prescription
              </Link>
            )}

            <Link
              to={`/doctor/appointment/${appointmentId}/patient-profile`}
              className="ActionButton bg-slate-50 text-slate-800"
            >
              <UserRound size={18} />
              Patient Profile
            </Link>

            <button
              type="button"
              onClick={completeAppointment}
              className="ActionButton bg-slate-950 text-white"
            >
              <CalendarDays size={18} />
              Complete Consultation
            </button>

            <button
              type="button"
              onClick={endCall}
              className="ActionButton bg-red-50 text-red-600"
            >
              <PhoneOff size={18} />
              End Video Call
            </button>
          </div>

          <div className="mt-4 rounded-3xl bg-slate-50 border border-slate-100 p-4">
            <h3 className="font-black text-slate-950 flex items-center gap-2">
              <Mic size={18} className="text-cyan-600" />
              Doctor Tips
            </h3>

            <ul className="mt-3 space-y-2 text-sm font-semibold text-slate-600">
              <li>• Review symptoms before starting treatment.</li>
              <li>• Keep consultation workspace open for notes.</li>
              <li>• Generate prescription before completing.</li>
              <li>• Schedule follow-up if needed.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PanelTitle({ title }) {
  return (
    <h2 className="text-lg font-black text-slate-950 mb-3">{title}</h2>
  );
}

function PatientCard({ patientName, patientMeta, slotText }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
          <UserRound className="text-cyan-600" size={24} />
        </div>

        <div className="min-w-0">
          <h3 className="font-black text-slate-950 truncate">{patientName}</h3>
          <p className="text-xs font-semibold text-slate-500 truncate">
            {patientMeta || "Patient details"}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-slate-50 p-3">
        <p className="text-[10px] font-black text-slate-500 uppercase">
          Schedule
        </p>
        <p className="text-sm font-bold text-slate-800 mt-1">{slotText}</p>
      </div>
    </div>
  );
}

function InfoSection({ icon: Icon, title, children }) {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} className="text-cyan-600" />
        <h3 className="font-black text-slate-950">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function MiniInfo({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-[10px] font-black uppercase text-slate-500">
        {label}
      </p>
      <p className="text-sm font-bold text-slate-900 mt-1">{value || "-"}</p>
    </div>
  );
}

function EmptyNote({ text }) {
  return (
    <p className="rounded-2xl bg-slate-50 p-3 text-sm font-semibold text-slate-500">
      {text}
    </p>
  );
}