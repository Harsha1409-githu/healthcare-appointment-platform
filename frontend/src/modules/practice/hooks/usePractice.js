import { useCallback, useState } from "react";

import { practiceService } from "../services/practice.service";

export function usePractice() {
  const [loading, setLoading] = useState(false);

  const [leaves, setLeaves] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [pauses, setPauses] = useState([]);
  const [weeklyPractice, setWeeklyPractice] = useState([]);

  const loadLeaves = useCallback(async (doctorId) => {
    try {
      setLoading(true);
      const data = await practiceService.getLeaves(doctorId);
      setLeaves(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAvailability = useCallback(async (doctorId) => {
    const data = await practiceService.getAvailability(doctorId);
    setAvailability(data || []);
  }, []);

  const loadPauses = useCallback(async (doctorId) => {
    const data = await practiceService.getPauses(doctorId);
    setPauses(data || []);
  }, []);

  const loadWeeklyPractice = useCallback(async (doctorId) => {
    const data = await practiceService.getWeeklyPractice(doctorId);
    setWeeklyPractice(data || []);
  }, []);

  const createLeave = async (payload) => {
    await practiceService.createLeave(payload);
  };

  const deleteLeave = async (id) => {
    await practiceService.deleteLeave(id);
  };

  return {
    loading,

    leaves,
    availability,
    pauses,
    weeklyPractice,

    loadLeaves,
    loadAvailability,
    loadPauses,
    loadWeeklyPractice,

    createLeave,
    deleteLeave,
  };
}