import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "@/api/axios";

export function usePatientAppointments() {
  const selectedProfile = JSON.parse(localStorage.getItem("selectedProfile") || "null");
  const patient = JSON.parse(localStorage.getItem("patientUser") || "null");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const [rescheduleFor, setRescheduleFor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState("");

  const [reviewForm, setReviewForm] = useState({
    appointmentId: null,
    doctorId: "",
    rating: 5,
    comment: "",
  });

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointment/my");
      setAppointments(res.data || []);
    } catch (err) {
      console.error("Appointment API error:", err);

      if (err.response?.status === 401) {
        toast.error("Please login again");
        localStorage.removeItem("patientToken");
        localStorage.removeItem("patientUser");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const profileAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      if (!selectedProfile) return true;
      if (selectedProfile.isSelf) return !appointment.familyMember;
      return appointment.familyMember?.id === selectedProfile.id;
    });
  }, [appointments, selectedProfile]);

  const filteredAppointments = useMemo(() => {
    return profileAppointments.filter((appointment) => {
      const matchesStatus =
        statusFilter === "ALL" || appointment.status === statusFilter;

      const text = `${appointment.doctor?.doctorName || ""} ${
        appointment.doctor?.specialization || ""
      } ${appointment.patientName || ""} ${
        appointment.familyMember?.fullName || ""
      } ${appointment.doctor?.hospital?.hospitalName || ""}`.toLowerCase();

      return matchesStatus && text.includes(search.toLowerCase().trim());
    });
  }, [profileAppointments, statusFilter, search]);

  const stats = useMemo(
    () => ({
      booked: profileAppointments.filter((a) => a.status === "BOOKED").length,
      completed: profileAppointments.filter((a) => a.status === "COMPLETED").length,
      cancelled: profileAppointments.filter((a) => a.status === "CANCELLED").length,
    }),
    [profileAppointments]
  );

  const upcomingAppointment = useMemo(
    () => filteredAppointments.find((item) => item.status === "BOOKED"),
    [filteredAppointments]
  );

  const cancelAppointment = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await api.patch(`/appointment/${id}/cancel`);

      setAppointments((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "CANCELLED" } : item
        )
      );

      toast.success("Appointment cancelled");
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error(error.response?.data?.message || "Failed to cancel appointment");
    }
  }, []);

  const openReschedule = useCallback(async (appointment) => {
    try {
      const type = appointment.appointmentType || "IN_PERSON";

      const res = await api.get(
        `/slot/doctor/${appointment.doctor.id}/available?type=${type}`
      );

      const slots = (res.data || []).filter(
        (slot) => String(slot.id) !== String(appointment.slot?.id)
      );

      setSelectedSlotId("");
      setAvailableSlots(slots);
      setRescheduleFor(appointment);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load slots");
    }
  }, []);

  const closeReschedule = useCallback(() => {
    setRescheduleFor(null);
    setSelectedSlotId("");
  }, []);

  const confirmReschedule = useCallback(async () => {
    if (!selectedSlotId) {
      toast.error("Select a slot");
      return;
    }

    try {
      await api.patch(`/appointment/${rescheduleFor.id}/reschedule`, {
        newSlotId: selectedSlotId,
      });

      toast.success("Appointment rescheduled");
      closeReschedule();
      fetchAppointments();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to reschedule");
    }
  }, [selectedSlotId, rescheduleFor, fetchAppointments, closeReschedule]);

  const openReviewForm = useCallback((appointment) => {
    setReviewForm({
      appointmentId: appointment.id,
      doctorId: appointment.doctor?.id || "",
      rating: 5,
      comment: "",
    });
  }, []);

  const closeReviewForm = useCallback(() => {
    setReviewForm({
      appointmentId: null,
      doctorId: "",
      rating: 5,
      comment: "",
    });
  }, []);

  const submitReview = useCallback(
    async (e) => {
      e.preventDefault();

      if (!reviewForm.comment.trim()) {
        toast.error("Please enter review comment");
        return;
      }

      try {
        await api.post("/review", {
          doctorId: reviewForm.doctorId,
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment,
        });

        toast.success("Review submitted");
        closeReviewForm();
      } catch (error) {
        console.error("Review error:", error);
        toast.error(error.response?.data?.message || "Failed to submit review");
      }
    },
    [reviewForm, closeReviewForm]
  );

  return {
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
  };
}