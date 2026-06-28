import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  X,
  Clock,
  CalendarDays,
  FileText,
  BellPlus,
} from "lucide-react";

export default function DoctorQuickActionFab() {
  const [open, setOpen] = useState(false);

  const actions = [
    {
      to: "/doctor/availability",
      label: "Add Slot",
      icon: Clock,
    },
    {
      to: "/doctor/calendar",
      label: "Calendar",
      icon: CalendarDays,
    },
    {
      to: "/doctor/follow-ups",
      label: "Follow-up",
      icon: BellPlus,
    },
    {
      to: "/doctor/prescriptions",
      label: "Prescriptions",
      icon: FileText,
    },
  ];

  return (
    <div className="fixed right-4 bottom-24 z-50 md:hidden">
      {open && (
        <div className="mb-3 space-y-2">
          {actions.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex items-center justify-end gap-2"
              >
                <span className="bg-slate-950 text-white text-xs font-black px-3 py-2 rounded-2xl shadow-lg">
                  {item.label}
                </span>

                <span className="w-11 h-11 rounded-2xl bg-white border border-slate-100 shadow-lg flex items-center justify-center">
                  <Icon size={18} className="text-cyan-600" />
                </span>
              </Link>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-3xl bg-cyan-600 text-white shadow-xl flex items-center justify-center active:scale-95 transition"
      >
        {open ? <X size={24} /> : <Plus size={26} />}
      </button>
    </div>
  );
}