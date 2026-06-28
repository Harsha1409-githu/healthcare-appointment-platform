import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
} from "lucide-react";

import api from "../api/axios";
import PageHeader from "../components/PageHeader";

export default function HospitalDetails() {
  const { id } = useParams();

  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHospital();
  }, [id]);

  const loadHospital = async () => {
    try {
      const hospitalRes = await api.get("/hospital");

const selectedHospital = (hospitalRes.data || []).find(
  (item) => item.id === id
);

setHospital(selectedHospital || null);

      const doctorsRes = await api.get("/doctor");
      setDoctors(
        (doctorsRes.data || []).filter(
          (doctor) => doctor.hospital?.id === id && doctor.isActive
        )
      );
    } catch (error) {
      console.error("Hospital details error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f8fb] pb-28">
        <div className="max-w-md mx-auto px-4 animate-pulse">
          <div className="h-44 bg-white rounded-3xl" />
          <div className="h-80 bg-white rounded-3xl mt-3" />
        </div>
      </main>
    );
  }

  if (!hospital) {
    return (
      <main className="min-h-screen bg-[#f4f8fb] pb-28">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-3xl p-6 text-center">
            <Building2 className="mx-auto text-cyan-600 mb-3" size={34} />
            <p className="font-black text-slate-950">Hospital not found</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-28">
    <PageHeader
  title="Hospital Details"
  subtitle="Hospital profile"
  showBack={false}
/>

      <div className="max-w-md mx-auto px-4">
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
          <div className="w-full h-32 rounded-3xl bg-cyan-50 flex items-center justify-center mb-4">
            {hospital.profileImage || hospital.logo ? (
              <img
                src={hospital.profileImage || hospital.logo}
                alt={hospital.hospitalName}
                className="w-full h-full rounded-3xl object-cover"
              />
            ) : (
              <Building2 className="text-cyan-600" size={46} />
            )}
          </div>

          <h1 className="text-2xl font-black text-slate-950">
            {hospital.hospitalName}
          </h1>

          <div className="flex items-center gap-2 mt-2">
            <span className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-[11px] font-black">
              Multi-speciality
            </span>

            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-black">
              Verified
            </span>
          </div>

          <Info icon={MapPin}>
            {[hospital.address, hospital.city, hospital.state]
              .filter(Boolean)
              .join(", ") || "Location available"}
          </Info>

          <Info icon={Phone}>{hospital.mobile || "Phone not available"}</Info>

          <Info icon={Mail}>{hospital.email || "Email not available"}</Info>
        </section>

        <section className="grid grid-cols-3 gap-2 mt-3">
          <Stat label="Doctors" value={doctors.length} />
          <Stat label="Rating" value="4.7" />
          <Stat label="Care" value="24/7" />
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-slate-950">
              Available Doctors
            </h2>

            <Link to="/doctors" className="text-cyan-600 font-black text-xs">
              View All
            </Link>
          </div>

          {doctors.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">
              No doctors available for this hospital yet.
            </p>
          ) : (
            <div className="space-y-3">
              {doctors.slice(0, 5).map((doctor) => (
                <DoctorRow key={doctor.id} doctor={doctor} />
              ))}
            </div>
          )}
        </section>

        <section className="bg-slate-950 rounded-3xl p-4 text-white mt-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-cyan-300" size={28} />

            <div>
              <h3 className="font-black">Trusted Care Partner</h3>
              <p className="text-sm text-slate-300 mt-1">
                Verified hospital profile with active doctors and appointment
                support.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Info({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
      <Icon size={16} className="text-cyan-600 shrink-0" />
      <span className="font-bold">{children}</span>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 text-center">
      <p className="text-lg font-black text-slate-950">{value}</p>
      <p className="text-[10px] text-slate-500 font-bold">{label}</p>
    </div>
  );
}

function DoctorRow({ doctor }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
      <Link
        to={`/doctor/${doctor.id}`}
        className="flex items-center gap-3 active:scale-[0.99]"
      >
        {doctor.profileImage ? (
          <img
            src={doctor.profileImage}
            alt={doctor.doctorName}
            className="w-12 h-12 rounded-2xl object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
            <Stethoscope className="text-cyan-600" size={22} />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-black text-slate-950 truncate">
            {doctor.doctorName}
          </h3>

          <p className="text-xs text-cyan-700 font-black truncate">
            {doctor.specialization || "Specialist"}
          </p>

          <p className="text-[11px] text-slate-500 font-bold mt-1">
            {doctor.experience || 5}+ yrs exp
          </p>
        </div>

        <ChevronRight className="text-slate-400" size={18} />
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm font-black text-slate-950">
          ₹{doctor.consultationFee || 0}
        </div>

        <Link
          to={`/doctor/${doctor.id}`}
          className="bg-cyan-600 text-white px-4 py-2 rounded-xl text-xs font-black active:scale-95 transition"
        >
          Book Appointment
        </Link>
      </div>
    </div>
  );
}