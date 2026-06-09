import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Stethoscope,
  GraduationCap,
  BriefcaseMedical,
  BadgeIndianRupee,
  MapPin,
  Building2,
  BadgeCheck,
  Star,
  CalendarCheck,
  ArrowRight,
  Phone,
  Mail,
} from "lucide-react";
import api from "../api/axios";

export default function DoctorDetails() {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/doctor/${id}`),
      api.get(`/slot/doctor/${id}/available`),
    ])
      .then(([doctorRes, slotRes]) => {
        setDoctor(doctorRes.data);
        setSlots(slotRes.data || []);
      })
      .catch((err) => {
        console.error("Doctor details error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        Loading doctor details...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-red-500">
        Doctor not found
      </div>
    );
  }

  const doctorImage =
    doctor.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      doctor.doctorName || "Doctor"
    )}&background=0f172a&color=fff&bold=true`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/40 to-white py-10">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      <div className="absolute top-40 right-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-8 md:p-10 text-white shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center gap-8">
            <img
              src={doctorImage}
              alt={doctor.doctorName}
              className="w-36 h-36 rounded-[2rem] object-cover border-4 border-white/20 shadow-2xl"
            />

            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur mb-4">
                <BadgeCheck size={18} className="text-emerald-300" />
                <span className="text-sm font-semibold">
                  Verified Specialist
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black">
                {doctor.doctorName}
              </h1>

              <p className="text-cyan-200 text-xl font-semibold mt-2">
                {doctor.specialization || "Specialist"}
              </p>

              <div className="flex flex-wrap gap-3 mt-5">
                <Badge icon={Star} text="4.8 Rating" />
                <Badge icon={BriefcaseMedical} text={`${doctor.experience || 0}+ Years`} />
                <Badge icon={BadgeIndianRupee} text={`₹${doctor.consultationFee || 0}`} />
              </div>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-[2rem] p-5 min-w-[240px]">
              <p className="text-blue-100 text-sm mb-2">
                Consultation Fee
              </p>

              <p className="text-4xl font-black">
                ₹{doctor.consultationFee || 0}
              </p>

              <p className="text-blue-100 text-sm mt-2">
                Pay securely and book your slot.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6 md:p-8">
              <h2 className="text-2xl font-black text-slate-900 mb-6">
                Professional Details
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                <InfoCard
                  icon={Stethoscope}
                  label="Specialization"
                  value={doctor.specialization}
                />

                <InfoCard
                  icon={GraduationCap}
                  label="Qualification"
                  value={doctor.qualification}
                />

                <InfoCard
                  icon={BriefcaseMedical}
                  label="Experience"
                  value={`${doctor.experience || 0} Years`}
                />

                <InfoCard
                  icon={BadgeIndianRupee}
                  label="Consultation Fee"
                  value={`₹${doctor.consultationFee || 0}`}
                />

                <InfoCard
                  icon={Phone}
                  label="Mobile"
                  value={doctor.mobile}
                />

                <InfoCard
                  icon={Mail}
                  label="Email"
                  value={doctor.email}
                />
              </div>
            </section>

            <section className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6 md:p-8">
              <h2 className="text-2xl font-black text-slate-900 mb-6">
                Available Slots
              </h2>

              {slots.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-6 text-slate-500">
                  No available slots right now.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {slots.slice(0, 6).map((slot) => (
                    <Link
                      key={slot.id}
                      to={`/book/${doctor.id}/${slot.id}`}
                      className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:border-blue-500 hover:bg-blue-50 transition"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-black text-slate-900">
                            {slot.date}
                          </p>

                          <p className="text-sm text-slate-500">
                            {slot.startTime} - {slot.endTime}
                          </p>
                        </div>

                        <ArrowRight
                          size={20}
                          className="text-blue-600 group-hover:translate-x-1 transition"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6">
              <h2 className="text-xl font-black text-slate-900 mb-5">
                Hospital
              </h2>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center overflow-hidden">
                  {doctor.hospital?.profileImage ? (
                    <img
                      src={doctor.hospital.profileImage}
                      alt={doctor.hospital?.hospitalName || "Hospital"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 size={30} className="text-blue-600" />
                  )}
                </div>

                <div>
                  <p className="font-black text-slate-900">
                    {doctor.hospital?.hospitalName || "Hospital"}
                  </p>

                  <p className="text-sm text-slate-500">
                    Healthcare Partner
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6">
              <h2 className="text-xl font-black text-slate-900 mb-5">
                Location
              </h2>

              <div className="flex items-center gap-3 text-slate-600">
                <MapPin size={22} className="text-emerald-600" />

                <span>
                  {doctor.city || "-"}, {doctor.state || "-"}
                </span>
              </div>
            </section>

            <section className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2rem] shadow-xl p-6 text-white">
              <CalendarCheck size={34} className="mb-4" />

              <h2 className="text-2xl font-black mb-2">
                Book Appointment
              </h2>

              <p className="text-blue-100 mb-5">
                Select an available slot and confirm your consultation.
              </p>

              {slots.length > 0 ? (
                <Link to={`/book/${doctor.id}/${slots[0].id}`}>
                  <button className="w-full bg-white text-blue-700 py-4 rounded-2xl font-black hover:scale-[1.02] transition">
                    Book Now
                  </button>
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full bg-white/30 text-white py-4 rounded-2xl font-black cursor-not-allowed"
                >
                  No Slots
                </button>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Badge({ icon: Icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-bold">
      <Icon size={16} />
      {text}
    </span>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-slate-50 border border-slate-100 p-4">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
        <Icon size={22} className="text-blue-600" />
      </div>

      <div>
        <p className="text-xs font-bold uppercase text-slate-400">
          {label}
        </p>

        <p className="font-black text-slate-900">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}