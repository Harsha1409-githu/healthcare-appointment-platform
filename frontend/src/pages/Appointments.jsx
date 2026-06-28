import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  Clock,
  Stethoscope,
  UserRound,
  XCircle,
  Star,
  Send,
  MessageSquare,
  Video,
  ShieldCheck,
  CalendarX,
  RefreshCcw,
  Search,
  BadgeCheck,
  Phone,
  Building2,
  Filter,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import usePullToRefresh from "../hooks/usePullToRefresh";
import PageHeader from "../components/PageHeader";
import VideoConsultCountdown from "../components/VideoConsultCountdown";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);

  const selectedProfile = JSON.parse(
    localStorage.getItem("selectedProfile") || "null"
  );

  const patient = JSON.parse(localStorage.getItem("patientUser") || "null");

  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [rescheduleFor, setRescheduleFor] = useState(null);
const [availableSlots, setAvailableSlots] = useState([]);
const [selectedSlotId, setSelectedSlotId] = useState("");
  const [reviewForm, setReviewForm] = useState({
    appointmentId: null,
    doctorId: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointment/my");
      setAppointments(res.data || []);
    } catch (err) {
      console.error("Appointment API error:", err);

      if (err.response?.status === 401) {
        toast.error("Please login again");
        localStorage.removeItem("patientToken");
        localStorage.removeItem("patientUser");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } finally {
      setLoading(false);
    }
  };

  const { visible, pullDistance, refreshing } = usePullToRefresh(async () => {
    await fetchAppointments();
  });

  const cancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await api.patch(`/appointment/${id}/cancel`);

      setAppointments((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "CANCELLED" } : item
        )
      );

      toast.success("Appointment cancelled");
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error(error.response?.data?.message || "Failed to cancel appointment");
    }
  };

 const openReschedule = async (appointment) => {
  try {
    const type =
      appointment.appointmentType || "IN_PERSON";

    const res = await api.get(
      `/slot/doctor/${appointment.doctor.id}/available?type=${type}`
    );

    const slots = (res.data || []).filter(
      (slot) =>
        String(slot.id) !==
        String(appointment.slot?.id)
    );

    // RESET OLD SELECTION
    setSelectedSlotId("");

    // LOAD NEW AVAILABLE SLOTS
    setAvailableSlots(slots);

    // OPEN MODAL
    setRescheduleFor(appointment);
  } catch (err) {
    console.error(err);
    toast.error("Unable to load slots");
  }
};

