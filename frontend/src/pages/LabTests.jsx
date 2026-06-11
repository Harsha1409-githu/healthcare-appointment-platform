import { useEffect, useState } from "react";
import {
  FlaskConical,
  CalendarDays,
  Clock,
  MapPin,
  IndianRupee,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import api from "../api/axios";

const tests = [
  { testName: "CBC Test", category: "Blood Test", price: 499 },
  { testName: "Blood Sugar", category: "Diabetes", price: 299 },
  { testName: "Lipid Profile", category: "Heart Health", price: 899 },
  { testName: "Thyroid Profile", category: "Hormone Test", price: 699 },
  { testName: "Vitamin D", category: "Vitamin Test", price: 799 },
  { testName: "Liver Function Test", category: "Liver Health", price: 999 },
  { testName: "Kidney Function Test", category: "Kidney Health", price: 999 },
];

export default function LabTests() {
  const patient = JSON.parse(
    localStorage.getItem("patientUser") ||
      localStorage.getItem("user") ||
      "null"
  );

  const [bookings, setBookings] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);

  const [form, setForm] = useState({
    preferredDate: "",
    preferredTime: "08:00",
    address: "",
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      if (!patient?.id) return;

      const res = await api.get(`/lab-test/patient/${patient.id}`);
      setBookings(res.data || []);
    } catch (error) {
      console.error("Lab bookings error:", error);
    }
  };

  const bookTest = async () => {
    if (!patient?.id) {
      alert("Patient not found. Please login again.");
      return;
    }

    if (!selectedTest || !form.preferredDate || !form.preferredTime || !form.address) {
      alert("Please select test and fill all fields");
      return;
    }

    try {
      await api.post("/lab-test", {
        patientId: patient.id,
        testName: selectedTest.testName,
        category: selectedTest.category,
        price: selectedTest.price,
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        address: form.address,
      });

      alert("Lab test booked successfully");

      setSelectedTest(null);
      setForm({
        preferredDate: "",
        preferredTime: "08:00",
        address: "",
      });

      fetchBookings();
    } catch (error) {
      console.error("Book lab test error:", error);
      alert("Failed to book lab test");
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this lab test booking?")) return;

    try {
      await api.patch(`/lab-test/${id}/cancel`);
      fetchBookings();
    } catch (error) {
      console.error("Cancel lab test error:", error);
      alert("Failed to cancel booking");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/40 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white p-8 shadow-2xl mb-8">
          <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mb-5">
            <FlaskConical className="text-cyan-300" size={34} />
          </div>

          <h1 className="text-4xl font-black">Lab Tests</h1>

          <p className="text-blue-100 mt-2">
            Book diagnostic tests and home sample collection.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-5">
              Popular Lab Tests
            </h2>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {tests.map((test) => (
                <button
                  key={test.testName}
                  onClick={() => setSelectedTest(test)}
                  className={`text-left rounded-[2rem] p-6 border shadow-xl transition hover:-translate-y-1 ${
                    selectedTest?.testName === test.testName
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-900 border-slate-100"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
                      selectedTest?.testName === test.testName
                        ? "bg-white/20"
                        : "bg-blue-50"
                    }`}
                  >
                    <FlaskConical
                      className={
                        selectedTest?.testName === test.testName
                          ? "text-white"
                          : "text-blue-600"
                      }
                      size={28}
                    />
                  </div>

                  <h3 className="text-xl font-black">{test.testName}</h3>

                  <p
                    className={`mt-2 ${
                      selectedTest?.testName === test.testName
                        ? "text-blue-100"
                        : "text-slate-500"
                    }`}
                  >
                    {test.category}
                  </p>

                  <p className="text-2xl font-black mt-4">
                    ₹{test.price}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 h-fit sticky top-24">
            <h2 className="text-xl font-black text-slate-900 mb-5">
              Book Lab Test
            </h2>

            {selectedTest ? (
              <div className="mb-5 bg-blue-50 rounded-2xl p-4">
                <p className="font-black text-blue-700">
                  {selectedTest.testName}
                </p>
                <p className="text-sm text-blue-600">
                  {selectedTest.category} • ₹{selectedTest.price}
                </p>
              </div>
            ) : (
              <div className="mb-5 bg-slate-50 rounded-2xl p-4 text-slate-500">
                Select a test from the left.
              </div>
            )}

            <div className="space-y-4">
              <input
                type="date"
                value={form.preferredDate}
                onChange={(e) =>
                  setForm({ ...form, preferredDate: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="time"
                value={form.preferredTime}
                onChange={(e) =>
                  setForm({ ...form, preferredTime: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <textarea
                rows="4"
                placeholder="Home sample collection address"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />

              <button
                onClick={bookTest}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6">
          <h2 className="text-2xl font-black text-slate-900 mb-5">
            My Lab Test Bookings
          </h2>

          {bookings.length === 0 ? (
            <p className="text-slate-500">No lab test bookings yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-slate-50 rounded-2xl p-5 border border-slate-100"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black text-lg text-slate-900">
                        {booking.testName}
                      </h3>

                      <p className="text-slate-500">{booking.category}</p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black ${
                        booking.status === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : booking.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mt-5 text-sm">
                    <Info icon={CalendarDays} text={booking.preferredDate} />
                    <Info icon={Clock} text={booking.preferredTime} />
                    <Info icon={MapPin} text={booking.address} />
                    <Info icon={IndianRupee} text={`₹${booking.price}`} />
                  </div>

                  {booking.status === "BOOKED" && (
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="mt-5 flex items-center justify-center gap-2 w-full bg-red-600 text-white py-3 rounded-2xl font-black hover:bg-red-700"
                    >
                      <XCircle size={18} />
                      Cancel Booking
                    </button>
                  )}

                  {booking.status === "COMPLETED" && (
                    <div className="mt-5 flex items-center gap-2 text-emerald-700 font-black">
                      <CheckCircle2 size={18} />
                      Test Completed
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 text-slate-600">
      <Icon size={16} className="text-blue-600 shrink-0" />
      <span className="break-all">{text}</span>
    </div>
  );
}