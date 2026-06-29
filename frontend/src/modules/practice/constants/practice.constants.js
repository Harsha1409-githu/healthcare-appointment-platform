export const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export const TEMPLATES = [
  {
    title: "Morning Clinic",
    desc: "In-person OPD",
    startTime: "09:00",
    endTime: "13:00",
    slotType: "IN_PERSON",
  },
  {
    title: "Evening Video",
    desc: "Online consults",
    startTime: "17:00",
    endTime: "20:00",
    slotType: "VIDEO",
  },
  {
    title: "Full Day Both",
    desc: "Clinic + video",
    startTime: "09:00",
    endTime: "17:00",
    slotType: "BOTH",
  },
];

export const PAUSE_REASONS = [
  { label: "Lunch", value: "Lunch" },
  { label: "Meeting", value: "Meeting" },
  { label: "Emergency", value: "Emergency" },
  { label: "Personal", value: "Personal" },
];