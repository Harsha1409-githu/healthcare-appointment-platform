import {
  Ambulance,
  Phone,
  Video,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmergencyBanner() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-10 md:p-14">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-5">
                <Ambulance size={18} />
                <span className="font-bold">
                  Emergency Medical Support
                </span>
              </div>

              <h2 className="text-5xl font-black leading-tight">
                Need Immediate Medical Help?
              </h2>

              <p className="text-red-100 text-lg mt-5 max-w-2xl">
                Connect with doctors instantly, start a video
                consultation or find the nearest available
                specialist during emergencies.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <button
                onClick={() => navigate("/doctors")}
                className="bg-white text-red-600 rounded-3xl p-6 text-left shadow-xl hover:scale-105 transition"
              >
                <Video size={34} />
                <h3 className="font-black text-xl mt-4">
                  Video Consultation
                </h3>
                <p className="text-slate-600 mt-2">
                  Talk to a doctor immediately.
                </p>
              </button>

              <button
                onClick={() => navigate("/doctors")}
                className="bg-white text-red-600 rounded-3xl p-6 text-left shadow-xl hover:scale-105 transition"
              >
                <Phone size={34} />
                <h3 className="font-black text-xl mt-4">
                  Find Doctor
                </h3>
                <p className="text-slate-600 mt-2">
                  Locate available specialists.
                </p>
              </button>
            </div>
          </div>

          <button
            onClick={() => navigate("/doctors")}
            className="mt-10 flex items-center gap-2 bg-white text-red-600 px-7 py-4 rounded-2xl font-black hover:bg-red-50 transition"
          >
            Get Emergency Help
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}