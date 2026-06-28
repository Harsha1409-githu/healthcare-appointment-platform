import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Stethoscope,
  UserRound,
  FileText,
  Save,
  Loader2,
  RefreshCw,
  Video,
  Phone,
  Mail,
  X,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import api from "../api/axios";

export default function HospitalAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [prescriptionForm, setPrescriptionForm] = useState({
    diagnosis: "",
    medicines: "",
    notes: "",
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getHospitalHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("hospitalToken")}`,
  });

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await api.get("/appointment/hospital/my", {
        headers: getHospitalHeaders(),
      });

      setAppointments(res.data || []);
    } catch (err) {
      console.error("Hospital appointment API error:", err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(
    () => ({
      total: appointments.length,
      booked: appointments.filter((a) => a.status === "BOOKED").length,
      completed: appointments.filter((a) => a.status === "COMPLETED").length,
      cancelled: appointments.filter((a) => a.status === "CANCELLED").length,
    }),
    [appointments]
  );

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const searchText = `
        ${appointment.patientName || ""}
        ${appointment.patientPhone || ""}
        ${appointment.patient?.fullName || ""}
        ${appointment.patient?.email || ""}
        ${appointment.doctor?.doctorName || ""}
        ${appointment.doctor?.specialization || ""}
      `.toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || appointment.status === statusFilter;

      const matchesDate = !dateFilter || appointment.slot?.date === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointments, search, statusFilter, dateFilter]);

  const markCompleted = async (id) => {
    if (!window.confirm("Mark this appointment as completed?")) return;

    try {
      setActionLoading(true);

      await api.patch(
        `/appointment/${id}/complete`,
        {},
        {
          headers: getHospitalHeaders(),
        }
      );

      fetchAppointments();
    } catch (error) {
      console.error("Complete appointment error:", error);
      alert(error.response?.data?.message || "Failed to complete appointment");
    } finally {
      setActionLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;

    try {
      setActionLoading(true);

      await api.patch(
        `/appointment/${id}/cancel`,
        {},
        {
          headers: getHospitalHeaders(),
        }
      );

      fetchAppointments();
    } catch (error) {
      console.error("Cancel appointment error:", error);
      alert(error.response?.data?.message || "Failed to cancel appointment");
    } finally {
      setActionLoading(false);
    }
  };

  const openPrescriptionSheet = (appointment) => {
    setSelectedAppointment(appointment);
    setPrescriptionForm({
      diagnosis: "",
      medicines: "",
      notes: "",
    });
  };

  const savePrescription = async () => {
    if (!selectedAppointment?.id) return;

    if (!prescriptionForm.diagnosis || !prescriptionForm.medicines) {
      alert("Diagnosis and medicines are required");
      return;
    }

    try {
      setActionLoading(true);

      await api.post("/prescription", {
        appointmentId: selectedAppointment.id,
        diagnosis: prescriptionForm.diagnosis,
        medicines: prescriptionForm.medicines,
        notes: prescriptionForm.notes,
      });

      alert("Prescription saved successfully");

      setSelectedAppointment(null);
      setPrescriptionForm({
        diagnosis: "",
        medicines: "",
        notes: "",
      });
    } catch (error) {
      console.error("Prescription error:", error);
      alert(error.response?.data?.message || "Failed to save prescription");
    } finally {
      setActionLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setDateFilter("");
  };

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-28">
      <PageHeader
        title="Appointments"
        subtitle={`${filteredAppointments.length} hospital bookings`}
      />

      <div className="max-w-md mx-auto px-4">
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-cyan-700 font-black">
                HOSPITAL CENTER
              </p>

              <h1 className="text-xl font-black text-slate-950">
                Appointment Manager
              </h1>

              <p className="text-sm text-slate-500">
                Manage bookings and prescriptions
              </p>
            </div>

            <button
              type="button"
              onClick={fetchAppointments}
              className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 active:scale-95"
            >
              <RefreshCw size={20} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4">
            <MiniStat icon={CalendarCheck} label="Total" value={stats.total} />
            <MiniStat icon={Clock} label="Booked" value={stats.booked} />
            <MiniStat
              icon={CheckCircle2}
              label="Done"
              value={stats.completed}
            />
            <MiniStat icon={XCircle} label="Cancel" value={stats.cancelled} />
          </div>
        </section>

        <section className="sticky top-[72px] z-20 bg-[#f4f8fb]/95 backdrop-blur-md pt-3 pb-3">
          <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-3 py-3 shadow-sm">
            <Search className="text-cyan-600 shrink-0" size={18} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient, phone, doctor"
              className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-slate-400"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2 mt-3">
            {["ALL", "BOOKED", "COMPLETED", "CANCELLED"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`py-2.5 rounded-2xl text-[10px] font-black transition ${
                  statusFilter === status
                    ? "bg-cyan-600 text-white"
                    : "bg-white text-slate-600 border border-slate-100"
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

          <div className="grid grid-cols-[1fr_auto] gap-2 mt-3">
            <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-2xl px-3 py-3 shadow-sm">
              <CalendarCheck size={17} className="text-cyan-600" />

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-slate-800"
              />
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="px-4 rounded-2xl bg-slate-950 text-white text-xs font-black"
            >
              Clear
            </button>
          </div>
        </section>

        {loading ? (
          <LoadingState />
        ) : filteredAppointments.length === 0 ? (
          <EmptyState />
        ) : (
          <section className="space-y-3">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                actionLoading={actionLoading}
                markCompleted={markCompleted}
                cancelAppointment={cancelAppointment}
                openPrescriptionSheet={openPrescriptionSheet}
              />
            ))}
          </section>
        )}
      </div>

      {selectedAppointment && (
        <PrescriptionSheet
          appointment={selectedAppointment}
          form={prescriptionForm}
          setForm={setPrescriptionForm}
          actionLoading={actionLoading}
          onSave={savePrescription}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </main>
  );
}

