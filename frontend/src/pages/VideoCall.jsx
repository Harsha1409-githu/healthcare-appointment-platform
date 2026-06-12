import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import api from "../api/axios";

export default function VideoCall() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const apiRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    loadMeeting();

    return () => {
      disposeMeeting();
    };
  }, [appointmentId]);

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
    const patientName =
      data?.patient?.fullName || data?.patientName || "Patient";

    const doctorName =
      data?.doctor?.doctorName || data?.doctorName || "Doctor";

    const doctorToken = localStorage.getItem("doctorToken");
    const hospitalToken = localStorage.getItem("hospitalToken");

    if (doctorToken) return doctorName;
    if (hospitalToken) return data?.doctor?.hospital?.hospitalName || "Hospital";

    return patientName;
  };

  const loadMeeting = async () => {
    try {
      setLoading(true);
      setError("");
      setJoined(false);

      disposeMeeting();

      const res = await api.get(`/appointment/${appointmentId}`);
      const appointmentData = res.data;

      setAppointment(appointmentData);

      const roomName =
        appointmentData.videoRoomId ||
        `medicare-appointment-${appointmentId}`;

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

      setTimeout(() => {
        setLoading(false);
      }, 3000);
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

  const endCall = () => {
    disposeMeeting();
    navigate(-1);
  };

  const doctorName =
    appointment?.doctor?.doctorName || appointment?.doctorName || "Doctor";

  const patientName =
    appointment?.patient?.fullName ||
    appointment?.patientName ||
    "Patient";

  const slotText = appointment?.slot
    ? `${appointment.slot.date || "-"} • ${appointment.slot.startTime || ""} - ${
        appointment.slot.endTime || ""
      }`
    : "Scheduled consultation";

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden">
      <div className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600 flex items-center justify-center shadow-sm shrink-0">
            <Video className="text-white" size={23} />
          </div>

          <div className="min-w-0">
            <h1 className="font-black text-slate-950 truncate">
              Video Consultation
            </h1>

            <p className="text-sm text-slate-500 truncate">
              Appointment #{appointmentId}
              {appointment?.doctor?.doctorName
                ? ` • Dr. ${appointment.doctor.doctorName}`
                : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-700 font-black">
            <ShieldCheck size={18} />
            Secure Room
          </div>

          <button
            onClick={endCall}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-3 rounded-2xl font-black hover:bg-red-700 transition"
          >
            <PhoneOff size={18} />
            <span className="hidden md:inline">End Call</span>
          </button>

          <button
            onClick={() => navigate(-1)}
            className="hidden md:flex items-center gap-2 bg-slate-950 text-white px-4 py-3 rounded-2xl font-black"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] flex-1 min-h-0">
        <aside className="hidden lg:block bg-white border-r border-slate-200 p-5 overflow-y-auto">
          <div className="bg-cyan-50 border border-cyan-100 rounded-3xl p-5 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-4">
              <Wifi className="text-cyan-600" size={24} />
            </div>

            <p className="font-black text-slate-950">
              Live Consultation
            </p>

            <p className="text-sm text-slate-500 mt-1">
              {joined ? "Connected successfully" : "Preparing secure room"}
            </p>
          </div>

          <InfoCard
            icon={Stethoscope}
            label="Doctor"
            value={`Dr. ${doctorName}`}
          />

          <InfoCard
            icon={UserRound}
            label="Patient"
            value={patientName}
          />

          <InfoCard
            icon={Clock}
            label="Schedule"
            value={slotText}
          />

          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 mt-5">
            <h3 className="font-black text-slate-950">
              Consultation Tips
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>• Keep camera and microphone enabled</li>
              <li>• Use a stable internet connection</li>
              <li>• Keep medical reports ready</li>
              <li>• Ask doctor before ending call</li>
            </ul>
          </div>
        </aside>

        <main className="relative min-h-0">
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

                <p className="text-slate-500 mt-3">
                  {error}
                </p>

                <div className="grid gap-3 mt-6">
                  <button
                    onClick={loadMeeting}
                    className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black hover:bg-cyan-700 transition flex items-center justify-center gap-2"
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
        </main>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 mb-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-2xl bg-cyan-50 flex items-center justify-center shrink-0">
          <Icon className="text-cyan-600" size={20} />
        </div>

        <div>
          <p className="text-xs font-black text-slate-400 uppercase">
            {label}
          </p>

          <p className="font-black text-slate-950 mt-1">
            {value || "-"}
          </p>
        </div>
      </div>
    </div>
  );
}