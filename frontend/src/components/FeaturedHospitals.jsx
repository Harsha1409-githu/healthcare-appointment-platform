import {
  Building2,
  MapPin,
  Stethoscope,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FeaturedHospitals() {
  const navigate = useNavigate();

  const hospitals = [
    {
      name: "Apollo Hospital",
      city: "Chennai",
      doctors: 45,
      specializations: 18,
    },
    {
      name: "Fortis Hospital",
      city: "Bangalore",
      doctors: 32,
      specializations: 14,
    },
    {
      name: "Global Hospitals",
      city: "Hyderabad",
      doctors: 28,
      specializations: 12,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
            Partner Hospitals
          </span>

          <h2 className="text-5xl font-black text-slate-900 mt-6">
            Trusted Hospitals
            <span className="block text-emerald-600">
              Across India
            </span>
          </h2>

          <p className="text-slate-500 text-lg mt-4">
            Connect with leading hospitals and healthcare institutions.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {hospitals.map((hospital) => (
            <div
              key={hospital.name}
              className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 hover:-translate-y-2 transition"
            >
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-emerald-600 to-cyan-500 flex items-center justify-center">
                <Building2
                  className="text-white"
                  size={30}
                />
              </div>

              <h3 className="text-2xl font-black text-slate-900 mt-6">
                {hospital.name}
              </h3>

              <div className="flex items-center gap-2 mt-3 text-slate-500">
                <MapPin size={18} />
                {hospital.city}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-50 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-black">
                    {hospital.doctors}
                  </p>

                  <p className="text-xs text-slate-500">
                    Doctors
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-black">
                    {hospital.specializations}
                  </p>

                  <p className="text-xs text-slate-500">
                    Specialties
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate("/doctors")
                }
                className="mt-6 w-full bg-slate-950 text-white py-4 rounded-2xl font-black hover:bg-emerald-700 transition flex items-center justify-center gap-2"
              >
                <Stethoscope size={18} />
                View Doctors
                <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}