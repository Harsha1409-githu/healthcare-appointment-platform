import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, FileText, Loader2, Plus, Star } from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/axios";
import DashboardSkeleton from "../components/DashboardSkeleton";
import usePullToRefresh from "../hooks/usePullToRefresh";

import ReviewCheckInSheet from "../doctor/waiting/ReviewCheckInSheet";
import DoctorTopBar from "../doctor/dashboard/DoctorTopBar";
import DoctorKPIs from "../doctor/dashboard/DoctorKPIs";
import SectionHeader from "../doctor/dashboard/SectionHeader";
import NextPatientCard from "../doctor/dashboard/NextPatientCard";
import QueueGroup from "../doctor/queue/QueueGroup";
import CheckInSheet from "../doctor/checkin/CheckInSheet";

import BottomSheet from "../doctor/common/BottomSheet";
import InputField from "../doctor/common/InputField";
import TextAreaField from "../doctor/common/TextAreaField";

import { buildQueues } from "../doctor/utils/buildQueues";

const todayIso = () => new Date().toISOString().split("T")[0];

const getPatientName = (appointment) =>
  appointment?.familyMember?.fullName ||
  appointment?.patient?.fullName ||
  appointment?.patientName ||
  "Patient";

export default function DoctorDashboard() {
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(
    JSON.parse(localStorage.getItem("doctorUser") || "null")
  );

  const [appointments, setAppointments] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [reviewSummary, setReviewSummary] = useState({
    totalReviews: 0,
    averageRating: 0,
  });

  const [checkInModal, setCheckInModal] = useState(null);
  const [checkInData, setCheckInData] = useState(null);
  const [reviewAppointment, setReviewAppointment] = useState(null);

  const [followUpAppointment, setFollowUpAppointment] = useState(null);
  const [followUpSaving, setFollowUpSaving] = useState(false);
  const [followUpForm, setFollowUpForm] = useState({
    followUpDate: "",
    notes: "",
  });

  const { pullDistance, refreshing, visible } = usePullToRefresh(async () => {
    await fetchDashboardData();
    await fetchNotificationCount();
  });

  useEffect(() => {
    if (!doctor) {
      navigate("/doctor/login");
      return;
    }

    fetchDashboardData();
    fetchNotificationCount();
  }, []);

  useEffect(() => {
    const refreshDoctor = () => {
      setDoctor(JSON.parse(localStorage.getItem("doctorUser") || "null"));
    };

    window.addEventListener("doctorProfileUpdated", refreshDoctor);
    window.addEventListener("storage", refreshDoctor);

    return () => {
      window.removeEventListener("doctorProfileUpdated", refreshDoctor);
      window.removeEventListener("storage", refreshDoctor);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [appointmentRes, reviewRes, followUpRes] = await Promise.all([
        api.get(`/appointment/doctor/${doctor.id}`),
        api.get(`/review/doctor/${doctor.id}/summary`),
        api.get(`/follow-up/doctor/${doctor.id}`),
      ]);

      setAppointments(appointmentRes.data || []);
      setFollowUps(followUpRes.data || []);
      setReviewSummary(reviewRes.data || { totalReviews: 0, averageRating: 0 });
    } catch (error) {
      console.error("Doctor dashboard error:", error);
      toast.error("Unable to load dashboard");
      setAppointments([]);
      setFollowUps([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationCount = async () => {
    try {
      const res = await api.get("/notifications/my");
      setUnreadCount((res.data || []).filter((item) => !item.isRead).length);
    } catch (error) {
      console.error(error);
    }
  };

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

  const openFollowUpModal = (appointment, days = 7) => {
    setFollowUpAppointment(appointment);
    setFollowUpForm({
      followUpDate: addDays(days),
      notes: "",
    });
  };

  const closeFollowUpModal = () => {
    setFollowUpAppointment(null);
    setFollowUpForm({
      followUpDate: "",
      notes: "",
    });
  };

  const saveFollowUp = async () => {
    if (!followUpAppointment) return;

    const patientId =
      followUpAppointment.patient?.id || followUpAppointment.patientId;

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
      closeFollowUpModal();
      await fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to schedule follow-up");
    } finally {
      setFollowUpSaving(false);
    }
  };

  const today = todayIso();

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const aKey = `${a.slot?.date || ""} ${a.slot?.startTime || ""}`;
      const bKey = `${b.slot?.date || ""} ${b.slot?.startTime || ""}`;
      return aKey.localeCompare(bKey);
    });
  }, [appointments]);

  const todayAppointments = useMemo(() => {
    return sortedAppointments.filter((item) => item.slot?.date === today);
  }, [sortedAppointments, today]);

  const futureAppointments = useMemo(() => {
    return sortedAppointments.filter((item) => item.slot?.date > today);
  }, [sortedAppointments, today]);

  const queues = useMemo(() => {
    return buildQueues({
      todayAppointments,
      futureAppointments,
    });
  }, [todayAppointments, futureAppointments]);

  const nextAppointment =
    queues.ready[0] ||
    queues.waiting[0] ||
    queues.consulting[0] ||
    queues.documentation[0] ||
    queues.upcomingToday[0] ||
    null;

  const completedToday = queues.completed.length;

  const waitingToday =
    queues.ready.length +
    queues.waiting.length +
    queues.consulting.length +
    queues.documentation.length;

  const pendingFollowUps = useMemo(() => {
    return followUps
      .filter((item) => item.status === "PENDING")
      .sort((a, b) =>
        String(a.followUpDate || "").localeCompare(String(b.followUpDate || ""))
      );
  }, [followUps]);

  const videoToday = todayAppointments.filter(
    (item) => item.appointmentType === "VIDEO"
  ).length;

  const compactAlerts = [
    unreadCount > 0
      ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
      : null,
    pendingFollowUps.length > 0
      ? `${pendingFollowUps.length} pending follow-up${
          pendingFollowUps.length > 1 ? "s" : ""
        }`
      : null,
    waitingToday > 0
      ? `${waitingToday} patient${waitingToday > 1 ? "s" : ""} active today`
      : null,
  ].filter(Boolean);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f8fb] pt-4 pb-28">
        <div className="mx-auto max-w-5xl px-4">
          <DashboardSkeleton />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-8">
      {visible && (
        <div
          className="fixed left-0 right-0 top-0 z-[100] flex justify-center transition-all duration-300"
          style={{ transform: `translateY(${pullDistance}px)` }}
        >
          <div className="mt-2 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-lg">
            <div
              className={`h-4 w-4 rounded-full border-2 border-cyan-600 border-t-transparent ${
                refreshing ? "animate-spin" : ""
              }`}
            />

            <span className="text-xs font-black text-cyan-700">
              {refreshing
                ? "Refreshing..."
                : pullDistance > 70
                ? "Release to refresh"
                : "Pull to refresh"}
            </span>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-3 pt-3 sm:px-4 lg:px-6 lg:pt-5">
        <DoctorTopBar
          doctor={doctor}
          today={today}
          unreadCount={unreadCount}
          onNotifications={() => navigate("/doctor/notifications")}
        />

        <DoctorKPIs
          todayCount={todayAppointments.length}
          activeCount={waitingToday}
          videoCount={videoToday}
          completedCount={completedToday}
        />

        <section className="mt-3">
          <NextPatientCard
            appointment={nextAppointment}
            onCheckIn={openCheckIn}
            onViewPrescription={viewPrescription}
            onFollowUp={openFollowUpModal}
          />
        </section>

        <section className="mt-3 rounded-[1.5rem] border border-slate-100 bg-white p-3 shadow-sm">
          <SectionHeader
            title="Doctor Work Queue"
            subtitle={`${todayAppointments.length} today`}
            action={
              <Link
                to="/doctor/appointments"
                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700"
              >
                View All
              </Link>
            }
          />

          <div className="mt-3 space-y-4">
            <QueueGroup
              title="Requires Attention"
              tone="red"
              items={queues.attention}
              empty="No urgent actions."
              onCheckIn={openCheckIn}
              onReview={(appointment) => setReviewAppointment(appointment)}
              onViewPrescription={viewPrescription}
              onFollowUp={openFollowUpModal}
            />

            <QueueGroup
              title="Ready to Consult"
              tone="emerald"
              items={queues.ready}
              empty="No patient ready to consult."
              onCheckIn={openCheckIn}
              onReview={(appointment) => setReviewAppointment(appointment)}
              onViewPrescription={viewPrescription}
              onFollowUp={openFollowUpModal}
            />

            <QueueGroup
              title="Waiting Room"
              tone="cyan"
              items={queues.waiting}
              empty="No patient in waiting room."
              onCheckIn={openCheckIn}
              onReview={(appointment) => setReviewAppointment(appointment)}
              onViewPrescription={viewPrescription}
              onFollowUp={openFollowUpModal}
            />

            <QueueGroup
              title="In Consultation"
              tone="blue"
              items={queues.consulting}
              empty="No active consultation."
              onCheckIn={openCheckIn}
              onReview={(appointment) => setReviewAppointment(appointment)}
              onViewPrescription={viewPrescription}
              onFollowUp={openFollowUpModal}
            />

            <QueueGroup
              title="Documentation Pending"
              tone="violet"
              items={queues.documentation}
              empty="No pending notes."
              onCheckIn={openCheckIn}
              onReview={(appointment) => setReviewAppointment(appointment)}
              onViewPrescription={viewPrescription}
              onFollowUp={openFollowUpModal}
            />

            <QueueGroup
              title="Upcoming Today"
              tone="slate"
              items={queues.upcomingToday}
              empty="No more appointments today."
              onCheckIn={openCheckIn}
              onReview={(appointment) => setReviewAppointment(appointment)}
              onViewPrescription={viewPrescription}
              onFollowUp={openFollowUpModal}
            />

            <QueueGroup
              title="Future Appointments"
              tone="slate"
              items={queues.future.slice(0, 5)}
              empty="No future appointments."
              onCheckIn={openCheckIn}
              onReview={(appointment) => setReviewAppointment(appointment)}
              onViewPrescription={viewPrescription}
              onFollowUp={openFollowUpModal}
            />

            <QueueGroup
              title="Completed Today"
              tone="emerald"
              items={queues.completed}
              empty="No completed consultations today."
              onCheckIn={openCheckIn}
              onReview={(appointment) => setReviewAppointment(appointment)}
              onViewPrescription={viewPrescription}
              onFollowUp={openFollowUpModal}
            />

            <QueueGroup
              title="Missed Appointments"
              tone="red"
              items={queues.missed}
              empty="No missed appointments today."
              onCheckIn={openCheckIn}
              onReview={(appointment) => setReviewAppointment(appointment)}
              onViewPrescription={viewPrescription}
              onFollowUp={openFollowUpModal}
            />
          </div>
        </section>

        <section className="mt-3 grid grid-cols-4 gap-2">
          <QuickAction to="/doctor/availability" icon={Clock} label="Slots" />
          <QuickAction to="/doctor/prescriptions" icon={FileText} label="Rx" />
          <QuickAction to="/doctor/follow-ups" icon={Plus} label="Follow" />
          <QuickAction to="/doctor/reviews" icon={Star} label="Reviews" />
        </section>

        <section className="mt-3 rounded-[1.5rem] border border-slate-100 bg-white p-3 shadow-sm">
          <SectionHeader
            title="Recent Alerts"
            subtitle={
              compactAlerts.length
                ? `${compactAlerts.length} updates`
                : "No urgent updates"
            }
            action={
              <Link
                to="/doctor/notifications"
                className="rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-700"
              >
                Open
              </Link>
            }
          />

          <div className="mt-3 space-y-2">
            {compactAlerts.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-500">
                You’re all caught up.
              </p>
            ) : (
              compactAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert}
                  className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />

                  <p className="min-w-0 flex-1 truncate text-sm font-bold text-slate-800">
                    {alert}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="mt-3 rounded-[1.5rem] border border-slate-100 bg-white p-3 shadow-sm">
          <SectionHeader
            title="Practice Summary"
            subtitle="Small view only. Detailed analytics stays on Analytics page."
          />

          <div className="mt-3 grid grid-cols-2 gap-2">
            <SummaryCard
              label="Rating"
              value={Number(reviewSummary.averageRating || 0).toFixed(1)}
              helper={`${reviewSummary.totalReviews || 0} reviews`}
            />

            <SummaryCard
              label="Pending Follow-ups"
              value={pendingFollowUps.length}
              helper="Needs review"
            />
          </div>
        </section>

        {checkInModal && (
        <CheckInSheet
  appointment={checkInModal}
  data={checkInData}
  onClose={() => {
    setCheckInModal(null);
    setCheckInData(null);
  }}
  onStartConsultation={(appointment) => {
    setCheckInModal(null);
    navigate(`/doctor/consultation/${appointment.id}`);
  }}
/>
        )}

        {followUpAppointment && (
          <FollowUpSheet
            appointment={followUpAppointment}
            form={followUpForm}
            setForm={setFollowUpForm}
            saving={followUpSaving}
            onClose={closeFollowUpModal}
            onSave={saveFollowUp}
            addDays={addDays}
          />
        )}

        <ReviewCheckInSheet
          open={!!reviewAppointment}
          appointment={reviewAppointment}
          checkIn={null}
          onClose={() => setReviewAppointment(null)}
          onStart={(appointment) => {
            setReviewAppointment(null);
            navigate(`/doctor/consultation/${appointment.id}`);
          }}
        />
      </div>
    </main>
  );
}

