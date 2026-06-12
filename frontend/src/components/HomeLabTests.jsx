import {
  FlaskConical,
  ArrowRight,
  IndianRupee,
  ShieldCheck,
  Clock,
  Home,
  BadgeCheck,
  HeartPulse,
  Droplets,
  Activity,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const tests = [
  {
    name: "CBC Test",
    category: "Blood Test",
    price: 499,
    oldPrice: 699,
    icon: Droplets,
    tag: "Popular",
    desc: "Complete blood count for overall health screening.",
  },
  {
    name: "Blood Sugar",
    category: "Diabetes",
    price: 299,
    oldPrice: 499,
    icon: Activity,
    tag: "Fast Result",
    desc: "Check glucose levels and monitor diabetes risk.",
  },
  {
    name: "Lipid Profile",
    category: "Heart Health",
    price: 899,
    oldPrice: 1199,
    icon: HeartPulse,
    tag: "Heart Care",
    desc: "Measure cholesterol and triglyceride levels.",
  },
  {
    name: "Thyroid Profile",
    category: "Hormone Test",
    price: 699,
    oldPrice: 999,
    icon: Sparkles,
    tag: "Recommended",
    desc: "Evaluate thyroid hormone levels and metabolism.",
  },
];

export default function HomeLabTests() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-cyan-50/40 to-white">
      <div className="absolute top-0 left-0 w-80 h-80 bg-cyan-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black border border-cyan-100">
              <FlaskConical size={18} />
              Lab Tests At Home
            </span>

            <h2 className="text-4xl md:text-5xl font-black text-slate-950 mt-6 leading-tight">
              Book Lab Tests
              <span className="block text-cyan-600">
                With Home Sample Pickup
              </span>
            </h2>

            <p className="text-slate-500 text-lg mt-5 max-w-2xl leading-relaxed">
              Choose health tests, schedule pickup and get digital reports
              securely in your MediCare account.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <MiniStat icon={Home} title="Home" value="Pickup" />
            <MiniStat icon={Clock} title="Reports" value="24 hrs" />
            <MiniStat icon={ShieldCheck} title="Labs" value="Verified" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {tests.map((test) => {
            const Icon = test.icon;

            return (
              <div
                key={test.name}
                className="group relative"
              >
                <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-40 blur transition duration-500" />

                <div className="relative h-full bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 hover:-translate-y-2 hover:shadow-xl transition duration-500">
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center">
                      <Icon className="text-cyan-600" size={28} />
                    </div>

                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-black">
                      <BadgeCheck size={13} />
                      {test.tag}
                    </span>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-black text-cyan-600 uppercase">
                      {test.category}
                    </p>

                    <h3 className="text-2xl font-black text-slate-950 mt-1">
                      {test.name}
                    </h3>

                    <p className="text-slate-500 mt-3 leading-relaxed">
                      {test.desc}
                    </p>
                  </div>

                  <div className="mt-6 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-400 font-bold">
                        Starting from
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <p className="flex items-center text-3xl font-black text-slate-950">
                          <IndianRupee size={23} />
                          {test.price}
                        </p>

                        <p className="flex items-center text-sm text-slate-400 line-through">
                          <IndianRupee size={14} />
                          {test.oldPrice}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      Save ₹{test.oldPrice - test.price}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate("/patient/lab-tests")}
                    className="mt-6 w-full bg-slate-950 text-white py-4 rounded-2xl font-black hover:bg-cyan-700 transition flex items-center justify-center gap-2"
                  >
                    Book Test
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-slate-950 rounded-[2rem] p-6 md:p-8 text-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-black">
              Need a full body checkup?
            </h3>

            <p className="text-slate-300 mt-2">
              Explore curated health packages with doorstep sample collection.
            </p>
          </div>

          <button
            onClick={() => navigate("/patient/lab-tests")}
            className="inline-flex items-center justify-center gap-2 bg-white text-slate-950 px-7 py-4 rounded-2xl font-black hover:bg-cyan-50 transition"
          >
            View All Lab Tests
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ icon: Icon, title, value }) {
  return (
    <div className="min-w-[92px] bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
      <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center mb-2">
        <Icon className="text-cyan-600" size={18} />
      </div>

      <p className="text-lg font-black text-slate-950">
        {value}
      </p>

      <p className="text-xs text-slate-500 font-bold">
        {title}
      </p>
    </div>
  );
}