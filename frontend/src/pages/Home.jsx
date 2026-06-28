import { Navigate } from "react-router-dom";

import Hero from "../components/Hero";
import HomeSearchSuggestions from "../components/HomeSearchSuggestions";
import HomeTabs from "../components/HomeTabs";
import Testimonials from "../components/Testimonials";
import AppointmentSummaryCard from "../components/AppointmentSummaryCard";
import TryDocLogo from "../components/TryDocLogo";

export default function Home() {
  const patientToken = localStorage.getItem("patientToken");

  if (patientToken && !localStorage.getItem("selectedProfile")) {
    return <Navigate to="/patient/select-profile" replace />;
  }

  return (
    <main className="min-h-screen bg-[#f4fbff] overflow-x-hidden pb-28">
      <div className="max-w-md mx-auto px-4 pt-4">
        <TryDocLogo size={40} />
      </div>

      <Hero />

      <AppointmentSummaryCard />

      <HomeSearchSuggestions />

      <HomeTabs />

      <Testimonials />
    </main>
  );
}