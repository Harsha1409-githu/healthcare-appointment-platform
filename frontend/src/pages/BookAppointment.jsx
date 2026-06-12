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
  FileText,
  CheckCircle2,
  Lock,
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
    symptoms: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get(`/doctor/${doctorId}`)
      .then((res) => setDoctor(res.data))
      .catch((err) => console.error("Doctor load error:", err));

    api
      .get(`/slot/doctor/${doctorId}/available`)
      .then((res) => setSlots(res.data || []))
      .catch((err) => console.error("Slot load error:", err));
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
              symptoms: form.symptoms,
            });

            navigate("/success", {
              state: {
                doctorName: doctor.doctorName,
                specialization: doctor.specialization,
                hospital: doctor.hospital?.hospitalName,
                fee: doctor.consultationFee,
                slot: selectedSlot,
                patientName: form.patientName,
              },
            });
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
          color: "#0891b2",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment initialization error:", error);
      alert(error.response?.data?.message || "Failed to start payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f4fbff] min-h-screen">
      <div className="max-w-[1450px] mx-auto px-6 py-8">
        <Link
          to={`/doctor/${doctorId}`}
          className="inline-flex items-center gap-2 text-cyan-700 font-black mb-6"
        >
          <ArrowLeft size={18} />
          Back to Doctor
        </Link>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-5">
            <CalendarCheck size={17} />
            SECURE APPOINTMENT BOOKING
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-950">
            Book Appointment
          </h1>

          <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
            Confirm your doctor, selected slot, patient details and complete
            secure payment.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-8">
          <div className="space-y-6">
            <section className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-950">
                  Doctor Summary
                </h2>

                <p className="text-slate-500 mt-1">
                  Review doctor and hospital details.
                </p>
              </div>

              <div className="p-6">
                {doctor ? (
                  <>
                    <div className="flex flex-col md:flex-row md:items-center gap-5 mb-6">
                      <div className="relative shrink-0">
                        <img
                          src={
                            doctor.profileImage ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              doctor.doctorName || "Doctor"
                            )}&background=0891b2&color=fff&bold=true`
                          }
                          alt={doctor.doctorName}
                          className="w-24 h-24 rounded-3xl object-cover border border-slate-100 shadow-sm"
                        />

                        <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-white">
                          <ShieldCheck size={17} className="text-white" />
                        </div>
                      </div>

                      <div>
                        <div className="inline-flex items-center gap-1.5 mb-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black">
                          <ShieldCheck size={14} />
                          Verified Doctor
                        </div>

                        <h3 className="text-3xl font-black text-slate-950">
                          {doctor.doctorName}
                        </h3>

                        <p className="text-cyan-700 font-black mt-1">
                          {doctor.specialization}
                        </p>
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
                        value={doctor.hospital?.hospitalName || "Hospital"}
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
                  </>
                ) : (
                  <p className="text-slate-500">
                    Loading doctor details...
                  </p>
                )}
              </div>
            </section>

            <section className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
              <h2 className="text-2xl font-black text-slate-950">
                Selected Slot
              </h2>

              <p className="text-slate-500 mt-1">
                Your preferred appointment date and time.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-5">
                <div className="bg-cyan-50 rounded-3xl p-5 border border-cyan-100">
                  <CalendarCheck className="text-cyan-600 mb-3" size={26} />
                  <p className="text-sm font-bold text-cyan-700">
                    Appointment Date
                  </p>
                  <p className="text-2xl font-black text-slate-950 mt-1">
                    {selectedSlot?.date || "Selected Date"}
                  </p>
                </div>

                <div className="bg-emerald-50 rounded-3xl p-5 border border-emerald-100">
                  <Clock className="text-emerald-600 mb-3" size={26} />
                  <p className="text-sm font-bold text-emerald-700">
                    Appointment Time
                  </p>
                  <p className="text-2xl font-black text-slate-950 mt-1">
                    {selectedSlot
                      ? `${selectedSlot.startTime} - ${selectedSlot.endTime}`
                      : "Selected Time"}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <form
            onSubmit={bookAppointment}
            className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 h-fit lg:sticky lg:top-24"
          >
            <h2 className="text-2xl font-black text-slate-950 mb-2">
              Patient Details
            </h2>

            <p className="text-slate-500 mb-6">
              Enter patient details for this consultation.
            </p>

            <div className="space-y-4">
              <InputField
                icon={UserRound}
                label="Patient Name"
                type="text"
                name="patientName"
                value={form.patientName}
                onChange={handleChange}
                placeholder="Enter patient name"
              />

              <InputField
                icon={Phone}
                label="Mobile Number"
                type="tel"
                name="patientPhone"
                value={form.patientPhone}
                onChange={handleChange}
                placeholder="Enter mobile number"
              />

              <div>
                <label className="text-sm font-black text-slate-700 mb-2 block">
                  Symptoms / Reason for Visit
                </label>

                <div className="flex gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                  <FileText className="text-cyan-600 mt-1" size={20} />

                  <textarea
                    name="symptoms"
                    value={form.symptoms}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe symptoms or reason for consultation"
                    className="w-full bg-transparent outline-none resize-none"
                  />
                </div>
              </div>

              <div className="bg-cyan-50 rounded-2xl p-4 border border-cyan-100">
                <h4 className="font-black text-slate-950 mb-3">
                  Consultation Includes
                </h4>

                <div className="space-y-2">
                  <IncludeItem text="Doctor consultation" />
                  <IncludeItem text="Digital prescription" />
                  <IncludeItem text="Appointment confirmation" />
                  <IncludeItem text="Secure medical record storage" />
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-500">
                    Total Payable
                  </p>

                  <p className="text-3xl font-black text-slate-950 mt-1">
                    ₹{doctor?.consultationFee || 0}
                  </p>
                </div>

                <IndianRupee className="text-cyan-600" size={36} />
              </div>

              <button
                type="submit"
                disabled={loading || !doctor}
                className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black hover:bg-cyan-700 transition disabled:bg-slate-400"
              >
                {loading
                  ? "Processing..."
                  : `Pay ₹${doctor?.consultationFee || 0} & Book`}
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-4 text-center">
              Your payment is securely processed via Razorpay.
            </p>

            <div className="flex justify-center gap-3 mt-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                <Lock size={12} />
                SSL Secured
              </span>

              <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-bold">
                <ShieldCheck size={12} />
                Razorpay Verified
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
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
}) {
  return (
    <div>
      <label className="text-sm font-black text-slate-700 mb-2 block">
        {label}
      </label>

      <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4">
        <Icon className="text-cyan-600" size={20} />

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent py-4 outline-none"
        />
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
      <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
        <Icon size={18} className="text-cyan-600" />
        {label}
      </div>

      <p className="font-black text-slate-900 mt-2">
        {value || "-"}
      </p>
    </div>
  );
}

function IncludeItem({ text }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
      <CheckCircle2 size={16} className="text-emerald-600" />
      {text}
    </div>
  );
}