import { useEffect, useState } from "react";
import {
  HeartPulse,
  Brain,
  Baby,
  Eye,
  Bone,
  Stethoscope,
  IndianRupee,
  Building2,
  MapPin,
  FlaskConical,
  Video,
  Hospital,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function HomeTabs() {
  return (
    <section className="max-w-[1100px] mx-auto px-4 py-2">
      <QuickActions />
      <SpecialitiesSection />
      <TopDoctorsSection />
      <FeaturedHospitalsSection />
    </section>
  );
}

function QuickActions() {
  const actions = [
    {
      icon: Stethoscope,
      title: "Book Doctor",
      subtitle: "Clinic visit",
      link: "/doctors",
    },
    {
      icon: Video,
      title: "Video Consult",
      subtitle: "Talk online",
      link: "/video-consult",
    },
    {
      icon: FlaskConical,
      title: "Lab Tests",
      subtitle: "At home",
      link: "/patient/lab-tests",
    },
    {
      icon: Hospital,
      title: "Hospitals",
      subtitle: "Near you",
      link: "/hospitals",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {actions.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.title}
            to={item.link}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm px-2 py-3 text-center active:scale-95 transition"
          >
            <div className="w-11 h-11 mx-auto rounded-2xl bg-cyan-50 flex items-center justify-center mb-2">
              <Icon className="text-cyan-600" size={21} />
            </div>

            <h3 className="text-[11px] font-black text-slate-900 leading-tight">
              {item.title}
            </h3>

            <p className="text-[10px] text-slate-400 font-bold leading-tight mt-0.5">
              {item.subtitle}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

function SpecialitiesSection() {
  const navigate = useNavigate();

  const items = [
    {
      name: "Cardiology",
      icon: HeartPulse,
      bg: "bg-red-50",
      text: "text-red-600",
    },
    {
      name: "Neurology",
      icon: Brain,
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    {
      name: "Pediatrics",
      icon: Baby,
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      name: "Eye Care",
      search: "Ophthalmology",
      icon: Eye,
      bg: "bg-cyan-50",
      text: "text-cyan-600",
    },
    {
      name: "Ortho",
      search: "Orthopedics",
      icon: Bone,
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
    {
      name: "General",
      search: "General Physician",
      icon: Stethoscope,
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
  ];

  return (
    <section className="mt-4">
      <SectionHeader
        title="Popular Specialities"
        action="View All"
        onClick={() => navigate("/doctors")}
      />

      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              type="button"
              onClick={() =>
                navigate(
                  `/doctors?specialization=${encodeURIComponent(
                    item.search || item.name
                  )}`
                )
              }
              className="bg-white border border-slate-100 rounded-2xl p-3 text-center shadow-sm active:scale-95 transition"
            >
              <div
                className={`w-12 h-12 mx-auto rounded-2xl ${item.bg} flex items-center justify-center`}
              >
                <Icon size={22} className={item.text} />
              </div>

              <p className="text-xs font-black text-slate-800 mt-2 leading-tight">
                {item.name}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function TopDoctorsSection() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    api
      .get("/doctor")
      .then((res) => {
        const activeDoctors = (res.data || [])
          .filter((doctor) => doctor.isActive)
          .slice(0, 6);

        setDoctors(activeDoctors);
      })
      .catch((err) => console.error("Doctors load error:", err));
  }, []);

  return (
    <section className="mt-4">
      <SectionHeader
        title="Top Doctors"
        action="View All"
        to="/doctors"
      />

      {doctors.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
          <Stethoscope className="text-cyan-600 mx-auto mb-2" size={32} />

          <p className="text-sm text-slate-500 font-bold">
            Doctors will appear here soon.
          </p>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </section>
  );
}

function DoctorCard({ doctor }) {
  const rating = doctor.rating || doctor.averageRating || 4.8;
  const experience = doctor.experience || 5;

  return (
    <Link
      to={`/doctor/${doctor.id}`}
      className="shrink-0 w-56 bg-white border border-slate-100 rounded-3xl p-3 shadow-sm active:scale-95 transition"
    >
      <div className="flex items-start gap-3">
        {doctor.profileImage ? (
          <img
            src={doctor.profileImage}
            alt={doctor.doctorName}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-100"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center border border-cyan-100">
            <Stethoscope size={26} className="text-cyan-600" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-black text-slate-950 truncate">
            {doctor.doctorName || "Doctor"}
          </h3>

          <p className="text-xs text-cyan-700 font-black truncate">
            {doctor.specialization || "Specialist"}
          </p>

          <div className="inline-flex items-center gap-1 mt-2 bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-[10px] font-black">
            ⭐ {rating}
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        <Info icon={Building2}>
          {doctor.hospital?.hospitalName || "Hospital"}
        </Info>

        <Info icon={MapPin}>
          {doctor.city || doctor.hospital?.city || "Available"}
        </Info>

        <p className="text-[11px] text-slate-500 font-bold">
          {experience}+ years experience
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center text-sm font-black text-slate-950">
          <IndianRupee size={13} />
          {doctor.consultationFee || 0}
        </div>

        <span className="bg-cyan-600 text-white rounded-xl px-3 py-2 text-xs font-black">
          Book
        </span>
      </div>
    </Link>
  );
}

function SectionHeader({ title, action, to, onClick }) {
  if (to) {
    return (
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-black text-slate-950">
          {title}
        </h2>

        <Link
          to={to}
          className="inline-flex items-center gap-1 text-cyan-600 font-black text-xs"
        >
          {action}
          <ChevronRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-lg font-black text-slate-950">
        {title}
      </h2>

      {action && (
        <button
          type="button"
          onClick={onClick}
          className="inline-flex items-center gap-1 text-cyan-600 font-black text-xs"
        >
          {action}
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

function Info({ icon: Icon, children }) {
  return (
    <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 min-w-0">
      <Icon size={12} className="text-cyan-600 shrink-0" />
      <span className="truncate">{children}</span>
    </div>
  );
}

function FeaturedHospitalsSection() {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    api
      .get("/hospital")
      .then((res) => {
        setHospitals((res.data || []).slice(0, 6));
      })
      .catch((err) => console.error("Hospitals load error:", err));
  }, []);

  return (
    <section className="mt-4">
      <SectionHeader
        title="Featured Hospitals"
        action="View All"
        to="/hospitals"
      />

      {hospitals.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
          <Building2 className="text-cyan-600 mx-auto mb-2" size={32} />
          <p className="text-sm text-slate-500 font-bold">
            Hospitals will appear here soon.
          </p>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {hospitals.map((hospital) => {
            const rating = hospital.rating || hospital.averageRating || 4.7;
            const doctorCount = hospital.doctors?.length || hospital.doctorCount || 25;

            return (
              <Link
  key={hospital.id}
  to={`/hospital/${hospital.id}`}
  className="shrink-0 w-56 bg-white border border-slate-100 rounded-3xl p-3 shadow-sm active:scale-95 transition"
>
                <div className="relative w-full h-24 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center mb-3 overflow-hidden">
                  {hospital.profileImage || hospital.logo ? (
                    <img
                      src={hospital.profileImage || hospital.logo}
                      alt={hospital.hospitalName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="text-cyan-600" size={36} />
                  )}

                  <span className="absolute top-2 right-2 bg-white/95 rounded-full px-2 py-1 text-[10px] font-black text-amber-700 shadow-sm">
                    ⭐ {rating}
                  </span>
                </div>

                <h3 className="text-sm font-black text-slate-950 truncate">
                  {hospital.hospitalName || "Hospital"}
                </h3>

                <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin size={12} className="text-cyan-600 shrink-0" />
                  <span className="truncate">
                    {hospital.city || hospital.state || "Available"}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-[10px]">
  <span className="text-cyan-700 font-black">
    Multi-speciality
  </span>

  <span className="text-slate-500 font-bold">
    {doctorCount}+ Doctors
  </span>
</div>

                <div className="mt-3 bg-slate-950 text-white rounded-xl py-2 text-center text-xs font-black">
                  View Hospital
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}