import {
  FlaskConical,
  ArrowRight,
  IndianRupee,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const tests = [
  ["CBC Test", "Blood Test", 499],
  ["Blood Sugar", "Diabetes", 299],
  ["Lipid Profile", "Heart Health", 899],
  ["Thyroid Profile", "Hormone Test", 699],
];

export default function HomeLabTests() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black border border-cyan-100">
            <FlaskConical size={18} />
            Lab Tests
          </span>

          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-6">
            Book Lab Tests
            <span className="block text-blue-600">
              From Home
            </span>
          </h2>

          <p className="text-slate-500 text-lg mt-4">
            Schedule diagnostic tests with home sample collection.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {tests.map(([name, category, price]) => (
            <div
              key={name}
              className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 hover:-translate-y-2 transition"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
                <FlaskConical className="text-blue-600" size={28} />
              </div>

              <h3 className="text-xl font-black text-slate-900">
                {name}
              </h3>

              <p className="text-slate-500 mt-2">{category}</p>

              <p className="flex items-center gap-1 text-2xl font-black text-blue-600 mt-5">
                <IndianRupee size={22} />
                {price}
              </p>

              <button
                onClick={() => navigate("/patient/lab-tests")}
                className="mt-6 w-full bg-slate-950 text-white py-3 rounded-2xl font-black hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                Book Test
                <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/patient/lab-tests")}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-blue-600 text-white font-black hover:bg-blue-700"
          >
            View All Lab Tests
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}