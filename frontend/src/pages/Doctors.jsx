import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  MapPin,
  Stethoscope,
  Star,
  IndianRupee,
  BadgeCheck,
  CalendarCheck,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";

import api from "../api/axios";

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(
      () => setDebounced(value),
      delay
    );

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function Doctors() {
  const [searchParams] = useSearchParams();

  const urlCity = searchParams.get("city") || "Chennai";
  const urlSpecialization =
    searchParams.get("specialization") || "All";

  const [city, setCity] = useState(urlCity);
  const [doctors, setDoctors] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] =
    useState(urlSpecialization);

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    setCity(urlCity);
    setSpecialization(urlSpecialization);
  }, [urlCity, urlSpecialization]);

  useEffect(() => {
    api
      .get(
        `/doctor/search?city=${encodeURIComponent(
          city
        )}`
      )
      .then((res) => {
        const data = res.data?.data || [];
        setDoctors(data);
        setFiltered(data);
      })
      .catch((err) =>
        console.error("API ERROR:", err)
      );
  }, [city]);

  useEffect(() => {
    let result = [...doctors];

    result = result.filter((d) => d.isActive);

    if (debouncedSearch) {
      result = result.filter((d) =>
        `${d.doctorName} ${d.specialization} ${d.hospital?.hospitalName || ""}`
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase())
      );
    }

    if (specialization !== "All") {
  result = result.filter((d) =>
    d.specialization
      ?.toLowerCase()
      .includes(specialization.toLowerCase())
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

  const cities = [
    "Chennai",
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
  ];

  return (
    <div className="relative bg-slate-50 min-h-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      <div className="absolute top-40 right-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />

      {/* Header */}
      <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />
          <div className="absolute right-10 top-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur mb-6">
            <Stethoscope size={18} className="text-cyan-300" />
            <span className="text-sm font-semibold">
              Verified healthcare specialists
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Find Doctors in{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              {city}
            </span>
          </h1>

          <p className="mt-4 text-blue-100 text-lg max-w-2xl">
            Search, compare and book appointments with trusted doctors by
            specialty, city, hospital and consultation fee.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="relative max-w-7xl mx-auto px-6 -mt-10 z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
              <SlidersHorizontal className="text-white" size={21} />
            </div>

            <div>
              <h2 className="font-black text-xl text-slate-900">
                Smart Doctor Search
              </h2>
              <p className="text-sm text-slate-500">
                Refine results by name, city and specialization
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 transition">
              <Search className="text-slate-400" size={21} />
              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search doctor, specialty, hospital..."
                className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
              <MapPin className="text-blue-600" size={21} />

              <select
                value={city}
                onChange={(e) =>
                  setCity(e.target.value)
                }
                className="w-full bg-transparent outline-none text-slate-800"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
              <Stethoscope
                className="text-emerald-600"
                size={21}
              />

              <select
                value={specialization}
                onChange={(e) =>
                  setSpecialization(e.target.value)
                }
                className="w-full bg-transparent outline-none text-slate-800"
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
      </div>

      {/* Doctors Grid */}
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-7">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {filtered.length} Doctors Found
            </h2>

            <p className="text-slate-500">
              Showing active doctors matching your search
            </p>
          </div>

          {specialization !== "All" && (
            <span className="inline-flex w-fit px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold">
              {specialization}
            </span>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center shadow-xl border">
            <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
              <Search className="text-blue-600" size={34} />
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              No Doctors Found
            </h3>

            <p className="text-slate-500 mt-2">
              Try changing search keywords, city or specialization.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((doc, index) => (
              <div key={doc.id} className="group relative">
                <div className="absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-60 blur transition duration-500" />

                <div className="relative h-full bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden group-hover:-translate-y-2 transition duration-500">
                  <div className="relative p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl" />

                    <div className="relative flex items-center gap-4">
                      <img
  src={
    doc.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      doc.doctorName
    )}&background=0f172a&color=fff&bold=true`
  }
  alt={doc.doctorName}
  className="w-20 h-20 rounded-3xl border-4 border-white/20 shadow-xl object-cover"
/>

                      <div>
                        <h3 className="text-2xl font-black">
                          {doc.doctorName}
                        </h3>

                        <p className="text-cyan-200 font-semibold">
                          {doc.specialization}
                        </p>

                        <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-400 text-slate-950 text-sm font-bold">
                          <Star
                            size={14}
                            className="fill-slate-950"
                          />
                          4.{9 - (index % 2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-2xl p-4">
                        <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                          <BadgeCheck size={17} />
                          Experience
                        </div>

                        <p className="text-2xl font-black mt-2 text-slate-900">
                          {doc.experience}+ yrs
                        </p>
                      </div>

                      <div className="bg-emerald-50 rounded-2xl p-4">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                          <IndianRupee size={17} />
                          Fee
                        </div>

                        <p className="text-2xl font-black mt-2 text-slate-900">
                          ₹{doc.consultationFee}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center gap-3 text-slate-600">
                        <Stethoscope
                          size={18}
                          className="text-blue-600"
                        />
                        <span>
                          {doc.hospital?.hospitalName ||
                            "Hospital Not Available"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-slate-600">
                        <MapPin
                          size={18}
                          className="text-emerald-600"
                        />
                        <span>{doc.city}</span>
                      </div>

                      <div className="flex items-center gap-3 text-emerald-700 font-semibold">
                        <CalendarCheck size={18} />
                        <span>Available Today</span>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Link
                        to={`/doctor/${doc.id}`}
                        className="flex-1"
                      >
                        <button className="w-full border border-blue-600 text-blue-600 py-3 rounded-2xl font-bold hover:bg-blue-50 transition">
                          Profile
                        </button>
                      </Link>

                      <Link
                        to={`/doctor/${doc.id}`}
                        className="flex-1"
                      >
                        <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:scale-[1.02] transition flex items-center justify-center gap-2">
                          Book
                          <ArrowRight size={18} />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}