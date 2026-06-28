import { useEffect, useState } from "react";
import {
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
  Video,
  Loader2,
  Users,
} from "lucide-react";
import api from "../api/axios";
import { useParams, Link, useSearchParams } from "react-router-dom";

export default function DoctorProfile() {
  const { id } = useParams();

  const [searchParams] = useSearchParams();

const [consultType, setConsultType] = useState(
  searchParams.get("type") === "VIDEO" ? "VIDEO" : "IN_PERSON"
);

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
 

  useEffect(() => {
    const loadDoctorProfile = async () => {
      try {
        setLoading(true);

        const doctorRes = await api.get(`/doctor/${id}`);
        setDoctor(doctorRes.data);

        const slotRes = await api.get(
          `/slot/doctor/${id}/available?type=${consultType}`
        );

       const now = new Date();

const availableSlots = (slotRes.data || []).filter((slot) => {
  const slotDateTime = new Date(`${slot.date}T${slot.startTime}`);
  return slotDateTime > now;
});

setSlots(availableSlots);
setSelectedSlot(availableSlots[0] || null);

        try {
          const reviewRes = await api.get(`/review/doctor/${id}`);
          setReviews(reviewRes.data || []);
        } catch {
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
        } catch {
          setRatingSummary({
            averageRating: 0,
            totalReviews: 0,
          });
        }
      } catch (error) {
        console.error("Doctor API error:", error);
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    loadDoctorProfile();
  }, [id, consultType]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f8fb] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
          <Loader2 className="text-cyan-600 animate-spin mx-auto" size={34} />
          <p className="text-slate-500 font-bold mt-3">
            Loading doctor profile...
          </p>
        </div>
      </main>
    );
  }

  if (!doctor) {
    return (
      <main className="min-h-screen bg-[#f4f8fb] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
          <p className="text-red-500 font-black text-lg">Doctor not found</p>

          <Link
            to="/doctors"
            className="inline-flex mt-5 px-5 py-3 rounded-2xl bg-cyan-600 text-white font-black"
          >
            Back to Doctors
          </Link>
        </div>
      </main>
    );
  }

  const averageRating = Number(ratingSummary.averageRating || 4.8).toFixed(1);
  const totalReviews = ratingSummary.totalReviews || reviews.length || 0;
  const availableToday = slots.length > 0;

  const consultationFee =
    consultType === "VIDEO"
      ? Math.max(Number(doctor.consultationFee || 0) - 100, 0)
      : Number(doctor.consultationFee || 0);

  return (
    <main className="min-h-screen bg-[#f4f8fb] px-4 pt-4 pb-36">
      <div className="max-w-md mx-auto">
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
          <div className="flex gap-3">
            <div className="relative shrink-0">
              <img
                src={
                  doctor.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    doctor.doctorName || "Doctor"
                  )}&background=0891b2&color=fff&bold=true&size=220`
                }
                alt={doctor.doctorName}
                className="w-24 h-24 rounded-[1.7rem] object-cover border border-slate-100"
              />

              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white">
                <BadgeCheck size={15} className="text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-[10px]">
                <ShieldCheck size={12} />
                Verified Doctor
              </div>

              <h1 className="text-xl font-black text-slate-950 truncate mt-2">
                {doctor.doctorName}
              </h1>

              <p className="text-sm text-cyan-700 font-black truncate">
                {doctor.specialization || "Specialist"}
              </p>

              <p className="text-xs text-slate-500 mt-1 truncate">
                {doctor.qualification || "Qualification not available"}
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-[11px] font-black">
                  <Star size={12} className="fill-yellow-500 text-yellow-500" />
                  {averageRating}
                </span>

                <span className="text-[11px] text-slate-500 font-bold">
                  {totalReviews} reviews
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto">
            <Chip>
              <Award size={12} />
              {doctor.experience || 0}+ Years
            </Chip>

            <Chip success={availableToday}>
              <Clock size={12} />
              {availableToday ? "Available Today" : "No Slots"}
            </Chip>

            <Chip>
              <Star size={12} />
              {averageRating} Rating
            </Chip>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-2 mt-3">
          <MiniStat
            icon={Award}
            value={`${doctor.experience || 0}+`}
            label="Years Exp"
          />

          <MiniStat icon={Star} value={averageRating} label="Rating" />

          <MiniStat
            icon={Users}
            value={`${Math.max(totalReviews * 12, 100)}+`}
            label="Patients"
          />
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <h2 className="text-lg font-black text-slate-950">
            Consultation Details
          </h2>

          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-3 mt-3">
            <InfoLine
              icon={Building2}
              label="Hospital"
              value={doctor.hospital?.hospitalName || "Hospital Not Available"}
            />

            <InfoLine
              icon={MapPin}
              label="Location"
              value={`${doctor.city || doctor.hospital?.city || "Available"}${
                doctor.state ? `, ${doctor.state}` : ""
              }`}
            />

            <InfoLine
              icon={GraduationCap}
              label="Qualification"
              value={doctor.qualification || "Not Available"}
            />
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <div className="bg-slate-100 rounded-2xl p-1 flex">
            <button
              type="button"
              onClick={() => setConsultType("IN_PERSON")}
              className={`flex-1 py-3 rounded-xl text-sm font-black transition ${
                consultType === "IN_PERSON"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              🏥 In-Person
            </button>

            <button
              type="button"
              onClick={() => setConsultType("VIDEO")}
              className={`flex-1 py-3 rounded-xl text-sm font-black transition ${
                consultType === "VIDEO"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              🎥 Video-Consult
            </button>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-bold">
                  Consultation Fee
                </p>

                <div className="flex items-center text-2xl font-black text-slate-950 mt-1">
                  <IndianRupee size={20} />
                  {consultationFee}
                </div>
              </div>

              <span
                className={`px-3 py-2 rounded-2xl text-xs font-black ${
                  consultType === "VIDEO"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {consultType === "VIDEO"
                  ? "Video-Consult"
                  : "In-Person Visit"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-5 mb-3">
            <div>
              <h2 className="text-lg font-black text-slate-950">
                Available Slots
              </h2>

              <p className="text-xs text-slate-500 font-bold">
                {consultType === "VIDEO"
                  ? "Online consultation timings"
                  : "Hospital visit timings"}
              </p>
            </div>

            <span className="text-xs font-black text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full">
              {slots.length} Slots
            </span>
          </div>

          {slots.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-3xl p-6 text-center">
              <Clock className="text-cyan-600 mx-auto mb-3" size={30} />

              <p className="font-black text-slate-950">No slots available</p>

              <p className="text-sm text-slate-500 mt-1">
                {consultType === "VIDEO"
                  ? "No video-consult slots available."
                  : "No in-person slots available."}
              </p>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {slots.map((slot) => {
                const active = selectedSlot?.id === slot.id;

                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`min-w-[150px] rounded-3xl p-4 border text-left active:scale-95 transition ${
                      active
                        ? "bg-cyan-600 border-cyan-600 text-white"
                        : "bg-white border-slate-200 text-slate-950"
                    }`}
                  >
                    <p className="text-xl font-black">{slot.startTime}</p>

                    <p
                      className={`text-xs mt-1 ${
                        active ? "text-cyan-50" : "text-slate-500"
                      }`}
                    >
                      {slot.date}
                    </p>

                    <p
                      className={`text-[11px] mt-2 font-black ${
                        active ? "text-cyan-50" : "text-cyan-700"
                      }`}
                    >
                      Ends {slot.endTime}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-black text-slate-950">
                {averageRating} Patient Experience
              </h2>

              <p className="text-xs text-slate-500 font-bold">
                Based on {totalReviews} verified reviews
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center">
              <Star className="text-yellow-500 fill-yellow-500" size={24} />
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-3xl p-6 text-center">
              <MessageSquare className="text-cyan-600 mx-auto mb-3" size={30} />

              <p className="font-black text-slate-950">No reviews yet</p>

              <p className="text-sm text-slate-500 mt-1">
                Reviews will appear after consultations.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.slice(0, 3).map((review) => (
                <div
                  key={review.id}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-950 text-sm">
                        {review.patient?.fullName || "Anonymous"}
                      </p>

                      <p className="text-xs text-slate-500">
                        Verified Patient
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs font-black">
                      <Star
                        size={12}
                        className="fill-yellow-500 text-yellow-500"
                      />
                      {review.rating}/5
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mt-3">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="fixed bottom-4 left-0 right-0 z-40 px-4">
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-3">
          {selectedSlot ? (
            <div className="flex items-center gap-3">
              <div className="min-w-[82px]">
                <p className="text-[10px] text-slate-500 font-bold">
                  Payable
                </p>

                <div className="flex items-center text-lg font-black text-slate-950">
                  <IndianRupee size={16} />
                  {consultationFee}
                </div>
              </div>

              <Link
                to={`/book/${doctor.id}/${selectedSlot.id}?type=${consultType}`}
                className={`flex-1 py-3 rounded-2xl text-center font-black text-white active:scale-95 transition ${
                  consultType === "VIDEO"
                    ? "bg-blue-600"
                    : "bg-emerald-600"
                }`}
              >
                Continue Booking
              </Link>
            </div>
          ) : (
            <button
              disabled
              className="w-full bg-slate-300 text-white py-3 rounded-2xl font-black text-sm"
            >
              No Slots
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

function Chip({ children, success }) {
  return (
    <span
      className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black ${
        success
          ? "bg-emerald-50 text-emerald-700"
          : "bg-cyan-50 text-cyan-700"
      }`}
    >
      {children}
    </span>
  );
}

function MiniStat({ icon: Icon, value, label }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 text-center">
      <Icon className="text-cyan-600 mx-auto mb-1.5" size={19} />

      <p className="font-black text-slate-950 text-sm">{value}</p>

      <p className="text-[11px] text-slate-500 font-bold">{label}</p>
    </div>
  );
}

function InfoLine({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-b-0">
      <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shrink-0 border border-slate-100">
        <Icon className="text-cyan-600" size={19} />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-bold">{label}</p>

        <p className="font-black text-slate-900 text-sm truncate">
          {value || "Not Available"}
        </p>
      </div>
    </div>
  );
}