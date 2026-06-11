import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Specialties from "../components/Specialties";
import FeaturedDoctors from "../components/FeaturedDoctors";
import AIHealthAssistant from "../components/AIHealthAssistant";
import HomeFeatures from "../components/HomeFeatures";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import FeaturedHospitals from "../components/FeaturedHospitals";
import EmergencyBanner from "../components/EmergencyBanner";
import Footer from "../components/Footer";
import HomeLabTests from "../components/HomeLabTests";

export default function Home() {
  return (
    <main className="overflow-hidden bg-white">
      <Hero />
      <AIHealthAssistant />
      <Stats />
      <HomeFeatures />
      <HomeLabTests />
      <Specialties />
      <FeaturedDoctors />
      <HowItWorks />
      <Testimonials />
      <FeaturedHospitals />
      <EmergencyBanner />
      <section className="py-20 px-6">
  <div className="max-w-7xl mx-auto">
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-10 md:p-14 text-white">
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />

      <div className="relative grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-bold mb-5">
            📱 MediCare Mobile App
          </span>

          <h2 className="text-4xl md:text-5xl font-black leading-tight">
            Healthcare in Your Pocket
          </h2>

          <p className="text-blue-100 text-lg mt-5 max-w-xl">
            Book appointments, consult doctors online, access
            prescriptions, manage medicine reminders and track your
            health anytime, anywhere.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
              🩺 Book Doctor Appointments
            </div>

            <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
              🎥 Video Consultations
            </div>

            <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
              💊 Medicine Reminders
            </div>

            <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
              🤖 AI Health Insights
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-8">
            <button className="bg-black text-white px-6 py-4 rounded-2xl font-bold hover:scale-105 transition">
              🍎 Download for iPhone
            </button>

            <button className="bg-green-600 text-white px-6 py-4 rounded-2xl font-bold hover:scale-105 transition">
              ▶ Download for Android
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="bg-white rounded-[2rem] p-4 shadow-2xl">
            <img
              src="https://placehold.co/320x650"
              alt="MediCare Mobile App"
              className="rounded-[1.5rem]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
      <Footer />
    </main>
  );
}