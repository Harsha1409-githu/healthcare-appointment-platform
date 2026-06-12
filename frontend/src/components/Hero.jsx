import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Navigation,
  X,
  Video,
  Stethoscope,
  ShieldCheck,
  ArrowRight,
  Building2,
} from "lucide-react";

const locationSuggestions = [
  { area: "Secunderabad", city: "Hyderabad" },
  { area: "Banjara Hills", city: "Hyderabad" },
  { area: "Kukatpally", city: "Hyderabad" },
  { area: "Anna Nagar", city: "Chennai" },
  { area: "T Nagar", city: "Chennai" },
  { area: "Velachery", city: "Chennai" },
  { area: "Whitefield", city: "Bangalore" },
  { area: "Indiranagar", city: "Bangalore" },
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
  const searchBoxRef = useRef(null);

  const [location, setLocation] = useState(
    localStorage.getItem("selectedCity") || ""
  );
  const [search, setSearch] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    const closeDropdown = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", closeDropdown);

    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  const filteredLocations = locationSuggestions.filter((item) =>
    `${item.area} ${item.city}`
      .toLowerCase()
      .includes(location.toLowerCase())
  );

  const filteredSearch = searchSuggestions.filter((item) =>
    `${item.title} ${item.type}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (location.trim()) {
      params.set("city", location.trim());
      localStorage.setItem("selectedCity", location.trim());
    }

    if (search.trim()) {
      params.set("search", search.trim());
    }

    setActiveDropdown(null);
    navigate(`/doctors?${params.toString()}`);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Location is not supported in this browser");
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
            "";

          setLocation(city);
          localStorage.setItem("selectedCity", city);
          setActiveDropdown(null);
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

  return (
    <section className="bg-[#f4fbff] pt-6 pb-10">
      <div className="max-w-[1500px] mx-auto px-6">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-visible">
          <div className="grid xl:grid-cols-[1fr_340px] gap-8 items-center p-7 md:p-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm border border-cyan-100 mb-5">
                <ShieldCheck size={16} />
                Trusted Healthcare Platform
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950 leading-tight">
                Find Trusted Doctors
                <span className="block text-cyan-600">Near You</span>
              </h1>

              <p className="text-slate-500 text-lg mt-4 max-w-3xl leading-relaxed">
                Search doctors, clinics, hospitals and book appointments from
                your selected location.
              </p>

              <form
                ref={searchBoxRef}
                onSubmit={handleSearch}
                className="relative mt-7 bg-white border border-slate-300 rounded-xl shadow-sm grid xl:grid-cols-[360px_1fr_140px]"
              >
                <div className="relative border-b xl:border-b-0 xl:border-r border-slate-300">
                  <div className="flex items-center gap-3 px-4 h-16">
                    <MapPin size={19} className="text-slate-500" />

                    <input
                      value={location}
                      onFocus={() => setActiveDropdown("location")}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        setActiveDropdown("location");
                      }}
                      placeholder="Search location"
                      className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                    />

                    {location && (
                      <button
                        type="button"
                        onClick={() => {
                          setLocation("");
                          localStorage.removeItem("selectedCity");
                          setActiveDropdown(null);
                        }}
                        className="w-6 h-6 rounded-full bg-slate-400 text-white flex items-center justify-center"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {activeDropdown === "location" && (
                    <Dropdown className="left-0 w-full">
                      <button
                        type="button"
                        onClick={useMyLocation}
                        className="w-full flex items-center gap-3 px-4 py-4 text-cyan-600 font-black hover:bg-cyan-50"
                      >
                        <Navigation
                          size={18}
                          className={detecting ? "animate-pulse" : ""}
                        />
                        {detecting ? "Detecting location..." : "Use my location"}
                      </button>

                      {filteredLocations.map((item) => (
                        <button
                          key={`${item.area}-${item.city}`}
                          type="button"
                          onClick={() => {
                            setLocation(item.city);
                            localStorage.setItem("selectedCity", item.city);
                            setActiveDropdown(null);
                          }}
                          className="w-full flex items-center gap-4 px-4 py-4 border-t border-slate-100 hover:bg-slate-50 text-left"
                        >
                          <CircleIcon icon={Search} />

                          <div>
                            <p className="font-bold text-slate-800">
                              {item.area}
                            </p>
                            <p className="text-sm text-slate-500">
                              {item.city}
                            </p>
                          </div>
                        </button>
                      ))}
                    </Dropdown>
                  )}
                </div>

                <div className="relative">
                  <div className="flex items-center gap-3 px-4 h-16">
                    <Search size={19} className="text-slate-500" />

                    <input
                      value={search}
                      onFocus={() => setActiveDropdown("search")}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setActiveDropdown("search");
                      }}
                      placeholder="Search doctors, clinics, hospitals, etc."
                      className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                    />

                    {search && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setActiveDropdown(null);
                        }}
                        className="w-6 h-6 rounded-full bg-slate-400 text-white flex items-center justify-center"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-cyan-600 text-white px-5 h-16 font-black hover:bg-cyan-700 transition flex items-center justify-center gap-2 rounded-b-xl xl:rounded-b-none xl:rounded-r-xl"
                >
                  Search
                  <ArrowRight size={17} />
                </button>

                {activeDropdown === "search" && (
                  <div className="absolute top-[66px] left-0 xl:left-[360px] right-0 xl:right-[140px] bg-white border border-slate-200 shadow-2xl z-50 rounded-b-2xl overflow-hidden">
                    {(search ? filteredSearch : searchSuggestions).map(
                      (item) => {
                        const Icon = item.icon;

                        return (
                          <button
                            key={`${item.title}-${item.type}`}
                            type="button"
                            onClick={() => {
                              setSearch(item.title);
                              setActiveDropdown(null);
                            }}
                            className="w-full flex items-center gap-4 px-5 py-4 border-b border-slate-100 hover:bg-slate-50 text-left"
                          >
                            <CircleIcon icon={Icon} />
                            <div>
                              <p className="font-black text-slate-800">
                                {item.title}
                              </p>
                              <p className="text-sm text-slate-500">
                                {item.type}
                              </p>
                            </div>
                          </button>
                        );
                      }
                    )}
                  </div>
                )}
              </form>

              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={() => navigate("/doctors")}
                  className="inline-flex items-center gap-2 bg-cyan-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-cyan-700 transition"
                >
                  <Stethoscope size={18} />
                  Find Doctors
                </button>

                <button
                  onClick={() => navigate("/video-consult")}
                  className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-800 px-6 py-4 rounded-2xl font-black hover:bg-slate-50 transition"
                >
                  <Video size={18} />
                  Video Consult
                </button>
              </div>
            </div>

            <div className="hidden xl:block">
              <div className="relative h-[320px] bg-gradient-to-br from-cyan-50 via-blue-50 to-white rounded-[2rem] border border-cyan-100 overflow-hidden flex items-center justify-center">
                <Stethoscope className="text-cyan-600 animate-float" size={130} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Dropdown({ children, className }) {
  return (
    <div
      className={`absolute top-[66px] ${className} bg-white border border-slate-200 shadow-2xl z-50 rounded-b-2xl overflow-hidden max-h-[390px] overflow-y-auto`}
    >
      {children}
    </div>
  );
}

function CircleIcon({ icon: Icon }) {
  return (
    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
      <Icon size={17} className="text-slate-500" />
    </div>
  );
}