function AppointmentCard({
  appointment,
  actionLoading,
  markCompleted,
  cancelAppointment,
  openPrescriptionSheet,
}) {
  const patientName =
    appointment.patient?.fullName || appointment.patientName || "Patient";

  const patientPhone =
    appointment.patientPhone || appointment.patient?.mobile || "Phone";

  const doctorName = appointment.doctor?.doctorName || "Doctor";
  const specialization = appointment.doctor?.specialization || "Specialist";

  const date = appointment.slot?.date || appointment.date || "Date";
  const time = `${formatTime(appointment.slot?.startTime) || ""} - ${
    formatTime(appointment.slot?.endTime) || ""
  }`;

  const status = appointment.status || "BOOKED";

  const statusStyle =
    status === "BOOKED"
      ? "bg-emerald-50 text-emerald-700"
      : status === "COMPLETED"
      ? "bg-cyan-50 text-cyan-700"
      : "bg-red-50 text-red-700";

  return (
    <article className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 active:scale-[0.99] transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0">
            <UserRound className="text-cyan-600" size={24} />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-black text-slate-950 truncate">
              {patientName}
            </h2>

            <p className="text-xs text-slate-500 font-bold flex items-center gap-1.5 mt-1">
              <Phone size={13} className="text-cyan-600" />
              {patientPhone}
            </p>

            {appointment.patient?.email && (
              <p className="text-xs text-slate-400 font-bold flex items-center gap-1.5 mt-1 truncate">
                <Mail size={13} className="text-cyan-600" />
                {appointment.patient.email}
              </p>
            )}
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${statusStyle}`}
        >
          {status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 mt-4">
        <InfoPill icon={Stethoscope} title={doctorName} text={specialization} />
        <InfoPill icon={Clock} title={date} text={time || "Time"} />
        <InfoPill
          icon={CalendarCheck}
          title="Appointment ID"
          text={`#${String(appointment.id).slice(0, 8)}`}
        />
      </div>

      {status === "BOOKED" && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => markCompleted(appointment.id)}
            className="bg-cyan-600 text-white py-3 rounded-2xl text-sm font-black disabled:bg-slate-400 active:scale-95"
          >
            Complete
          </button>

          <button
            type="button"
            disabled={actionLoading}
            onClick={() => cancelAppointment(appointment.id)}
            className="bg-red-600 text-white py-3 rounded-2xl text-sm font-black disabled:bg-slate-400 active:scale-95"
          >
            Cancel
          </button>
        </div>
      )}

      {status === "COMPLETED" && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            type="button"
            onClick={() => openPrescriptionSheet(appointment)}
            className="bg-emerald-600 text-white py-3 rounded-2xl text-sm font-black active:scale-95 flex items-center justify-center gap-1.5"
          >
            <FileText size={16} />
            Prescription
          </button>

          <a
            href={`/video-call/${appointment.id}`}
            className="bg-slate-950 text-white py-3 rounded-2xl text-sm font-black active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Video size={16} />
            Video
          </a>
        </div>
      )}

      {status === "CANCELLED" && (
        <p className="mt-4 text-center bg-slate-50 rounded-2xl py-3 text-sm text-slate-500 font-bold">
          No action available
        </p>
      )}
    </article>
  );
}

