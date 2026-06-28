import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Navigation,
  X,
  Stethoscope,
  Building2,
  UserRound,
} from "lucide-react";

const locationSuggestions = [
  { area: "Use current location", city: "", current: true },
  { area: "Chennai", city: "Chennai" },
  { area: "Bangalore", city: "Bangalore" },
  { area: "Hyderabad", city: "Hyderabad" },
  { area: "Mumbai", city: "Mumbai" },
  { area: "Delhi", city: "Delhi" },
];

const searchSuggestions = [
  { title: "Cardiology", type: "Speciality", icon: Stethoscope },
  { title: "Dermatology", type: "Speciality", icon: Stethoscope },
  { title: "Neurology", type: "Speciality", icon: Stethoscope },
  { title: "Orthopedics", type: "Speciality", icon: Stethoscope },
  { title: "Pediatrics", type: "Speciality", icon: Stethoscope },
  { title: "ENT", type: "Speciality", icon: Stethoscope },
  { title: "General Physician", type: "Speciality", icon: Stethoscope },
  { title: "Apollo Hospital", type: "Hospital", icon: Building2 },
  { title: "Fortis Hospital", type: "Hospital", icon: Building2 },
];

export default function Hero() {
  const navigate = useNavigate();
  const boxRef = useRef(null);

  const patient =
    JSON.parse(localStorage.getItem("patientUser") || "null") ||
    JSON.parse(localStorage.getItem("user") || "null");

  const selectedProfile = JSON.parse(
    localStorage.getItem("selectedProfile") || "null"
  );

  const [location, setLocation] = useState(
    localStorage.getItem("selectedCity") || patient?.city || "Chennai"
  );
  const [search, setSearch] = useState("");
  const [dropdown, setDropdown] = useState(null);
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    const close = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setDropdown(null);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const filteredSearch = searchSuggestions.filter((item) =>
    `${item.title} ${item.type}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Location is not supported");
      return;
    }

    setDetecting(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data = await res.json();

          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            "Chennai";

          setLocation(city);
          localStorage.setItem("selectedCity", city);
          setDropdown(null);
        } catch (error) {
          console.error(error);
          alert("Unable to detect location");
        } finally {
          setDetecting(false);
        }
      },
      () => {
        setDetecting(false);
        alert("Please allow location permission");
      }
    );
  };

  const submitSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (location.trim()) {
      params.set("city", location.trim());
      localStorage.setItem("selectedCity", location.trim());
    }

    if (search.trim()) {
      params.set("search", search.trim());
    }

    setDropdown(null);
    navigate(`/doctors?${params.toString()}`);
  };

  return (
    <section className="bg-[#f4fbff] pt-4 pb-2">
      <div className="max-w-[900px] mx-auto px-4">
        <div ref={boxRef} className="relative overflow-visible">
          <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-950 leading-tight mb-1">
              {getGreeting()} {patient?.fullName?.split(" ")[0] || "Patient"} 👋
            </h1>

            <Link
              to="/account"
              className="w-12 h-12 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0"
            >
              {selectedProfile?.profileImage || patient?.profileImage ? (
                <img
                  src={selectedProfile?.profileImage || patient?.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserRound size={22} className="text-cyan-600" />
              )}
            </Link>
          </div>

          <button
  type="button"
  onClick={() => setDropdown("location")}
  className="mt-2 flex items-center gap-1.5"
>
  <MapPin
    size={15}
    className="text-cyan-600 shrink-0"
  />

  <span className="text-base font-black text-slate-950">
    {location || "Select city"}
  </span>

  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-slate-400"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
</button>

          {dropdown === "location" && (
            <div className="absolute left-0 right-0 top-[104px] z-50 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
              {locationSuggestions.map((item) => (
                <button
                  key={item.area}
                  type="button"
                  onClick={() => {
                    if (item.current) {
                      useMyLocation();
                      return;
                    }

                    setLocation(item.city);
                    localStorage.setItem("selectedCity", item.city);
                    setDropdown(null);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 border-b border-slate-100 last:border-b-0 text-left active:bg-slate-50"
                >
                  <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center">
                    {item.current ? (
                      <Navigation
                        size={17}
                        className={`text-cyan-600 ${
                          detecting ? "animate-pulse" : ""
                        }`}
                      />
                    ) : (
                      <MapPin size={17} className="text-cyan-600" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-800">
                      {item.current
                        ? detecting
                          ? "Detecting location..."
                          : "Use current location"
                        : item.area}
                    </p>

                    {!item.current && (
                      <p className="text-xs text-slate-500">India</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          <form onSubmit={submitSearch} className="mt-4 relative">
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-4 shadow-sm">
              <Search size={19} className="text-cyan-600 shrink-0" />

              <input
                value={search}
                onFocus={() => setDropdown("search")}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setDropdown("search");
                }}
                placeholder="Search doctors, hospitals, specialities"
                className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setDropdown(null);
                  }}
                >
                  <X size={16} className="text-slate-400" />
                </button>
              )}
            </div>

            {dropdown === "search" && (
              <div className="absolute top-[58px] left-0 right-0 z-50 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
                {(search ? filteredSearch : searchSuggestions).map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={`${item.title}-${item.type}`}
                      type="button"
                      onClick={() => {
                        setSearch(item.title);
                        setDropdown(null);
                        navigate(
                          `/doctors?city=${encodeURIComponent(
                            location
                          )}&search=${encodeURIComponent(item.title)}`
                        );
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 border-b border-slate-100 last:border-b-0 text-left active:bg-slate-50"
                    >
                      <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center">
                        <Icon size={17} className="text-cyan-600" />
                      </div>

                      <div>
                        <p className="text-sm font-black text-slate-800">
                          {item.title}
                        </p>

                        <p className="text-xs text-slate-500">{item.type}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}