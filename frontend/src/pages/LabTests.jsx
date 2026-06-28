import { useEffect, useMemo, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Checkout } from "capacitor-razorpay";
import toast from "react-hot-toast";
import {
  FlaskConical,
  CalendarDays,
  Clock,
  MapPin,
  IndianRupee,
  XCircle,
  CheckCircle2,
  Search,
  ShieldCheck,
  Activity,
  HeartPulse,
  Droplets,
  ClipboardList,
  Lock,
  ChevronDown,
  ChevronRight,
  PackageCheck,
  UserRound,
  Check,
  X,
  Download,
  Truck,
  FileCheck2,
} from "lucide-react";

import api from "../api/axios";
import PageHeader from "../components/PageHeader";

const tests = [
  { testName: "CBC Test", category: "Blood Test", price: 499, desc: "Complete blood count.", icon: Droplets },
  { testName: "Blood Sugar", category: "Diabetes", price: 299, desc: "Check glucose levels.", icon: Activity },
  { testName: "Lipid Profile", category: "Heart Health", price: 899, desc: "Cholesterol screening.", icon: HeartPulse },
  { testName: "Thyroid Profile", category: "Hormone Test", price: 699, desc: "TSH, T3 and T4 test.", icon: FlaskConical },
  { testName: "Vitamin D", category: "Vitamin Test", price: 799, desc: "Vitamin D deficiency test.", icon: ShieldCheck },
  { testName: "Liver Function", category: "Liver Health", price: 999, desc: "Liver wellness test.", icon: ClipboardList },
  { testName: "Kidney Function", category: "Kidney Health", price: 999, desc: "Kidney health markers.", icon: FlaskConical },
];

const cities = ["Chennai", "Bangalore", "Hyderabad", "Mumbai", "Delhi", "Pune"];

