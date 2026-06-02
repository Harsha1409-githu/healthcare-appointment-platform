import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function Booking() {
  const { slotId } = useParams();

  const [form, setForm] = useState({
    patientName: "",
    patientPhone: "",
  });

  const handleBook = async () => {
    await api.post("/appointment", {
      slotId,
      doctorId: "PUT_DOCTOR_ID_HERE",
      ...form,
    });

    alert("Appointment booked!");
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow rounded-xl p-6">
  <h1 className="text-2xl font-bold mb-4">
    Book Appointment
  </h1>

  <input
    className="w-full border p-3 rounded mb-4"
    placeholder="Patient Name"
  />

  <input
    className="w-full border p-3 rounded mb-4"
    placeholder="Phone Number"
  />

  <button className="w-full bg-blue-600 text-white p-3 rounded">
    Confirm Booking
  </button>
</div>
  );
}