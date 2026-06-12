import {
  Building2,
  MapPin,
  Stethoscope,
  ArrowRight,
  Star,
  ShieldCheck,
  Clock,
  HeartPulse,
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
      rating: "4.8",
      image:
        "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Fortis Hospital",
      city: "Bangalore",
      doctors: 32,
      specializations: 14,
      rating: "4.7",
      image:
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Global Hospitals",
      city: "Hyderabad",
      doctors: 28,
      specializations: 12,
      rating: "4.6",
      image:
        "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=900&q=80",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1450px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm">
              <Building2 size={17} />
              PARTNER HOSPITALS
            </span>

            <h2 className="text-4xl md:text-5xl font-black text-slate-950 mt-5">
              Trusted hospitals
              <span className="block text-cyan-600">
                across India
              </span>
            </h2>

            <p className="text-slate-500 text-lg mt-5 max-w-2xl leading-relaxed">
              Connect with leading hospitals and healthcare institutions
              offering verified specialists and easy appointment booking.
            </p>
          </div>

          <button
            onClick={() => navigate("/hospitals")}
            className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-950 text-white font-black hover:bg-cyan-700 transition"
          >
            View All Hospitals
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {hospitals.map((hospital) => (
            <div
              key={hospital.name}
              className="bg-white rounded-[1.8rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hospital.image}
                  alt={hospital.name}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />

                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-emerald-700 font-black text-xs shadow">
                  <ShieldCheck size={14} />
                  Verified Hospital
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-black text-white">
                    {hospital.name}
                  </h3>

                  <div className="flex items-center gap-2 text-cyan-100 mt-1">
                    <MapPin size={17} />
                    {hospital.city}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-3 gap-3">
                  <HospitalStat
                    value={hospital.rating}
                    label="Rating"
                    icon={Star}
                  />

                  <HospitalStat
                    value={`${hospital.doctors}+`}
                    label="Doctors"
                    icon={Stethoscope}
                  />

                  <HospitalStat
                    value={`${hospital.specializations}+`}
                    label="Specialties"
                    icon={HeartPulse}
                  />
                </div>

                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-emerald-700 font-black">
                  <Clock size={19} />
                  24/7 Emergency Support
                </div>

                <button
                  onClick={() => navigate("/doctors")}
                  className="mt-5 w-full bg-cyan-600 text-white py-4 rounded-2xl font-black hover:bg-cyan-700 transition flex items-center justify-center gap-2"
                >
                  <Stethoscope size={18} />
                  View Doctors
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HospitalStat({ value, label, icon: Icon }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100">
      <Icon size={18} className="text-cyan-600 mx-auto mb-2" />
      <p className="text-lg font-black text-slate-950">
        {value}
      </p>
      <p className="text-[11px] text-slate-500 font-semibold">
        {label}
      </p>
    </div>
  );
}