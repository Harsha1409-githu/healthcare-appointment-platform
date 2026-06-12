import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Stethoscope,
  BadgeCheck,
  Star,
  IndianRupee,
  Award,
  Building2,
  MapPin,
  GraduationCap,
  CalendarCheck,
  Clock,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  Video,
} from "lucide-react";
import api from "../api/axios";

export default function DoctorProfile() {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDoctorProfile = async () => {
      try {
        const doctorRes = await api.get(`/doctor/${id}`);
        setDoctor(doctorRes.data);

        try {
          const slotRes = await api.get(`/slot/doctor/${id}/available`);
          setSlots(slotRes.data || []);
        } catch (slotErr) {
          console.error("Slot API error:", slotErr);
          setSlots([]);
        }

        try {
          const reviewRes = await api.get(`/review/doctor/${id}`);
          setReviews(reviewRes.data || []);
        } catch (reviewErr) {
          console.error("Review API error:", reviewErr);
          setReviews([]);
        }

        try {
          const summaryRes = await api.get(`/review/doctor/${id}/summary`);
          setRatingSummary(
            summaryRes.data || {
              averageRating: 0,
              totalReviews: 0,
            }
          );
        } catch (summaryErr) {
          console.error("Summary API error:", summaryErr);
          setRatingSummary({
            averageRating: 0,
            totalReviews: 0,
          });
        }
      } catch (doctorErr) {
        console.error("Doctor API error:", doctorErr);
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    loadDoctorProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4fbff] flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="text-cyan-600 animate-pulse" size={34} />
          </div>
          <p className="text-slate-500 font-semibold">
            Loading doctor profile...
          </p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-[#f4fbff] flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
          <p className="text-red-500 font-black text-xl">
            Doctor not found
          </p>
          <Link
            to="/doctors"
            className="inline-flex mt-5 px-5 py-3 rounded-2xl bg-cyan-600 text-white font-black"
          >
            Back to Doctors
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = Number(ratingSummary.averageRating || 0).toFixed(1);

  return (
    <div className="bg-[#f4fbff] min-h-screen">
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-[1450px] mx-auto px-6 py-10">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 text-cyan-700 font-black mb-6"
          >
            ← Back to Doctors
          </Link>

          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative shrink-0">
                  <img
                    src={
                      doctor.profileImage ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        doctor.doctorName || "Doctor"
                      )}&background=0891b2&color=fff&bold=true&size=220`
                    }
                    alt={doctor.doctorName}
                    className="w-36 h-36 rounded-[2rem] object-cover border border-slate-100 shadow-sm"
                  />

                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-white">
                    <BadgeCheck size={19} className="text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs mb-3">
                    <ShieldCheck size={14} />
                    Verified Doctor
                  </div>

                  <h1 className="text-4xl font-black text-slate-950">
                    {doctor.doctorName}
                  </h1>

                  <p className="text-cyan-700 text-xl font-black mt-2">
                    {doctor.specialization || "Specialist"}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 mt-6">
                    <InfoItem
                      icon={GraduationCap}
                      label="Qualification"
                      value={doctor.qualification || "Not Available"}
                    />

                    <InfoItem
                      icon={Award}
                      label="Experience"
                      value={`${doctor.experience || 0}+ Years`}
                    />

                    <InfoItem
                      icon={Building2}
                      label="Hospital"
                      value={
                        doctor.hospital?.hospitalName ||
                        "Hospital Not Available"
                      }
                    />

                    <InfoItem
                      icon={MapPin}
                      label="Location"
                      value={`${doctor.city || ""}${
                        doctor.state ? `, ${doctor.state}` : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <aside className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 lg:sticky lg:top-24">
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                <p className="text-sm text-slate-500 font-semibold">
                  Consultation Fee
                </p>

                <div className="flex items-center text-4xl font-black text-slate-950 mt-2">
                  <IndianRupee size={28} />
                  {doctor.consultationFee || 0}
                </div>

                <p className="text-sm text-emerald-700 font-black mt-3 flex items-center gap-2">
                  <CalendarCheck size={17} />
                  Instant appointment booking
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <MiniStat
                  icon={Star}
                  value={averageRating}
                  label={`${ratingSummary.totalReviews || 0} Reviews`}
                />

                <MiniStat
                  icon={Video}
                  value="Online"
                  label="Video Consult"
                />
              </div>

              {slots.length > 0 ? (
                <Link to={`/book/${doctor.id}/${slots[0].id}`}>
                  <button className="mt-5 w-full bg-cyan-600 text-white py-4 rounded-2xl font-black hover:bg-cyan-700 transition flex items-center justify-center gap-2">
                    Book Appointment
                    <ArrowRight size={18} />
                  </button>
                </Link>
              ) : (
                <button
                  disabled
                  className="mt-5 w-full bg-slate-300 text-white py-4 rounded-2xl font-black cursor-not-allowed"
                >
                  No Slots Available
                </button>
              )}

              <Link to="/doctors">
                <button className="mt-3 w-full border border-cyan-600 text-cyan-700 py-4 rounded-2xl font-black hover:bg-cyan-50 transition">
                  View Similar Doctors
                </button>
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <div className="max-w-[1450px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <main className="space-y-8">
            <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
                  <CalendarCheck className="text-cyan-600" size={25} />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    Available Slots
                  </h2>
                  <p className="text-slate-500">
                    Choose a convenient time and book instantly
                  </p>
                </div>
              </div>

              {slots.length === 0 ? (
                <div className="border border-dashed border-slate-200 rounded-3xl p-10 text-center">
                  <Clock className="text-cyan-600 mx-auto mb-4" size={38} />
                  <p className="font-black text-slate-950">
                    No slots available
                  </p>
                  <p className="text-slate-500 mt-2">
                    Please check again later or view similar doctors.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="border border-slate-100 bg-slate-50 rounded-3xl p-5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center border border-slate-100">
                          <Clock size={21} className="text-cyan-600" />
                        </div>

                        <div>
                          <p className="font-black text-slate-950">
                            {slot.date}
                          </p>

                          <p className="text-slate-500 mt-1">
                            {slot.startTime} - {slot.endTime}
                          </p>
                        </div>
                      </div>

                      <Link to={`/book/${doctor.id}/${slot.id}`}>
                        <button className="mt-5 w-full bg-cyan-600 text-white py-3 rounded-2xl font-black hover:bg-cyan-700 transition">
                          Book This Slot
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center">
                  <Star className="text-yellow-500" size={25} />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    Patient Reviews
                  </h2>
                  <p className="text-slate-500">
                    Feedback from verified patients
                  </p>
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className="border border-dashed border-slate-200 rounded-3xl p-10 text-center">
                  <MessageSquare
                    className="text-cyan-600 mx-auto mb-4"
                    size={38}
                  />
                  <p className="font-black text-slate-950">
                    No reviews yet
                  </p>
                  <p className="text-slate-500 mt-2">
                    Patient reviews will appear here after consultations.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border border-slate-100 rounded-3xl p-5 bg-slate-50"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-black text-slate-950">
                            {review.patient?.fullName || "Anonymous"}
                          </p>

                          <p className="text-sm text-slate-500">
                            Verified Patient
                          </p>
                        </div>

                        <div className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-full font-black border border-yellow-100">
                          <Star size={15} className="fill-yellow-500" />
                          {review.rating}/5
                        </div>
                      </div>

                      <p className="text-slate-600 leading-relaxed mt-4">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>

          <aside className="space-y-5">
            <TrustCard
              icon={ShieldCheck}
              title="Verified Profile"
              desc="Doctor details are reviewed before listing."
            />

            <TrustCard
              icon={CalendarCheck}
              title="Instant Booking"
              desc="Select available slots and confirm appointment quickly."
            />

            <TrustCard
              icon={Video}
              title="Online Consultation"
              desc="Video consultation support is available for eligible appointments."
            />
          </aside>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-4">
      <Icon className="text-cyan-600 shrink-0 mt-0.5" size={20} />

      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-semibold">
          {label}
        </p>

        <p className="font-black text-slate-800 mt-1 truncate">
          {value || "Not Available"}
        </p>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, value, label }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 p-4 text-center">
      <Icon className="text-cyan-600 mx-auto mb-2" size={22} />
      <p className="font-black text-slate-950">
        {value}
      </p>
      <p className="text-xs text-slate-500 font-semibold mt-1">
        {label}
      </p>
    </div>
  );
}

function TrustCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-5">
      <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center mb-4">
        <Icon className="text-cyan-600" size={22} />
      </div>

      <h3 className="font-black text-slate-950">
        {title}
      </h3>

      <p className="text-slate-500 text-sm mt-2 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}