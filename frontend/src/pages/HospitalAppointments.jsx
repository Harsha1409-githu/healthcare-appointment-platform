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
  Filter,
  Loader2,
  RefreshCw,
  Video,
  Phone,
  Mail,
  ShieldCheck,
} from "lucide-react";
import api from "../api/axios";

export default function HospitalAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [doctorFilter, setDoctorFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");

  const [showPrescription, setShowPrescription] = useState(null);

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

  const doctors = useMemo(() => {
    const names = appointments
      .map((appointment) => appointment.doctor?.doctorName)
      .filter(Boolean);

    return ["ALL", ...new Set(names)];
  }, [appointments]);

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

      const matchesDoctor =
        doctorFilter === "ALL" ||
        appointment.doctor?.doctorName === doctorFilter;

      const matchesDate = !dateFilter || appointment.slot?.date === dateFilter;

      return matchesSearch && matchesStatus && matchesDoctor && matchesDate;
    });
  }, [appointments, search, statusFilter, doctorFilter, dateFilter]);

  const booked = appointments.filter((appointment) => appointment.status === "BOOKED").length;
  const completed = appointments.filter((appointment) => appointment.status === "COMPLETED").length;
  const cancelled = appointments.filter((appointment) => appointment.status === "CANCELLED").length;

  const markCompleted = async (id) => {
    const confirmComplete = window.confirm(
      "Mark this appointment as completed?"
    );

    if (!confirmComplete) return;

    try {
      setActionLoading(true);

      await api.patch(`/appointment/${id}/complete`, {}, {
        headers: getHospitalHeaders(),
      });

      fetchAppointments();
    } catch (error) {
      console.error("Complete appointment error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to complete appointment"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    const confirmCancel = window.confirm("Cancel this appointment?");

    if (!confirmCancel) return;

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

      alert(
        error.response?.data?.message ||
          "Failed to cancel appointment"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const savePrescription = async (appointmentId) => {
    if (!prescriptionForm.diagnosis || !prescriptionForm.medicines) {
      alert("Diagnosis and medicines are required");
      return;
    }

    try {
      setActionLoading(true);

      await api.post("/prescription", {
        appointmentId,
        diagnosis: prescriptionForm.diagnosis,
        medicines: prescriptionForm.medicines,
        notes: prescriptionForm.notes,
      });

      alert("Prescription saved successfully");

      setShowPrescription(null);

      setPrescriptionForm({
        diagnosis: "",
        medicines: "",
        notes: "",
      });
    } catch (error) {
      console.error("Prescription error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to save prescription"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setDoctorFilter("ALL");
    setDateFilter("");
  };

  const statusClass = (status) => {
    if (status === "BOOKED") {
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }

    if (status === "CANCELLED") {
      return "bg-red-50 text-red-700 border-red-100";
    }

    return "bg-cyan-50 text-cyan-700 border-cyan-100";
  };

  return (
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6 py-8">
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                <CalendarCheck size={17} />
                Hospital Appointment Center
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                Hospital Appointments
              </h1>

              <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
                Monitor bookings, manage appointment status and create
                prescriptions after consultations.
              </p>
            </div>

            <button
              onClick={fetchAppointments}
              className="inline-flex items-center justify-center gap-2 bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-cyan-700 transition"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </section>

        <section className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={CalendarCheck}
            title="Total"
            value={appointments.length}
            gradient="from-cyan-600 to-blue-500"
          />

          <StatCard
            icon={Clock}
            title="Booked"
            value={booked}
            gradient="from-emerald-600 to-teal-500"
          />

          <StatCard
            icon={CheckCircle2}
            title="Completed"
            value={completed}
            gradient="from-purple-600 to-fuchsia-500"
          />

          <StatCard
            icon={XCircle}
            title="Cancelled"
            value={cancelled}
            gradient="from-red-600 to-rose-500"
          />
        </section>

        <section className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center">
                <Filter className="text-cyan-600" size={22} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-950">
                  Search & Filters
                </h2>

                <p className="text-sm text-slate-500">
                  Filter appointments by patient, doctor, status or date.
                </p>
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 font-black hover:bg-slate-200 transition"
            >
              Clear Filters
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <InputBox icon={Search}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient, phone, doctor..."
                className="w-full bg-transparent outline-none"
              />
            </InputBox>

            <InputBox icon={Stethoscope}>
              <select
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
                className="w-full bg-transparent outline-none"
              >
                {doctors.map((doctor) => (
                  <option key={doctor} value={doctor}>
                    {doctor === "ALL" ? "All Doctors" : doctor}
                  </option>
                ))}
              </select>
            </InputBox>

            <InputBox icon={CheckCircle2}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-transparent outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="BOOKED">Booked</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </InputBox>

            <InputBox icon={CalendarCheck}>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full bg-transparent outline-none"
              />
            </InputBox>
          </div>
        </section>

        {loading ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10 text-center text-slate-500">
            <Loader2 className="mx-auto animate-spin text-cyan-600 mb-3" />
            Loading appointments...
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-12 text-center">
            <div className="w-20 h-20 rounded-3xl bg-cyan-50 flex items-center justify-center mx-auto mb-5">
              <CalendarCheck className="text-cyan-600" size={36} />
            </div>

            <h3 className="text-2xl font-black text-slate-950">
              No appointments found
            </h3>

            <p className="text-slate-500 mt-2">
              Appointments will appear here after patients book with your
              hospital doctors.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                statusClass={statusClass}
                actionLoading={actionLoading}
                markCompleted={markCompleted}
                cancelAppointment={cancelAppointment}
                showPrescription={showPrescription}
                setShowPrescription={setShowPrescription}
                prescriptionForm={prescriptionForm}
                setPrescriptionForm={setPrescriptionForm}
                savePrescription={savePrescription}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AppointmentCard({
  appointment,
  statusClass,
  actionLoading,
  markCompleted,
  cancelAppointment,
  showPrescription,
  setShowPrescription,
  prescriptionForm,
  setPrescriptionForm,
  savePrescription,
}) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 opacity-0 group-hover:opacity-30 blur transition duration-500" />

      <div className="relative bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div className="grid md:grid-cols-3 gap-6 flex-1">
              <InfoBlock
                icon={UserRound}
                title="Patient"
                main={
                  appointment.patient?.fullName ||
                  appointment.patientName ||
                  "Patient"
                }
                sub={appointment.patientPhone}
                extra={appointment.patient?.email}
              />

              <InfoBlock
                icon={Stethoscope}
                title="Doctor"
                main={appointment.doctor?.doctorName}
                sub={appointment.doctor?.specialization}
                extra={appointment.doctor?.hospital?.hospitalName}
              />

              <InfoBlock
                icon={Clock}
                title="Schedule"
                main={appointment.slot?.date || appointment.date}
                sub={`${appointment.slot?.startTime || ""} - ${
                  appointment.slot?.endTime || ""
                }`}
                extra={`Appointment #${String(appointment.id).slice(0, 8)}`}
              />
            </div>

            <div className="flex flex-col items-start xl:items-end gap-3 shrink-0">
              <span
                className={`px-4 py-2 rounded-full text-sm font-black border ${statusClass(
                  appointment.status
                )}`}
              >
                {appointment.status}
              </span>

              {appointment.status === "BOOKED" && (
                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={actionLoading}
                    onClick={() => markCompleted(appointment.id)}
                    className="bg-cyan-600 text-white px-4 py-2 rounded-xl font-black hover:bg-cyan-700 disabled:bg-slate-400"
                  >
                    Complete
                  </button>

                  <button
                    disabled={actionLoading}
                    onClick={() => cancelAppointment(appointment.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-xl font-black hover:bg-red-700 disabled:bg-slate-400"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {appointment.status === "COMPLETED" && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      setShowPrescription(
                        showPrescription === appointment.id
                          ? null
                          : appointment.id
                      )
                    }
                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-black hover:bg-emerald-700"
                  >
                    Add Prescription
                  </button>

                  <a
                    href={`/video-call/${appointment.id}`}
                    className="inline-flex items-center gap-2 bg-slate-950 text-white px-4 py-2 rounded-xl font-black"
                  >
                    <Video size={16} />
                    Video
                  </a>
                </div>
              )}

              {appointment.status === "CANCELLED" && (
                <span className="text-slate-400 text-sm font-semibold">
                  No action available
                </span>
              )}
            </div>
          </div>
        </div>

        {showPrescription === appointment.id && (
          <div className="border-t border-slate-100 bg-slate-50 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <FileText className="text-emerald-600" size={22} />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-950">
                  Add Prescription
                </h3>

                <p className="text-sm text-slate-500">
                  Create prescription for{" "}
                  {appointment.patient?.fullName ||
                    appointment.patientName ||
                    "Patient"}
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <input
                type="text"
                placeholder="Diagnosis"
                value={prescriptionForm.diagnosis}
                onChange={(e) =>
                  setPrescriptionForm({
                    ...prescriptionForm,
                    diagnosis: e.target.value,
                  })
                }
                className="w-full border border-slate-200 bg-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <textarea
                placeholder="Medicines"
                rows="4"
                value={prescriptionForm.medicines}
                onChange={(e) =>
                  setPrescriptionForm({
                    ...prescriptionForm,
                    medicines: e.target.value,
                  })
                }
                className="w-full border border-slate-200 bg-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <textarea
                placeholder="Notes"
                rows="3"
                value={prescriptionForm.notes}
                onChange={(e) =>
                  setPrescriptionForm({
                    ...prescriptionForm,
                    notes: e.target.value,
                  })
                }
                className="w-full border border-slate-200 bg-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <div className="flex flex-wrap gap-3">
                <button
                  disabled={actionLoading}
                  onClick={() => savePrescription(appointment.id)}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-2xl font-black hover:bg-emerald-700 disabled:bg-slate-400"
                >
                  <Save size={18} />
                  Save Prescription
                </button>

                <button
                  onClick={() => setShowPrescription(null)}
                  className="border border-slate-300 px-5 py-3 rounded-2xl font-black hover:bg-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, gradient }) {
  return (
    <div className="group relative">
      <div
        className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-40 blur transition duration-500`}
      />

      <div className="relative bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 group-hover:-translate-y-1 group-hover:shadow-xl transition duration-500">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-sm mb-5`}
        >
          <Icon className="text-white" size={27} />
        </div>

        <p className="text-slate-500 text-sm">{title}</p>

        <h2 className="text-4xl font-black text-slate-950 mt-1">
          {value}
        </h2>
      </div>
    </div>
  );
}

function InputBox({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-cyan-500 transition">
      <Icon size={19} className="text-cyan-600 shrink-0" />
      {children}
    </div>
  );
}

function InfoBlock({ icon: Icon, title, main, sub, extra }) {
  return (
    <div className="flex gap-3">
      <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center shrink-0">
        <Icon className="text-cyan-600" size={23} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-black text-slate-400 uppercase">
          {title}
        </p>

        <p className="font-black text-slate-950 truncate">
          {main || "-"}
        </p>

        {sub && (
          <p className="text-sm text-slate-500 truncate">
            {sub}
          </p>
        )}

        {extra && (
          <p className="text-xs text-slate-400 mt-1 truncate">
            {extra}
          </p>
        )}
      </div>
    </div>
  );
}