function QuickAction({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-slate-100 bg-white px-2 py-3 text-center shadow-sm active:scale-95"
    >
      <Icon className="mx-auto text-cyan-600" size={20} />
      <p className="mt-1.5 text-[11px] font-black text-slate-800">{label}</p>
    </Link>
  );
}

function SummaryCard({ label, value, helper }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-2xl font-black text-slate-950">{value}</p>

      <p className="mt-0.5 text-xs font-black text-slate-700">{label}</p>

      <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
        {helper}
      </p>
    </div>
  );
}

function FollowUpSheet({
  appointment,
  form,
  setForm,
  saving,
  onClose,
  onSave,
  addDays,
}) {
  return (
    <BottomSheet
      title="Schedule Follow-up"
      subtitle={getPatientName(appointment)}
      onClose={onClose}
    >
      <div className="grid grid-cols-3 gap-2">
        {[7, 15, 30].map((days) => (
          <button
            key={days}
            type="button"
            onClick={() =>
              setForm({
                ...form,
                followUpDate: addDays(days),
              })
            }
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
          onChange={(e) =>
            setForm({
              ...form,
              followUpDate: e.target.value,
            })
          }
        />

        <TextAreaField
          label="Notes"
          value={form.notes}
          rows={3}
          onChange={(e) =>
            setForm({
              ...form,
              notes: e.target.value,
            })
          }
          placeholder="Example: Review after medicine course"
        />

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-violet-600 text-sm font-black text-white disabled:bg-slate-300"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Schedule
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}