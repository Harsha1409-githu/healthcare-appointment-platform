export const APPOINTMENT_STATUS = {
  BOOKED: "BOOKED",
  CHECKED_IN: "CHECKED_IN",
  IN_CONSULTATION: "IN_CONSULTATION",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const APPOINTMENT_VIEW = {
  TODAY: "TODAY",
  UPCOMING: "UPCOMING",
  COMPLETED: "COMPLETED",
  CUSTOM: "CUSTOM",
};

export const STAGE_ORDER = [
  {
    key: "booked",
    title: "Waiting",
    tone: "cyan",
  },
  {
    key: "prescription",
    title: "Prescription",
    tone: "amber",
  },
  {
    key: "followUp",
    title: "Follow-up",
    tone: "violet",
  },
  {
    key: "completed",
    title: "Completed",
    tone: "emerald",
  },
  {
    key: "cancelled",
    title: "Cancelled",
    tone: "slate",
  },
];

export const QUICK_FILTERS = [
  {
    key: "TODAY",
    label: "Today",
  },
  {
    key: "UPCOMING",
    label: "Next",
  },
  {
    key: "COMPLETED",
    label: "Done",
  },
  {
    key: "CUSTOM",
    label: "Date",
  },
];