import {
  FlaskConical,
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
  },
  {
    name: "Blood Sugar",
    category: "Diabetes",
    price: 299,
    oldPrice: 499,
    icon: Activity,
    tag: "Fast Result",
  },
  {
    name: "Lipid Profile",
    category: "Heart Health",
    price: 899,
    oldPrice: 1199,
    icon: HeartPulse,
    tag: "Heart Care",
  },
  {
    name: "Thyroid Profile",
    category: "Hormone Test",
    price: 699,
    oldPrice: 999,
    icon: Sparkles,
    tag: "Recommended",
  },
];

export default function HomeLabTests() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#f4f8fb] px-4 py-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-cyan-700 font-black text-xs">
              <FlaskConical size={15} />
              Lab Tests At Home
            </div>

            <h2 className="text-xl font-black text-slate-950 mt-1">
              Book Lab Tests
            </h2>

            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Home pickup • Digital reports
            </p>
          </div>

          <button
            onClick={() => navigate("/patient/lab-tests")}
            className="text-xs font-black text-cyan-700 bg-white border border-slate-100 rounded-full px-3 py-2 shadow-sm"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <MiniStat icon={Home} title="Home" value="Pickup" />
          <MiniStat icon={Clock} title="Reports" value="24 hrs" />
          <MiniStat icon={ShieldCheck} title="Labs" value="Verified" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {tests.map((test) => {
            const Icon = test.icon;

            return (
              <button
                key={test.name}
                onClick={() => navigate("/patient/lab-tests")}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3 text-left active:scale-95 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-50 flex items-center justify-center">
                    <Icon className="text-cyan-600" size={21} />
                  </div>

                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black">
                    <BadgeCheck size={11} />
                    {test.tag}
                  </span>
                </div>

                <p className="text-[10px] font-black text-cyan-600 uppercase mt-3">
                  {test.category}
                </p>

                <h3 className="text-sm font-black text-slate-950 mt-0.5">
                  {test.name}
                </h3>

                <div className="flex items-end justify-between gap-2 mt-2">
                  <div className="flex items-center">
                    <IndianRupee size={14} className="text-slate-950" />
                    <span className="text-lg font-black text-slate-950">
                      {test.price}
                    </span>
                  </div>

                  <div className="flex items-center text-xs text-slate-400 line-through">
                    <IndianRupee size={11} />
                    {test.oldPrice}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MiniStat({ icon: Icon, title, value }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2.5 text-center">
      <Icon className="text-cyan-600 mx-auto" size={17} />

      <p className="text-xs font-black text-slate-950 mt-1">
        {value}
      </p>

      <p className="text-[10px] text-slate-500 font-bold">
        {title}
      </p>
    </div>
  );
}