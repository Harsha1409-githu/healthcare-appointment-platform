import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { usePractice } from "@/modules/practice";

import VacationSummaryCard from "./VacationSummaryCard";
import VacationForm from "./VacationForm";
import VacationList from "./VacationList";

import { DEFAULT_VACATION_FORM } from "./VacationData";
import { getUpcomingVacations } from "./VacationHelpers";

export default function VacationHolidaysSection({ doctorId }) {
  const {
    loading,
    leaves,
    loadLeaves,
    createLeave,
    deleteLeave,
  } = usePractice();

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(DEFAULT_VACATION_FORM);

  const upcomingVacations = useMemo(
    () => getUpcomingVacations(leaves),
    [leaves]
  );

  useEffect(() => {
    if (doctorId) {
      loadLeaves(doctorId);
    }
  }, [doctorId, loadLeaves]);

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

      await createLeave({
        doctorId,
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
      });

      setForm(DEFAULT_VACATION_FORM);

      toast.success("Time off saved");
      await loadLeaves(doctorId);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save time off");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLeave = async (id) => {
    if (!window.confirm("Delete this time off?")) return;

    try {
      await deleteLeave(id);
      toast.success("Time off deleted");
      await loadLeaves(doctorId);
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
        onDelete={handleDeleteLeave}
      />
    </section>
  );
}