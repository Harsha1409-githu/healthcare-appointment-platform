import {
  Stethoscope,
  Building2,
  UsersRound,
  CalendarCheck,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function Stats() {
  const stats = [
    {
      title: "Verified Doctors",
      value: "100+",
      desc: "Experienced specialists across multiple departments",
      icon: Stethoscope,
      gradient: "from-blue-600 to-cyan-500",
      bg: "bg-blue-50",
    },
    {
      title: "Partner Hospitals",
      value: "20+",
      desc: "Trusted healthcare centers connected to our platform",
      icon: Building2,
      gradient: "from-emerald-600 to-teal-500",
      bg: "bg-emerald-50",
    },
    {
      title: "Happy Patients",
      value: "5000+",
      desc: "Patients managing appointments and prescriptions digitally",
      icon: UsersRound,
      gradient: "from-purple-600 to-fuchsia-500",
      bg: "bg-purple-50",
    },
    {
      title: "Appointments",
      value: "10000+",
      desc: "Successful consultations booked through MediCare",
      icon: CalendarCheck,
      gradient: "from-orange-500 to-amber-500",
      bg: "bg-orange-50",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-slate-50">
      <div className="absolute top-10 left-10 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold mb-5">
            <Sparkles size={18} />
            Trusted by Patients & Hospitals
          </div>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-950">
            Healthcare impact
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              you can trust
            </span>
          </h2>

          <p className="text-slate-500 mt-5 text-lg">
            MediCare connects patients, doctors, hospitals and digital
            prescriptions into one seamless healthcare experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group relative"
              >
                <div
                  className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r ${item.gradient} opacity-0 blur group-hover:opacity-50 transition duration-500`}
                />

                <div className="relative h-full bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl overflow-hidden group-hover:-translate-y-2 transition duration-500">
                  <div
                    className={`absolute -right-10 -top-10 w-32 h-32 ${item.bg} rounded-full`}
                  />

                  <div className="relative flex items-center justify-between mb-8">
                    <div
                      className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-[-6deg] transition duration-500`}
                    >
                      <Icon className="text-white" size={30} />
                    </div>

                    <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold">
                      <TrendingUp size={14} />
                      Growing
                    </div>
                  </div>

                  <div className="relative">
                    <h3 className="text-5xl font-black tracking-tight text-slate-950">
                      {item.value}
                    </h3>

                    <p className="mt-2 text-lg font-bold text-slate-800">
                      {item.title}
                    </p>

                    <p className="mt-3 text-sm leading-relaxed text-slate-500">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.gradient} group-hover:w-full transition-all duration-700`}
                      style={{
                        width: `${70 + index * 7}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-slate-950 rounded-[2rem] p-8 md:p-10 text-white shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-black">
                One platform for complete healthcare management
              </h3>

              <p className="text-slate-300 mt-2 max-w-2xl">
                From doctor discovery and appointment booking to payments,
                prescriptions and hospital management — everything works
                together beautifully.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur">
              <CalendarCheck className="text-cyan-300" />
              <div>
                <p className="text-sm text-slate-300">
                  Average booking time
                </p>
                <p className="text-2xl font-black">
                  &lt; 2 mins
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}