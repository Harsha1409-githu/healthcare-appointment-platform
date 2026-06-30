import { useCallback, useState } from "react";

import { appointmentService } from "../services/appointment.service";

export function useAppointments() {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);

  const loadMyAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getMyAppointments();
      setAppointments(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDoctorAppointments = useCallback(async (doctorId) => {
    try {
      setLoading(true);
      const data = await appointmentService.getDoctorAppointments(doctorId);
      setAppointments(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadHospitalAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getHospitalAppointments();
      setAppointments(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDoctorSlots = useCallback(async (doctorId) => {
    const data = await appointmentService.getDoctorSlots(doctorId);
    setSlots(data);
  }, []);

  return {
    loading,
    appointments,
    slots,

    setAppointments,

    loadMyAppointments,
    loadDoctorAppointments,
    loadHospitalAppointments,
    loadDoctorSlots,
  };
}