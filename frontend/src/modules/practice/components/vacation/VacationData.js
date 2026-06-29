import {
  AlertTriangle,
  Briefcase,
  GraduationCap,
  HeartPulse,
  Plane,
  UserRound,
} from "lucide-react";

export const VACATION_REASONS = [
  {
    label: "Vacation",
    value: "Vacation",
    icon: Plane,
  },
  {
    label: "Sick",
    value: "Sick",
    icon: HeartPulse,
  },
  {
    label: "Conference",
    value: "Conference",
    icon: Briefcase,
  },
  {
    label: "Training",
    value: "Training",
    icon: GraduationCap,
  },
  {
    label: "Emergency",
    value: "Emergency",
    icon: AlertTriangle,
  },
  {
    label: "Personal",
    value: "Personal",
    icon: UserRound,
  },
];

export const DEFAULT_VACATION_FORM = {
  startDate: "",
  endDate: "",
  reason: "Vacation",
};