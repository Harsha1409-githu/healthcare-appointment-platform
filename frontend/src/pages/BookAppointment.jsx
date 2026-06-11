import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  CalendarCheck,
  Clock,
  Stethoscope,
  Building2,
  MapPin,
  GraduationCap,
  IndianRupee,
  UserRound,
  Phone,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import api from "../api/axios";

export default function BookAppointment() {
  const { doctorId, slotId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);

  const [form, setForm] = useState({
    patientName: "",
    patientPhone: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get(`/doctor/${doctorId}`)
      .then((res) => setDoctor(res.data))
      .catch((err) =>
        console.error("Doctor load error:", err)
      );

    api
      .get(`/slot/doctor/${doctorId}/available`)
      .then((res) => setSlots(res.data || []))
      .catch((err) =>
        console.error("Slot load error:", err)
      );
  }, [doctorId]);

  const selectedSlot = slots.find(
    (slot) => String(slot.id) === String(slotId)
  );

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const bookAppointment = async (e) => {
    e.preventDefault();

    if (!form.patientName || !form.patientPhone) {
      alert("Please enter patient name and phone number");
      return;
    }

    if (!doctor) {
      alert("Doctor details not loaded");
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay script not loaded. Please check index.html");
      return;
    }

    try {
      setLoading(true);

      const orderRes = await api.post("/payment/order", {
        amount: doctor.consultationFee,
      });

      const order = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "MediCare",
        description: "Doctor Consultation Fee",
        order_id: order.id,

        handler: async function (response) {
          try {
            await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            await api.post("/appointment", {
              doctorId,
              slotId,
              patientName: form.patientName,
              patientPhone: form.patientPhone,
            });

            navigate("/success");
          } catch (error) {
            console.error("Payment/booking error:", error);
            alert(
              error.response?.data?.message ||
                "Payment successful but appointment booking failed"
            );
          }
        },

        prefill: {
          name: form.patientName,
          contact: form.patientPhone,
        },

        theme: {
          color: "#2563eb",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment initialization error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to start payment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/40 to-white py-10">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      <div className="absolute top-40 right-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6">
        <Link
          to={`/doctor/${doctorId}`}
          className="inline-flex items-center gap-2 text-blue-600 font-black mb-6"
        >
          <ArrowLeft size={18} />
          Back to Doctor
        </Link>

        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-8 md:p-10 text-white shadow-2xl mb-8">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-5">
              <CalendarCheck size={18} className="text-cyan-300" />
              <span className="text-sm font-semibold">
                Secure Appointment Booking
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black">
              Book Appointment
            </h1>

            <p className="text-blue-100 mt-3 max-w-2xl">
              Confirm your consultation details and complete payment securely.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-7">
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-2xl font-black text-slate-900">
                Appointment Summary
              </h2>

              <p className="text-slate-500 mt-1">
                Review doctor, hospital and selected slot.
              </p>
            </div>

            <div className="p-6">
              {doctor ? (
                <>
                  <div className="flex items-center gap-5 mb-6">
                    <img
                      src={
                        doctor.profileImage ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          doctor.doctorName || "Doctor"
                        )}&background=2563eb&color=fff&bold=true`
                      }
                      alt={doctor.doctorName}
                      className="w-20 h-20 rounded-3xl object-cover shadow-lg"
                    />

                    <div>
                      <h3 className="text-2xl font-black text-slate-900">
                        {doctor.doctorName}
                      </h3>

                      <p className="text-blue-600 font-bold mt-1">
                        {doctor.specialization}
                      </p>

                      <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black">
                        <ShieldCheck size={14} />
                        Verified Doctor
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <InfoCard
                      icon={GraduationCap}
                      label="Qualification"
                      value={doctor.qualification || "-"}
                    />

                    <InfoCard
                      icon={Stethoscope}
                      label="Experience"
                      value={`${doctor.experience || 0} Years`}
                    />

                    <InfoCard
                      icon={Building2}
                      label="Hospital"
                      value={
                        doctor.hospital?.hospitalName ||
                        "Hospital"
                      }
                    />

                    <InfoCard
                      icon={MapPin}
                      label="Location"
                      value={
                        doctor.city || doctor.state
                          ? `${doctor.city || ""}${
                              doctor.city && doctor.state ? ", " : ""
                            }${doctor.state || ""}`
                          : doctor.hospital?.city || "Available"
                      }
                    />
                  </div>

                  <div className="mt-6 bg-blue-50 rounded-[1.5rem] p-5">
                    <p className="text-sm font-bold text-blue-700">
                      Selected Slot
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <Clock className="text-blue-600" size={22} />

                      <p className="font-black text-slate-900">
                        {selectedSlot
                          ? `${selectedSlot.date} | ${selectedSlot.startTime} - ${selectedSlot.endTime}`
                          : "Selected slot"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 bg-emerald-50 rounded-[1.5rem] p-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-emerald-700">
                        Consultation Fee
                      </p>

                      <p className="text-3xl font-black text-slate-900 mt-1">
                        ₹{doctor.consultationFee}
                      </p>
                    </div>

                    <IndianRupee className="text-emerald-600" size={38} />
                  </div>
                </>
              ) : (
                <p className="text-slate-500">
                  Loading doctor details...
                </p>
              )}
            </div>
          </div>

          <form
            onSubmit={bookAppointment}
            className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 h-fit sticky top-24"
          >
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              Patient Details
            </h2>

            <p className="text-slate-500 mb-6">
              Enter patient details for this consultation.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-black text-slate-700 mb-2 block">
                  Patient Name
                </label>

                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4">
                  <UserRound className="text-blue-600" size={20} />

                  <input
                    type="text"
                    name="patientName"
                    value={form.patientName}
                    onChange={handleChange}
                    placeholder="Enter patient name"
                    className="w-full bg-transparent py-4 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-black text-slate-700 mb-2 block">
                  Mobile Number
                </label>

                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4">
                  <Phone className="text-blue-600" size={20} />

                  <input
                    type="tel"
                    name="patientPhone"
                    value={form.patientPhone}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    className="w-full bg-transparent py-4 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !doctor}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-2xl font-black hover:scale-[1.02] transition disabled:bg-slate-400 disabled:scale-100"
              >
                {loading
                  ? "Processing..."
                  : `Pay ₹${doctor?.consultationFee || 0} & Book`}
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-4 text-center">
              Your payment is securely processed via Razorpay.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
      <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
        <Icon size={18} className="text-blue-600" />
        {label}
      </div>

      <p className="font-black text-slate-900 mt-2">
        {value || "-"}
      </p>
    </div>
  );
}