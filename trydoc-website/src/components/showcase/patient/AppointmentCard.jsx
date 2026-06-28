import { CalendarCheck, Video } from "lucide-react";

export default function AppointmentCard() {
  return (
    <div className="mt-4 rounded-3xl bg-cyan-600 p-5 text-white shadow-lg shadow-cyan-500/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black text-cyan-100">
            TODAY&apos;S APPOINTMENT
          </p>

          <h4 className="mt-3 text-xl font-black">
            Dr Rahul Sharma
          </h4>

          <p className="mt-1 text-sm font-bold text-cyan-100">
            Cardiology • 4:30 PM
          </p>
        </div>

        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/20">
          <CalendarCheck size={21} />
        </div>
      </div>

      <button
        type="button"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 text-sm font-black text-cyan-700"
      >
        <Video size={16} />
        Join Video Consult
      </button>
    </div>
  );
}