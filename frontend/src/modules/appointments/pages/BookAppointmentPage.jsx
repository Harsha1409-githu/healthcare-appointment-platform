import { Capacitor } from "@capacitor/core";
import { Checkout } from "capacitor-razorpay";
import { useEffect, useState } from "react";

import {
  CalendarCheck,
  Clock,
  Building2,
  MapPin,
  GraduationCap,
  IndianRupee,
  UserRound,
  Phone,
  ShieldCheck,
  FileText,
  Lock,
  Loader2,
  BadgeCheck,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "@/api/axios";
import usePullToRefresh from "@/hooks/usePullToRefresh";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Video } from "lucide-react";

export default function BookAppointment() {
  const { doctorId, slotId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

const appointmentType =
  searchParams.get("type") === "VIDEO" ? "VIDEO" : "IN_PERSON";

const isVideoConsult = appointmentType === "VIDEO";



  const patient =
    JSON.parse(localStorage.getItem("patientUser") || "null") ||
    JSON.parse(localStorage.getItem("user") || "null");

  const selectedProfile = JSON.parse(
    localStorage.getItem("selectedProfile") || "null"
  );

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const consultationFee = isVideoConsult
  ? Math.max(Number(doctor?.consultationFee || 0) - 100, 0)
  : Number(doctor?.consultationFee || 0);

  const [form, setForm] = useState({
    patientName: "",
    patientPhone: "",
    symptoms: "",
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [leaveInfo, setLeaveInfo] = useState(null);
  const [checkingLeave, setCheckingLeave] = useState(false);

  const loadData = async (showLoader = true) => {
    try {
      if (showLoader) setPageLoading(true);

      const [doctorRes, slotRes] = await Promise.all([
        api.get(`/doctor/${doctorId}`),
        api.get(`/slot/doctor/${doctorId}/available`),
      ]);

      setDoctor(doctorRes.data);
      setSlots(slotRes.data || []);
    } catch (error) {
      console.error("Booking page load error:", error);
      toast.error("Unable to load booking details");
    } finally {
      setPageLoading(false);
    }
  };

  const { pullDistance, refreshing, visible } = usePullToRefresh(async () => {
    await loadData(false);
    toast.success("Booking details refreshed");
  });

  useEffect(() => {
    loadData();
  }, [doctorId]);

  useEffect(() => {
    if (!selectedProfile && !patient) return;

    setForm((prev) => ({
      ...prev,
      patientName:
        selectedProfile?.fullName || patient?.fullName || prev.patientName,
      patientPhone:
        selectedProfile?.mobile || patient?.mobile || prev.patientPhone,
    }));
  }, []);

  const selectedSlot = slots.find(
    (slot) => String(slot.id) === String(slotId)
  );

  useEffect(() => {
    const checkDoctorLeave = async () => {
      if (!doctorId || !selectedSlot?.date) return;

      try {
        setCheckingLeave(true);

        const res = await api.get(
          `/leave/check/${doctorId}/${selectedSlot.date}`
        );

        setLeaveInfo(res.data || null);
      } catch (error) {
        console.error("Leave check error:", error);
        setLeaveInfo(null);
      } finally {
        setCheckingLeave(false);
      }
    };

    checkDoctorLeave();
  }, [doctorId, selectedSlot?.date]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createAppointmentAfterPayment = async (paymentResponse) => {
    await api.post("/payment/verify", {
      razorpay_order_id: paymentResponse.razorpay_order_id,
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_signature: paymentResponse.razorpay_signature,
    });

    if (!patient?.id) {
      toast.error("Please login again");
      navigate("/welcome", { replace: true });
      return;
    }

    const appointmentRes = await api.post("/appointment", {
      doctorId,
      slotId,
      patientId: patient.id,
      familyMemberId: selectedProfile?.isSelf ? undefined : selectedProfile?.id,
      patientName: form.patientName,
      patientPhone: form.patientPhone,
      symptoms: form.symptoms,
       appointmentType,
    });

  const successData = {
  appointmentType:
    appointmentRes.data?.appointmentType ||
    appointmentType,

  meetingLink:
    appointmentRes.data?.meetingLink || null,

  fee: consultationFee,

  appointmentId: appointmentRes.data?.id,
  doctorName: doctor.doctorName,
  specialization: doctor.specialization,
  hospital: doctor.hospital?.hospitalName,
  slot: selectedSlot,
  patientName: form.patientName,
  familyMember: appointmentRes.data?.familyMember || null,
};

    localStorage.setItem("appointmentSuccess", JSON.stringify(successData));

    toast.success("Appointment booked successfully");

    navigate("/patient/success", {
      replace: true,
      state: successData,
    });
  };

  const bookAppointment = async (e) => {
    e.preventDefault();

    if (leaveInfo?.onLeave) {
      toast.error("Doctor is on leave. Please choose another slot.");
      return;
    }

    if (!form.patientName || !form.patientPhone) {
      toast.error("Please enter patient name and phone number");
      return;
    }

    if (!doctor) {
      toast.error("Doctor details not loaded");
      return;
    }

    if (!selectedSlot) {
      toast.error("Selected slot not available");
      return;
    }

    if (!Capacitor.isNativePlatform() && !window.Razorpay) {
      toast.error("Razorpay script not loaded");
      return;
    }

    try {
      setLoading(true);

      const orderRes = await api.post("/payment/order", {
        amount: consultationFee,
      });

      const order = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "TryDoc",
        description: "Doctor Consultation Fee",
        order_id: order.id,

        method: {
          card: true,
          netbanking: true,
          wallet: true,
          upi: false,
        },

        prefill: {
          name: form.patientName,
          contact: form.patientPhone,
        },

        theme: {
          color: "#0891b2",
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },

        retry: {
          enabled: true,
          max_count: 3,
        },

        handler: async function (response) {
          try {
            await createAppointmentAfterPayment(response);
          } catch (error) {
            console.error("BOOKING ERROR", error);
            toast.error(
              error?.response?.data?.message ||
                error?.message ||
                "Payment verified but booking failed"
            );
            setLoading(false);
          }
        },
      };

      if (Capacitor.isNativePlatform()) {
        const razorpayResponse = await Checkout.open(options);
        const response = razorpayResponse?.response || razorpayResponse;
        await createAppointmentAfterPayment(response);
      } else {
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to start payment"
      );
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <BookingSkeleton />;
  }

  return (
    <form
      onSubmit={bookAppointment}
      className="min-h-screen bg-[#f4f8fb] px-4 pt-4 pb-44"
    >
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
              {refreshing
                ? "Refreshing..."
                : pullDistance > 70
                ? "Release to refresh"
                : "Pull to refresh"}
            </span>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto">
        <header className="mb-2">
          <div className="inline-flex items-center gap-1.5 text-cyan-700 font-black text-xs">
            <CalendarCheck size={15} />
            {isVideoConsult
  ? "VIDEO-CONSULT BOOKING"
  : "IN-PERSON BOOKING"}
          </div>

          <h1 className="text-2xl font-black text-slate-950 mt-1">
            Confirm Booking
          </h1>

          <p className="text-sm text-slate-500 font-semibold">
            Review details and complete payment
          </p>
        
        </header>
</div>
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
          <div className="flex gap-3">
            <div className="relative shrink-0">
              <img
                src={
                  doctor?.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    doctor?.doctorName || "Doctor"
                  )}&background=0891b2&color=fff&bold=true`
                }
                alt={doctor?.doctorName || "Doctor"}
                className="w-20 h-20 rounded-3xl object-cover border border-slate-100"
              />

              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white">
                <BadgeCheck size={14} className="text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-[10px]">
                <ShieldCheck size={12} />
                Verified Doctor
              </div>

              <h2 className="text-lg font-black text-slate-950 truncate mt-2">
                {doctor?.doctorName}
              </h2>

              <p className="text-sm text-cyan-700 font-black truncate">
                {doctor?.specialization || "Specialist"}
              </p>

              <p className="text-xs text-slate-500 mt-1 truncate">
                {doctor?.qualification || "Qualification not available"}
              </p>
            </div>
          </div>
          

          <div className="mt-3 space-y-2">
            <CompactInfo
              icon={Building2}
              text={doctor?.hospital?.hospitalName || "Hospital"}
            />
            <CompactInfo
              icon={MapPin}
              text={doctor?.city || doctor?.hospital?.city || "Available"}
            />
            <CompactInfo
              icon={GraduationCap}
              text={`${doctor?.experience || 0} years experience`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <SlotBox
              icon={CalendarCheck}
              label="Date"
              value={selectedSlot?.date || "Selected Date"}
              tone="cyan"
            />

            <SlotBox
              icon={Clock}
              label="Time"
              value={
                selectedSlot
                  ? `${selectedSlot.startTime} - ${selectedSlot.endTime}`
                  : "Selected Time"
              }
              tone="emerald"
            />
          </div>
        </section>

        <div
  className={`mt-3 rounded-3xl border p-4 ${
    isVideoConsult
      ? "bg-blue-50 border-blue-100"
      : "bg-emerald-50 border-emerald-100"
  }`}
>
  <div className="flex items-center justify-between">
    <div>
      <p className="text-xs font-bold text-slate-500">
        Consultation Type
      </p>

      <h3 className="text-lg font-black text-slate-950 mt-1">
        {isVideoConsult
          ? "🎥 Video-Consult"
          : "🏥 In-Person Visit"}
      </h3>

      <p className="text-xs text-slate-500 mt-1">
        {isVideoConsult
          ? "Consult from anywhere"
          : "Visit hospital for consultation"}
      </p>
    </div>

    <div
      className={`px-3 py-2 rounded-2xl text-xs font-black ${
        isVideoConsult
          ? "bg-blue-100 text-blue-700"
          : "bg-emerald-100 text-emerald-700"
      }`}
    >
      {isVideoConsult ? "Video-Consult" : "In-Person"}
    </div>
  </div>
</div>

        {checkingLeave && (
          <section className="bg-white border border-slate-100 rounded-3xl p-4 mt-2 flex items-center gap-3">
            <Loader2 className="text-cyan-600 animate-spin" size={20} />
            <p className="text-sm font-bold text-slate-600">
              Checking doctor availability...
            </p>
          </section>
        )}

        {leaveInfo?.onLeave && (
          <section className="bg-red-50 border border-red-200 rounded-3xl p-4 mt-2">
            <div className="flex gap-3">
              <div className="w-11 h-11 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="text-red-600" size={22} />
              </div>

              <div>
                <h3 className="font-black text-red-700">
                  Doctor Unavailable
                </h3>

                <p className="text-sm text-red-600 mt-1">
                  Doctor is on leave from {leaveInfo.leave?.startDate} to{" "}
                  {leaveInfo.leave?.endDate}.
                </p>

                <p className="text-xs text-red-500 mt-2 font-bold">
                  Reason: {leaveInfo.leave?.reason || "Leave"}
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-2">
          <div className="mb-3 pb-3 border-b border-slate-100">
            <p className="text-[11px] text-cyan-700 font-black">
              BOOKING FOR
            </p>

            <div className="flex items-center justify-between mt-2">
              <div className="min-w-0">
                <h3 className="font-black text-slate-950 truncate">
                  {selectedProfile?.fullName || patient?.fullName || "Patient"}
                </h3>

                <p className="text-xs text-slate-500">
                  {selectedProfile?.relation || "SELF"}
                  {selectedProfile?.age ? ` • ${selectedProfile.age}Y` : ""}
                  {selectedProfile?.gender ? ` • ${selectedProfile.gender}` : ""}
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/account")}
                className="flex items-center gap-1 text-xs font-black text-cyan-700 bg-cyan-50 px-3 py-2 rounded-2xl"
              >
                Change
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <h2 className="text-lg font-black text-slate-950 mb-3">
            Patient Details
          </h2>

          <div className="space-y-3">
            <InputField
              icon={UserRound}
              label="Patient Name"
              type="text"
              name="patientName"
              value={form.patientName}
              onChange={handleChange}
              placeholder="Enter patient name"
              disabled={!!selectedProfile}
            />

            <InputField
              icon={Phone}
              label="Mobile Number"
              type="tel"
              name="patientPhone"
              value={form.patientPhone}
              onChange={handleChange}
              placeholder="Enter mobile number"
              disabled={!!selectedProfile}
            />

            <div>
              <label className="text-xs font-black text-slate-700 mb-1.5 block">
                Symptoms / Reason
              </label>

              <div className="flex gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3">
                <FileText
                  className="text-cyan-600 mt-0.5 shrink-0"
                  size={17}
                />

                <textarea
                  name="symptoms"
                  value={form.symptoms}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe symptoms or reason"
                  className="w-full bg-transparent outline-none resize-none text-sm text-slate-800"
                />
              </div>
            </div>
          </div>
        </section>

   <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-2">
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="text-xs font-bold text-slate-500">
        Consultation Fee
      </p>

      <div className="flex items-center text-2xl font-black text-slate-950 mt-1">
        <IndianRupee size={20} />
        {consultationFee}
      </div>

      <p className="text-xs text-slate-500 mt-1">
        {isVideoConsult
          ? "Video-Consult Fee"
          : "In-Person Consultation Fee"}
      </p>
    </div>

    <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
      {isVideoConsult ? (
        <Video className="text-blue-600" size={24} />
      ) : (
        <IndianRupee className="text-cyan-600" size={24} />
      )}
    </div>
  </div>

  <div className="flex gap-2 mt-3">
    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black">
      <Lock size={12} />
      Secure
    </span>

    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-xs font-black">
      <ShieldCheck size={12} />
      Razorpay
    </span>
  </div>
</section>

      <div className="fixed bottom-24 left-0 right-0 z-40 px-4">
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-3">
          <button
            type="submit"
            disabled={loading || !doctor || checkingLeave || leaveInfo?.onLeave}
            className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black disabled:bg-slate-400 active:scale-95 transition"
          >
           
 {
  leaveInfo?.onLeave
    ? "Doctor On Leave"
    : checkingLeave
    ? "Checking Availability..."
    : loading
    ? "Processing..."
    : `Pay ₹${consultationFee} & ${
        isVideoConsult
          ? "Book Video-Consult"
          : "Book In-Person Visit"
      }`
}

          </button>
        </div>
      </div>
    </form>
  );
}

function BookingSkeleton() {
  return (
    <main className="min-h-screen bg-[#f4f8fb] px-4 pt-4 pb-28">
      <div className="max-w-md mx-auto animate-pulse">
        <div className="h-4 bg-slate-200 rounded-full w-32" />
        <div className="h-7 bg-slate-200 rounded-full w-48 mt-3" />
        <div className="bg-white rounded-3xl border border-slate-100 p-4 mt-3">
          <div className="flex gap-3">
            <div className="w-20 h-20 rounded-3xl bg-slate-100" />
            <div className="flex-1">
              <div className="h-4 bg-slate-100 rounded-full w-24" />
              <div className="h-5 bg-slate-100 rounded-full w-40 mt-3" />
              <div className="h-3 bg-slate-100 rounded-full w-32 mt-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="h-20 bg-slate-100 rounded-2xl" />
            <div className="h-20 bg-slate-100 rounded-2xl" />
          </div>
        </div>
        <div className="h-64 bg-white rounded-3xl mt-2" />
        <div className="h-28 bg-white rounded-3xl mt-2" />
      </div>
    </main>
  );
}

function InputField({
  icon: Icon,
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  disabled,
}) {
  return (
    <div>
      <label className="text-xs font-black text-slate-700 mb-1.5 block">
        {label}
      </label>

      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3">
        <Icon className="text-cyan-600 shrink-0" size={17} />

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-transparent outline-none text-sm text-slate-800 disabled:text-slate-500"
        />
      </div>
    </div>
  );
}

function CompactInfo({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500 min-w-0">
      <Icon size={14} className="text-cyan-600 shrink-0" />
      <span className="truncate font-semibold">{text || "-"}</span>
    </div>
  );
}

function SlotBox({ icon: Icon, label, value, tone }) {
  const color =
    tone === "emerald"
      ? "bg-emerald-50 border-emerald-100 text-emerald-700"
      : "bg-cyan-50 border-cyan-100 text-cyan-700";

  return (
    <div className={`rounded-2xl p-3 border ${color}`}>
      <Icon size={19} className="mb-1" />

      <p className="text-xs font-bold">{label}</p>

      <p className="text-sm font-black text-slate-950 mt-1">{value}</p>
    </div>
  );
}