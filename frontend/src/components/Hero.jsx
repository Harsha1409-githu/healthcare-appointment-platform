import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-24">

        <h1 className="text-5xl font-bold mb-6">
          Find & Book Trusted Doctors
        </h1>

        <p className="text-xl mb-8">
          Book appointments with experienced doctors
          near you.
        </p>

        <div className="flex gap-3 bg-white rounded-xl p-2 max-w-xl">
          <input
            type="text"
            placeholder="Search doctors..."
            className="flex-1 outline-none text-black px-3"
          />

          <button
            onClick={() => navigate("/doctors")}
            className="bg-blue-600 text-white px-5 py-3 rounded-lg"
          >
            <Search size={20} />
          </button>
        </div>

      </div>
    </section>
  );
}