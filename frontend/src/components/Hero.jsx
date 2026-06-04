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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white">
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32 grid lg:grid-cols-2 gap-14 items-center">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur mb-6">
            <HeartPulse size={18} className="text-cyan-300" />
            <span className="text-sm font-medium">
              Trusted healthcare at your fingertips
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
            Book the right doctor,
            <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-emerald-300 bg-clip-text text-transparent">
              at the right time.
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-blue-100 mt-6 max-w-2xl leading-relaxed">
            Discover verified doctors, compare specialties, book appointments,
            make secure payments, and access digital prescriptions from one
            beautiful healthcare platform.
          </p>

          {/* Search Box */}
          <div className="mt-9 bg-white/95 backdrop-blur-xl rounded-3xl p-3 shadow-2xl max-w-2xl">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center gap-3 px-4 py-4 bg-slate-50 rounded-2xl">
                <Search className="text-slate-400" size={22} />
                <input
                  type="text"
                  placeholder="Search doctor, specialty, hospital..."
                  className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <button
                onClick={() => navigate("/doctors")}
                className="group px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg hover:scale-[1.02] transition flex items-center justify-center gap-2"
              >
                Find Doctors
                <ArrowRight
                  size={19}
                  className="group-hover:translate-x-1 transition"
                />
              </button>
            </div>
          </div>

          {/* Trust Points */}
          <div className="grid sm:grid-cols-3 gap-4 mt-8 max-w-2xl">
            <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <ShieldCheck className="text-emerald-300" />
              <div>
                <p className="font-bold">Verified</p>
                <p className="text-xs text-blue-100">Doctors</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <CalendarCheck className="text-cyan-300" />
              <div>
                <p className="font-bold">Instant</p>
                <p className="text-xs text-blue-100">Booking</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <HeartPulse className="text-pink-300" />
              <div>
                <p className="font-bold">Digital</p>
                <p className="text-xs text-blue-100">Prescriptions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-3xl rounded-full" />

          <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-6 shadow-2xl">
            <div className="bg-white rounded-[1.5rem] p-6 text-slate-900 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Available Today
                  </p>
                  <h2 className="text-2xl font-black">
                    Dr. Ravi Kumar
                  </h2>
                  <p className="text-blue-600 font-semibold">
                    Cardiologist
                  </p>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center">
                  <Stethoscope className="text-white" size={30} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-slate-50 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-black">12+</p>
                  <p className="text-xs text-slate-500">Years</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-black">4.9</p>
                  <p className="text-xs text-slate-500">Rating</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-black">₹800</p>
                  <p className="text-xs text-slate-500">Fee</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
                  <MapPin className="text-blue-600" />
                  <span className="font-medium">
                    Apollo Hospital, Chennai
                  </span>
                </div>

                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl">
                  <Clock className="text-emerald-600" />
                  <span className="font-medium">
                    Next slot: Today, 10:30 AM
                  </span>
                </div>

                <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-2xl">
                  <Star className="text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">
                    500+ successful consultations
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/doctors")}
                className="mt-6 w-full py-4 rounded-2xl bg-slate-950 text-white font-bold hover:bg-blue-700 transition"
              >
                Book Appointment
              </button>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 rounded-3xl p-5 shadow-2xl hidden md:block">
            <p className="text-sm text-slate-500">Appointments</p>
            <p className="text-3xl font-black">1,250+</p>
            <p className="text-xs text-emerald-600 font-semibold">
              Successfully booked
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}