import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import api from "../../../../api/axios";

import VacationSummaryCard from "./VacationSummaryCard";
import VacationForm from "./VacationForm";
import VacationList from "./VacationList";

import { DEFAULT_VACATION_FORM } from "./VacationData";
import { getUpcomingVacations } from "./VacationHelpers";

export default function VacationHolidaysSection({ doctorId }) {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(DEFAULT_VACATION_FORM);

  const upcomingVacations = useMemo(
    () => getUpcomingVacations(leaves),
    [leaves]
  );

  useEffect(() => {
    if (doctorId) {
      loadLeaves();
    }
  }, [doctorId]);

  const loadLeaves = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/leave/doctor/${doctorId}`);
      setLeaves(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load time off");
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  const applyLeave = async () => {
    if (!form.startDate || !form.endDate) {
      toast.error("Select start and end date");
      return;
    }

    if (form.startDate > form.endDate) {
      toast.error("End date must be after start date");
      return;
    }

    if (!doctorId) {
      toast.error("Doctor not found");
      return;
    }

    try {
      setSaving(true);

      await api.post("/leave", {
        doctorId,
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
      });

      setForm(DEFAULT_VACATION_FORM);

      toast.success("Time off saved");
      await loadLeaves();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save time off");
    } finally {
      setSaving(false);
    }
  };

  const deleteLeave = async (id) => {
    if (!window.confirm("Delete this time off?")) return;

    try {
      await api.delete(`/leave/${id}`);
      toast.success("Time off deleted");
      await loadLeaves();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete time off");
    }
  };

  return (
    <section className="mt-3">
      <VacationSummaryCard
        upcomingVacations={upcomingVacations}
        leaves={leaves}
      />

      <VacationForm
        form={form}
        setForm={setForm}
        saving={saving}
        onSubmit={applyLeave}
      />

      <VacationList
        loading={loading}
        upcomingVacations={upcomingVacations}
        onDelete={deleteLeave}
      />
    </section>
  );
}