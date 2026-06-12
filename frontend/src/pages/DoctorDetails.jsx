import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Stethoscope,
  GraduationCap,
  BriefcaseMedical,
  IndianRupee,
  MapPin,
  Building2,
  BadgeCheck,
  Star,
  CalendarCheck,
  ArrowRight,
  Phone,
  Mail,
  ShieldCheck,
  Clock,
  Video,
  Loader2,
  Award,
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
      <div className="min-h-screen bg-[#f4fbff] flex items-center justify-center">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 text-center">
          <Loader2 className="mx-auto text-cyan-600 animate-spin mb-4" size={38} />
          <p className="text-slate-500 font-semibold">
            Loading doctor details...
          </p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-[#f4fbff] flex items-center justify-center">
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 text-center">
          <p className="text-red-500 font-black text-xl">
            Doctor not found
          </p>
        </div>
      </div>
    );
  }

  const doctorImage =
    doctor.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      doctor.doctorName || "Doctor"
    )}&background=0891b2&color=fff&bold=true`;

  return (
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6 py-8">
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="grid xl:grid-cols-[1fr_330px] gap-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="relative shrink-0">
                <img
                  src={doctorImage}
                  alt={doctor.doctorName}
                  className="w-36 h-36 rounded-[2rem] object-cover border border-slate-100 shadow-sm"
                />

                <div className="absolute -bottom-3 -right-3 w-11 h-11 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-white">
                  <BadgeCheck size={20} className="text-white" />
                </div>
              </div>

              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-black text-sm mb-4">
                  <ShieldCheck size={17} />
                  VERIFIED SPECIALIST
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                  {doctor.doctorName}
                </h1>

                <p className="text-cyan-700 text-xl font-black mt-2">
                  {doctor.specialization || "Specialist"}
                </p>

                <div className="flex flex-wrap gap-3 mt-5">
                  <Badge icon={Star} text="4.8 Rating" />
                  <Badge
                    icon={BriefcaseMedical}
                    text={`${doctor.experience || 0}+ Years`}
                  />
                  <Badge icon={Video} text="Video Consult" />
                  <Badge icon={Clock} text="Available Today" />
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mt-6">
                  <InfoLine
                    icon={Building2}
                    text={doctor.hospital?.hospitalName || "Hospital Not Available"}
                  />

                  <InfoLine
                    icon={MapPin}
                    text={
                      doctor.city || doctor.hospital?.city || "Location Available"
                    }
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-[2rem] border border-slate-100 p-6">
              <p className="text-sm text-slate-500 font-semibold">
                Consultation Fee
              </p>

              <div className="flex items-center text-5xl font-black text-slate-950 mt-2">
                <IndianRupee size={34} />
                {doctor.consultationFee || 0}
              </div>

              <p className="text-emerald-700 font-black mt-4 flex items-center gap-2">
                <CalendarCheck size={18} />
                Instant appointment booking
              </p>

              <div className="grid gap-3 mt-6">
                {slots.length > 0 ? (
                  <Link to={`/book/${doctor.id}/${slots[0].id}`}>
                    <button className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black hover:bg-cyan-700 transition flex items-center justify-center gap-2">
                      Book Appointment
                      <ArrowRight size={18} />
                    </button>
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full bg-slate-300 text-white py-4 rounded-2xl font-black cursor-not-allowed"
                  >
                    No Slots Available
                  </button>
                )}

                <Link to="/doctors">
                  <button className="w-full border border-cyan-600 text-cyan-700 py-4 rounded-2xl font-black hover:bg-cyan-50 transition">
                    View Other Doctors
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="grid xl:grid-cols-[1fr_380px] gap-8">
          <main className="space-y-8">
            <section className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
              <h2 className="text-2xl font-black text-slate-950 mb-6">
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
                  icon={IndianRupee}
                  label="Consultation Fee"
                  value={`₹${doctor.consultationFee || 0}`}
                />

                <InfoCard icon={Phone} label="Mobile" value={doctor.mobile} />

                <InfoCard icon={Mail} label="Email" value={doctor.email} />
              </div>
            </section>

            <section className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    Available Slots
                  </h2>

                  <p className="text-slate-500 mt-1">
                    Choose your preferred appointment time.
                  </p>
                </div>

                <span className="hidden sm:inline-flex px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm">
                  {slots.length} Slots
                </span>
              </div>

              {slots.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-8 text-center">
                  <CalendarCheck className="mx-auto text-slate-300 mb-4" size={42} />

                  <h3 className="text-xl font-black text-slate-950">
                    No available slots
                  </h3>

                  <p className="text-slate-500 mt-2">
                    Please check again later or choose another doctor.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {slots.map((slot) => (
                    <Link
                      key={slot.id}
                      to={`/book/${doctor.id}/${slot.id}`}
                      className="group rounded-2xl border border-slate-100 bg-slate-50 p-5 hover:border-cyan-200 hover:bg-cyan-50 transition"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-black text-slate-950">
                            {slot.date}
                          </p>

                          <p className="text-sm text-slate-500 mt-1">
                            {slot.startTime} - {slot.endTime}
                          </p>
                        </div>

                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 group-hover:translate-x-1 transition">
                          <ArrowRight size={19} className="text-cyan-600" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </main>

          <aside className="space-y-6">
            <section className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
              <h2 className="text-xl font-black text-slate-950 mb-5">
                Hospital
              </h2>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center overflow-hidden border border-cyan-100">
                  {doctor.hospital?.profileImage ? (
                    <img
                      src={doctor.hospital.profileImage}
                      alt={doctor.hospital?.hospitalName || "Hospital"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 size={30} className="text-cyan-600" />
                  )}
                </div>

                <div>
                  <p className="font-black text-slate-950">
                    {doctor.hospital?.hospitalName || "Hospital"}
                  </p>

                  <p className="text-sm text-slate-500">
                    Healthcare Partner
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
              <h2 className="text-xl font-black text-slate-950 mb-5">
                Location
              </h2>

              <div className="flex items-center gap-3 text-slate-600 bg-slate-50 rounded-2xl border border-slate-100 p-4">
                <MapPin size={22} className="text-cyan-600" />

                <span className="font-semibold">
                  {doctor.city || "-"}, {doctor.state || "-"}
                </span>
              </div>
            </section>

            <section className="bg-cyan-600 rounded-[2rem] shadow-sm p-6 text-white">
              <CalendarCheck size={34} className="mb-4" />

              <h2 className="text-2xl font-black mb-2">
                Book Appointment
              </h2>

              <p className="text-cyan-100 mb-5">
                Select an available slot and confirm your consultation.
              </p>

              {slots.length > 0 ? (
                <Link to={`/book/${doctor.id}/${slots[0].id}`}>
                  <button className="w-full bg-white text-cyan-700 py-4 rounded-2xl font-black hover:bg-cyan-50 transition">
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
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-100 text-sm font-black">
      <Icon size={16} />
      {text}
    </span>
  );
}

function InfoLine({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3 text-slate-600 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 min-w-0">
      <Icon size={18} className="text-cyan-600 shrink-0" />
      <span className="truncate font-semibold">{text || "-"}</span>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-slate-50 border border-slate-100 p-4">
      <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
        <Icon size={22} className="text-cyan-600" />
      </div>

      <div>
        <p className="text-xs font-black uppercase text-slate-400">
          {label}
        </p>

        <p className="font-black text-slate-950">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}