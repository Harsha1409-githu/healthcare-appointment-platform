import { useEffect, useMemo, useState } from "react";
import {
  FlaskConical,
  CalendarDays,
  Clock,
  MapPin,
  IndianRupee,
  XCircle,
  CheckCircle2,
  Search,
  Filter,
  ShieldCheck,
  Home,
  Activity,
  HeartPulse,
  Droplets,
  CalendarCheck,
  ArrowRight,
  ClipboardList,
} from "lucide-react";
import api from "../api/axios";

const tests = [
  {
    testName: "CBC Test",
    category: "Blood Test",
    price: 499,
    desc: "Complete blood count for overall health screening.",
    icon: Droplets,
  },
  {
    testName: "Blood Sugar",
    category: "Diabetes",
    price: 299,
    desc: "Check glucose levels and diabetes risk.",
    icon: Activity,
  },
  {
    testName: "Lipid Profile",
    category: "Heart Health",
    price: 899,
    desc: "Cholesterol and triglyceride health assessment.",
    icon: HeartPulse,
  },
  {
    testName: "Thyroid Profile",
    category: "Hormone Test",
    price: 699,
    desc: "TSH, T3 and T4 thyroid function screening.",
    icon: FlaskConical,
  },
  {
    testName: "Vitamin D",
    category: "Vitamin Test",
    price: 799,
    desc: "Measure vitamin D deficiency and bone health risk.",
    icon: ShieldCheck,
  },
  {
    testName: "Liver Function Test",
    category: "Liver Health",
    price: 999,
    desc: "Evaluate liver enzymes and liver wellness.",
    icon: ClipboardList,
  },
  {
    testName: "Kidney Function Test",
    category: "Kidney Health",
    price: 999,
    desc: "Assess kidney markers and renal health.",
    icon: FlaskConical,
  },
];

