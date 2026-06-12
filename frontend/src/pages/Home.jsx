import Hero from "../components/Hero";
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

      <HomeFeatures />

      <Specialties />

      <AIHealthAssistant />

      <FeaturedHospitals />

      <HowItWorks />

      <Testimonials />

      <DownloadApp />

      <Footer />
    </main>
  );
}

function DownloadApp() {
  return (
    <section className="py-20 bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 md:p-12 lg:p-14">
          <div>
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-5">
              DOWNLOAD THE MEDICARE APP
            </span>

            <h2 className="text-4xl md:text-5xl font-black text-slate-950 leading-tight">
              Healthcare at your fingertips
            </h2>

            <p className="text-slate-600 text-lg mt-5 leading-relaxed max-w-2xl">
              Book appointments, consult doctors online, access prescriptions,
              manage medicine reminders and track your health anytime.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              <AppFeature icon="🩺" title="Doctor Consultations" />
              <AppFeature icon="🎥" title="Video Consult" />
              <AppFeature icon="💊" title="Medicine Reminders" />
              <AppFeature icon="🤖" title="AI Health Insights" />
            </div>

            <div className="flex flex-wrap gap-4 mt-10">
              <button className="bg-slate-950 text-white px-6 py-4 rounded-2xl font-black hover:bg-cyan-700 transition">
                 App Store
              </button>

              <button className="bg-slate-950 text-white px-6 py-4 rounded-2xl font-black hover:bg-cyan-700 transition">
                ▶ Google Play
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="w-[290px] h-[600px] bg-slate-950 rounded-[3rem] p-3 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  <div className="bg-cyan-600 text-white p-6">
                    <h3 className="text-2xl font-black">
                      MediCare
                    </h3>

                    <p className="text-cyan-100 mt-2">
                      Your Health Companion
                    </p>
                  </div>

                  <div className="p-5 space-y-4">
                    <PhoneCard title="Book Appointment" bg="bg-cyan-50" />
                    <PhoneCard title="Video Consultation" bg="bg-green-50" />
                    <PhoneCard title="Medicine Reminder" bg="bg-purple-50" />
                    <PhoneCard title="AI Health Insights" bg="bg-orange-50" />
                  </div>
                </div>
              </div>

              <div className="absolute -right-8 top-24 bg-white shadow-xl rounded-2xl px-4 py-3 border border-slate-100">
                ⭐ 4.9 Rating
              </div>

              <div className="absolute -left-10 bottom-24 bg-white shadow-xl rounded-2xl px-4 py-3 border border-slate-100">
                👨‍⚕️ 500+ Doctors
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AppFeature({ icon, title }) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-100">
      <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <span className="font-bold text-slate-800">{title}</span>
    </div>
  );
}

function PhoneCard({ title, bg }) {
  return (
    <div className={`${bg} rounded-2xl p-4 border border-slate-100`}>
      <p className="font-black text-slate-800">{title}</p>
      <p className="text-xs text-slate-500 mt-1">
        Available in MediCare app
      </p>
    </div>
  );
}