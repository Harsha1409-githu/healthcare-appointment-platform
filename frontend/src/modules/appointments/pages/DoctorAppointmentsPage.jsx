import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Search,
  Stethoscope,
  UserRound,
  Video,
  X,
} from "lucide-react";
import toast from "react-hot-toast";


import api from "@/api/axios";
import PrescriptionModal from "@/components/PrescriptionModal";
import usePullToRefresh from "@/hooks/usePullToRefresh";
import {
  AppointmentEmptyState,
  AppointmentSkeleton,
  DoctorAppointmentCard,
  DoctorAppointmentStats,
} from "@/modules/appointments";

const todayIso = () => new Date().toISOString().split("T")[0];



export default function DoctorAppointments() {
  const doctor = JSON.parse(localStorage.getItem("doctorUser") || "null");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState(todayIso());
  const [view, setView] = useState("TODAY");

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [checkInModal, setCheckInModal] = useState(null);
  const [checkInData, setCheckInData] = useState(null);

  const [consultationAppointment, setConsultationAppointment] = useState(null);
  const [consultationSaving, setConsultationSaving] = useState(false);
  const [consultationForm, setConsultationForm] = useState({
    diagnosis: "",
    doctorNotes: "",
    advice: "",
    followUpRequired: false,
  });

  const [followUpAppointment, setFollowUpAppointment] = useState(null);
  const [followUpSaving, setFollowUpSaving] = useState(false);
  const [followUpForm, setFollowUpForm] = useState({
    followUpDate: "",
    notes: "",
  });

  const { pullDistance, refreshing, visible } = usePullToRefresh(async () => {
    await fetchAppointments(false);
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      if (!doctor?.id) {
        setAppointments([]);
        return;
      }

      const res = await api.get(`/appointment/doctor/${doctor.id}`);
      setAppointments(res.data || []);
    } catch (err) {
      console.error("Doctor appointments error:", err);
      toast.error("Unable to load appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((appointment) => {
        const appointmentDate = appointment.slot?.date;
        const text = `
          ${appointment.patientName || ""}
          ${appointment.patientPhone || ""}
          ${appointment.patient?.fullName || ""}
          ${appointment.familyMember?.fullName || ""}
          ${appointment.status || ""}
        `.toLowerCase();

        const matchesSearch = text.includes(search.toLowerCase().trim());

        if (view === "TODAY") return matchesSearch && appointmentDate === todayIso();
        if (view === "UPCOMING") return matchesSearch && appointmentDate > todayIso();
        if (view === "COMPLETED") return matchesSearch && appointment.status === "COMPLETED";
        if (view === "CUSTOM") return matchesSearch && appointmentDate === dateFilter;

        return matchesSearch;
      })
      .sort((a, b) => {
        const dateCompare = String(a.slot?.date || "").localeCompare(String(b.slot?.date || ""));
        if (dateCompare !== 0) return dateCompare;
        return String(a.slot?.startTime || "").localeCompare(String(b.slot?.startTime || ""));
      });
  }, [appointments, search, view, dateFilter]);

  const stats = useMemo(() => {
    const todayItems = appointments.filter((item) => item.slot?.date === todayIso());
    return {
      today: todayItems.length,
      waiting: todayItems.filter((item) => item.status === "BOOKED").length,
      video: todayItems.filter((item) => item.appointmentType === "VIDEO").length,
      done: todayItems.filter((item) => item.status === "COMPLETED").length,
    };
  }, [appointments]);

  const groupedAppointments = useMemo(() => {
    return {
      booked: filteredAppointments.filter((item) => item.status === "BOOKED"),
      prescription: filteredAppointments.filter(
        (item) =>
          item.status === "COMPLETED" &&
          !item.prescriptionCompleted
      ),
      followUp: filteredAppointments.filter(
        (item) =>
          item.status === "COMPLETED" &&
          item.prescriptionCompleted &&
          !item.followUpScheduled
      ),
      completed: filteredAppointments.filter(
        (item) =>
          item.status === "COMPLETED" &&
          item.prescriptionCompleted
      ),
      cancelled: filteredAppointments.filter((item) => item.status === "CANCELLED"),
    };
  }, [filteredAppointments]);

  const openCheckIn = async (appointment) => {
    try {
      const res = await api.get(`/check-in/doctor/appointment/${appointment.id}`);
      setCheckInData(res.data);
      setCheckInModal(appointment);
    } catch (error) {
      console.error(error);
      toast("Patient has not submitted Check-In yet");
    }
  };

  const openConsultation = (appointment) => {
    setConsultationAppointment(appointment);
    setConsultationForm({
      diagnosis: "",
      doctorNotes: "",
      advice: "",
      followUpRequired: false,
    });
  };

  const saveConsultation = async () => {
    if (!consultationForm.diagnosis.trim()) {
      toast.error("Diagnosis is required");
      return;
    }

    try {
      setConsultationSaving(true);

      await api.post("/consultation", {
        appointmentId: consultationAppointment.id,
        diagnosis: consultationForm.diagnosis,
        doctorNotes: consultationForm.doctorNotes,
        advice: consultationForm.advice,
        followUpRequired: consultationForm.followUpRequired,
      });

      toast.success("Consultation saved");
      setConsultationAppointment(null);
      await fetchAppointments(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save consultation");
    } finally {
      setConsultationSaving(false);
    }
  };

  const markCompleted = async (appointment) => {
    try {
      setActionLoadingId(appointment.id);
      await api.patch(`/appointment/${appointment.id}/complete`);
      toast.success("Appointment completed");
      await fetchAppointments(false);
    } catch (error) {
      console.error("Complete appointment error:", error);
      toast.error(error.response?.data?.message || "Failed to complete appointment");
    } finally {
      setActionLoadingId(null);
    }
  };

  const viewPrescription = async (appointment) => {
    try {
      const res = await api.get(`/prescription/appointment/${appointment.id}`);

      if (!res.data?.id) {
        toast.error("Prescription not found");
        return;
      }

      window.open(
        `${import.meta.env.VITE_API_URL}/prescription/${res.data.id}/pdf`,
        "_blank"
      );
    } catch (error) {
      console.error(error);
      toast.error("Unable to open prescription");
    }
  };

  const addDays = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  };

  const openFollowUp = (appointment, days = 7) => {
    setFollowUpAppointment(appointment);
    setFollowUpForm({
      followUpDate: addDays(days),
      notes: "",
    });
  };

  const saveFollowUp = async () => {
    if (!followUpAppointment) return;

    const patientId = followUpAppointment.patient?.id || followUpAppointment.patientId;

    if (!patientId) {
      toast.error("Patient not found");
      return;
    }

    if (!followUpForm.followUpDate) {
      toast.error("Please select follow-up date");
      return;
    }

    try {
      setFollowUpSaving(true);

      await api.post("/follow-up", {
        appointmentId: followUpAppointment.id,
        doctorId: doctor.id,
        patientId,
        followUpDate: followUpForm.followUpDate,
        notes: followUpForm.notes,
      });

      toast.success("Follow-up scheduled");
      setFollowUpAppointment(null);
      await fetchAppointments(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to schedule follow-up");
    } finally {
      setFollowUpSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8fb] pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
      {visible && (
        <div
          className="fixed left-0 right-0 top-0 z-[100] flex justify-center transition-all duration-300"
          style={{ transform: `translateY(${pullDistance}px)` }}
        >
          <div className="mt-3 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-lg">
            <div
              className={`h-4 w-4 rounded-full border-2 border-cyan-600 border-t-transparent ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            <span className="text-xs font-black text-cyan-700">
              {refreshing ? "Refreshing..." : "Pull to refresh"}
            </span>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-md px-3 pt-3">
        <section className="rounded-[1.7rem] border border-slate-100 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700">
                Doctor OPD
              </p>
              <h1 className="text-xl font-black text-slate-950">
                Appointments
              </h1>
              <p className="text-xs font-semibold text-slate-500">
                Today • {stats.today} patients
              </p>
            </div>

            <Link
              to="/doctor/dashboard"
              className="rounded-2xl bg-slate-950 px-3 py-2 text-xs font-black text-white"
            >
              Dashboard
            </Link>
          </div>

          <DoctorAppointmentStats stats={stats} />
        </section>

        <section className="sticky top-0 z-20 mt-3 space-y-2 bg-[#f6f8fb] pb-2 pt-1">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-sm">
            <Search size={17} className="text-cyan-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient"
              className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")}>
                <X size={16} className="text-slate-400" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              ["TODAY", "Today"],
              ["UPCOMING", "Next"],
              ["COMPLETED", "Done"],
              ["CUSTOM", "Date"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setView(key)}
                className={`rounded-2xl py-2.5 text-[11px] font-black ${
                  view === key
                    ? "bg-cyan-600 text-white"
                    : "border border-slate-100 bg-white text-slate-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {view === "CUSTOM" && (
            <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-sm">
              <CalendarCheck size={17} className="text-cyan-600" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
              />
            </div>
          )}
        </section>

        {loading ? (
          <AppointmentSkeleton />
        ) : filteredAppointments.length === 0 ? (
          <AppointmentEmptyState />
        ) : (
          <section className="space-y-3">
            <Stage title="Waiting" count={groupedAppointments.booked.length} tone="cyan">
              {groupedAppointments.booked.map((appointment) => (
                <DoctorAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  actionLoadingId={actionLoadingId}
                  onCheckIn={openCheckIn}
                  onConsult={openConsultation}
                  onPrescription={() => setSelectedAppointment(appointment)}
                  onViewPrescription={viewPrescription}
                  onFollowUp={openFollowUp}
                  onComplete={markCompleted}
                />
              ))}
            </Stage>

            <Stage title="Needs Prescription" count={groupedAppointments.prescription.length} tone="amber">
              {groupedAppointments.prescription.map((appointment) => (
                <DoctorAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  actionLoadingId={actionLoadingId}
                  onCheckIn={openCheckIn}
                  onConsult={openConsultation}
                  onPrescription={() => setSelectedAppointment(appointment)}
                  onViewPrescription={viewPrescription}
                  onFollowUp={openFollowUp}
                  onComplete={markCompleted}
                />
              ))}
            </Stage>

            <Stage title="Ready to Close" count={groupedAppointments.followUp.length} tone="violet">
              {groupedAppointments.followUp.map((appointment) => (
                <DoctorAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  actionLoadingId={actionLoadingId}
                  onCheckIn={openCheckIn}
                  onConsult={openConsultation}
                  onPrescription={() => setSelectedAppointment(appointment)}
                  onViewPrescription={viewPrescription}
                  onFollowUp={openFollowUp}
                  onComplete={markCompleted}
                />
              ))}
            </Stage>

            <Stage title="Completed" count={groupedAppointments.completed.length} tone="emerald">
              {groupedAppointments.completed.slice(0, 6).map((appointment) => (
                <DoctorAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  actionLoadingId={actionLoadingId}
                  onCheckIn={openCheckIn}
                  onConsult={openConsultation}
                  onPrescription={() => setSelectedAppointment(appointment)}
                  onViewPrescription={viewPrescription}
                  onFollowUp={openFollowUp}
                  onComplete={markCompleted}
                />
              ))}
            </Stage>
          </section>
        )}

        {selectedAppointment && (
          <PrescriptionModal
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
            onSaved={async () => {
              setSelectedAppointment(null);
              await fetchAppointments(false);
            }}
          />
        )}

        {checkInModal && (
          <CheckInSheet
            appointment={checkInModal}
            data={checkInData}
            onClose={() => {
              setCheckInModal(null);
              setCheckInData(null);
            }}
          />
        )}

        {consultationAppointment && (
          <ConsultationSheet
            appointment={consultationAppointment}
            form={consultationForm}
            setForm={setConsultationForm}
            saving={consultationSaving}
            onClose={() => setConsultationAppointment(null)}
            onSave={saveConsultation}
          />
        )}

        {followUpAppointment && (
          <FollowUpSheet
            appointment={followUpAppointment}
            form={followUpForm}
            setForm={setFollowUpForm}
            saving={followUpSaving}
            onClose={() => setFollowUpAppointment(null)}
            onSave={saveFollowUp}
            addDays={addDays}
          />
        )}
      </div>
    </main>
  );
}



function Stage({ title, count, tone, children }) {
  if (!count) return null;

  const dot =
    tone === "emerald"
      ? "bg-emerald-500"
      : tone === "amber"
      ? "bg-amber-500"
      : tone === "violet"
      ? "bg-violet-500"
      : "bg-cyan-500";

  return (
    <div className="rounded-[1.5rem] border border-slate-100 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
          <h2 className="text-sm font-black text-slate-950">{title}</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-600">
          {count}
        </span>
      </div>

      <div className="space-y-2">{children}</div>
    </div>
  );
}



function CheckInSheet({ appointment, data, onClose }) {
  return (
    <BottomSheet title={`${getPatientName(appointment)} Check-In`} onClose={onClose}>
      {!data ? (
        <p className="rounded-2xl bg-slate-50 p-4 text-center text-sm font-semibold text-slate-500">
          No check-in available.
        </p>
      ) : (
        <div className="space-y-3">
          <Info label="Temperature" value={data.temperature} />
          <Info label="Blood Pressure" value={data.bloodPressure} />
          <Info label="Weight" value={data.weight} />
          <Info label="Symptoms" value={data.symptoms} />
          <Info label="Notes" value={data.notes} />
        </div>
      )}
    </BottomSheet>
  );
}

function ConsultationSheet({ appointment, form, setForm, saving, onClose, onSave }) {
  return (
    <BottomSheet title="Consultation Workspace" subtitle={getPatientName(appointment)} onClose={onClose}>
      <div className="space-y-3">
        <InputField
          label="Diagnosis"
          value={form.diagnosis}
          onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
          placeholder="Example: Viral fever"
        />

        <TextAreaField
          label="Doctor Notes"
          value={form.doctorNotes}
          rows={3}
          onChange={(e) => setForm({ ...form, doctorNotes: e.target.value })}
          placeholder="Symptoms, history, vitals"
        />

        <TextAreaField
          label="Advice"
          value={form.advice}
          rows={3}
          onChange={(e) => setForm({ ...form, advice: e.target.value })}
          placeholder="Rest, hydration, red flags"
        />

        <label className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3">
          <input
            type="checkbox"
            checked={form.followUpRequired}
            onChange={(e) =>
              setForm({ ...form, followUpRequired: e.target.checked })
            }
          />
          <span className="text-sm font-black text-slate-800">
            Follow-up Required
          </span>
        </label>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={onClose} className="h-12 rounded-2xl border border-slate-200 font-black">
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-600 font-black text-white disabled:bg-slate-300"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Save
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}

function FollowUpSheet({ appointment, form, setForm, saving, onClose, onSave, addDays }) {
  return (
    <BottomSheet title="Schedule Follow-up" subtitle={getPatientName(appointment)} onClose={onClose}>
      <div className="grid grid-cols-3 gap-2">
        {[7, 15, 30].map((days) => (
          <button
            key={days}
            onClick={() => setForm({ ...form, followUpDate: addDays(days) })}
            className="rounded-2xl bg-cyan-50 py-3 text-xs font-black text-cyan-700"
          >
            {days} Days
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-3">
        <InputField
          label="Follow-up Date"
          type="date"
          value={form.followUpDate}
          onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
        />

        <TextAreaField
          label="Notes"
          value={form.notes}
          rows={3}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Review after medicine course"
        />

        <div className="grid grid-cols-2 gap-2">
          <button onClick={onClose} className="h-12 rounded-2xl border border-slate-200 font-black">
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-violet-600 font-black text-white disabled:bg-slate-300"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Schedule
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}

function BottomSheet({ title, subtitle, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 px-3 backdrop-blur-sm">
      <div className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-4">
          <div>
            <h2 className="text-lg font-black text-slate-950">{title}</h2>
            {subtitle && <p className="text-sm font-semibold text-slate-500">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          {children}
        </div>
      </div>
    </div>
  );
}

function InputField({ label, type = "text", value, onChange, placeholder }) {
  return (
    <label className="block">
      <p className="mb-1.5 text-xs font-black text-slate-700">{label}</p>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold outline-none focus:border-cyan-500"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows }) {
  return (
    <label className="block">
      <p className="mb-1.5 text-xs font-black text-slate-700">{label}</p>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold outline-none focus:border-cyan-500"
      />
    </label>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-xs font-black text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value || "-"}</p>
    </div>
  );
}

