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
        const doctor = JSON.parse(
          localStorage.getItem("doctorUser") || "null"
        );
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

    const text = `${item.patientName} ${item.patientPhone} ${item.doctor?.doctorName} ${item.doctor?.specialization}`
      .toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const totalBooked = appointments.filter((a) => a.status === "BOOKED").length;
  const totalCompleted = appointments.filter(
    (a) => a.status === "COMPLETED"
  ).length;
  const totalCancelled = appointments.filter(
    (a) => a.status === "CANCELLED"
  ).length;

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

    let backgroundColor = "#2563eb";

    if (status === "COMPLETED") backgroundColor = "#16a34a";
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        Loading appointment calendar...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/40 to-white py-8 px-6">
      <div className="max-w-[1500px] mx-auto">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-8 md:p-10 text-white shadow-2xl mb-8">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-5">
                <CalendarDays size={18} className="text-cyan-300" />
                <span className="text-sm font-semibold">
                  Advanced Scheduling Center
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black">
                Appointment Calendar
              </h1>

              <p className="text-blue-100 mt-3 max-w-2xl">
                Month, week, day and agenda views with status colors, video
                consultation access and appointment insights.
              </p>
            </div>

            <button
              onClick={fetchAppointments}
              className="flex items-center gap-2 bg-white/10 border border-white/20 px-5 py-3 rounded-2xl font-bold hover:bg-white/20"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-5 mb-8">
          <StatCard
            icon={CalendarCheck}
            label="Total"
            value={appointments.length}
            color="blue"
          />
          <StatCard
            icon={Clock}
            label="Booked"
            value={totalBooked}
            color="blue"
          />
          <StatCard
            icon={CheckCircle2}
            label="Completed"
            value={totalCompleted}
            color="green"
          />
          <StatCard
            icon={XCircle}
            label="Cancelled"
            value={totalCancelled}
            color="red"
          />
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Calendar View
              </h2>
              <p className="text-slate-500 text-sm">
                Showing {events.length} appointment events
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 md:w-80">
                <Search size={18} className="text-blue-600" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search patient or doctor..."
                  className="w-full bg-transparent outline-none text-slate-800"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-bold outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="BOOKED">Booked</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
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
        </div>
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="bg-slate-950 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black">Appointment Details</h2>
            <p className="text-slate-300 text-sm">#{appointment.id}</p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"
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
            icon={Clock}
            label="Schedule"
            value={`${appointment.slot?.date} | ${appointment.slot?.startTime} - ${appointment.slot?.endTime}`}
          />

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">
              Status
            </p>

            <span
              className={`inline-flex px-4 py-2 rounded-full text-sm font-black ${
                appointment.status === "COMPLETED"
                  ? "bg-green-100 text-green-700"
                  : appointment.status === "CANCELLED"
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {appointment.status}
            </span>
          </div>

          {appointment.videoRoomId && appointment.status === "BOOKED" && (
            <a
              href={`/video-call/${appointment.id}`}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700"
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
    <div className="bg-slate-50 rounded-2xl p-4 flex gap-3">
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
        <Icon size={20} className="text-blue-600" />
      </div>

      <div>
        <p className="text-xs font-bold text-slate-400 uppercase">
          {label}
        </p>
        <p className="font-black text-slate-900">{value || "-"}</p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colorClass =
    color === "green"
      ? "from-green-600 to-emerald-500"
      : color === "red"
      ? "from-red-600 to-rose-500"
      : "from-blue-600 to-cyan-500";

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-white">
      <div
        className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${colorClass} flex items-center justify-center mb-5 shadow-lg`}
      >
        <Icon className="text-white" size={26} />
      </div>

      <p className="text-slate-500 text-sm">{label}</p>

      <h2 className="text-4xl font-black text-slate-950 mt-1">
        {value}
      </h2>
    </div>
  );
}