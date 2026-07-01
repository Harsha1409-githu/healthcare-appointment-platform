import PageHeader from "@/components/PageHeader";
import {
  EmptyState,
  HospitalAppointmentCard,
  HospitalAppointmentHeader,
  HospitalAppointmentToolbar,
  LoadingState,
  PrescriptionSheet,
} from "@/modules/appointments/components/hospital";
import { useHospitalAppointments } from "@/modules/appointments/hooks";

export default function HospitalAppointments() {
  const {
    hospital,
    filteredAppointments,
    stats,
    loading,
    actionLoading,

    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,

    fetchAppointments,
    markCompleted,
    cancelAppointment,

    selectedAppointment,
    setSelectedAppointment,
    prescriptionForm,
    setPrescriptionForm,
    openPrescriptionSheet,
    savePrescription,
  } = useHospitalAppointments();

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

      <div className="mx-auto max-w-md px-4">
        <HospitalAppointmentHeader
          hospital={hospital}
          stats={stats}
          loading={loading}
          onRefresh={fetchAppointments}
        />

        <HospitalAppointmentToolbar
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          clearFilters={clearFilters}
        />

        {loading ? (
          <LoadingState />
        ) : filteredAppointments.length === 0 ? (
          <EmptyState />
        ) : (
          <section className="space-y-3">
            {filteredAppointments.map((appointment) => (
              <HospitalAppointmentCard
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