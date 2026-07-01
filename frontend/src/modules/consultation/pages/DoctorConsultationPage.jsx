import {
  CalendarDays,
  ClipboardList,
  FlaskConical,
  Loader2,
  Pill,
  Stethoscope,
} from "lucide-react";

import {
  AdviceFollowUpCard,
  ConsultationActions,
  ConsultationHeader,
  ConsultationSummary,
  DiagnosisTemplatesCard,
  LabTestsCard,
  MedicineEditor,
  NextButton,
  PatientSnapshot,
  PatientTimeline,
  SoapNotes,
  StepCard,
  VitalsCard,
} from "@/modules/consultation/components";

import {
  COMMON_MEDICINES,
  COMMON_TESTS,
  DAYS,
  DIAGNOSIS_TEMPLATES,
  DOSAGES,
  MASTER_MEDICINES,
  TIMINGS,
} from "@/modules/consultation/utils";

import { useConsultation } from "@/modules/consultation/hooks";

export default function DoctorConsultationPage() {
  const {
    navigate,
    profile,
    patient,
    appointment,
    loading,
    saving,

    activeStep,
    setActiveStep,

    listeningField,
    startDictation,
    stopDictation,

    medicine,
    setMedicine,

    labInput,
    setLabInput,

    form,
    setForm,

    showSummary,
    setShowSummary,
    completeAfterSummary,
    setCompleteAfterSummary,
    saveConsultation,
  } = useConsultation();

  const progressItems = [
    { label: "Patient", done: Boolean(patient?.id) },
    { label: "Symptoms", done: Boolean(form.symptoms?.trim() || form.subjective?.trim()) },
    { label: "Diagnosis", done: Boolean(form.diagnosis?.trim() || form.assessment?.trim()) },
    { label: "Medicine", done: form.medicines.length > 0 },
    { label: "Advice", done: Boolean(form.advice?.trim()) },
  ];

  const medicineSuggestions = medicine.name?.trim()
    ? MASTER_MEDICINES.filter((item) =>
        item.name
          .toLowerCase()
          .includes(medicine.name.toLowerCase().trim())
      ).slice(0, 6)
    : [];

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
        assessment: diagnosis,
        medicines: [...prev.medicines, ...newMedicines],
        labTests: Array.from(new Set([...prev.labTests, ...template.labTests])),
        advice: prev.advice || template.advice,
        followUpRequired: true,
        followUpDate: followUpDate.toISOString().split("T")[0],
      };
    });
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
      assessment: prescription.diagnosis || prev.assessment,
      advice: prescription.notes || prev.advice,
    }));

    setActiveStep("medicines");
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
          done={Boolean(
            form.symptoms?.trim() ||
              form.subjective?.trim() ||
              form.diagnosis?.trim() ||
              form.assessment?.trim()
          )}
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
              selectedDiagnosis={form.diagnosis || form.assessment}
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
          done={Boolean(form.advice?.trim())}
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