import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    api.get(`/doctor/${doctorId}`).then((res) => {
      setDoctor(res.data);
    });

    api.get(`/slot/doctor/${doctorId}/available`).then((res) => {
      setSlots(res.data || []);
    });
  }, [doctorId]);

  const selectedSlot = slots.find((slot) => slot.id === slotId);

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
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">
          Book Appointment
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">
              Appointment Summary
            </h2>

            {doctor && (
              <>
                <div className="flex items-center gap-4 mb-5">
                  <img
                    src={`https://ui-avatars.com/api/?name=${doctor.doctorName}&background=2563eb&color=fff`}
                    alt={doctor.doctorName}
                    className="w-16 h-16 rounded-full"
                  />

                  <div>
                    <h3 className="font-bold">
                      {doctor.doctorName}
                    </h3>

                    <p className="text-blue-600">
                      {doctor.specialization}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-gray-600">
                  <p>🎓 {doctor.qualification}</p>
                  <p>
                    🧑‍⚕️ {doctor.experience} Years Experience
                  </p>
                  <p>🏥 {doctor.hospital?.hospitalName}</p>
                  <p>
                    📍 {doctor.city}, {doctor.state}
                  </p>
                  <p className="font-bold text-green-600">
                    ₹{doctor.consultationFee}
                  </p>
                </div>
              </>
            )}

            <div className="mt-6 border-t pt-4">
              <p className="text-sm text-gray-500">
                Selected Slot
              </p>

              <p className="font-semibold mt-1">
                {selectedSlot
                  ? `${selectedSlot.date} | ${selectedSlot.startTime} - ${selectedSlot.endTime}`
                  : "Selected slot"}
              </p>
            </div>
          </div>

          <form
            onSubmit={bookAppointment}
            className="bg-white rounded-2xl shadow p-6"
          >
            <h2 className="text-xl font-bold mb-4">
              Patient Details
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Patient Name
              </label>

              <input
                type="text"
                name="patientName"
                value={form.patientName}
                onChange={handleChange}
                placeholder="Enter patient name"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Mobile Number
              </label>

              <input
                type="tel"
                name="patientPhone"
                value={form.patientPhone}
                onChange={handleChange}
                placeholder="Enter mobile number"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !doctor}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading
                ? "Processing..."
                : `Pay ₹${doctor?.consultationFee || 0} & Book`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}