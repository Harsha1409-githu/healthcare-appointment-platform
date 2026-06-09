import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Video, ArrowLeft } from "lucide-react";
import api from "../api/axios";

export default function VideoCall() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeeting();

    return () => {
      const existingScript = document.querySelector(
        'script[src="https://meet.jit.si/external_api.js"]'
      );

      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const loadMeeting = async () => {
    try {
      const res = await api.get(`/appointment/${appointmentId}`);

      const roomName =
        res.data.videoRoomId ||
        `medicare-appointment-${appointmentId}`;

      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;

      script.onload = () => {
        if (!window.JitsiMeetExternalAPI) {
          alert("Video service failed to load");
          return;
        }

        new window.JitsiMeetExternalAPI("meet.jit.si", {
          roomName,
          parentNode: containerRef.current,
          width: "100%",
          height: "100%",
          configOverwrite: {
            prejoinPageEnabled: false,
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
          },
        });

        setLoading(false);
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error(error);
      alert("Unable to load video consultation");
      navigate(-1);
    }
  };

  return (
    <div className="h-screen bg-slate-950 flex flex-col">
      <div className="h-20 bg-white border-b flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center">
            <Video className="text-white" size={22} />
          </div>

          <div>
            <h1 className="font-black text-slate-900">
              Video Consultation
            </h1>
            <p className="text-sm text-slate-500">
              Secure online consultation room
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-slate-950 text-white px-4 py-3 rounded-2xl font-bold"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <div className="relative flex-1">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-white z-10">
            Loading video room...
          </div>
        )}

        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
}