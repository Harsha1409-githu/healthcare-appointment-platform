import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  CalendarDays,
  Clock,
  Stethoscope,
  IndianRupee,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Building2,
  MapPin,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import api from "../api/axios";

export default function BookAppointment() {
  const { doctorId, slotId } = useParams();
  const navigate = useNavigate();

  const patient =
    JSON.parse(localStorage.getItem("patientUser") || "null") ||
    JSON.parse(localStorage.getItem("user") || "null") ||
    {};

  const [doctor, setDoctor] = useState(null);
  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [form, setForm] = useState({
    patientName: patient?.fullName || "",
    patientPhone: patient?.mobile || "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [doctorRes, slotRes] = await Promise.all([
        api.get(`/doctor/${doctorId}`),
        api.get(`/slot/${slotId}`),
      ]);

      setDoctor(doctorRes.data);
      setSlot(slotRes.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!form.patientName.trim() || !form.patientPhone.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      setBookingLoading(true);

      await api.post("/appointment", {
        doctorId,
        slotId,
        patientName: form.patientName,
        patientPhone: form.patientPhone,
      });

      navigate("/success");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4fbff] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
          <Loader2
            size={36}
            className="animate-spin text-cyan-600 mx-auto"
          />

          <p className="mt-3 text-slate-500 font-semibold">
            Loading booking details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4fbff] pb-32">
      <PageHeader title="Book Appointment" />

      <div className="max-w-[900px] mx-auto px-4 py-4">
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="flex gap-4">
            <img
              src={
                doctor?.profileImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  doctor?.doctorName || "Doctor"
                )}&background=0891b2&color=fff`
              }
              alt={doctor?.doctorName || "Doctor"}
              className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shrink-0"
            />

            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-black">
                <ShieldCheck size={12} />
                Verified
              </div>

              <h2 className="text-lg font-black text-slate-950 mt-2 truncate">
                {doctor?.doctorName || "Doctor"}
              </h2>

              <p className="text-cyan-700 font-bold text-sm truncate">
                {doctor?.specialization || "Specialist"}
              </p>

              <p className="text-xs text-slate-500 truncate mt-1">
                {doctor?.hospital?.hospitalName || "Hospital"}
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 mt-4">
          <InfoBox
            icon={Stethoscope}
            label="Experience"
            value={`${doctor?.experience || 0} Years`}
          />

          <InfoBox
            icon={IndianRupee}
            label="Fee"
            value={`₹${doctor?.consultationFee || 0}`}
          />

          <InfoBox
            icon={Building2}
            label="Hospital"
            value={doctor?.hospital?.hospitalName || "Hospital"}
          />

          <InfoBox
            icon={MapPin}
            label="Location"
            value={
              doctor?.city ||
              doctor?.state ||
              doctor?.hospital?.city ||
              "Available"
            }
          />
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mt-4">
          <h3 className="font-black text-slate-950 mb-3">
            Selected Slot
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-cyan-50 rounded-2xl p-4 border border-cyan-100">
              <CalendarDays className="text-cyan-600 mb-2" size={20} />

              <p className="text-xs text-cyan-700 font-bold">
                Date
              </p>

              <p className="font-black text-slate-950 text-sm mt-1">
                {slot?.date || "-"}
              </p>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
              <Clock className="text-emerald-600 mb-2" size={20} />

              <p className="text-xs text-emerald-700 font-bold">
                Time
              </p>

              <p className="font-black text-slate-950 text-sm mt-1">
                {slot?.startTime || "-"} - {slot?.endTime || "-"}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mt-4">
          <h3 className="font-black text-slate-950 mb-4">
            Patient Details
          </h3>

          <div className="space-y-3">
            <InputField
              icon={User}
              label="Full Name"
              value={form.patientName}
              placeholder="Enter patient name"
              onChange={(value) =>
                setForm({
                  ...form,
                  patientName: value,
                })
              }
            />

            <InputField
              icon={Phone}
              label="Mobile Number"
              value={form.patientPhone}
              placeholder="Enter mobile number"
              onChange={(value) =>
                setForm({
                  ...form,
                  patientPhone: value,
                })
              }
            />
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mt-4">
          <h3 className="font-black text-slate-950 mb-3">
            Payment Summary
          </h3>

          <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <div>
              <p className="text-xs text-slate-500 font-bold">
                Consultation Fee
              </p>

              <p className="text-2xl font-black text-slate-950 mt-1">
                ₹{doctor?.consultationFee || 0}
              </p>
            </div>

            <IndianRupee className="text-cyan-600" size={32} />
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700 font-bold">
            <CheckCircle2 size={15} />
            Secure appointment confirmation
          </div>
        </section>
      </div>

      <div className="fixed bottom-4 left-0 right-0 z-40 px-4">
        <div className="max-w-[900px] mx-auto bg-white border border-slate-200 rounded-[1.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-3">
          <button
            onClick={handleBook}
            disabled={bookingLoading}
            className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 disabled:bg-slate-400"
          >
            {bookingLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Booking...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Confirm Appointment • ₹{doctor?.consultationFee || 0}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function InputField({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label className="text-xs font-black text-slate-700 mb-1.5 block">
        {label}
      </label>

      <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-3">
        <Icon size={18} className="text-cyan-600 shrink-0" />

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent py-3 outline-none text-sm text-slate-800"
        />
      </div>
    </div>
  );
}

function InfoBox({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 min-w-0">
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
        <Icon size={15} className="text-cyan-600 shrink-0" />
        {label}
      </div>

      <p className="font-black text-slate-900 mt-1 text-sm truncate">
        {value || "-"}
      </p>
    </div>
  );
}