function PrescriptionSheet({
  appointment,
  form,
  setForm,
  actionLoading,
  onSave,
  onClose,
}) {
  const patientName =
    appointment.patient?.fullName || appointment.patientName || "Patient";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end">
      <div className="bg-white w-full max-w-md mx-auto rounded-t-[2rem] max-h-[88vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 p-4 rounded-t-[2rem] z-10">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />

          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-950">
                Add Prescription
              </h2>

              <p className="text-sm text-slate-500">
                For {patientName}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-3 pb-8">
          <input
            type="text"
            placeholder="Diagnosis"
            value={form.diagnosis}
            onChange={(e) =>
              setForm({
                ...form,
                diagnosis: e.target.value,
              })
            }
            className="w-full border border-slate-200 bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
          />

          <textarea
            placeholder="Medicines"
            rows="5"
            value={form.medicines}
            onChange={(e) =>
              setForm({
                ...form,
                medicines: e.target.value,
              })
            }
            className="w-full border border-slate-200 bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 text-sm resize-none"
          />

          <textarea
            placeholder="Notes"
            rows="3"
            value={form.notes}
            onChange={(e) =>
              setForm({
                ...form,
                notes: e.target.value,
              })
            }
            className="w-full border border-slate-200 bg-slate-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 text-sm resize-none"
          />

          <button
            type="button"
            disabled={actionLoading}
            onClick={onSave}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 rounded-2xl font-black disabled:bg-slate-400 active:scale-95"
          >
            {actionLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Prescription
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoPill({ icon: Icon, title, text }) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-3 py-3 min-w-0">
      <Icon size={18} className="text-cyan-600 shrink-0" />

      <div className="min-w-0">
        <p className="text-sm font-black text-slate-950 truncate">
          {title || "-"}
        </p>

        <p className="text-xs text-slate-500 truncate">
          {text || "-"}
        </p>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 text-center">
      <Icon className="text-cyan-600 mx-auto" size={17} />

      <p className="text-sm font-black text-slate-950 mt-1">
        {value}
      </p>

      <p className="text-[9px] text-slate-500 font-bold">
        {label}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
      <Loader2 className="mx-auto animate-spin text-cyan-600 mb-3" size={34} />

      <h3 className="text-lg font-black text-slate-950">
        Loading appointments
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        Please wait while we fetch hospital bookings.
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
      <CalendarCheck className="text-cyan-600 mx-auto mb-3" size={36} />

      <h3 className="text-lg font-black text-slate-950">
        No appointments found
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        Appointments will appear here after patients book with your hospital
        doctors.
      </p>
    </div>
  );
}