export default function LabTests() {
  const patient =
    JSON.parse(localStorage.getItem("patientUser") || "null") ||
    JSON.parse(localStorage.getItem("user") || "null");

  const savedProfile = JSON.parse(localStorage.getItem("selectedProfile") || "null");
  const savedCity = localStorage.getItem("selectedCity") || patient?.city || "Chennai";

  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfile] = useState(savedProfile);
  const [showProfilePicker, setShowProfilePicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [paying, setPaying] = useState(false);

  const [form, setForm] = useState({
    preferredDate: "",
    preferredTime: "08:00",
    city: savedCity,
    address: "",
  });

  useEffect(() => {
    fetchOrders();
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      if (!patient?.id) return;

      const res = await api.get(`/family-member/patient/${patient.id}`);

      const selfProfile = {
        id: patient.id,
        fullName: patient.fullName || "Me",
        relation: "SELF",
        gender: patient.gender,
        age: patient.age,
        mobile: patient.mobile,
        profileImage: patient.profileImage,
        isSelf: true,
      };

      const allProfiles = [selfProfile, ...(res.data || [])];
      setProfiles(allProfiles);

      if (!activeProfile?.id) {
        setActiveProfile(selfProfile);
        localStorage.setItem("selectedProfile", JSON.stringify(selfProfile));
      }
    } catch (error) {
      console.error("Profile load error:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      if (!patient?.id) return;
      const res = await api.get(`/lab-test/orders/patient/${patient.id}`);
      setOrders(res.data || []);
    } catch (error) {
      console.error("Lab orders error:", error);
    }
  };

  const switchProfile = (profile) => {
    localStorage.setItem("selectedProfile", JSON.stringify(profile));
    setActiveProfile(profile);
    setShowProfilePicker(false);
    setExpandedOrder(null);
    toast.success(`Switched to ${profile.fullName}`);
    window.dispatchEvent(new Event("patientProfileUpdated"));
  };

  const switchCity = (city) => {
    localStorage.setItem("selectedCity", city);
    setForm((prev) => ({ ...prev, city }));
    setShowLocationPicker(false);
    toast.success(`Location changed to ${city}`);
  };

  const profileOrders = useMemo(() => {
    return orders.filter((order) => {
      if (!activeProfile) return true;
      if (activeProfile.isSelf) return !order.familyMemberId;
      return order.familyMemberId === activeProfile.id;
    });
  }, [orders, activeProfile]);

  const toggleTest = (test) => {
    setSelectedTests((prev) => {
      const exists = prev.some((item) => item.testName === test.testName);
      return exists
        ? prev.filter((item) => item.testName !== test.testName)
        : [...prev, test];
    });
  };

  const removeSelectedTest = (testName) => {
    setSelectedTests((prev) => prev.filter((item) => item.testName !== testName));
  };

  const totalAmount = selectedTests.reduce((sum, test) => sum + test.price, 0);

  const createLabOrderAfterPayment = async () => {
    await api.post("/lab-test/order", {
      patientId: patient.id,
      familyMemberId: activeProfile?.isSelf ? undefined : activeProfile?.id,
      preferredDate: form.preferredDate,
      preferredTime: form.preferredTime,
      address: `${form.address}, ${form.city}`,
      tests: selectedTests.map((test) => ({
        testName: test.testName,
        category: test.category,
        price: test.price,
      })),
    });

    toast.success("Lab order booked successfully");

    setSelectedTests([]);
    setForm({
      preferredDate: "",
      preferredTime: "08:00",
      city: form.city,
      address: "",
    });

    fetchOrders();
  };

  const bookTest = async () => {
    if (!patient?.id) {
      toast.error("Patient not found. Please login again.");
      return;
    }

    if (!selectedTests.length || !form.preferredDate || !form.preferredTime || !form.address) {
      toast.error("Please select tests and fill all fields");
      return;
    }

    if (!Capacitor.isNativePlatform() && !window.Razorpay) {
      toast.error("Razorpay script not loaded");
      return;
    }

    try {
      setPaying(true);

      const orderRes = await api.post("/payment/order", {
        amount: Number(totalAmount),
      });

      const order = orderRes.data;

      const verifyAndBook = async (response) => {
        await api.post("/payment/verify", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        await createLabOrderAfterPayment();
      };

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "TryDoc",
        description: "Lab Test Booking",
        order_id: order.id,
        prefill: {
          name: activeProfile?.fullName || patient?.fullName || "Patient",
          contact: activeProfile?.mobile || patient?.mobile || "",
        },
        theme: { color: "#0891b2" },
        modal: { ondismiss: () => setPaying(false) },
        handler: async (response) => {
          try {
            await verifyAndBook(response);
          } catch (error) {
            console.error("Lab order after payment error:", error);
            toast.error("Payment verified but booking failed");
          } finally {
            setPaying(false);
          }
        },
      };

      if (Capacitor.isNativePlatform()) {
        const razorpayResponse = await Checkout.open(options);
        const response = razorpayResponse?.response || razorpayResponse;
        await verifyAndBook(response);
        setPaying(false);
      } else {
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
    } catch (error) {
      console.error("Lab payment error:", error);
      toast.error(error?.response?.data?.message || "Payment failed");
      setPaying(false);
    }
  };

  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this lab order?")) return;

    try {
      await api.patch(`/lab-test/order/${id}/cancel`);
      toast.success("Lab order cancelled");
      fetchOrders();
    } catch (error) {
      console.error("Cancel lab order error:", error);
      toast.error("Failed to cancel order");
    }
  };

  const categories = useMemo(
    () => ["ALL", ...new Set(tests.map((test) => test.category))],
    []
  );

  const filteredTests = tests.filter((test) => {
    const matchesSearch = `${test.testName} ${test.category}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "ALL" || test.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-40">
      <PageHeader title="Lab Tests" subtitle="Book home sample collection" />

      <div className="sticky top-0 z-30 bg-[#f4f8fb]/95 backdrop-blur-xl">
        <div className="max-w-md mx-auto px-4 mt-1 mb-3 pt-2">
          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => setShowLocationPicker(true)}
              className="flex items-center gap-1 text-slate-900 font-bold"
            >
              <MapPin size={15} className="text-cyan-600" />
              <span className="truncate max-w-[90px]">{form.city}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => setShowProfilePicker(true)}
              className="flex items-center gap-1 text-slate-900 font-bold"
            >
              {activeProfile?.profileImage ? (
                <img
                  src={activeProfile.profileImage}
                  alt={activeProfile.fullName}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <UserRound size={15} className="text-cyan-600" />
              )}

              <span className="truncate max-w-[120px]">
                {activeProfile?.fullName || patient?.fullName || "Patient"}
              </span>

              <ChevronDown size={13} className="text-slate-400" />
            </button>
          </div>

          <div className="border-b border-slate-200 mt-2" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3">
            <Search className="text-cyan-600 shrink-0" size={17} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tests"
              className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto mt-3 pb-1 no-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`shrink-0 px-3 py-2 rounded-full text-xs font-black border ${
                  categoryFilter === category
                    ? "bg-cyan-600 text-white border-cyan-600"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                {category === "ALL" ? "All" : category}
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 mt-3">
          {filteredTests.length === 0 ? (
            <div className="col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
              <FlaskConical className="text-slate-300 mx-auto" size={34} />
              <p className="font-black text-slate-900 mt-3">No tests found</p>
            </div>
          ) : (
            filteredTests.map((test) => (
              <TestCard
                key={test.testName}
                test={test}
                selected={selectedTests.some((item) => item.testName === test.testName)}
                onSelect={() => toggleTest(test)}
              />
            ))
          )}
        </section>

        {selectedTests.length > 0 && (
          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black text-cyan-700">LAB CART</p>

                <h2 className="text-xl font-black text-slate-950 mt-1">
                  {selectedTests.length} Tests Selected
                </h2>

                <p className="text-xs text-slate-500 font-bold mt-1">
                  For {activeProfile?.fullName || patient?.fullName}
                </p>
              </div>

              <div className="flex items-center text-xl font-black text-slate-950">
                <IndianRupee size={17} />
                {totalAmount}
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {selectedTests.map((test) => (
                <div
                  key={test.testName}
                  className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-900 truncate">
                      {test.testName}
                    </p>
                    <p className="text-xs text-slate-500">₹{test.price}</p>
                  </div>

                  <button
                    onClick={() => removeSelectedTest(test.testName)}
                    className="text-xs font-black text-red-600 bg-red-50 px-3 py-1.5 rounded-full"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <InputBox
                type="date"
                value={form.preferredDate}
                onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                icon={CalendarDays}
              />

              <InputBox
                type="time"
                value={form.preferredTime}
                onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                icon={Clock}
              />
            </div>

            <div className="mt-3">
              <p className="text-xs font-black text-slate-700 mb-1.5">
                Collection Address
              </p>

              <div className="flex gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3">
                <MapPin className="text-cyan-600 mt-0.5 shrink-0" size={17} />

                <textarea
                  rows="3"
                  placeholder={`Enter pickup address in ${form.city}`}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full bg-transparent outline-none resize-none text-sm text-slate-800"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black">
                <Lock size={12} />
                Secure Payment
              </span>

              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-xs font-black">
                <ShieldCheck size={12} />
                Razorpay
              </span>
            </div>
          </section>
        )}

        <section className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-black text-slate-950">My Lab Orders</h2>

            <span className="text-xs font-black text-cyan-700">
              {profileOrders.length} Orders
            </span>
          </div>

          {profileOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
              <FlaskConical className="text-slate-300 mx-auto" size={34} />

              <p className="font-black text-slate-900 mt-3">No lab orders yet</p>

              <p className="text-sm text-slate-500 mt-1">
                Add tests to book home sample collection.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {profileOrders.map((order) => (
                <LabOrderCard
                  key={order.id}
                  order={order}
                  expanded={expandedOrder === order.id}
                  onToggle={() =>
                    setExpandedOrder(expandedOrder === order.id ? null : order.id)
                  }
                  cancelOrder={cancelOrder}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedTests.length > 0 && (
        <div className="fixed bottom-24 left-0 right-0 z-40 px-4">
          <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-slate-500 font-bold">
                  {selectedTests.length} Tests Selected
                </p>

                <div className="flex items-center text-lg font-black text-slate-950">
                  <IndianRupee size={16} />
                  {totalAmount}
                </div>
              </div>

              <button
                onClick={bookTest}
                disabled={paying}
                className="flex-1 bg-cyan-600 text-white py-3 rounded-2xl font-black text-sm active:scale-95 transition disabled:bg-slate-400"
              >
                {paying ? "Processing..." : "Pay & Book"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfilePicker && (
        <ProfilePicker
          profiles={profiles}
          activeProfile={activeProfile}
          onSelect={switchProfile}
          onClose={() => setShowProfilePicker(false)}
        />
      )}

      {showLocationPicker && (
        <LocationPicker
          city={form.city}
          onSelect={switchCity}
          onClose={() => setShowLocationPicker(false)}
        />
      )}
    </main>
  );
}

function TestCard({ test, selected, onSelect }) {
  const Icon = test.icon || FlaskConical;

  return (
    <div
      className={`rounded-3xl p-3 border shadow-sm transition ${
        selected
          ? "bg-cyan-600 text-white border-cyan-600"
          : "bg-white text-slate-950 border-slate-100"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${
          selected ? "bg-white/20" : "bg-cyan-50"
        }`}
      >
        <Icon className={selected ? "text-white" : "text-cyan-600"} size={21} />
      </div>

      <h3 className="text-sm font-black leading-tight">{test.testName}</h3>

      <p className={`text-xs mt-1 ${selected ? "text-cyan-50" : "text-slate-500"}`}>
        {test.category}
      </p>

      <p className={`text-[11px] mt-2 leading-snug ${selected ? "text-cyan-50" : "text-slate-500"}`}>
        {test.desc}
      </p>

      <div className="flex items-center justify-between mt-3">
        <p className="flex items-center text-lg font-black">
          <IndianRupee size={14} />
          {test.price}
        </p>

        <button
          type="button"
          onClick={onSelect}
          className={`px-3 py-1.5 rounded-full text-[11px] font-black active:scale-95 transition ${
            selected ? "bg-white text-cyan-700" : "bg-cyan-600 text-white"
          }`}
        >
          {selected ? "✓ Added" : "+ Add"}
        </button>
      </div>
    </div>
  );
}

function LabOrderCard({ order, expanded, onToggle, cancelOrder }) {
  const statusStyles =
    order.status === "CANCELLED"
      ? "bg-red-50 text-red-700 border-red-100"
      : order.status === "COMPLETED"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : "bg-cyan-50 text-cyan-700 border-cyan-100";

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <button type="button" onClick={onToggle} className="w-full p-4 text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-black text-cyan-700">
              {order.orderNumber}
            </p>

            <h3 className="text-lg font-black text-slate-950 mt-1">
              {order.items?.length || 0} Tests
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              {order.preferredDate} • {order.preferredTime}
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="flex items-center justify-end text-lg font-black text-slate-950">
              <IndianRupee size={15} />
              {order.totalAmount}
            </div>

            <span className={`inline-flex mt-2 px-2.5 py-1 rounded-full border text-[10px] font-black ${statusStyles}`}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold min-w-0">
            <PackageCheck size={14} className="text-cyan-600 shrink-0" />
            <span className="truncate">Home sample collection</span>
          </div>

          {expanded ? (
            <ChevronDown size={18} className="text-slate-400" />
          ) : (
            <ChevronRight size={18} className="text-slate-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-100 px-4 py-3 bg-slate-50">
          <OrderTimeline status={order.status} />

          <div className="space-y-2 mt-3">
            {order.items?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 bg-white border border-slate-100 rounded-2xl px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900 truncate">
                    {item.testName}
                  </p>

                  <p className="text-xs text-slate-500">{item.category}</p>
                </div>

                <span className="flex items-center text-sm font-black text-slate-950">
                  <IndianRupee size={12} />
                  {item.price}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <Info icon={CalendarDays} text={order.preferredDate} />
            <Info icon={Clock} text={order.preferredTime} />
          </div>

          <Info icon={MapPin} text={order.address} full />

          {order.status === "COMPLETED" && (
            <button
              type="button"
              onClick={() => window.print()}
              className="mt-3 flex items-center justify-center gap-2 w-full bg-emerald-600 text-white py-3 rounded-2xl font-black text-sm"
            >
              <Download size={17} />
              Download Report
            </button>
          )}

          {order.status === "BOOKED" && (
            <button
              type="button"
              onClick={() => cancelOrder(order.id)}
              className="mt-3 flex items-center justify-center gap-2 w-full bg-red-600 text-white py-3 rounded-2xl font-black text-sm"
            >
              <XCircle size={17} />
              Cancel Order
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function OrderTimeline({ status }) {
  const steps = [
    { label: "Order Placed", icon: CheckCircle2, done: true },
    { label: "Collection Scheduled", icon: Truck, done: status !== "CANCELLED" },
    { label: "Report Ready", icon: FileCheck2, done: status === "COMPLETED" },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-3">
      <p className="text-xs font-black text-slate-950 mb-3">Order Timeline</p>

      <div className="space-y-2">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <div key={step.label} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  step.done ? "bg-emerald-50" : "bg-slate-100"
                }`}
              >
                <Icon
                  size={14}
                  className={step.done ? "text-emerald-600" : "text-slate-400"}
                />
              </div>

              <span
                className={`text-xs font-bold ${
                  step.done ? "text-slate-800" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfilePicker({ profiles, activeProfile, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-end">
      <div className="w-full bg-white rounded-t-[2rem] p-4 pb-6">
        <div className="max-w-md mx-auto">
          <PickerHeader title="Switch Profile" onClose={onClose} />

          <div className="mt-4 space-y-2">
            {profiles.map((profile) => {
              const active = activeProfile?.id === profile.id;

              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => onSelect(profile)}
                  className={`w-full flex items-center gap-3 rounded-2xl p-3 text-left border ${
                    active
                      ? "bg-cyan-50 border-cyan-200"
                      : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 overflow-hidden flex items-center justify-center">
                    {profile.profileImage ? (
                      <img
                        src={profile.profileImage}
                        alt={profile.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserRound className="text-cyan-600" size={24} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-slate-950 truncate">
                      {profile.fullName}
                    </h3>

                    <p className="text-xs text-slate-500">
                      {profile.relation || "SELF"}
                    </p>
                  </div>

                  {active && (
                    <div className="w-7 h-7 rounded-full bg-cyan-600 flex items-center justify-center">
                      <Check className="text-white" size={16} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function LocationPicker({ city, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-end">
      <div className="w-full bg-white rounded-t-[2rem] p-4 pb-6">
        <div className="max-w-md mx-auto">
          <PickerHeader title="Choose Location" onClose={onClose} />

          <div className="mt-4 space-y-2">
            {cities.map((item) => {
              const active = city === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onSelect(item)}
                  className={`w-full flex items-center gap-3 rounded-2xl p-3 text-left border ${
                    active
                      ? "bg-cyan-50 border-cyan-200"
                      : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center">
                    <MapPin className="text-cyan-600" size={20} />
                  </div>

                  <h3 className="flex-1 font-black text-slate-950">{item}</h3>

                  {active && (
                    <div className="w-7 h-7 rounded-full bg-cyan-600 flex items-center justify-center">
                      <Check className="text-white" size={16} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function PickerHeader({ title, onClose }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-black text-slate-950">{title}</h2>

      <button
        type="button"
        onClick={onClose}
        className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center"
      >
        <X size={18} />
      </button>
    </div>
  );
}

function InputBox({ type, value, onChange, icon: Icon }) {
  return (
    <label>
      <p className="text-xs font-black text-slate-700 mb-1.5">
        {type === "date" ? "Date" : "Time"}
      </p>

      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3">
        <Icon className="text-cyan-600 shrink-0" size={17} />

        <input
          type={type}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent outline-none text-sm text-slate-800"
        />
      </div>
    </label>
  );
}

function Info({ icon: Icon, text, full = false }) {
  return (
    <div
      className={`flex items-center gap-2 text-slate-600 bg-white rounded-2xl px-3 py-2 border border-slate-100 min-w-0 ${
        full ? "mt-2 text-xs" : "text-xs"
      }`}
    >
      <Icon size={15} className="text-cyan-600 shrink-0" />
      <span className="truncate">{text || "-"}</span>
    </div>
  );
}