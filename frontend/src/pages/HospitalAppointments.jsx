import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Stethoscope,
  UserRound,
  Phone,
  Mail,
  FileText,
  Save,
  Filter,
} from "lucide-react";

import api from "../api/axios";

export default function HospitalAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchAppointments = () => {
    setLoading(true);

    api
      .get("/appointment/hospital/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "hospitalToken"
          )}`,
        },
      })
      .then((res) => {
        setAppointments(res.data || []);
      })
      .catch((err) => {
        console.error("Hospital appointment API error:", err);
      })
      .finally(() => setLoading(false));
  };

  const doctors = useMemo(() => {
    const names = appointments
      .map((a) => a.doctor?.doctorName)
      .filter(Boolean);

    return ["ALL", ...new Set(names)];
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const searchText = `
        ${appointment.patientName || ""}
        ${appointment.patientPhone || ""}
        ${appointment.patient?.email || ""}
        ${appointment.doctor?.doctorName || ""}
        ${appointment.doctor?.specialization || ""}
      `.toLowerCase();

      const matchesSearch = searchText.includes(
        search.toLowerCase()
      );

      const matchesStatus =
        statusFilter === "ALL" ||
        appointment.status === statusFilter;

      const matchesDoctor =
        doctorFilter === "ALL" ||
        appointment.doctor?.doctorName === doctorFilter;

      const matchesDate =
        !dateFilter || appointment.slot?.date === dateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDoctor &&
        matchesDate
      );
    });
  }, [appointments, search, statusFilter, doctorFilter, dateFilter]);

  const booked = appointments.filter(
    (a) => a.status === "BOOKED"
  ).length;

  const completed = appointments.filter(
    (a) => a.status === "COMPLETED"
  ).length;

  const cancelled = appointments.filter(
    (a) => a.status === "CANCELLED"
  ).length;

  const markCompleted = async (id) => {
    const confirmComplete = window.confirm(
      "Mark this appointment as completed?"
    );

    if (!confirmComplete) return;

    try {
      await api.patch(`/appointment/${id}/complete`);
      fetchAppointments();
    } catch (error) {
      console.error("Complete appointment error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to complete appointment"
      );
    }
  };

  const cancelAppointment = async (id) => {
    const confirmCancel = window.confirm(
      "Cancel this appointment?"
    );

    if (!confirmCancel) return;

    try {
      await api.patch(
        `/appointment/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "hospitalToken"
            )}`,
          },
        }
      );

      fetchAppointments();
    } catch (error) {
      console.error("Cancel appointment error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to cancel appointment"
      );
    }
  };

  const savePrescription = async (appointmentId) => {
    if (
      !prescriptionForm.diagnosis ||
      !prescriptionForm.medicines
    ) {
      alert("Diagnosis and medicines are required");
      return;
    }

    try {
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
    }
  };

  const statusClass = (status) => {
    if (status === "BOOKED") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (status === "CANCELLED") {
      return "bg-red-100 text-red-700";
    }

    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/40 to-white">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      <div className="absolute top-40 right-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-8 md:p-10 text-white shadow-2xl mb-8">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur mb-5">
              <CalendarCheck size={18} className="text-cyan-300" />
              <span className="text-sm font-semibold">
                Hospital Appointment Center
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Hospital Appointments
            </h1>

            <p className="text-blue-100 mt-3 max-w-2xl">
              Monitor bookings, manage appointment status and create
              prescriptions after consultations.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={CalendarCheck}
            title="Total"
            value={appointments.length}
            gradient="from-blue-600 to-cyan-500"
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
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6 mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
              <Filter className="text-white" size={22} />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">
                Search & Filters
              </h2>
              <p className="text-sm text-slate-500">
                Filter appointments by patient, doctor, status or date.
              </p>
            </div>
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
        </div>

        {loading ? (
          <div className="bg-white rounded-[2rem] shadow-xl p-10 text-center text-slate-500">
            Loading appointments...
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-[2rem] shadow-xl p-12 text-center">
            <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
              <CalendarCheck className="text-blue-600" size={36} />
            </div>

            <h3 className="text-2xl font-black text-slate-900">
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
              <div key={appointment.id} className="group relative">
                <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-40 blur transition duration-500" />

                <div className="relative bg-white rounded-[2rem] shadow-xl border border-white overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="grid md:grid-cols-3 gap-6 flex-1">
                        <InfoBlock
                          icon={UserRound}
                          title="Patient"
                          main={appointment.patientName}
                          sub={appointment.patientPhone}
                          extra={appointment.patient?.email}
                        />

                        <InfoBlock
                          icon={Stethoscope}
                          title="Doctor"
                          main={appointment.doctor?.doctorName}
                          sub={appointment.doctor?.specialization}
                          extra={
                            appointment.doctor?.hospital?.hospitalName
                          }
                        />

                        <InfoBlock
                          icon={Clock}
                          title="Schedule"
                          main={appointment.slot?.date}
                          sub={`${appointment.slot?.startTime || ""} - ${
                            appointment.slot?.endTime || ""
                          }`}
                          extra={`Appointment #${appointment.id}`}
                        />
                      </div>

                      <div className="flex flex-col items-start lg:items-end gap-3">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-bold ${statusClass(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>

                        {appointment.status === "BOOKED" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                markCompleted(appointment.id)
                              }
                              className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700"
                            >
                              Complete
                            </button>

                            <button
                              onClick={() =>
                                cancelAppointment(appointment.id)
                              }
                              className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-700"
                            >
                              Cancel
                            </button>
                          </div>
                        )}

                        {appointment.status === "COMPLETED" && (
                          <button
                            onClick={() =>
                              setShowPrescription(
                                showPrescription === appointment.id
                                  ? null
                                  : appointment.id
                              )
                            }
                            className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-700"
                          >
                            Add Prescription
                          </button>
                        )}

                        {appointment.status === "CANCELLED" && (
                          <span className="text-slate-400 text-sm">
                            No action available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {showPrescription === appointment.id && (
                    <div className="border-t bg-slate-50 p-6">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 flex items-center justify-center">
                          <FileText className="text-white" size={22} />
                        </div>

                        <div>
                          <h3 className="text-xl font-black text-slate-900">
                            Add Prescription
                          </h3>
                          <p className="text-sm text-slate-500">
                            Create prescription for {appointment.patientName}
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
                          className="w-full border border-slate-200 bg-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
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
                          className="w-full border border-slate-200 bg-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
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
                          className="w-full border border-slate-200 bg-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              savePrescription(appointment.id)
                            }
                            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-2xl font-bold hover:bg-emerald-700"
                          >
                            <Save size={18} />
                            Save Prescription
                          </button>

                          <button
                            onClick={() => setShowPrescription(null)}
                            className="border border-slate-300 px-5 py-3 rounded-2xl font-bold hover:bg-white"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
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

      <div className="relative bg-white rounded-[2rem] p-6 shadow-xl border border-white group-hover:-translate-y-1 transition duration-500">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg mb-5`}
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
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 transition">
      <Icon size={19} className="text-blue-600" />
      {children}
    </div>
  );
}

function InfoBlock({ icon: Icon, title, main, sub, extra }) {
  return (
    <div className="flex gap-3">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
        <Icon className="text-blue-600" size={23} />
      </div>

      <div>
        <p className="text-xs font-bold text-slate-400 uppercase">
          {title}
        </p>

        <p className="font-black text-slate-900">
          {main || "-"}
        </p>

        {sub && (
          <p className="text-sm text-slate-500">
            {sub}
          </p>
        )}

        {extra && (
          <p className="text-xs text-slate-400 mt-1">
            {extra}
          </p>
        )}
      </div>
    </div>
  );
}