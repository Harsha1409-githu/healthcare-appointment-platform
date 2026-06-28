import {
  Stethoscope,
  Building2,
  UsersRound,
  CalendarCheck,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Clock,
  Activity,
  HeartPulse,
  ArrowRight,
} from "lucide-react";

export default function Stats() {
  const stats = [
    {
      title: "Verified Doctors",
      value: "100+",
      desc: "Experienced specialists across cardiology, pediatrics, neurology and more.",
      icon: Stethoscope,
      gradient: "from-cyan-600 to-blue-500",
      bg: "bg-cyan-50",
      progress: 86,
    },
    {
      title: "Partner Hospitals",
      value: "20+",
      desc: "Trusted hospitals and clinics connected through the TryDoc network.",
      icon: Building2,
      gradient: "from-emerald-600 to-teal-500",
      bg: "bg-emerald-50",
      progress: 78,
    },
    {
      title: "Happy Patients",
      value: "5000+",
      desc: "Patients managing appointments, prescriptions and health records digitally.",
      icon: UsersRound,
      gradient: "from-purple-600 to-fuchsia-500",
      bg: "bg-purple-50",
      progress: 92,
    },
    {
      title: "Appointments",
      value: "10000+",
      desc: "Successful consultations booked across online and in-clinic visits.",
      icon: CalendarCheck,
      gradient: "from-orange-500 to-amber-500",
      bg: "bg-orange-50",
      progress: 95,
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-cyan-50/60 via-white to-slate-50">
      <div className="absolute top-10 left-10 w-80 h-80 bg-cyan-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-end mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black border border-cyan-100 mb-5">
              <Sparkles size={18} />
              Trusted Healthcare Network
            </div>

            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-950 leading-tight">
              Healthcare impact
              <span className="block text-cyan-600">
                you can trust
              </span>
            </h2>
          </div>

          <p className="text-slate-500 text-lg leading-relaxed">
            TryDoc connects patients, doctors, hospitals, prescriptions,
            lab tests and digital health records into one seamless healthcare
            experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="group relative">
                <div
                  className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r ${item.gradient} opacity-0 blur group-hover:opacity-50 transition duration-500`}
                />

                <div className="relative h-full bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm overflow-hidden group-hover:-translate-y-2 group-hover:shadow-2xl transition duration-500">
                  <div
                    className={`absolute -right-10 -top-10 w-32 h-32 ${item.bg} rounded-full`}
                  />

                  <div className="relative flex items-center justify-between mb-8">
                    <div
                      className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-[-6deg] transition duration-500`}
                    >
                      <Icon className="text-white" size={30} />
                    </div>

                    <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full text-xs font-black">
                      <TrendingUp size={14} />
                      Growing
                    </div>
                  </div>

                  <h3 className="text-5xl font-black tracking-tight text-slate-950">
                    {item.value}
                  </h3>

                  <p className="mt-2 text-lg font-black text-slate-800">
                    {item.title}
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    {item.desc}
                  </p>

                  <div className="mt-6">
                    <div className="flex justify-between text-xs font-black text-slate-400 mb-2">
                      <span>Platform Growth</span>
                      <span>{item.progress}%</span>
                    </div>

                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${item.gradient} group-hover:w-full transition-all duration-700`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 grid lg:grid-cols-[1fr_420px] gap-7">
          <div className="relative overflow-hidden bg-slate-950 rounded-[2rem] p-8 md:p-10 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-cyan-100 font-black text-sm mb-6">
                <HeartPulse size={17} />
                Complete Healthcare Platform
              </div>

              <h3 className="text-2xl md:text-4xl font-black leading-tight">
                One platform for appointments, prescriptions, records and care
                coordination.
              </h3>

              <p className="text-slate-300 mt-4 max-w-3xl leading-relaxed">
                From doctor discovery and appointment booking to video
                consultations, prescriptions and hospital management — every
                workflow stays connected.
              </p>

              <div className="flex flex-wrap gap-3 mt-7">
                <FeaturePill icon={ShieldCheck} text="Verified providers" />
                <FeaturePill icon={Clock} text="Fast booking" />
                <FeaturePill icon={Activity} text="Health tracking" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-7">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center">
                <CalendarCheck className="text-cyan-600" size={28} />
              </div>

              <div>
                <p className="text-sm text-slate-500 font-bold">
                  Average booking time
                </p>

                <p className="text-4xl font-black text-slate-950">
                  &lt; 2 mins
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <MiniMetric label="Doctor discovery" value="Instant" />
              <MiniMetric label="Slot confirmation" value="Real-time" />
              <MiniMetric label="Prescription access" value="Digital" />
            </div>

            <button className="mt-7 w-full inline-flex items-center justify-center gap-2 bg-cyan-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-cyan-700 transition">
              Explore TryDoc
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturePill({ icon: Icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm font-black text-cyan-50">
      <Icon size={15} className="text-cyan-300" />
      {text}
    </span>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0">
      <span className="text-slate-500 font-semibold">
        {label}
      </span>

      <span className="font-black text-slate-950">
        {value}
      </span>
    </div>
  );
}