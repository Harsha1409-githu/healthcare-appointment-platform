import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import PageHeader from "../components/PageHeader";
import api from "../api/axios";
import VacationHolidaysSection from "../doctor/availability/Vacation/VacationHolidaysSection";
import AvailabilityHero from "../doctor/availability/AvailabilityHero";
import SessionForm from "../doctor/availability/SessionForm";
import WeeklySessionPlanner from "../doctor/availability/WeeklySessionPlanner";
import AvailabilityTipCard from "../doctor/availability/AvailabilityTipCard";
import SmartSetupCard from "../doctor/availability/SmartSetup/SmartSetupCard";
import SmartSetupWizard from "../doctor/availability/SmartSetup/SmartSetupWizard";
import PauseCustomSheet from "../doctor/availability/PauseCustomSheet";
import { DAYS, DEFAULT_SESSION } from "../doctor/availability/availabilityData";
import {
  todayIso,
  getStatusConfig,
} from "../doctor/availability/availabilityHelpers";

export default function DoctorAvailability() {
  const doctor = JSON.parse(localStorage.getItem("doctorUser") || "null");

  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [slots, setSlots] = useState([]);
  const [activeDay, setActiveDay] = useState("MONDAY");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showSmartSetup, setShowSmartSetup] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState("AVAILABLE");
  const [blockedUntil, setBlockedUntil] = useState(null);
  const [showPauseSheet, setShowPauseSheet] = useState(false);