const confirmReschedule = async () => {
  if (!selectedSlotId) {
    toast.error("Select a slot");
    return;
  }

  try {
    await api.patch(
      `/appointment/${rescheduleFor.id}/reschedule`,
      {
        newSlotId: selectedSlotId,
      }
    );

    toast.success("Appointment rescheduled");

    setRescheduleFor(null);
    setSelectedSlotId("");
    fetchAppointments();
  } catch (err) {
    console.error(err);
    toast.error(
      err.response?.data?.message ||
        "Failed to reschedule"
    );
  }
};

  const openReviewForm = (appointment) => {
    setReviewForm({
      appointmentId: appointment.id,
      doctorId: appointment.doctor?.id || "",
      rating: 5,
      comment: "",
    });
  };

  const closeReviewForm = () => {
    setReviewForm({
      appointmentId: null,
      doctorId: "",
      rating: 5,
      comment: "",
    });
  };

  const submitReview = async (e) => {
    e.preventDefault();

    if (!reviewForm.comment.trim()) {
      toast.error("Please enter review comment");
      return;
    }

    try {
      await api.post("/review", {
        doctorId: reviewForm.doctorId,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });

      toast.success("Review submitted");
      closeReviewForm();
    } catch (error) {
      console.error("Review error:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  const profileAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      if (!selectedProfile) return true;

      if (selectedProfile.isSelf) {
        return !appointment.familyMember;
      }

      return appointment.familyMember?.id === selectedProfile.id;
    });
  }, [appointments, selectedProfile]);

  const stats = useMemo(
    () => ({
      booked: profileAppointments.filter((a) => a.status === "BOOKED").length,
      completed: profileAppointments.filter((a) => a.status === "COMPLETED")
        .length,
      cancelled: profileAppointments.filter((a) => a.status === "CANCELLED")
        .length,
    }),
    [profileAppointments]
  );

  const filteredAppointments = profileAppointments.filter((appointment) => {
    const matchesStatus =
      statusFilter === "ALL" || appointment.status === statusFilter;

    const text = `${appointment.doctor?.doctorName || ""} ${
      appointment.doctor?.specialization || ""
    } ${appointment.patientName || ""} ${
      appointment.familyMember?.fullName || ""
    } ${appointment.doctor?.hospital?.hospitalName || ""}`.toLowerCase();

    return matchesStatus && text.includes(search.toLowerCase().trim());
  });

  const upcomingAppointment = filteredAppointments.find(
    (item) => item.status === "BOOKED"
  );

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-28">
      {visible && (
        <div
          className="fixed top-0 left-0 right-0 z-[100] flex justify-center transition-all duration-300"
          style={{ transform: `translateY(${pullDistance}px)` }}
        >
          <div className="mt-3 bg-white border border-slate-200 shadow-lg rounded-full px-4 py-2 flex items-center gap-2">
            <div
              className={`w-4 h-4 border-2 border-cyan-600 border-t-transparent rounded-full ${
                refreshing ? "animate-spin" : ""
              }`}
            />

            <span className="text-xs font-black text-cyan-700">
              {refreshing ? "Refreshing..." : "Pull to refresh"}
            </span>
          </div>
        </div>
      )}

      <PageHeader
        title="My Appointments"
        subtitle="Track bookings, video calls, reviews and cancellations"
      />

      <div className="max-w-md mx-auto px-4">
        <section className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-3xl p-4 text-white shadow-sm">
          <p className="text-xs font-bold text-cyan-100">APPOINTMENTS FOR</p>

          <h1 className="text-2xl font-black mt-1">
            {selectedProfile?.fullName || patient?.fullName || "Patient"}
          </h1>

          <p className="text-sm text-cyan-100 mt-1">
            {stats.booked} upcoming appointments
          </p>

        </section>

        <section className="grid grid-cols-3 gap-2 mt-3">
          <MiniStat title="Upcoming" value={stats.booked} />
          <MiniStat title="Completed" value={stats.completed} />
          <MiniStat title="Cancelled" value={stats.cancelled} />
        </section>

        {upcomingAppointment && (
          <UpcomingCard appointment={upcomingAppointment} />
        )}

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3 mt-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3">
            <Search className="text-cyan-600 shrink-0" size={17} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctor or hospital"
              className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="mt-2 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3">
            <Filter className="text-cyan-600 shrink-0" size={17} />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-slate-800 font-bold"
            >
              <option value="ALL">All Appointments</option>
              <option value="BOOKED">Booked</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </section>

        <section className="mt-3">
          {loading ? (
            <AppointmentsSkeleton />
          ) : profileAppointments.length === 0 ? (
            <EmptyAppointments />
          ) : filteredAppointments.length === 0 ? (
            <EmptyCard text="No appointments found." />
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  reviewForm={reviewForm}
                  openReviewForm={openReviewForm}
                  closeReviewForm={closeReviewForm}
                  submitReview={submitReview}
                  setReviewForm={setReviewForm}
                  cancelAppointment={cancelAppointment}
                  openReschedule={openReschedule}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {rescheduleFor && (
 <div className="fixed inset-0 z-[100] bg-black/40 flex items-end justify-center pb-20">
   <div className="bg-white w-full max-w-md rounded-t-3xl p-4 max-h-[80vh] overflow-y-auto">
      <h2 className="text-lg font-black">
        Reschedule Appointment
      </h2>

      <p className="text-sm text-slate-500 mt-1">
        Select a new slot
      </p>

      <div className="space-y-2 mt-4">
       {availableSlots.length === 0 ? (
  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
    <p className="text-sm font-black text-slate-700">
      No available slots found
    </p>
    <p className="text-xs text-slate-500 mt-1">
      Generate slots for this doctor/date or check slot type.
    </p>
  </div>
) : (
  availableSlots.map((slot) => (
    <button
      key={slot.id}
      type="button"
      onClick={() => setSelectedSlotId(slot.id)}
      className={`w-full text-left p-4 rounded-2xl border active:scale-95 transition ${
        selectedSlotId === slot.id
          ? "border-cyan-600 bg-cyan-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-black text-slate-950">
            {slot.date}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {slot.startTime} - {slot.endTime}
          </p>
        </div>

        {selectedSlotId === slot.id && (
          <CheckCircle2 className="text-cyan-600" size={20} />
        )}
      </div>
    </button>
  ))
)}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <button
          onClick={() => {
            setRescheduleFor(null);
            setSelectedSlotId("");
          }}
          className="py-3 rounded-2xl border border-slate-300 font-black"
        >
          Close
        </button>

        <button
          onClick={confirmReschedule}
          className="py-3 rounded-2xl bg-cyan-600 text-white font-black"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  );
}

function getVideoConsultStatus(appointment) {
  if (
    appointment.appointmentType !== "VIDEO" ||
    !appointment.slot?.date ||
    !formatTime(appointment.slot?.startTime)
  ) {
    return {
      canJoin: false,
      status: "NONE",
    };
  }

  const start = new Date(
    `${appointment.slot.date}T${appointment.slot.startTime}`
  );

  const now = new Date();

  const joinTime = new Date(start.getTime() - 10 * 60 * 1000);
  const expiryTime = new Date(start.getTime() + 30 * 60 * 1000);

  if (now < joinTime) {
    return {
      canJoin: false,
      status: "UPCOMING",
    };
  }

  if (now >= joinTime && now <= expiryTime) {
    return {
      canJoin: true,
      status: "LIVE",
    };
  }

  return {
    canJoin: false,
    status: "EXPIRED",
  };
}

function canRescheduleAppointment(appointment) {
  if (
    appointment.status !== "BOOKED" ||
    !appointment.slot?.date ||
    !formatTime(appointment.slot?.startTime)
  ) {
    return false;
  }

  const appointmentDateTime = new Date(
    `${appointment.slot.date}T${appointment.slot.startTime}`
  );

  const now = new Date();

  const cutoffTime = new Date(
    appointmentDateTime.getTime() - 2 * 60 * 60 * 1000
  );

  return now <= cutoffTime;
}

function UpcomingCard({ appointment }) {
  const videoStatus = getVideoConsultStatus(appointment);

  return (
    <section className="bg-slate-950 rounded-3xl p-4 text-white mt-3">
      <p className="text-xs text-cyan-200 font-black">NEXT APPOINTMENT</p>

      <h2 className="text-lg font-black mt-1 truncate">
        {appointment.doctor?.doctorName || "Doctor"}
      </h2>

      <p className="text-sm text-cyan-100 font-bold truncate">
        {appointment.doctor?.specialization || "Specialist"}
      </p>

      <div className="flex items-center gap-2 mt-3 text-sm text-slate-200 font-bold">
        <Clock size={15} className="text-cyan-300" />
        {appointment.slot?.date || "-"} • {formatTime(appointment.slot?.startTime) || "-"}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <Link
          to={`/doctor/${appointment.doctor?.id}`}
          className="bg-white text-slate-950 py-3 rounded-2xl font-black text-sm text-center"
        >
          View Doctor
        </Link>

        {appointment.appointmentType === "VIDEO" ? (
          videoStatus.canJoin ? (
            <a
              href={appointment.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="bg-green-500 text-white py-3 rounded-2xl font-black text-sm text-center animate-pulse"
            >
              🎥 Join Video-Consult
            </a>
          ) : (
            <div className="bg-slate-700 text-white py-3 rounded-2xl font-black text-sm text-center">
              {videoStatus.status === "UPCOMING" ? (
  <VideoConsultCountdown appointment={appointment} />
) : (
  "Expired"
)}
            </div>
          )
        ) : (
         <Link
  to={`/patient/appointments/${appointment.id}`}
  className="bg-cyan-500 text-white py-3 rounded-2xl font-black text-sm text-center"
>
  View Details
</Link>
        )}
      </div>
    </section>
  );
}

function AppointmentCard({
  appointment,
  reviewForm,
  openReviewForm,
  closeReviewForm,
  submitReview,
  setReviewForm,
  cancelAppointment,
  openReschedule,
}) {
  const doctorImage =
    appointment.doctor?.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      appointment.doctor?.doctorName || "Doctor"
    )}&background=0891b2&color=fff&bold=true`;

    const videoStatus = getVideoConsultStatus(appointment);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
         <StatusBadge
  status={appointment.status}
  appointmentType={appointment.appointmentType}
/>

          {appointment.doctor?.id && (
            <Link
              to={`/doctor/${appointment.doctor.id}`}
              className="text-xs font-black text-cyan-600"
            >
              View Doctor
            </Link>
          )}
        </div>

        <div className="flex gap-3">
          <div className="relative shrink-0">
            <img
              src={doctorImage}
              alt={appointment.doctor?.doctorName || "Doctor"}
              className="w-20 h-20 rounded-3xl object-cover border border-slate-100"
            />

            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white">
              <BadgeCheck size={13} className="text-white" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-black text-slate-950 truncate">
              {appointment.doctor?.doctorName || "Doctor"}
            </h3>

            <p className="text-sm text-cyan-700 font-black truncate">
              {appointment.doctor?.specialization || "Specialization"}
            </p>

            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-black mt-2 max-w-full">
              <Building2 size={11} />
              <span className="truncate">
                {appointment.doctor?.hospital?.hospitalName ||
                  "Hospital Not Available"}
              </span>
            </div>

            <div className="mt-2 space-y-1">
              <InfoLine
                icon={Clock}
                text={`${appointment.slot?.date || "-"} | ${
                  formatTime(appointment.slot?.startTime) || ""
                } - ${formatTime(appointment.slot?.endTime) || ""}`}
              />

              <InfoLine
                icon={UserRound}
                text={
                  appointment.familyMember?.fullName ||
                  appointment.patientName ||
                  "Patient"
                }
              />

              <InfoLine
                icon={Phone}
                text={appointment.patientPhone || "Phone Not Available"}
              />
            </div>

            {appointment.familyMember && (
              <div className="inline-flex items-center mt-2 px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black">
                {appointment.familyMember.relation}
              </div>
            )}

            <AppointmentTimeline appointment={appointment} />
          </div>
        </div>
      </div>

      {appointment.status === "CANCELLED" && (
        <div className="mx-4 mb-3 text-xs text-red-600 font-semibold bg-red-50 border border-red-100 rounded-2xl p-3">
          Slot released and available again.
        </div>
      )}

      <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
        <div className="grid grid-cols-2 gap-2">

  {appointment.status === "BOOKED" &&
    appointment.appointmentType === "VIDEO" && (
      videoStatus.canJoin ? (
        <Link
          to={`/patient/appointments/${appointment.id}`}
          className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-green-600 px-3 py-3 text-white text-sm font-black animate-pulse"
        >
          <Video size={16} />
          Join Video-Consult
        </Link>
      ) : (
        <div className="col-span-2">
          <VideoConsultCountdown
            appointment={appointment}
          />
        </div>
      )
    )}

  {appointment.status === "BOOKED" && (
    <>
      <button
        disabled={!canRescheduleAppointment(appointment)}
        onClick={() =>
          canRescheduleAppointment(appointment) &&
          openReschedule(appointment)
        }
        className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-black ${
          canRescheduleAppointment(appointment)
            ? "bg-cyan-600 text-white"
            : "bg-slate-200 text-slate-500"
        }`}
      >
        <RefreshCcw size={15} />
        {canRescheduleAppointment(appointment)
          ? "Reschedule"
          : "Closed"}
      </button>

      <button
        onClick={() => cancelAppointment(appointment.id)}
        className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-3 text-white text-xs font-black"
      >
        <XCircle size={15} />
        Cancel
      </button>
    </>
  )}

  {appointment.status === "COMPLETED" && (
    <button
      onClick={() => openReviewForm(appointment)}
      className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-3 py-3 text-white text-xs font-black"
    >
      <Star size={15} />
      Write Review
    </button>
  )}

  {appointment.status === "CANCELLED" &&
    appointment.doctor?.id && (
      <Link
        to={`/doctor/${appointment.doctor.id}`}
        className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-3 py-3 text-white text-xs font-black"
      >
        <RefreshCcw size={15} />
        Book Again
      </Link>
    )}
</div>
      </div>

      {reviewForm.appointmentId === appointment.id && (
        <form
          onSubmit={submitReview}
          className="border-t border-slate-100 bg-white p-4"
        >
          <h3 className="text-base font-black text-slate-950">
            Write a Review
          </h3>

          <div className="space-y-3 mt-3">
            <select
              value={reviewForm.rating}
              onChange={(e) =>
                setReviewForm({
                  ...reviewForm,
                  rating: e.target.value,
                })
              }
              className="w-full border border-slate-200 bg-slate-50 rounded-2xl p-3 outline-none text-sm font-bold"
            >
              <option value={5}>⭐⭐⭐⭐⭐ 5</option>
              <option value={4}>⭐⭐⭐⭐ 4</option>
              <option value={3}>⭐⭐⭐ 3</option>
              <option value={2}>⭐⭐ 2</option>
              <option value={1}>⭐ 1</option>
            </select>

            <input
              value={reviewForm.comment}
              onChange={(e) =>
                setReviewForm({
                  ...reviewForm,
                  comment: e.target.value,
                })
              }
              placeholder="Write your feedback"
              className="w-full border border-slate-200 bg-slate-50 rounded-2xl p-3 outline-none text-sm"
            />
          </div>

          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 text-white px-4 py-3 rounded-xl font-black text-xs"
            >
              <Send size={15} />
              Submit
            </button>

            <button
              type="button"
              onClick={closeReviewForm}
              className="flex-1 border border-slate-300 px-4 py-3 rounded-xl font-black text-xs"
            >
              Close
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function AppointmentsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 animate-pulse"
        >
          <div className="flex gap-3">
            <div className="w-20 h-20 rounded-3xl bg-slate-200" />

            <div className="flex-1">
              <div className="h-4 w-36 bg-slate-200 rounded-full mb-2" />
              <div className="h-3 w-24 bg-slate-200 rounded-full mb-2" />
              <div className="h-3 w-44 bg-slate-200 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="h-10 bg-slate-200 rounded-xl" />
            <div className="h-10 bg-slate-200 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyAppointments() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
      <CalendarCheck className="text-cyan-600 mx-auto mb-3" size={32} />

      <h3 className="text-lg font-black text-slate-950">No appointments</h3>

      <p className="text-sm text-slate-500 mt-1">
        Your booked appointments will appear here.
      </p>

      <Link
        to="/doctors"
        className="inline-flex items-center gap-2 mt-4 bg-cyan-600 text-white px-5 py-3 rounded-2xl font-black text-sm"
      >
        <Stethoscope size={17} />
        Find Doctors
      </Link>
    </div>
  );
}

function EmptyCard({ text }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center text-slate-500 font-semibold text-sm">
      {text}
    </div>
  );
}

function MiniStat({ title, value }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 text-center">
      <p className="text-base font-black text-slate-950">{value}</p>
      <p className="text-[10px] text-slate-500 font-bold">{title}</p>
    </div>
  );
}

function InfoLine({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
      <Icon className="text-cyan-600 shrink-0" size={13} />
      <span className="truncate">{text || "-"}</span>
    </div>
  );
}

function StatusBadge({ status, appointmentType }) {
  let config;

  if (status === "BOOKED") {
    config =
      appointmentType === "VIDEO"
        ? {
            icon: Video,
            text: "Video Appointment",
            className: "bg-blue-50 text-blue-700 border-blue-100",
          }
        : {
            icon: Building2,
            text: "In-Person Appointment",
            className: "bg-emerald-50 text-emerald-700 border-emerald-100",
          };
  } else if (status === "COMPLETED") {
    config = {
      icon: ShieldCheck,
      text: "Completed",
      className: "bg-cyan-50 text-cyan-700 border-cyan-100",
    };
  } else {
    config = {
      icon: CalendarX,
      text: "Cancelled",
      className: "bg-red-50 text-red-700 border-red-100",
    };
  }

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black ${config.className}`}
    >
      <Icon size={13} />
      {config.text}
    </span>
  );
}

function AppointmentTimeline({ appointment }) {
  const isVideo = appointment.appointmentType === "VIDEO";
  const isCancelled = appointment.status === "CANCELLED";
  const isCompleted = appointment.status === "COMPLETED";

  const steps = isCancelled
    ? [
        { title: "Booked", done: true },
        { title: "Payment Done", done: true },
        { title: "Cancelled", done: true, danger: true },
      ]
    : [
        { title: "Booked", done: true },
        { title: "Payment Done", done: true },
        {
          title: isVideo ? "Video-Consult Pending" : "Consultation Pending",
          done: isCompleted,
        },
        {
          title: "Completed",
          done: isCompleted,
        },
      ];

  return (
    <div className="mt-3 bg-slate-50 border border-slate-100 rounded-2xl p-3">
      <p className="text-[11px] font-black text-slate-500 mb-3">
        APPOINTMENT TIMELINE
      </p>

      <div className="grid grid-cols-4 gap-1">
        {steps.map((step, index) => (
          <div key={step.title} className="text-center">
            <div className="flex items-center">
              <div
                className={`h-0.5 flex-1 ${
                  index === 0
                    ? "bg-transparent"
                    : step.done
                    ? step.danger
                      ? "bg-red-300"
                      : "bg-emerald-300"
                    : "bg-slate-200"
                }`}
              />

              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-white mx-1 ${
                  step.done
                    ? step.danger
                      ? "bg-red-500"
                      : "bg-emerald-500"
                    : "bg-slate-300"
                }`}
              >
                {step.done ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <Clock size={14} />
                )}
              </div>

              <div
                className={`h-0.5 flex-1 ${
                  index === steps.length - 1
                    ? "bg-transparent"
                    : steps[index + 1]?.done
                    ? steps[index + 1]?.danger
                      ? "bg-red-300"
                      : "bg-emerald-300"
                    : "bg-slate-200"
                }`}
              />
            </div>

            <p
              className={`text-[9px] font-black mt-1 leading-tight ${
                step.danger
                  ? "text-red-600"
                  : step.done
                  ? "text-slate-800"
                  : "text-slate-400"
              }`}
            >
              {step.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

