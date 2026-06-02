
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link, useSearchParams } from "react-router-dom";

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function Doctors() {
  const [searchParams] = useSearchParams();

  const city = searchParams.get("city") || "Chennai";

  const [doctors, setDoctors] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("All");

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    api
      .get(`/doctor/search?city=${city}`)
      .then((res) => {
        const data = res.data?.data || [];
        setDoctors(data);
        setFiltered(data);
      })
      .catch((err) => console.error("API ERROR:", err));
  }, [city]);

  useEffect(() => {
    let result = [...doctors];

    if (debouncedSearch) {
      result = result.filter((d) =>
        d.doctorName
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase())
      );
    }

    if (specialization !== "All") {
      result = result.filter(
        (d) => d.specialization === specialization
      );
    }

    setFiltered(result);
  }, [debouncedSearch, specialization, doctors]);

  const specs = [
    "All",
    ...new Set(
      doctors
        .map((d) => d.specialization)
        .filter(Boolean)
    ),
  ];

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold">
            Find Doctors in {city}
          </h1>

          <p className="mt-2 text-blue-100">
            Search and book appointments with trusted doctors
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 -mt-6">
        <div className="bg-white rounded-xl shadow-lg p-5">

          <div className="grid md:grid-cols-2 gap-4">

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctor name..."
              className="border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={specialization}
              onChange={(e) =>
                setSpecialization(e.target.value)
              }
              className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {specs.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>

          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            {filtered.length} Doctors Found
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center shadow">
            <h3 className="text-lg font-semibold">
              No Doctors Found
            </h3>

            <p className="text-gray-500 mt-2">
              Try changing search keywords or filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {filtered.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6"
              >
                {/* Doctor Info */}
                <div className="flex items-center gap-4">

                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      doc.doctorName
                    )}&background=2563eb&color=fff`}
                    alt={doc.doctorName}
                    className="w-16 h-16 rounded-full"
                  />

                  <div>
                    <h3 className="text-lg font-bold">
                      {doc.doctorName}
                    </h3>

                    <p className="text-blue-600 font-medium">
                      {doc.specialization}
                    </p>
                  </div>

                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-4">

                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                    ⭐ 4.8
                  </span>

                  <span className="text-gray-500 text-sm">
                    120 Reviews
                  </span>

                </div>

                {/* Experience & Fee */}
                <div className="grid grid-cols-2 gap-3 mt-5">

                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">
                      Experience
                    </p>

                    <p className="font-semibold">
                      {doc.experience} Years
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">
                      Fee
                    </p>

                    <p className="font-semibold">
                      ₹{doc.consultationFee}
                    </p>
                  </div>

                </div>

                {/* Hospital */}
                <div className="mt-4 text-sm text-gray-600">
                  🏥{" "}
                  {doc.hospital?.hospitalName ||
                    "Hospital Not Available"}
                </div>

                {/* Location */}
                <div className="mt-2 text-sm text-gray-600">
                  📍 {doc.city}
                </div>

                {/* Availability */}
                <div className="mt-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Available Today
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">

                  <Link
                    to={`/doctor/${doc.id}`}
                    className="flex-1"
                  >
                    <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50">
                      Profile
                    </button>
                  </Link>

                  <Link
                    to={`/doctor/${doc.id}`}
                    className="flex-1"
                  >
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                      Book Now
                    </button>
                  </Link>

                </div>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}

