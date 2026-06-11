import {
  Search,
  ShieldCheck,
  CalendarCheck,
  HeartPulse,
  Star,
  MapPin,
  Stethoscope,
  Clock,
  ArrowRight,
  Brain,
  Video,
  FileText,
  Sparkles,
  Activity,
  Users,
  Hospital,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Hero() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const searchDoctors = () => {
    if (query.trim()) {
      navigate(
        `/doctors?specialization=${encodeURIComponent(query)}`
      );
      return;
    }

    navigate("/doctors");
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_35%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_35%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.15),transparent_35%)]" />

      <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:54px_54px]" />

      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-cyan-400/20 rounded-full blur-3xl" />
      <div className="absolute top-20 right-0 w-[620px] h-[620px] bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-[520px] h-[520px] bg-emerald-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-[1500px] mx-auto px-6 py-24 lg:py-32 grid xl:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur mb-6 shadow-xl">
            <Sparkles size={18} className="text-cyan-300" />
            <span className="text-sm font-semibold">
              AI-powered healthcare platform for patients, doctors & hospitals
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.02] tracking-tight">
            Your Health.
            <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-emerald-300 bg-clip-text text-transparent">
              Smarter. Faster.
            </span>
            <span className="block">Connected.</span>
          </h1>

          <p className="text-lg lg:text-xl text-blue-100 mt-6 max-w-2xl leading-relaxed">
            Book verified doctors, start video consultations, check symptoms
            with AI, upload medical records and access prescriptions from one
            intelligent healthcare platform.
          </p>

          <div className="mt-9 bg-white/95 backdrop-blur-xl rounded-[2rem] p-3 shadow-2xl max-w-3xl border border-white/40">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center gap-3 px-4 py-4 bg-slate-50 rounded-2xl">
                <Search className="text-slate-400" size={22} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search doctor, specialty, hospital..."
                  className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <button
                onClick={searchDoctors}
                className="group px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black shadow-lg hover:scale-[1.02] transition flex items-center justify-center gap-2"
              >
                Find Doctors
                <ArrowRight
                  size={19}
                  className="group-hover:translate-x-1 transition"
                />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-5">
            <button
              onClick={() => navigate("/doctors")}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white text-blue-700 font-black hover:bg-blue-50 transition"
            >
              <CalendarCheck size={20} />
              Book Appointment
            </button>

            <button
              onClick={() => navigate("/symptom-checker")}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-black hover:bg-white/20 transition"
            >
              <Brain size={20} className="text-cyan-300" />
              Try AI Symptom Checker
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-9 max-w-3xl">
            <MiniStat icon={Stethoscope} value="50+" label="Doctors" />
            <MiniStat icon={Users} value="500+" label="Patients" />
            <MiniStat icon={CalendarCheck} value="1K+" label="Bookings" />
            <MiniStat icon={Star} value="4.9" label="Rating" />
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-8 max-w-3xl">
            <TrustCard
              icon={ShieldCheck}
              title="Verified"
              desc="Doctors"
              color="text-emerald-300"
            />

            <TrustCard
              icon={Video}
              title="Video"
              desc="Consultations"
              color="text-cyan-300"
            />

            <TrustCard
              icon={FileText}
              title="Digital"
              desc="Health Records"
              color="text-pink-300"
            />
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-3xl rounded-full" />

          <div className="relative grid gap-5">
            <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-5 shadow-2xl">
              <div className="bg-white rounded-[1.7rem] p-6 text-slate-900 shadow-xl">
                <div className="flex items-center justify-between gap-5">
                  <div>
                    <p className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      <Activity size={14} />
                      Available Today
                    </p>

                    <h2 className="text-3xl font-black mt-4">
                      Dr. Ravi Kumar
                    </h2>

                    <p className="text-blue-600 font-bold">
                      Cardiologist
                    </p>
                  </div>

                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow-xl">
                    <Stethoscope className="text-white" size={38} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-6">
                  <Metric value="12+" label="Years" />
                  <Metric value="4.9" label="Rating" />
                  <Metric value="₹800" label="Fee" />
                </div>

                <div className="mt-6 space-y-3">
                  <InfoRow
                    icon={Hospital}
                    color="text-blue-600"
                    bg="bg-blue-50"
                    text="Apollo Hospital, Chennai"
                  />

                  <InfoRow
                    icon={Clock}
                    color="text-emerald-600"
                    bg="bg-emerald-50"
                    text="Next slot: Today, 10:30 AM"
                  />

                  <InfoRow
                    icon={Star}
                    color="text-yellow-500 fill-yellow-500"
                    bg="bg-yellow-50"
                    text="500+ successful consultations"
                  />
                </div>

                <button
                  onClick={() => navigate("/doctors")}
                  className="mt-6 w-full py-4 rounded-2xl bg-slate-950 text-white font-black hover:bg-blue-700 transition"
                >
                  Book Appointment
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <FloatingCard
                icon={Brain}
                title="AI Symptom Checker"
                desc="Find the right specialist instantly"
                action={() => navigate("/symptom-checker")}
              />

              <FloatingCard
                icon={FileText}
                title="Medical Records"
                desc="Upload reports & prescriptions"
                action={() => navigate("/patient/medical-records")}
              />
            </div>
          </div>

          <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 rounded-3xl p-5 shadow-2xl hidden md:block border border-slate-100">
            <p className="text-sm text-slate-500">Appointments</p>
            <p className="text-3xl font-black">1,250+</p>
            <p className="text-xs text-emerald-600 font-bold">
              Successfully booked
            </p>
          </div>

          <div className="absolute -top-6 -right-6 bg-white text-slate-900 rounded-3xl p-5 shadow-2xl hidden lg:block border border-slate-100">
            <p className="text-sm text-slate-500">Live doctors</p>
            <p className="text-3xl font-black">24/7</p>
            <p className="text-xs text-blue-600 font-bold">
              Online consultation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ icon: Icon, value, label }) {
  return (
    <div className="bg-white/10 border border-white/10 backdrop-blur rounded-2xl p-4">
      <Icon className="text-cyan-300 mb-3" size={22} />
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs text-blue-100">{label}</p>
    </div>
  );
}

function TrustCard({ icon: Icon, title, desc, color }) {
  return (
    <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur">
      <Icon className={color} />
      <div>
        <p className="font-black">{title}</p>
        <p className="text-xs text-blue-100">{desc}</p>
      </div>
    </div>
  );
}

function Metric({ value, label }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-4 text-center">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function InfoRow({ icon: Icon, color, bg, text }) {
  return (
    <div className={`flex items-center gap-3 p-4 ${bg} rounded-2xl`}>
      <Icon className={color} />
      <span className="font-bold">{text}</span>
    </div>
  );
}

function FloatingCard({ icon: Icon, title, desc, action }) {
  return (
    <button
      onClick={action}
      className="text-left bg-white/10 border border-white/20 backdrop-blur-xl rounded-[1.5rem] p-5 hover:bg-white/20 transition"
    >
      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
        <Icon className="text-cyan-300" size={25} />
      </div>

      <h3 className="font-black text-lg">{title}</h3>
      <p className="text-sm text-blue-100 mt-1">{desc}</p>
    </button>
  );
}