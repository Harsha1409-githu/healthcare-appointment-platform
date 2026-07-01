import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import api from "@/api/axios";
import { todayIso } from "@/modules/appointments/utils";

export function useHospitalAppointments() {
  const hospital = JSON.parse(localStorage.getItem("hospitalUser") || "null");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescriptionForm, setPrescriptionForm] = useState({
    diagnosis: "",
    medicines: "",
    notes: "",
  });

  const getHospitalHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("hospitalToken")}`,
  });

  const fetchAppointments = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

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

      const matchesSearch = searchText.includes(search.toLowerCase().trim());
      const matchesStatus =
        statusFilter === "ALL" || appointment.status === statusFilter;
      const matchesDate = !dateFilter || appointment.slot?.date === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointments, search, statusFilter, dateFilter]);

  const stats = useMemo(
    () => ({
      total: appointments.length,
      today: appointments.filter((item) => item.slot?.date === todayIso()).length,
      completed: appointments.filter((item) => item.status === "COMPLETED").length,
      cancelled: appointments.filter((item) => item.status === "CANCELLED").length,
    }),
    [appointments]
  );

  const markCompleted = useCallback(
    async (appointmentId) => {
      try {
        setActionLoading(appointmentId);

        await api.patch(
          `/appointment/${appointmentId}/complete`,
          {},
          { headers: getHospitalHeaders() }
        );

        toast.success("Appointment marked as completed");
        fetchAppointments();
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Unable to complete appointment");
      } finally {
        setActionLoading(null);
      }
    },
    [fetchAppointments]
  );

  const cancelAppointment = useCallback(
    async (appointmentId) => {
      if (!window.confirm("Cancel this appointment?")) return;

      try {
        setActionLoading(appointmentId);

        await api.patch(
          `/appointment/${appointmentId}/cancel`,
          {},
          { headers: getHospitalHeaders() }
        );

        toast.success("Appointment cancelled");
        fetchAppointments();
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Unable to cancel appointment");
      } finally {
        setActionLoading(null);
      }
    },
    [fetchAppointments]
  );

  const openPrescriptionSheet = useCallback((appointment) => {
    setSelectedAppointment(appointment);
    setPrescriptionForm({
      diagnosis: "",
      medicines: "",
      notes: "",
    });
  }, []);

  const savePrescription = useCallback(async () => {
    if (!selectedAppointment?.id) return;

    if (!prescriptionForm.diagnosis || !prescriptionForm.medicines) {
      toast.error("Diagnosis and medicines are required");
      return;
    }

    try {
      setActionLoading("prescription");

      await api.post("/prescription", {
        appointmentId: selectedAppointment.id,
        diagnosis: prescriptionForm.diagnosis,
        medicines: prescriptionForm.medicines,
        notes: prescriptionForm.notes,
      });

      toast.success("Prescription saved successfully");

      setSelectedAppointment(null);
      setPrescriptionForm({
        diagnosis: "",
        medicines: "",
        notes: "",
      });

      fetchAppointments();
    } catch (error) {
      console.error("Prescription error:", error);
      toast.error(error.response?.data?.message || "Failed to save prescription");
    } finally {
      setActionLoading(null);
    }
  }, [prescriptionForm, selectedAppointment, fetchAppointments]);

  return {
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
  };
}