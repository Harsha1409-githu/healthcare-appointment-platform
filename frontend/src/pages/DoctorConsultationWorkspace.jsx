import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ClipboardList,
  FlaskConical,
  Loader2,
  Pill,
  Stethoscope,
} from "lucide-react";
import toast from "react-hot-toast";

import PatientSnapshot from "../doctor/consultation/PatientSnapshot";
import PatientTimeline from "../doctor/consultation/PatientTimeline";
import SoapNotes from "../doctor/consultation/SoapNotes";
import VitalsCard from "../doctor/consultation/VitalsCard";
import MedicineEditor from "../doctor/consultation/MedicineEditor";
import LabTestsCard from "../doctor/consultation/LabTestsCard";
import AdviceFollowUpCard from "../doctor/consultation/AdviceFollowUpCard";
import ConsultationSummary from "../doctor/consultation/ConsultationSummary";
import StepCard from "../doctor/consultation/StepCard";
import NextButton from "../doctor/consultation/NextButton";
import ConsultationActions from "../doctor/consultation/ConsultationActions";
import ConsultationHeader from "../doctor/consultation/ConsultationHeader";
import DiagnosisTemplatesCard from "../doctor/consultation/DiagnosisTemplatesCard";

import {
  getPatientProfile,
  saveConsultationNote,
  createPrescription,
  createFollowUp,
  completeAppointment,
} from "../doctor/consultation/consultationApi";

import {
  COMMON_MEDICINES,
  MASTER_MEDICINES,
  DIAGNOSIS_TEMPLATES,
  DOSAGES,
  TIMINGS,
  DAYS,
  COMMON_TESTS,
} from "../doctor/consultation/consultationData";

import {
  buildPrescriptionText,
  buildConsultationNotes,
} from "../doctor/consultation/consultationHelpers";

import { getDoctorIdFromAppointment } from "../doctor/consultation/doctorConsultationUtils";

