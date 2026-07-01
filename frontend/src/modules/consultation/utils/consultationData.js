export const COMMON_MEDICINES = [
  "Paracetamol 500mg",
  "Dolo 650",
  "Cetirizine 10mg",
  "Azithromycin 500mg",
  "Amoxicillin 500mg",
  "Pantoprazole 40mg",
  "ORS Sachet",
  "Vitamin D3",
];

export const MASTER_MEDICINES = [
  { name: "Paracetamol 500mg", dosage: "500 mg", timing: "BD", days: "5" },
  { name: "Dolo 650", dosage: "650 mg", timing: "BD", days: "3" },
  { name: "Cetirizine 10mg", dosage: "10 mg", timing: "HS", days: "5" },
  { name: "Azithromycin 500mg", dosage: "500 mg", timing: "OD", days: "3" },
  { name: "Amoxicillin 500mg", dosage: "500 mg", timing: "TDS", days: "5" },
  { name: "Pantoprazole 40mg", dosage: "40 mg", timing: "OD", days: "7" },
  { name: "ORS Sachet", dosage: "1 Sachet", timing: "SOS", days: "3" },
  { name: "Vitamin D3", dosage: "1 Tablet", timing: "OD", days: "30" },
  { name: "Ibuprofen 400mg", dosage: "400 mg", timing: "BD", days: "3" },
  { name: "Domperidone 10mg", dosage: "10 mg", timing: "BD", days: "3" },
];

export const DIAGNOSIS_TEMPLATES = {
  "Viral Fever": {
    medicines: [
      { name: "Paracetamol 500mg", dosage: "500 mg", timing: "BD", days: "5" },
      { name: "Cetirizine 10mg", dosage: "10 mg", timing: "HS", days: "5" },
      { name: "ORS Sachet", dosage: "1 Sachet", timing: "SOS", days: "3" },
    ],
    labTests: ["CBC"],
    advice:
      "Drink plenty of fluids. Take rest. Monitor temperature. Return if fever persists beyond 3 days or symptoms worsen.",
    followUpDays: 3,
  },
  Acidity: {
    medicines: [
      { name: "Pantoprazole 40mg", dosage: "40 mg", timing: "OD", days: "7" },
    ],
    labTests: [],
    advice:
      "Avoid spicy food, tea, coffee and late-night meals. Eat small frequent meals.",
    followUpDays: 7,
  },
  Diabetes: {
    medicines: [],
    labTests: ["HbA1c", "FBS", "PPBS", "KFT", "Urine Test"],
    advice:
      "Follow diabetic diet, regular walking, medication adherence and sugar monitoring.",
    followUpDays: 30,
  },
  Hypertension: {
    medicines: [],
    labTests: ["ECG", "KFT", "Lipid Profile"],
    advice:
      "Reduce salt intake, monitor BP regularly, exercise daily and avoid stress.",
    followUpDays: 15,
  },
};

export const DOSAGES = [
  "250 mg",
  "500 mg",
  "650 mg",
  "1 Tablet",
  "2 Tablets",
  "5 ml",
  "10 ml",
];

export const TIMINGS = ["OD", "BD", "TDS", "HS", "SOS"];

export const DAYS = ["3", "5", "7", "10", "15", "30"];

export const COMMON_TESTS = [
  "CBC",
  "LFT",
  "KFT",
  "HbA1c",
  "Thyroid",
  "ECG",
  "Chest X-Ray",
  "Urine Test",
  "Lipid Profile",
  "Vitamin D",
  "MRI",
  "CT Scan",
];