export default function LabTests() {
  const patient = JSON.parse(
    localStorage.getItem("patientUser") ||
      localStorage.getItem("user") ||
      "null"
  );

  const [bookings, setBookings] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

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

    if (
      !selectedTest ||
      !form.preferredDate ||
      !form.preferredTime ||
      !form.address
    ) {
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

  const categories = useMemo(() => {
    return ["ALL", ...new Set(tests.map((test) => test.category))];
  }, []);

  const filteredTests = tests.filter((test) => {
    const matchesSearch = `${test.testName} ${test.category}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "ALL" || test.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      booked: bookings.filter((item) => item.status === "BOOKED").length,
      completed: bookings.filter((item) => item.status === "COMPLETED").length,
      cancelled: bookings.filter((item) => item.status === "CANCELLED").length,
    };
  }, [bookings]);

  return (
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6 py-8">
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                <FlaskConical size={17} />
                LAB TESTS
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                Book Lab Tests at Home
              </h1>

              <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
                Choose diagnostic tests, schedule home sample collection and
                track bookings from your patient portal.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MiniStat title="Total" value={stats.total} icon={ClipboardList} />
              <MiniStat title="Booked" value={stats.booked} icon={CalendarCheck} />
              <MiniStat title="Done" value={stats.completed} icon={CheckCircle2} />
              <MiniStat title="Cancel" value={stats.cancelled} icon={XCircle} />
            </div>
          </div>
        </section>

        <section className="grid xl:grid-cols-[1fr_420px] gap-8">
          <main>
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 mb-6">
              <div className="grid lg:grid-cols-[1fr_260px] gap-4">
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                  <Search className="text-cyan-600" size={20} />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search tests or categories..."
                    className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                  />
                </div>

                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                  <Filter className="text-cyan-600" size={20} />

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full bg-transparent outline-none text-slate-800 font-semibold"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "ALL" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  Popular Lab Tests
                </h2>

                <p className="text-slate-500">
                  Select a test to continue booking
                </p>
              </div>

              <span className="hidden sm:inline-flex px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm">
                {filteredTests.length} Tests
              </span>
            </div>

            {filteredTests.length === 0 ? (
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10 text-center">
                <FlaskConical
                  className="mx-auto text-slate-300 mb-4"
                  size={44}
                />

                <h3 className="font-black text-xl text-slate-950">
                  No tests found
                </h3>

                <p className="text-slate-500 mt-2">
                  Try another search or category.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-5">
                {filteredTests.map((test) => (
                  <TestCard
                    key={test.testName}
                    test={test}
                    selected={selectedTest?.testName === test.testName}
                    onSelect={() => setSelectedTest(test)}
                  />
                ))}
              </div>
            )}
          </main>

          <aside className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 h-fit xl:sticky xl:top-24">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
                <CalendarDays className="text-cyan-600" size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  Book Lab Test
                </h2>

                <p className="text-sm text-slate-500">
                  Home sample collection
                </p>
              </div>
            </div>

            {selectedTest ? (
              <div className="mb-5 bg-cyan-50 rounded-2xl p-4 border border-cyan-100">
                <p className="font-black text-cyan-700">
                  {selectedTest.testName}
                </p>

                <p className="text-sm text-cyan-700 mt-1">
                  {selectedTest.category} • ₹{selectedTest.price}
                </p>
              </div>
            ) : (
              <div className="mb-5 bg-slate-50 rounded-2xl p-4 text-slate-500 border border-slate-100">
                Select a test from the list.
              </div>
            )}

            <div className="space-y-4">
              <InputBox
                type="date"
                value={form.preferredDate}
                onChange={(e) =>
                  setForm({ ...form, preferredDate: e.target.value })
                }
                icon={CalendarDays}
              />

              <InputBox
                type="time"
                value={form.preferredTime}
                onChange={(e) =>
                  setForm({ ...form, preferredTime: e.target.value })
                }
                icon={Clock}
              />

              <div>
                <p className="text-sm font-black text-slate-700 mb-2">
                  Collection Address
                </p>

                <div className="flex gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                  <MapPin className="text-cyan-600 mt-1" size={20} />

                  <textarea
                    rows="4"
                    placeholder="Home sample collection address"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    className="w-full bg-transparent outline-none resize-none"
                  />
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-500">
                    Total Payable
                  </p>

                  <p className="text-3xl font-black text-slate-950 mt-1">
                    ₹{selectedTest?.price || 0}
                  </p>
                </div>

                <IndianRupee className="text-cyan-600" size={34} />
              </div>

              <button
                onClick={bookTest}
                className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black hover:bg-cyan-700 transition flex items-center justify-center gap-2"
              >
                Confirm Booking
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="mt-5 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-emerald-700 font-black">
                <Home size={18} />
                Home Sample Collection
              </div>

              <p className="text-sm text-emerald-700 mt-2">
                Certified technician will visit your address at selected time.
              </p>
            </div>
          </aside>
        </section>

        <section className="mt-10 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                My Lab Test Bookings
              </h2>

              <p className="text-slate-500">
                Track your scheduled and completed diagnostic tests.
              </p>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-3xl p-10 text-center">
              <FlaskConical
                className="mx-auto text-slate-300 mb-4"
                size={44}
              />

              <h3 className="font-black text-xl text-slate-950">
                No lab test bookings yet
              </h3>

              <p className="text-slate-500 mt-2">
                Select a test and book home sample collection.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  cancelBooking={cancelBooking}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function TestCard({ test, selected, onSelect }) {
  const Icon = test.icon || FlaskConical;

  return (
    <button
      onClick={onSelect}
      className={`text-left rounded-[2rem] p-6 border shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
        selected
          ? "bg-cyan-600 text-white border-cyan-600"
          : "bg-white text-slate-950 border-slate-100"
      }`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
          selected ? "bg-white/20" : "bg-cyan-50"
        }`}
      >
        <Icon
          className={selected ? "text-white" : "text-cyan-600"}
          size={28}
        />
      </div>

      <h3 className="text-xl font-black">{test.testName}</h3>

      <p className={`mt-2 ${selected ? "text-cyan-100" : "text-slate-500"}`}>
        {test.category}
      </p>

      <p className={`text-sm mt-3 leading-relaxed ${selected ? "text-cyan-50" : "text-slate-500"}`}>
        {test.desc}
      </p>

      <div className="flex items-center justify-between gap-4 mt-5">
        <p className="text-2xl font-black">₹{test.price}</p>

        <span
          className={`inline-flex items-center gap-1 text-sm font-black ${
            selected ? "text-white" : "text-cyan-700"
          }`}
        >
          Select
          <ArrowRight size={16} />
        </span>
      </div>
    </button>
  );
}

function BookingCard({ booking, cancelBooking }) {
  const statusStyles =
    booking.status === "CANCELLED"
      ? "bg-red-50 text-red-700 border-red-100"
      : booking.status === "COMPLETED"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : "bg-cyan-50 text-cyan-700 border-cyan-100";

  return (
    <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black text-xl text-slate-950">
            {booking.testName}
          </h3>

          <p className="text-slate-500">{booking.category}</p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-black border ${statusStyles}`}
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
          className="mt-5 flex items-center justify-center gap-2 w-full bg-red-600 text-white py-3 rounded-2xl font-black hover:bg-red-700 transition"
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
  );
}

function InputBox({ type, value, onChange, icon: Icon }) {
  return (
    <div>
      <p className="text-sm font-black text-slate-700 mb-2">
        {type === "date" ? "Preferred Date" : "Preferred Time"}
      </p>

      <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
        <Icon className="text-cyan-600" size={20} />

        <input
          type={type}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent outline-none text-slate-800"
        />
      </div>
    </div>
  );
}

function Info({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 text-slate-600 bg-white rounded-2xl px-3 py-2 border border-slate-100 min-w-0">
      <Icon size={16} className="text-cyan-600 shrink-0" />
      <span className="break-all">{text}</span>
    </div>
  );
}

function MiniStat({ title, value, icon: Icon }) {
  return (
    <div className="min-w-[90px] bg-slate-50 rounded-2xl border border-slate-100 p-3">
      <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center mb-2">
        <Icon className="text-cyan-600" size={18} />
      </div>

      <p className="text-xl font-black text-slate-950">{value}</p>
      <p className="text-xs text-slate-500 font-bold">{title}</p>
    </div>
  );
}