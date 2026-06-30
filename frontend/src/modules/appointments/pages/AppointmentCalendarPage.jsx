import { useEffect, useMemo, useState } from "react";
import {
  Clock,
  UserRound,
  Stethoscope,
  Video,
  X,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Phone,
  Building2,
  CalendarDays,
  CheckCircle2,
  XCircle,
  CircleDot,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import PageHeader from "@/components/PageHeader";
import api from "@/api/axios";
import PrescriptionModal from "@/components/PrescriptionModal";

const STATUS_FILTERS = ["ALL", "BOOKED", "COMPLETED", "CANCELLED"];

export default function AppointmentCalendar() {
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescriptionAppointment, setPrescriptionAppointment] = useState(null);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [showSlots, setShowSlots] = useState(false);

  const doctorToken = localStorage.getItem("doctorToken");
  const hospitalToken = localStorage.getItem("hospitalToken");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      let appointmentRes;
      let slotRes = { data: [] };

      if (doctorToken) {
        const doctor = JSON.parse(localStorage.getItem("doctorUser") || "null");

const doctorId =
  doctor?.id ||
  doctor?.doctorId ||
  doctor?._id ||
  doctor?.userId ||
  doctor?.doctor?.id;

if (!doctorId) {
  toast.error("Doctor not found. Please login again.");
  setAppointments([]);
  setSlots([]);
  return;
}

appointmentRes = await api.get(`/appointment/doctor/${doctorId}`);
slotRes = await api.get(`/slot/doctor/${doctorId}`);
      } else if (hospitalToken) {
        appointmentRes = await api.get("/appointment/hospital/my");
      } else {
        appointmentRes = await api.get("/appointment/my");
      }

      setAppointments(appointmentRes.data || []);
      setSlots(slotRes.data || []);
    } catch (error) {
      console.error("Calendar error:", error);
      toast.error("Failed to load calendar");
      setAppointments([]);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const monthDates = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: lastDay }, (_, index) => {
      const date = new Date(year, month, index + 1);
      return {
        date,
        key: toDateKey(date),
        day: date.toLocaleDateString([], { weekday: "short" }),
        number: date.getDate(),
      };
    });
  }, [currentMonth]);

  const filteredAppointments = appointments.filter((item) => {
    const matchesStatus =
      statusFilter === "ALL" || item.status === statusFilter;

    const text = `${item.patientName || ""} ${item.patientPhone || ""} ${
      item.patient?.fullName || ""
    } ${item.doctor?.doctorName || ""} ${
      item.doctor?.specialization || ""
    } ${item.doctor?.hospital?.hospitalName || ""}`.toLowerCase();

    return matchesStatus && text.includes(search.toLowerCase());
  });

  const selectedDateSlots = slots
    .filter((slot) => slot.date === selectedDate)
    .sort((a, b) =>
      String(a.startTime || "").localeCompare(String(b.startTime || ""))
    );

  const selectedDateAppointments = filteredAppointments
    .filter((item) => item.slot?.date === selectedDate)
    .sort((a, b) =>
      String(a.slot?.startTime || "").localeCompare(
        String(b.slot?.startTime || "")
      )
    );

  const selectedRawAppointments = appointments.filter(
    (item) => item.slot?.date === selectedDate
  );

  const selectedAvailableSlots = selectedDateSlots.filter(
    (slot) => slot.isAvailable
  );

  const selectedBookedCount = selectedRawAppointments.filter(
    (item) => item.status === "BOOKED"
  ).length;

  const selectedCompletedCount = selectedRawAppointments.filter(
    (item) => item.status === "COMPLETED"
  ).length;

  const selectedCancelledCount = selectedRawAppointments.filter(
    (item) => item.status === "CANCELLED"
  ).length;

  const selectedAvailableCount = selectedAvailableSlots.length;

  const changeMonth = (step) => {
    const nextMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + step,
      1
    );

    setCurrentMonth(nextMonth);
    setSelectedDate(toDateKey(nextMonth));
    setShowSlots(false);
  };

  const goToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(toDateKey(today));
    setShowSlots(false);
  };

  const selectDate = (dateKey) => {
    setSelectedDate(dateKey);
    setShowSlots(false);
  };

  const selectedDateLabel = new Date(selectedDate).toLocaleDateString([], {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f8fb] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
          <Loader2
            className="mx-auto text-cyan-600 animate-spin mb-3"
            size={36}
          />
          <p className="text-slate-500 font-bold">Loading calendar...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-28">
      <PageHeader title="Calendar" subtitle="Appointments by date" />

      <div className="max-w-md mx-auto px-4">
        <section className="bg-slate-950 text-white rounded-[2rem] p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="text-center">
              <h1 className="text-xl font-black">
                {currentMonth.toLocaleDateString([], {
                  month: "long",
                  year: "numeric",
                })}
              </h1>

              <button
                type="button"
                onClick={goToday}
                className="text-[11px] font-black text-cyan-300 mt-1"
              >
                Today
              </button>
            </div>

            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto mt-4 pb-1 no-scrollbar">
            {monthDates.map((item) => {
              const active = item.key === selectedDate;
              const today = item.key === toDateKey(new Date());
              const summary = getDateSummary(item.key, appointments, slots);

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => selectDate(item.key)}
                  className={`min-w-[62px] rounded-3xl p-2 text-center border transition active:scale-95 ${
                    active
                      ? "bg-cyan-500 border-cyan-400 text-white shadow-lg"
                      : today
                      ? "bg-white/15 border-white/10 text-white"
                      : "bg-white/5 border-white/10 text-slate-300"
                  }`}
                >
                  <p className="text-[10px] font-black">{item.day}</p>
                  <p className="text-xl font-black mt-0.5">{item.number}</p>

                  <div className="flex justify-center gap-1 mt-1.5">
                    <Dot count={summary.booked} className="bg-cyan-300" />
                    <Dot count={summary.completed} className="bg-purple-300" />
                    <Dot count={summary.cancelled} className="bg-red-300" />
                    <Dot count={summary.available} className="bg-emerald-300" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3 mt-2">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] text-cyan-700 font-black">
                SELECTED DATE
              </p>

              <h2 className="text-base font-black text-slate-950 truncate">
                {selectedDateLabel}
              </h2>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-cyan-50 flex items-center justify-center">
              <CalendarDays className="text-cyan-600" size={21} />
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-3 py-2 mt-2">
            <Search size={16} className="text-cyan-600 shrink-0" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient"
              className="w-full bg-transparent outline-none text-sm text-slate-800"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-slate-400"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 gap-1.5 mt-2">
            <CountCard
              label="Booked"
              value={selectedBookedCount}
              icon={CircleDot}
              tone="cyan"
            />

            <CountCard
              label="Done"
              value={selectedCompletedCount}
              icon={CheckCircle2}
              tone="purple"
            />

            <CountCard
              label="Cancel"
              value={selectedCancelledCount}
              icon={XCircle}
              tone="red"
            />

            <CountCard
              label="Avail"
              value={selectedAvailableCount}
              icon={Clock}
              tone="green"
            />
          </div>

          <div className="grid grid-cols-4 gap-1.5 mt-2">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`py-1.5 rounded-xl text-[10px] font-black transition ${
                  statusFilter === status
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-50 text-slate-600 border border-slate-100"
                }`}
              >
                {status === "ALL"
                  ? "All"
                  : status === "BOOKED"
                  ? "Booked"
                  : status === "COMPLETED"
                  ? "Done"
                  : "Cancel"}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3 mt-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-black text-slate-950">
                Appointment Details
              </h2>

              <p className="text-[11px] text-slate-500">
                {selectedDateAppointments.length} appointment
                {selectedDateAppointments.length === 1 ? "" : "s"} found
              </p>
            </div>

            <span className="bg-cyan-50 text-cyan-700 text-[10px] font-black px-2.5 py-1 rounded-full">
              {statusFilter === "ALL" ? "All" : statusFilter}
            </span>
          </div>

          {selectedDateAppointments.length === 0 ? (
            <Empty text="No appointments found for this date." />
          ) : (
            <div className="space-y-2">
              {selectedDateAppointments.map((appointment) => (
                <AppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                  onClick={() => setSelectedAppointment(appointment)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3 mt-2">
          <button
            type="button"
            onClick={() => setShowSlots(!showSlots)}
            className="w-full flex items-center justify-between"
          >
            <div className="text-left">
              <h2 className="text-base font-black text-slate-950">
                Available Slots
              </h2>

              <p className="text-[11px] text-slate-500">
                {selectedAvailableSlots.length} slot
                {selectedAvailableSlots.length === 1 ? "" : "s"} available
              </p>
            </div>

            <div className="flex items-center gap-2 text-cyan-700 font-black text-xs">
              {showSlots ? "Hide" : "Show"}
              {showSlots ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
            </div>
          </button>

          {showSlots && (
            <div className="space-y-2 mt-2">
              {selectedAvailableSlots.length === 0 ? (
                <Empty text="No available slots for this date." />
              ) : (
                selectedAvailableSlots.map((slot) => (
                  <SlotRow key={slot.id} slot={slot} />
                ))
              )}
            </div>
          )}
        </section>
      </div>

      {prescriptionAppointment && (
        <PrescriptionModal
          appointment={prescriptionAppointment}
          onClose={() => setPrescriptionAppointment(null)}
          onSaved={() => {
            setPrescriptionAppointment(null);
            fetchData();
          }}
        />
      )}

      {selectedAppointment && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onCreatePrescription={(appointment) => {
            setSelectedAppointment(null);
            setPrescriptionAppointment(appointment);
          }}
        />
      )}
    </main>
  );
}

function CountCard({ icon: Icon, label, value, tone }) {
  const styles = {
    cyan: "bg-cyan-50 text-cyan-700",
    purple: "bg-purple-50 text-purple-700",
    red: "bg-red-50 text-red-700",
    green: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className={`${styles[tone]} rounded-xl p-2 text-center`}>
      <Icon size={14} className="mx-auto" />
      <p className="text-base font-black mt-0.5">{value}</p>
      <p className="text-[8px] font-black leading-tight">{label}</p>
    </div>
  );
}

function Dot({ count, className }) {
  if (!count) return <span className="w-1.5 h-1.5 rounded-full bg-white/10" />;

  return <span className={`w-1.5 h-1.5 rounded-full ${className}`} />;
}

function AppointmentRow({ appointment, onClick }) {
  const patientName =
    appointment.patient?.fullName || appointment.patientName || "Patient";

  const time = `${formatTime(appointment.slot?.startTime) || "--"} - ${
    formatTime(appointment.slot?.endTime) || "--"
  }`;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-3 text-left active:scale-[0.99] transition"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
          <UserRound className="text-cyan-600" size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-black text-slate-950 text-sm truncate">
              {patientName}
            </h3>

            <StatusBadge status={appointment.status} />
          </div>

          <p className="text-xs text-slate-500 mt-1">{time}</p>

          <p className="text-xs text-slate-400 mt-1 truncate">
            {appointment.patientPhone || appointment.patient?.mobile || "-"}
          </p>
        </div>
      </div>
    </button>
  );
}

function SlotRow({ slot }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border p-3 bg-emerald-50 border-emerald-100">
      <div>
        <p className="font-black text-slate-950">
          {slot.startTime} - {slot.endTime}
        </p>

        <p className="text-xs text-slate-500">{slot.date}</p>
      </div>

      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-700">
        AVAILABLE
      </span>
    </div>
  );
}

function AppointmentModal({ appointment, onClose, onCreatePrescription }) {
  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-end justify-center px-4">
      <div className="bg-white rounded-t-[2rem] shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-950">
              Appointment Details
            </h2>

            <p className="text-slate-500 text-xs">#{appointment.id}</p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <Detail
            icon={Stethoscope}
            label="Doctor"
            value={appointment.doctor?.doctorName || "Doctor"}
          />

          <Detail
            icon={UserRound}
            label="Patient"
            value={appointment.patient?.fullName || appointment.patientName}
          />

          <Detail
            icon={Phone}
            label="Patient Phone"
            value={appointment.patientPhone || appointment.patient?.mobile}
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
              formatTime(appointment.slot?.startTime) || ""
            } - ${formatTime(appointment.slot?.endTime) || ""}`}
          />

          <div>
            <p className="text-xs font-black text-slate-400 uppercase mb-2">
              Status
            </p>

            <StatusBadge status={appointment.status} />
          </div>

          {appointment.status === "COMPLETED" && (
            <button
              type="button"
              onClick={() => onCreatePrescription(appointment)}
              className="w-full bg-cyan-600 text-white py-3 rounded-2xl font-black text-sm"
            >
              Create Prescription
            </button>
          )}

          <Link
            to={`/doctor/appointment/${appointment.id}/patient-profile`}
            className="flex items-center justify-center bg-slate-950 text-white py-3 rounded-2xl font-black text-sm"
          >
            View Patient Timeline
          </Link>

          {appointment.videoRoomId && appointment.status === "BOOKED" && (
            <Link
              to={`/video-call/${appointment.id}`}
              className="flex items-center justify-center gap-2 bg-cyan-600 text-white py-3 rounded-2xl font-black text-sm"
            >
              <Video size={18} />
              Join Video Consultation
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-3 flex gap-3 border border-slate-100">
      <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-cyan-600" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-black text-slate-400 uppercase">{label}</p>

        <p className="font-black text-slate-950 text-sm truncate">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const style =
    status === "COMPLETED"
      ? "bg-purple-50 text-purple-700 border-purple-100"
      : status === "CANCELLED"
      ? "bg-red-50 text-red-700 border-red-100"
      : "bg-cyan-50 text-cyan-700 border-cyan-100";

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black border shrink-0 ${style}`}
    >
      {status}
    </span>
  );
}

function Empty({ text }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
      <p className="text-sm text-slate-500 font-semibold">{text}</p>
    </div>
  );
}

function getDateSummary(dateKey, appointments, slots) {
  const daySlots = slots.filter((slot) => slot.date === dateKey);
  const dayAppointments = appointments.filter(
    (item) => item.slot?.date === dateKey
  );

  return {
    available: daySlots.filter((slot) => slot.isAvailable).length,
    booked: dayAppointments.filter((item) => item.status === "BOOKED").length,
    completed: dayAppointments.filter((item) => item.status === "COMPLETED")
      .length,
    cancelled: dayAppointments.filter((item) => item.status === "CANCELLED")
      .length,
  };
}

function toDateKey(date) {
  return date.toISOString().split("T")[0];
}