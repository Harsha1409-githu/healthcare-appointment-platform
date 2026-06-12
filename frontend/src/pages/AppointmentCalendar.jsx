import { useEffect, useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  CalendarDays,
  Clock,
  UserRound,
  Stethoscope,
  Video,
  X,
  Search,
  CheckCircle2,
  XCircle,
  CalendarCheck,
  RefreshCw,
  Filter,
  ShieldCheck,
  Activity,
  Phone,
  Building2,
  Loader2,
} from "lucide-react";
import api from "../api/axios";

const locales = {};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function AppointmentCalendar() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const doctorToken = localStorage.getItem("doctorToken");
  const hospitalToken = localStorage.getItem("hospitalToken");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      let res;

      if (doctorToken) {
        const doctor = JSON.parse(localStorage.getItem("doctorUser") || "null");
        res = await api.get(`/appointment/doctor/${doctor.id}`);
      } else if (hospitalToken) {
        res = await api.get("/appointment/hospital/my");
      } else {
        res = await api.get("/appointment/my");
      }

      setAppointments(res.data || []);
    } catch (error) {
      console.error("Calendar appointment error:", error);
      alert("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((item) => {
    const matchesStatus =
      statusFilter === "ALL" || item.status === statusFilter;

    const text = `${item.patientName || ""} ${item.patientPhone || ""} ${
      item.doctor?.doctorName || ""
    } ${item.doctor?.specialization || ""} ${
      item.doctor?.hospital?.hospitalName || ""
    }`.toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const stats = useMemo(
    () => ({
      total: appointments.length,
      booked: appointments.filter((a) => a.status === "BOOKED").length,
      completed: appointments.filter((a) => a.status === "COMPLETED").length,
      cancelled: appointments.filter((a) => a.status === "CANCELLED").length,
    }),
    [appointments]
  );

  const events = useMemo(() => {
    return filteredAppointments
      .filter((appointment) => appointment.slot?.date)
      .map((appointment) => {
        const date = appointment.slot.date;
        const startTime = appointment.slot.startTime || "09:00";
        const endTime = appointment.slot.endTime || "09:30";

        return {
          id: appointment.id,
          title: `${appointment.patientName || "Patient"} • ${
            appointment.doctor?.doctorName || "Doctor"
          }`,
          start: new Date(`${date}T${startTime}`),
          end: new Date(`${date}T${endTime}`),
          resource: appointment,
        };
      });
  }, [filteredAppointments]);

  const eventStyleGetter = (event) => {
    const status = event.resource?.status;

    let backgroundColor = "#0891b2";

    if (status === "COMPLETED") backgroundColor = "#059669";
    if (status === "CANCELLED") backgroundColor = "#dc2626";

    return {
      style: {
        backgroundColor,
        borderRadius: "14px",
        border: "none",
        color: "white",
        fontWeight: 800,
        padding: "5px 8px",
        boxShadow: "0 8px 20px rgba(15, 23, 42, 0.15)",
      },
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4fbff] flex items-center justify-center">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 text-center">
          <Loader2 className="mx-auto text-cyan-600 animate-spin mb-4" size={38} />
          <p className="text-slate-500 font-semibold">
            Loading appointment calendar...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="max-w-[1500px] mx-auto px-6 py-8">
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                <CalendarDays size={17} />
                ADVANCED SCHEDULING CENTER
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                Appointment Calendar
              </h1>

              <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
                Month, week, day and agenda views with status colors, video
                consultation access and appointment insights.
              </p>
            </div>

            <button
              onClick={fetchAppointments}
              className="inline-flex items-center justify-center gap-2 bg-cyan-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-cyan-700 transition"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </section>

        <section className="grid md:grid-cols-4 gap-5 mb-8">
          <StatCard icon={CalendarCheck} label="Total" value={stats.total} />
          <StatCard icon={Clock} label="Booked" value={stats.booked} />
          <StatCard
            icon={CheckCircle2}
            label="Completed"
            value={stats.completed}
            tone="green"
          />
          <StatCard
            icon={XCircle}
            label="Cancelled"
            value={stats.cancelled}
            tone="red"
          />
        </section>

        <section className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                Calendar View
              </h2>

              <p className="text-slate-500 text-sm">
                Showing {events.length} appointment events
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 md:w-80">
                <Search size={18} className="text-cyan-600" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search patient or doctor..."
                  className="w-full bg-transparent outline-none text-slate-800"
                />
              </div>

              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                <Filter size={18} className="text-cyan-600" />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent font-bold outline-none text-slate-800"
                >
                  <option value="ALL">All Status</option>
                  <option value="BOOKED">Booked</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="h-[760px] premium-calendar">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                views={["month", "week", "day", "agenda"]}
                defaultView="month"
                popup
                eventPropGetter={eventStyleGetter}
                onSelectEvent={(event) =>
                  setSelectedAppointment(event.resource)
                }
              />
            </div>
          </div>
        </section>
      </div>

      {selectedAppointment && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
}

function AppointmentModal({ appointment, onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-xl w-full overflow-hidden border border-slate-100">
        <div className="bg-slate-950 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black">Appointment Details</h2>
            <p className="text-slate-300 text-sm">#{appointment.id}</p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <Detail
            icon={Stethoscope}
            label="Doctor"
            value={appointment.doctor?.doctorName || "Doctor"}
          />

          <Detail
            icon={UserRound}
            label="Patient"
            value={appointment.patientName}
          />

          <Detail
            icon={Phone}
            label="Patient Phone"
            value={appointment.patientPhone}
          />

          <Detail
            icon={Building2}
            label="Hospital"
            value={appointment.doctor?.hospital?.hospitalName || "Hospital"}
          />

          <Detail
            icon={Clock}
            label="Schedule"
            value={`${appointment.slot?.date || "-"} | ${
              appointment.slot?.startTime || ""
            } - ${appointment.slot?.endTime || ""}`}
          />

          <div>
            <p className="text-xs font-black text-slate-400 uppercase mb-2">
              Status
            </p>

            <StatusBadge status={appointment.status} />
          </div>

          {appointment.videoRoomId && appointment.status === "BOOKED" && (
            <a
              href={`/video-call/${appointment.id}`}
              className="flex items-center justify-center gap-2 bg-cyan-600 text-white py-4 rounded-2xl font-black hover:bg-cyan-700 transition"
            >
              <Video size={20} />
              Join Video Consultation
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-4 flex gap-3 border border-slate-100">
      <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
        <Icon size={20} className="text-cyan-600" />
      </div>

      <div>
        <p className="text-xs font-black text-slate-400 uppercase">
          {label}
        </p>

        <p className="font-black text-slate-950">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const style =
    status === "COMPLETED"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : status === "CANCELLED"
      ? "bg-red-50 text-red-700 border-red-100"
      : "bg-cyan-50 text-cyan-700 border-cyan-100";

  return (
    <span
      className={`inline-flex px-4 py-2 rounded-full text-sm font-black border ${style}`}
    >
      {status}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, tone = "cyan" }) {
  const styles = {
    cyan: "bg-cyan-50 text-cyan-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
      <div
        className={`w-14 h-14 rounded-2xl ${
          styles[tone] || styles.cyan
        } flex items-center justify-center mb-5`}
      >
        <Icon size={26} />
      </div>

      <p className="text-slate-500 text-sm font-semibold">
        {label}
      </p>

      <h2 className="text-4xl font-black text-slate-950 mt-1">
        {value}
      </h2>
    </div>
  );
}