import {
  ClipboardList,
  FlaskConical,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Syringe,
} from "lucide-react";

export const recommendationConfig = {
  LAB_TEST: {
    icon: FlaskConical,
    title: "Doctor Recommended Lab Tests",
    action: "Book Tests",
    route: "/patient/lab-tests",
  },

  RADIOLOGY: {
    icon: ClipboardList,
    title: "Doctor Recommended Scans",
    action: "Book Scan",
    route: "/patient/radiology",
  },

  SPECIALIST: {
    icon: Stethoscope,
    title: "Doctor Referral",
    action: "Book Doctor",
    route: "/doctors",
  },

  VACCINATION: {
    icon: Syringe,
    title: "Doctor Recommended Vaccination",
    action: "Book Vaccine",
    route: "/patient/vaccinations",
  },

  PHYSIOTHERAPY: {
    icon: HeartPulse,
    title: "Physiotherapy Recommendation",
    action: "Book Session",
    route: "/patient/physiotherapy",
  },

  CUSTOM: {
    icon: ShieldCheck,
    title: "Doctor Recommendation",
    action: "View",
    route: "#",
  },
};

export function getRecommendationConfig(service) {
  return recommendationConfig[service] || recommendationConfig.CUSTOM;
}
