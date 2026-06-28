import { useEffect, useState } from "react";
import { CalendarDays, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function AppointmentSummaryCard() {
  const patient =
    JSON.parse(localStorage.getItem("patientUser") || "null") ||
    JSON.parse(localStorage.getItem("user") || "null");

  const selectedProfile = JSON.parse(
    localStorage.getItem("selectedProfile") || "null"
  );

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUpcomingAppointment();
  }, []);

  const loadUpcomingAppointment = async () => {
    try {
      const res = await api.get("/appointment/my");

      const appointments = res.data || [];

      const upcoming = appointments.find(
        (item) =>
          item.status !== "CANCELLED" &&
          item.status !== "COMPLETED"
      );

      setAppointment(upcoming || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <section className="max-w-[900px] mx-auto px-4 py-2">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
        {appointment ? (
          <>
            <div className="flex items-center gap-2">
  <CalendarDays
    size={18}
    className="text-cyan-600"
  />

  <p className="text-xs text-cyan-700 font-black">
    NEXT APPOINTMENT
  </p>
</div>

            <h3 className="text-lg font-black text-slate-950 mt-1">
              {appointment.doctor?.doctorName || "Doctor"}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {appointment.doctor?.specialization || "Specialist"}
            </p>

            <div className="flex items-center gap-2 mt-3 text-sm font-bold text-slate-700">
              <CalendarDays size={16} className="text-cyan-600" />

              {appointment.appointmentDate || "Upcoming"}
            </div>

            <Link
              to="/patient/appointments"
              className="mt-4 inline-flex items-center gap-1 text-cyan-600 font-black text-sm"
            >
              View Appointment
              <ChevronRight size={16} />
            </Link>
          </>
        ) : (
          <>
           <div className="flex items-center gap-2">
  <CalendarDays
    size={18}
    className="text-cyan-600"
  />

  <p className="text-xs text-cyan-700 font-black">
    APPOINTMENTS
  </p>
</div>

<h3 className="text-lg font-black text-slate-950 mt-3">
  No Upcoming Appointments
</h3>

            <p className="text-sm text-slate-500 mt-1">
              Book a doctor consultation in minutes.
            </p>

            <Link
              to="/doctors"
              className="mt-4 inline-flex items-center gap-1 text-cyan-600 font-black text-sm"
            >
              Book Appointment
              <ChevronRight size={16} />
            </Link>
          </>
        )}
      </div>
    </section>
  );
}