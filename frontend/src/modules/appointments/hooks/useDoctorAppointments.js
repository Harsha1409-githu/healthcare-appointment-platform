import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { appointmentService } from "../services/appointment.service";
import { todayIso } from "../utils/appointment.utils";
import { filterAppointments } from "../utils/appointment.filter";
import { calculateAppointmentStats } from "../utils/appointment.stats";
import { groupAppointments } from "../utils/appointment.group";


export function useDoctorAppointments() {
  const doctor = JSON.parse(localStorage.getItem("doctorUser") || "null");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState(todayIso());
  const [view, setView] = useState("TODAY");

  const fetchAppointments = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      if (!doctor?.id) {
        setAppointments([]);
        return;
      }

     const data =
  await appointmentService.getDoctorAppointments(doctor.id);

setAppointments(data);
    } catch (err) {
      console.error("Doctor appointments error:", err);
      toast.error("Unable to load appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [doctor?.id]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

 const filteredAppointments = useMemo(
  () =>
    filterAppointments(
      appointments,
      search,
      view,
      dateFilter
    ),
  [appointments, search, view, dateFilter]
);

const stats = useMemo(
  () => calculateAppointmentStats(appointments),
  [appointments]
);

const groupedAppointments = useMemo(
  () => groupAppointments(filteredAppointments),
  [filteredAppointments]
);

  return {
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
  };
}