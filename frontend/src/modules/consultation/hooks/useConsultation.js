import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { consultationService } from "@/modules/consultation/services";
import {
  buildConsultationNotes,
  buildPrescriptionText,
} from "@/modules/consultation/utils";

import { getDoctorIdFromAppointment } from "@/modules/consultation/utils";

export function useConsultation() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [activeStep, setActiveStep] = useState("snapshot");
  const [listeningField, setListeningField] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [completeAfterSummary, setCompleteAfterSummary] = useState(false);

  const [medicine, setMedicine] = useState({
    name: "",
    dosage: "",
    timing: "BD",
    days: "5",
  });

  const [labInput, setLabInput] = useState("");

  const [form, setForm] = useState({
    symptoms: "",
    diagnosis: "",
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    vitals: {
      bp: "",
      pulse: "",
      temperature: "",
      spo2: "",
      weight: "",
      height: "",
      respiration: "",
      bloodSugar: "",
    },
    medicines: [],
    labTests: [],
    advice: "",
    followUpRequired: false,
    followUpDate: "",
  });

  const loadPatientProfile = useCallback(async () => {
    if (!appointmentId) return;

    try {
      setLoading(true);

      const data = await consultationService.getPatientProfile(appointmentId);
      setProfile(data);
    } catch (error) {
      console.error("Consultation load error:", error);
      toast.error("Unable to load consultation");
    } finally {
      setLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    loadPatientProfile();
  }, [loadPatientProfile]);

  const patient = profile?.patient;
  const appointment = profile?.appointment;

  const startDictation = (field) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Voice dictation is not supported in this browser");
      return;
    }

    recognitionRef.current?.stop();

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListeningField(field);
      toast.success("Listening...");
    };

    recognition.onresult = (event) => {
      const text = event.results?.[0]?.[0]?.transcript || "";

      setForm((prev) => ({
        ...prev,
        [field]: prev[field] ? `${prev[field]} ${text}` : text,
      }));
    };

    recognition.onerror = () => {
      toast.error("Could not capture voice");
    };

    recognition.onend = () => {
      setListeningField(null);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopDictation = () => {
    recognitionRef.current?.stop();
    setListeningField(null);
  };

  const saveConsultation = async (complete = false) => {
  const diagnosis = form.diagnosis || form.assessment;

  if (!diagnosis?.trim()) {
    toast.error("Diagnosis is required");
    setActiveStep("clinical");
    return;
  }

  try {
    setSaving(true);

    const doctorId = getDoctorIdFromAppointment(appointment);

    await consultationService.saveConsultationNote({
      appointmentId: Number(appointmentId),
      doctorId,
      diagnosis,
      doctorNotes: buildConsultationNotes(form),
      advice: form.advice,
      followUpRequired: form.followUpRequired,
    });

    if (form.medicines.length > 0) {
      await consultationService.createPrescription({
        appointmentId: Number(appointmentId),
        diagnosis,
        medicines: buildPrescriptionText(form.medicines),
        notes: form.advice,
      });
    }

    if (form.labTests.length > 0 && patient?.id) {
  await consultationService.createLabOrder({
    patientId: patient.id,
    preferredDate: new Date().toISOString().split("T")[0],
    preferredTime: "09:00",
    address: patient?.address || patient?.city || "Patient address not available",
    tests: form.labTests.map((testName) => ({
      testName,
      category: "Doctor Ordered",
      price: 0,
    })),
  });
}

    if (complete) {
      await consultationService.completeAppointment(appointmentId);
      toast.success("Consultation completed");
    } else {
      toast.success("Consultation draft saved");
    }

    navigate(`/doctor/appointment/${appointmentId}/patient-profile`);
  } catch (error) {
    console.error("Consultation save error:", error);
    toast.error(error.response?.data?.message || "Failed to save consultation");
  } finally {
    setSaving(false);
  }
};

  return {
    appointmentId,
    navigate,

    profile,
    patient,
    appointment,

    loading,
    saving,
    setSaving,

    activeStep,
    setActiveStep,

    listeningField,
    startDictation,
    stopDictation,

    showSummary,
    setShowSummary,
    completeAfterSummary,
    setCompleteAfterSummary,

    medicine,
    setMedicine,

    labInput,
    setLabInput,

    form,
    setForm,

    loadPatientProfile,
    saveConsultation,
  };
}