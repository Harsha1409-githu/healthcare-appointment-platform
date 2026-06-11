import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Video,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  PhoneOff,
} from "lucide-react";
import api from "../api/axios";

export default function VideoCall() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const apiRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    loadMeeting();

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, []);

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

  const loadMeeting = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/appointment/${appointmentId}`);
      setAppointment(res.data);

      const roomName =
        res.data.videoRoomId ||
        `medicare-appointment-${appointmentId}`;

      await loadJitsiScript();

      if (!window.JitsiMeetExternalAPI) {
        alert("Video service failed to load");
        return;
      }

      if (apiRef.current) {
        apiRef.current.dispose();
      }

      apiRef.current = new window.JitsiMeetExternalAPI("meet.jit.si", {
        roomName,
        parentNode: containerRef.current,
        width: "100%",
        height: "100%",
        userInfo: {
          displayName:
            res.data.patient?.fullName ||
            res.data.patientName ||
            "MediCare User",
        },
        configOverwrite: {
          prejoinPageEnabled: false,
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableDeepLinking: true,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_POWERED_BY: false,
        },
      });

      apiRef.current.addEventListener("videoConferenceJoined", () => {
        setLoading(false);
      });

      apiRef.current.addEventListener("readyToClose", () => {
        navigate(-1);
      });

      setTimeout(() => {
        setLoading(false);
      }, 2500);
    } catch (error) {
      console.error("Video call error:", error);
      alert(
        error.response?.data?.message ||
          "Unable to load video consultation"
      );
      navigate(-1);
    }
  };

  const endCall = () => {
    if (apiRef.current) {
      apiRef.current.dispose();
      apiRef.current = null;
    }

    navigate(-1);
  };

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden">
      <div className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
            <Video className="text-white" size={23} />
          </div>

          <div>
            <h1 className="font-black text-slate-900">
              Video Consultation
            </h1>

            <p className="text-sm text-slate-500">
              Appointment #{appointmentId}
              {appointment?.doctor?.doctorName
                ? ` • Dr. ${appointment.doctor.doctorName}`
                : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-700 font-bold">
            <ShieldCheck size={18} />
            Secure Room
          </div>

          <button
            onClick={endCall}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-3 rounded-2xl font-bold hover:bg-red-700"
          >
            <PhoneOff size={18} />
            End Call
          </button>

          <button
            onClick={() => navigate(-1)}
            className="hidden md:flex items-center gap-2 bg-slate-950 text-white px-4 py-3 rounded-2xl font-bold"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>
      </div>

      <div className="relative flex-1">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 bg-slate-950">
            <Loader2 className="animate-spin text-cyan-300" size={42} />

            <h2 className="text-2xl font-black mt-5">
              Preparing secure consultation room...
            </h2>

            <p className="text-slate-400 mt-2">
              Please allow camera and microphone access.
            </p>
          </div>
        )}

        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
}