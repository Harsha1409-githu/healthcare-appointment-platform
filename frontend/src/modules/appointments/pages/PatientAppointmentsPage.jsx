import PageHeader from "@/components/PageHeader";
import usePullToRefresh from "@/hooks/usePullToRefresh";
import {
  MiniStat,
  PatientAppointmentCard,
  RescheduleSheet,
  UpcomingAppointmentCard,
} from "@/modules/appointments/components/patient";
import { usePatientAppointments } from "@/modules/appointments/hooks";
import {
  canRescheduleAppointment,
  formatTime,
  getVideoConsultStatus,
} from "@/modules/appointments/utils/appointment.utils";
import { CalendarCheck, Filter, Search, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";

export default function PatientAppointmentsPage() {
  const {
    patient,
    selectedProfile,
    profileAppointments,
    filteredAppointments,
    loading,

    statusFilter,
    setStatusFilter,

    search,
    setSearch,

    fetchAppointments,
    stats,
    upcomingAppointment,

    cancelAppointment,

    rescheduleFor,
    availableSlots,
    selectedSlotId,
    setSelectedSlotId,
    openReschedule,
    closeReschedule,
    confirmReschedule,

    reviewForm,
    setReviewForm,
    openReviewForm,
    closeReviewForm,
    submitReview,
  } = usePatientAppointments();

  const { visible, pullDistance, refreshing } = usePullToRefresh(async () => {
    await fetchAppointments();
  });

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-28">
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

      <PageHeader
        title="My Appointments"
        subtitle="Track bookings, video calls, reviews and cancellations"
      />

      <div className="mx-auto max-w-md px-4">
        <section className="rounded-3xl bg-gradient-to-r from-cyan-600 to-blue-700 p-4 text-white shadow-sm">
          <p className="text-xs font-bold text-cyan-100">
            APPOINTMENTS FOR
          </p>

          <h1 className="mt-1 text-2xl font-black">
            {selectedProfile?.fullName || patient?.fullName || "Patient"}
          </h1>

          <p className="mt-1 text-sm text-cyan-100">
            {stats.booked} upcoming appointments
          </p>
        </section>

        <section className="mt-3 grid grid-cols-3 gap-2">
          <MiniStat title="Upcoming" value={stats.booked} />
          <MiniStat title="Completed" value={stats.completed} />
          <MiniStat title="Cancelled" value={stats.cancelled} />
        </section>

        {upcomingAppointment && (
          <UpcomingAppointmentCard
            appointment={upcomingAppointment}
            formatTime={formatTime}
            getVideoConsultStatus={getVideoConsultStatus}
          />
        )}

        <section className="mt-3 rounded-3xl border border-slate-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
            <Search className="shrink-0 text-cyan-600" size={17} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctor or hospital"
              className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
            <Filter className="shrink-0 text-cyan-600" size={17} />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none"
            >
              <option value="ALL">All Appointments</option>
              <option value="BOOKED">Booked</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </section>

        <section className="mt-3">
          {loading ? (
            <AppointmentsSkeleton />
          ) : profileAppointments.length === 0 ? (
            <EmptyAppointments />
          ) : filteredAppointments.length === 0 ? (
            <EmptyCard text="No appointments found." />
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((appointment) => (
                <PatientAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  reviewForm={reviewForm}
                  openReviewForm={openReviewForm}
                  closeReviewForm={closeReviewForm}
                  submitReview={submitReview}
                  setReviewForm={setReviewForm}
                  cancelAppointment={cancelAppointment}
                  openReschedule={openReschedule}
                  formatTime={formatTime}
                  getVideoConsultStatus={getVideoConsultStatus}
                  canRescheduleAppointment={canRescheduleAppointment}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <RescheduleSheet
        appointment={rescheduleFor}
        availableSlots={availableSlots}
        selectedSlotId={selectedSlotId}
        setSelectedSlotId={setSelectedSlotId}
        onClose={closeReschedule}
        onConfirm={confirmReschedule}
      />
    </main>
  );
}

function AppointmentsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
        >
          <div className="flex gap-3">
            <div className="h-20 w-20 rounded-3xl bg-slate-200" />

            <div className="flex-1">
              <div className="mb-2 h-4 w-36 rounded-full bg-slate-200" />
              <div className="mb-2 h-3 w-24 rounded-full bg-slate-200" />
              <div className="h-3 w-44 rounded-full bg-slate-200" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="h-10 rounded-xl bg-slate-200" />
            <div className="h-10 rounded-xl bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyAppointments() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm">
      <CalendarCheck className="mx-auto mb-3 text-cyan-600" size={32} />

      <h3 className="text-lg font-black text-slate-950">
        No appointments
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        Your booked appointments will appear here.
      </p>

      <Link
        to="/doctors"
        className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-black text-white"
      >
        <Stethoscope size={17} />
        Find Doctors
      </Link>
    </div>
  );
}

function EmptyCard({ text }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 text-center text-sm font-semibold text-slate-500 shadow-sm">
      {text}
    </div>
  );
}