export default function DoctorConsultationWorkspace() {
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
    vitals: {
      bp: "",
      pulse: "",
      temperature: "",
      weight: "",
    },
    medicines: [],
    labTests: [],
    advice: "",
    followUpRequired: false,
    followUpDate: "",
  });

  useEffect(() => {
    loadPatientProfile();
  }, [appointmentId]);

  const loadPatientProfile = async () => {
    try {
      setLoading(true);
      const data = await getPatientProfile(appointmentId);
      setProfile(data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load consultation");
    } finally {
      setLoading(false);
    }
  };

  const patient = profile?.patient;
  const appointment = profile?.appointment;

  const progressItems = [
    { label: "Patient", done: Boolean(patient?.id) },
    { label: "Symptoms", done: Boolean(form.symptoms.trim()) },
    { label: "Diagnosis", done: Boolean(form.diagnosis.trim()) },
    { label: "Medicine", done: form.medicines.length > 0 },
    { label: "Advice", done: Boolean(form.advice.trim()) },
  ];

  const medicineSuggestions = useMemo(() => {
    if (!medicine.name.trim()) return [];

    return MASTER_MEDICINES.filter((item) =>
      item.name.toLowerCase().includes(medicine.name.toLowerCase().trim())
    ).slice(0, 6);
  }, [medicine.name]);

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

  const applyDiagnosisTemplate = (diagnosis) => {
    const template = DIAGNOSIS_TEMPLATES[diagnosis];
    if (!template) return;

    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + template.followUpDays);

    setForm((prev) => {
      const existingMedicineNames = new Set(
        prev.medicines.map((item) => item.name)
      );

      const newMedicines = template.medicines.filter(
        (item) => !existingMedicineNames.has(item.name)
      );

      return {
        ...prev,
        diagnosis,
        medicines: [...prev.medicines, ...newMedicines],
        labTests: Array.from(new Set([...prev.labTests, ...template.labTests])),
        advice: prev.advice || template.advice,
        followUpRequired: true,
        followUpDate: followUpDate.toISOString().split("T")[0],
      };
    });

    toast.success(`${diagnosis} template added`);
  };

  const copyMedicines = (prescription) => {
    if (!prescription?.medicines) return;

    const medicines = prescription.medicines
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const parts = line.split("-");

        return {
          name: parts[0]?.trim() || "",
          dosage: parts[1]?.trim() || "",
          timing: parts[2]?.trim() || "",
          days: parts[3]?.replace("days", "").trim() || "",
        };
      })
      .filter((item) => item.name);

    setForm((prev) => ({
      ...prev,
      medicines,
    }));

    setActiveStep("medicines");
  };

  const copyFullPrescription = (prescription) => {
    copyMedicines(prescription);

    setForm((prev) => ({
      ...prev,
      diagnosis: prescription.diagnosis || prev.diagnosis,
      advice: prescription.notes || prev.advice,
    }));

    setActiveStep("medicines");
  };

  const saveConsultation = async (complete = false) => {
    if (!form.diagnosis.trim()) {
      toast.error("Diagnosis is required");
      setActiveStep("clinical");
      return;
    }

    try {
      setSaving(true);

      await saveConsultationNote({
        appointmentId,
        diagnosis: form.diagnosis,
        symptoms: form.symptoms,
        doctorNotes: buildConsultationNotes(form),
        advice: form.advice,
        followUpRequired: form.followUpRequired,
      });

      if (form.medicines.length > 0) {
        await createPrescription({
          appointmentId,
          diagnosis: form.diagnosis,
          medicines: buildPrescriptionText(form.medicines),
          notes: form.advice,
        });
      }

      if (form.followUpRequired && form.followUpDate) {
        const doctorId = getDoctorIdFromAppointment(appointment);

        if (!doctorId || !patient?.id) {
          toast.error("Consultation saved, but follow-up could not be created");
        } else {
          await createFollowUp({
            appointmentId,
            doctorId,
            patientId: patient.id,
            followUpDate: form.followUpDate,
            notes: form.advice || "Follow-up after consultation",
          });
        }
      }

      if (complete) {
        await completeAppointment(appointmentId);
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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8fb]">
        <Loader2 className="animate-spin text-cyan-600" size={36} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-md px-3 pt-3">
       <ConsultationHeader
  appointment={appointment}
  progressItems={progressItems}
  onBack={() => navigate(-1)}
/>

        <PatientSnapshot
  patient={patient}
  appointment={appointment}
  open={activeStep === "snapshot"}
  onToggle={() =>
    setActiveStep(activeStep === "snapshot" ? "" : "snapshot")
  }
/>

   <PatientTimeline
  profile={profile}
  open={activeStep === "timeline"}
  onToggle={() =>
    setActiveStep(activeStep === "timeline" ? "" : "timeline")
  }
  onRepeatMedicines={copyMedicines}
  onRepeatFullPrescription={copyFullPrescription}
/>

        <StepCard
          id="clinical"
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          done={Boolean(form.symptoms.trim() && form.diagnosis.trim())}
          icon={Stethoscope}
          title="1. Clinical Notes"
        >
          <div className="space-y-3">
            <SoapNotes
              form={form}
              setForm={setForm}
              listeningField={listeningField}
              startDictation={startDictation}
              stopDictation={stopDictation}
            />

            <DiagnosisTemplatesCard
              diagnosisTemplates={DIAGNOSIS_TEMPLATES}
              selectedDiagnosis={form.diagnosis}
              onApply={applyDiagnosisTemplate}
            />

            <NextButton onClick={() => setActiveStep("vitals")} />
          </div>
        </StepCard>

        <StepCard
          id="vitals"
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          done={Boolean(
            form.vitals.bp ||
              form.vitals.pulse ||
              form.vitals.temperature ||
              form.vitals.weight
          )}
          icon={ClipboardList}
          title="2. Vitals"
        >
          <VitalsCard form={form} setForm={setForm} />

          <NextButton onClick={() => setActiveStep("medicines")} />
        </StepCard>

        <StepCard
          id="medicines"
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          done={form.medicines.length > 0}
          icon={Pill}
          title="3. Medicines"
        >
          <div className="space-y-3">
            <MedicineEditor
  medicine={medicine}
  setMedicine={setMedicine}
  form={form}
  setForm={setForm}
  patient={patient}
  commonMedicines={COMMON_MEDICINES}
  medicineSuggestions={medicineSuggestions}
  dosages={DOSAGES}
  timings={TIMINGS}
  days={DAYS}
/>

            <NextButton onClick={() => setActiveStep("labs")} />
          </div>
        </StepCard>

        <StepCard
          id="labs"
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          done={form.labTests.length > 0}
          icon={FlaskConical}
          title="4. Lab Tests"
        >
          <LabTestsCard
            form={form}
            setForm={setForm}
            labInput={labInput}
            setLabInput={setLabInput}
            commonTests={COMMON_TESTS}
          />

          <NextButton onClick={() => setActiveStep("advice")} />
        </StepCard>

        <StepCard
          id="advice"
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          done={Boolean(form.advice.trim())}
          icon={CalendarDays}
          title="5. Advice & Follow-up"
        >
          <AdviceFollowUpCard
            form={form}
            setForm={setForm}
            listeningField={listeningField}
            startDictation={startDictation}
            stopDictation={stopDictation}
          />
        </StepCard>
      </div>

      <ConsultationActions
        saving={saving}
        onSaveDraft={() => {
          setCompleteAfterSummary(false);
          setShowSummary(true);
        }}
        onComplete={() => {
          setCompleteAfterSummary(true);
          setShowSummary(true);
        }}
      />

      {showSummary && (
        <ConsultationSummary
          form={form}
          patient={patient}
          complete={completeAfterSummary}
          saving={saving}
          onClose={() => setShowSummary(false)}
          onConfirm={() => {
            setShowSummary(false);
            saveConsultation(completeAfterSummary);
          }}
        />
      )}
    </main>
  );
}