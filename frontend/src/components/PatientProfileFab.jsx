import { useState } from "react";
import {
  Plus,
  X,
  Pill,
  CalendarDays,
  Phone,
  MessageCircle,
  Video,
} from "lucide-react";

export default function PatientProfileFab({
  patient,
  appointmentId,
  onPrescription,
  onFollowUp,
}) {
  const [open, setOpen] = useState(false);

  const mobile = patient?.mobile || "";

  const whatsappUrl = mobile
    ? `https://wa.me/91${mobile}`
    : "#";

  return (
    <div className="fixed bottom-28 right-4 z-50">
      <div className="flex flex-col items-end gap-3">
        {open && (
          <>
            <button
              onClick={() => {
                onPrescription?.();
                setOpen(false);
              }}
              className="flex items-center gap-3 bg-white shadow-xl border border-slate-100 rounded-2xl px-4 py-3"
            >
              <Pill size={18} className="text-cyan-600" />
              <span className="font-black text-sm">
                Prescription
              </span>
            </button>

            <button
              onClick={() => {
                onFollowUp?.();
                setOpen(false);
              }}
              className="flex items-center gap-3 bg-white shadow-xl border border-slate-100 rounded-2xl px-4 py-3"
            >
              <CalendarDays
                size={18}
                className="text-violet-600"
              />
              <span className="font-black text-sm">
                Follow-up
              </span>
            </button>

            <a
              href={`tel:${mobile}`}
              className="flex items-center gap-3 bg-white shadow-xl border border-slate-100 rounded-2xl px-4 py-3"
            >
              <Phone size={18} className="text-emerald-600" />
              <span className="font-black text-sm">
                Call
              </span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-white shadow-xl border border-slate-100 rounded-2xl px-4 py-3"
            >
              <MessageCircle
                size={18}
                className="text-green-600"
              />
              <span className="font-black text-sm">
                WhatsApp
              </span>
            </a>

            <a
              href={`/video-call/${appointmentId}`}
              className="flex items-center gap-3 bg-white shadow-xl border border-slate-100 rounded-2xl px-4 py-3"
            >
              <Video size={18} className="text-red-600" />
              <span className="font-black text-sm">
                Video Consult
              </span>
            </a>
          </>
        )}

        <button
          onClick={() => setOpen(!open)}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-all ${
            open
              ? "bg-red-500 rotate-45"
              : "bg-cyan-600"
          }`}
        >
          {open ? (
            <X size={24} />
          ) : (
            <Plus size={24} />
          )}
        </button>
      </div>
    </div>
  );
}