const [pauseUntil, setPauseUntil] = useState("");
const [pauseReason, setPauseReason] = useState("Lunch");

  const todayDate = useMemo(() => todayIso(), []);

  const [form, setForm] = useState({
    doctorId: doctor?.id || "",
    dayOfWeek: "MONDAY",
    ...DEFAULT_SESSION,
  });

  useEffect(() => {
    if (!doctor?.id) return;

    setForm((prev) => ({
      ...prev,
      doctorId: doctor.id,
    }));

    loadDoctorStatus();
    fetchAll();
  }, [doctor?.id]);

  const fetchAll = async () => {
    await Promise.all([fetchAvailability(), fetchSlots()]);
  };

  const fetchAvailability = async () => {
    try {
      const res = await api.get(`/availability/doctor/${doctor.id}`);
      setAvailability(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load availability");
    }
  };

  const fetchSlots = async () => {
    try {
      const res = await api.get(`/slot/doctor/${doctor.id}`);
      setSlots(res.data || []);
    } catch (error) {
      console.error(error);
      setSlots([]);
    }
  };

  const loadDoctorStatus = async () => {
    try {
      const { data } = await api.get(`/doctor/${doctor.id}/status`);
      setAvailabilityStatus(data.liveStatus || "AVAILABLE");
      setBlockedUntil(data.blockedUntil ? new Date(data.blockedUntil) : null);
    } catch (error) {
      console.error("Failed to load doctor status", error);
    }
  };

  const blockTime = async (minutes) => {
    const until = new Date();
    until.setMinutes(until.getMinutes() + minutes);

    try {
      await api.patch(`/doctor/${doctor.id}/status`, {
        status: "BREAK",
        blockedUntil: until.toISOString(),
      });

      await loadDoctorStatus();
      toast.success(`Bookings paused for ${minutes} minutes`);
    } catch {
      toast.error("Failed to pause bookings");
    }
  };

  const resumeAvailability = async () => {
    try {
      await api.patch(`/doctor/${doctor.id}/status`, {
        status: "AVAILABLE",
        blockedUntil: null,
      });

      await loadDoctorStatus();
      toast.success("Availability resumed");
    } catch {
      toast.error("Failed to resume availability");
    }
  };

  const groupedAvailability = useMemo(() => {
    return DAYS.map((day) => ({
      day,
      sessions: availability
        .filter((item) => item.dayOfWeek === day)
        .sort((a, b) =>
          String(a.startTime || "").localeCompare(String(b.startTime || ""))
        ),
    }));
  }, [availability]);

  const selectedDateSlots = useMemo(() => {
    return slots.filter((slot) => slot.date === todayDate);
  }, [slots, todayDate]);

  const availableSlots = selectedDateSlots.filter((slot) => slot.isAvailable);
  const bookedSlots = selectedDateSlots.filter((slot) => !slot.isAvailable);
  const nextAvailableSlot = availableSlots[0];
  const statusConfig = getStatusConfig(availabilityStatus);

  const openAddSession = (day) => {
    setEditingId(null);
    setActiveDay(day);
    setShowForm(true);

    setForm({
      doctorId: doctor?.id || "",
      dayOfWeek: day,
      ...DEFAULT_SESSION,
    });

    setTimeout(() => {
      document.getElementById("session-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  const openEditSession = (session) => {
    setEditingId(session.id);
    setActiveDay(session.dayOfWeek);
    setShowForm(true);

    setForm({
      doctorId: doctor?.id || "",
      dayOfWeek: session.dayOfWeek,
      slotType: session.slotType || DEFAULT_SESSION.slotType,
      startTime: session.startTime || DEFAULT_SESSION.startTime,
      endTime: session.endTime || DEFAULT_SESSION.endTime,
      slotDuration: session.slotDuration || DEFAULT_SESSION.slotDuration,
    });

    setTimeout(() => {
      document.getElementById("session-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  const generateSlotsForNextDays = async (days = 7) => {
    const today = new Date();

    for (let index = 0; index < days; index++) {
      const date = new Date(today);
      date.setDate(today.getDate() + index);

      await api.post("/slot/generate", {
        doctorId: doctor.id,
        date: date.toISOString().split("T")[0],
      });
    }
  };

  const createSessionSafely = async (payload) => {
    try {
      await api.post("/availability", payload);
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "";

      if (
        message.includes("already exists") ||
        message.includes("exact availability")
      ) {
        return false;
      }

      throw error;
    }
  };

  const saveSession = async (e) => {
    e.preventDefault();

    if (form.startTime >= form.endTime) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        slotDuration: Number(form.slotDuration),
      };

      if (editingId) {
        await api.patch(`/availability/${editingId}`, payload);
      } else {
        await api.post("/availability", payload);
      }

      setShowForm(false);
      setEditingId(null);

      await generateSlotsForNextDays(7);
      await fetchAvailability();
      await fetchSlots();

      toast.success("Session saved and slots updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save session");
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (id) => {
    if (!window.confirm("Delete this session?")) return;

    try {
      setLoading(true);
      await api.delete(`/availability/${id}`);
      toast.success("Session deleted");
      await fetchAvailability();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete session");
    } finally {
      setLoading(false);
    }
  };

  const createSmartSetup = async (setup) => {
    try {
      setLoading(true);

      for (const day of setup.days) {
        await createSessionSafely({
          doctorId: doctor.id,
          dayOfWeek: day,
          startTime: setup.startTime,
          endTime: setup.endTime,
          slotType: setup.slotType,
          slotDuration: setup.slotDuration,
        });
      }

      await generateSlotsForNextDays(7);
      await fetchAvailability();
      await fetchSlots();

      setShowSmartSetup(false);
      toast.success("Smart schedule created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create schedule");
    } finally {
      setLoading(false);
    }
  };

  const pauseUntilTime = async () => {
  if (!pauseUntil) {
    toast.error("Select pause time");
    return;
  }

  const until = new Date();
  const [hours, minutes] = pauseUntil.split(":").map(Number);

  until.setHours(hours, minutes, 0, 0);

  if (until <= new Date()) {
    toast.error("Pause time must be later than current time");
    return;
  }

  try {
    setLoading(true);

    await api.patch(`/doctor/${doctor.id}/status`, {
      status: "BREAK",
      blockedUntil: until.toISOString(),
      reason: pauseReason,
    });

    await loadDoctorStatus();
    setShowPauseSheet(false);

    toast.success(`Bookings paused until ${pauseUntil}`);
  } catch {
    toast.error("Failed to pause bookings");
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-[#f6f8fb] pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
     <PageHeader title="Practice Schedule" subtitle="Manage working hours" />

      <div className="mx-auto max-w-md px-3">
 <AvailabilityHero
  statusConfig={statusConfig}
  blockedUntil={blockedUntil}
  selectedDateSlots={selectedDateSlots}
  availableSlots={availableSlots}
  bookedSlots={bookedSlots}
  nextAvailableSlot={nextAvailableSlot}
  onPause30={() => blockTime(30)}
  onPause60={() => blockTime(60)}
  onPause120={() => blockTime(120)}
  onCustomPause={() => setShowPauseSheet(true)}
  onResume={resumeAvailability}
/>

        <SmartSetupCard onStart={() => setShowSmartSetup(true)} />

        <WeeklySessionPlanner
          groupedAvailability={groupedAvailability}
          activeDay={activeDay}
          setActiveDay={setActiveDay}
          loading={loading}
          onAdd={openAddSession}
          onEdit={openEditSession}
          onDelete={deleteSession}
        />

        <SessionForm
          showForm={showForm}
          editingId={editingId}
          form={form}
          setForm={setForm}
          loading={loading}
          onSubmit={saveSession}
          onCancel={() => {
            setShowForm(false);
            setEditingId(null);
          }}
        />

        <VacationHolidaysSection doctorId={doctor?.id} />

        <AvailabilityTipCard />

        <SmartSetupWizard
          open={showSmartSetup}
          loading={loading}
          onClose={() => setShowSmartSetup(false)}
          onCreate={createSmartSetup}
        />
    <PauseCustomSheet
  open={showPauseSheet}
  loading={loading}
  pauseUntil={pauseUntil}
  setPauseUntil={setPauseUntil}
  reason={pauseReason}
  setReason={setPauseReason}
  onClose={() => setShowPauseSheet(false)}
  onConfirm={pauseUntilTime}
/>
      </div>
    </main>
  );
}