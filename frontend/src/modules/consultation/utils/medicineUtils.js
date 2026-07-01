import { DRUG_FAMILIES } from "./drugFamilies";
import { DRUG_INTERACTIONS } from "./drugInteractions";

const normalize = (value = "") => value.toLowerCase().trim();

export function checkMedicationSafety({ medicineName, form, patient }) {
  const name = normalize(medicineName);

  if (!name) return [];

  const alerts = [];

  const existingMedicines = form?.medicines || [];
  const allergies = normalize(patient?.allergies || patient?.allergy || "");
  const currentMedicines = normalize(
    patient?.currentMedicines || patient?.medications || ""
  );

  const duplicate = existingMedicines.some((item) =>
    normalize(item.name).includes(name)
  );

  if (duplicate) {
    alerts.push({
      type: "duplicate",
      severity: "warning",
      title: "Duplicate Medicine",
      message: "This medicine is already added.",
    });
  }

  Object.entries(DRUG_FAMILIES).forEach(([family, drugs]) => {
    const medicineInFamily = drugs.some((drug) => name.includes(drug));
    const allergyMatches = allergies.includes(family);

    if (medicineInFamily && allergyMatches) {
      alerts.push({
        type: "allergy",
        severity: "danger",
        title: "Allergy Alert",
        message: `Patient has ${family} allergy. Please review before prescribing.`,
      });
    }
  });

  if (currentMedicines && currentMedicines.includes(name)) {
    alerts.push({
      type: "current",
      severity: "warning",
      title: "Already Taking",
      message: "Patient may already be taking this medicine. Verify dosage.",
    });
  }

  DRUG_INTERACTIONS.forEach((item) => {
    const a = normalize(item.a);
    const b = normalize(item.b);

    const selectedMatchesA = name.includes(a);
    const selectedMatchesB = name.includes(b);

    const currentHasA = currentMedicines.includes(a);
    const currentHasB = currentMedicines.includes(b);

    const formHasA = existingMedicines.some((m) =>
      normalize(m.name).includes(a)
    );

    const formHasB = existingMedicines.some((m) =>
      normalize(m.name).includes(b)
    );

    if (
      (selectedMatchesA && (currentHasB || formHasB)) ||
      (selectedMatchesB && (currentHasA || formHasA))
    ) {
      alerts.push({
        type: "interaction",
        severity: item.severity,
        title: "Drug Interaction",
        message: item.message,
      });
    }
  });

  return alerts;
}