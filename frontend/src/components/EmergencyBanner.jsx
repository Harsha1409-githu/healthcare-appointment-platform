import {
  Ambulance,
  Phone,
  Video,
  ArrowRight,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmergencyBanner() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1450px] mx-auto px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-red-50 via-white to-rose-50 border border-red-100 shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-100/60 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-rose-100/70 rounded-full blur-3xl" />

          <div className="relative p-8 md:p-12 lg:p-14 grid lg:grid-cols-[1fr_0.9fr] gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 mb-5">
                <Ambulance size={18} />
                <span className="font-black">
                  Emergency Medical Support
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black leading-tight text-slate-950">
                Need immediate medical help?
              </h2>

              <p className="text-slate-600 text-lg mt-5 max-w-2xl leading-relaxed">
                Quickly connect with available doctors, start a video
                consultation, or find the right specialist during urgent
                medical situations.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 mt-8 max-w-2xl">
                <InfoBadge
                  icon={Clock}
                  title="24/7"
                  desc="Support"
                />
                <InfoBadge
                  icon={ShieldCheck}
                  title="Verified"
                  desc="Doctors"
                />
                <InfoBadge
                  icon={Ambulance}
                  title="Fast"
                  desc="Assistance"
                />
              </div>

              <button
                onClick={() => navigate("/doctors")}
                className="mt-9 inline-flex items-center gap-2 bg-red-600 text-white px-7 py-4 rounded-2xl font-black hover:bg-red-700 transition shadow-lg"
              >
                Get Emergency Help
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <EmergencyCard
                icon={Video}
                title="Video Consultation"
                desc="Talk to an available doctor quickly."
                onClick={() => navigate("/doctors")}
              />

              <EmergencyCard
                icon={Phone}
                title="Find Doctor"
                desc="Locate nearby specialists and hospitals."
                onClick={() => navigate("/doctors")}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EmergencyCard({ icon: Icon, title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-3xl p-6 border border-red-100 shadow-lg hover:-translate-y-1 hover:shadow-xl transition"
    >
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
        <Icon size={30} className="text-red-600" />
      </div>

      <h3 className="font-black text-xl text-slate-950">
        {title}
      </h3>

      <p className="text-slate-500 mt-2 leading-relaxed">
        {desc}
      </p>

      <div className="mt-5 inline-flex items-center gap-2 text-red-600 font-black">
        Continue
        <ArrowRight size={17} />
      </div>
    </button>
  );
}

function InfoBadge({ icon: Icon, title, desc }) {
  return (
    <div className="bg-white border border-red-100 rounded-2xl p-4 shadow-sm">
      <Icon className="text-red-600 mb-3" size={22} />
      <p className="text-xl font-black text-slate-950">{title}</p>
      <p className="text-xs text-slate-500 font-semibold">{desc}</p>
    </div>
  );
}