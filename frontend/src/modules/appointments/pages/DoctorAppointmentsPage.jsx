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
  DoctorAppointmentHeader,
  DoctorAppointmentStage,
  DoctorAppointmentStats,
  DoctorAppointmentToolbar,
  CheckInSheet,
  ConsultationSheet,
  FollowUpSheet,
  useDoctorAppointments,
} from "@/modules/appointments";

const todayIso = () => new Date().toISOString().split("T")[0];



export default function DoctorAppointments() {

  const {
  doctor,
  appointments,
  filteredAppointments,
  groupedAppointments,
  stats,
  loading,
  actionLoadingId,
  setActionLoadingId,
  search,
  setSearch,
  view,
  setView,
  dateFilter,
  setDateFilter,
  fetchAppointments,
} = useDoctorAppointments();
 

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
        <DoctorAppointmentHeader
  totalAppointments={stats.today}
  loading={loading}
  doctorStatus="AVAILABLE"
  onRefresh={() => fetchAppointments(false)}
/>

<DoctorAppointmentStats stats={stats} />
<DoctorAppointmentToolbar
  search={search}
  setSearch={setSearch}
  view={view}
  setView={setView}
  dateFilter={dateFilter}
  setDateFilter={setDateFilter}
/>
       
        {loading ? (
          <AppointmentSkeleton />
        ) : filteredAppointments.length === 0 ? (
          <AppointmentEmptyState />
        ) : (
          <section className="space-y-3">
            <DoctorAppointmentStage title="Waiting" count={groupedAppointments.booked.length} tone="cyan">
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
            </DoctorAppointmentStage>

            <DoctorAppointmentStage title="Needs Prescription" count={groupedAppointments.prescription.length} tone="amber">
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
            </DoctorAppointmentStage>

            <DoctorAppointmentStage title="Ready to Close" count={groupedAppointments.followUp.length} tone="violet">
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
            </DoctorAppointmentStage>

            <DoctorAppointmentStage title="Completed" count={groupedAppointments.completed.length} tone="emerald">
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
            </DoctorAppointmentStage>
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

