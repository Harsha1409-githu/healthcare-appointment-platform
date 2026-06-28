export function buildPrescriptionText(medicines = []) {
  return medicines
    .map(
      (m) =>
        `${m.name} - ${m.dosage || "-"} - ${m.timing || "-"} - ${
          m.days || "-"
        } days`
    )
    .join("\n");
}

export function buildConsultationNotes(form) {
  return `
Symptoms:
${form.symptoms || "-"}

Vitals:
BP: ${form.vitals.bp || "-"}
Pulse: ${form.vitals.pulse || "-"}
Temperature: ${form.vitals.temperature || "-"}
Weight: ${form.vitals.weight || "-"}

Medicines:
${buildPrescriptionText(form.medicines) || "-"}

Lab Tests:
${form.labTests.length ? form.labTests.join(", ") : "-"}
`;
}