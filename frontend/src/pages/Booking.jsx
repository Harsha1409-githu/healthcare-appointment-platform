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
} from "lucide-react";
import api from "../api/axios";

export default function BookAppointment() {
  const { doctorId, slotId } = useParams();
  const navigate = useNavigate();

  const patient =
    JSON.parse(localStorage.getItem("patientUser")) ||
    JSON.parse(localStorage.getItem("user")) ||
    {};

  const [doctor, setDoctor] = useState(null);
  const [slot, setSlot] = useState(null);

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] =
    useState(false);

  const [form, setForm] = useState({
    patientName: patient?.fullName || "",
    patientPhone: patient?.mobile || "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [doctorRes, slotRes] =
        await Promise.all([
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
    if (
      !form.patientName.trim() ||
      !form.patientPhone.trim()
    ) {
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

      alert(
        error.response?.data?.message ||
          "Booking failed"
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4fbff] flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={40}
            className="animate-spin text-cyan-600 mx-auto"
          />

          <p className="mt-4 text-slate-500">
            Loading booking details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4fbff] py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center">
              <CalendarDays
                className="text-cyan-600"
                size={28}
              />
            </div>

            <div>
              <h1 className="text-4xl font-black text-slate-950">
                Confirm Appointment
              </h1>

              <p className="text-slate-500 mt-1">
                Review doctor and slot details
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-8">
          {/* Booking Form */}

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
            <h2 className="text-2xl font-black text-slate-950 mb-6">
              Patient Details
            </h2>

            <div className="space-y-5">
              <div>
                <label className="font-bold text-slate-700">
                  Full Name
                </label>

                <div className="relative mt-2">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={form.patientName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        patientName:
                          e.target.value,
                      })
                    }
                    className="w-full pl-12 h-14 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-cyan-500 outline-none"
                    placeholder="Enter patient name"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">
                  Mobile Number
                </label>

                <div className="relative mt-2">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={form.patientPhone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        patientPhone:
                          e.target.value,
                      })
                    }
                    className="w-full pl-12 h-14 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-cyan-500 outline-none"
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleBook}
              disabled={bookingLoading}
              className="w-full mt-8 bg-cyan-600 text-white h-14 rounded-2xl font-black hover:bg-cyan-700 transition flex items-center justify-center gap-2"
            >
              {bookingLoading ? (
                <>
                  <Loader2
                    size={20}
                    className="animate-spin"
                  />
                  Booking...
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Confirm Appointment
                </>
              )}
            </button>
          </div>

          {/* Doctor Summary */}

          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      doctor?.profileImage ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        doctor?.doctorName
                      )}&background=0891b2&color=fff`
                    }
                    alt={doctor?.doctorName}
                    className="w-20 h-20 rounded-3xl object-cover border-4 border-white/20"
                  />

                  <div>
                    <h3 className="text-2xl font-black">
                      {doctor?.doctorName}
                    </h3>

                    <p className="text-cyan-200">
                      {
                        doctor?.specialization
                      }
                    </p>

                    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-emerald-400 text-slate-950 text-xs font-black">
                      <ShieldCheck
                        size={14}
                      />
                      Verified Doctor
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <InfoRow
                  icon={Stethoscope}
                  label="Experience"
                  value={`${doctor?.experience} Years`}
                />

                <InfoRow
                  icon={IndianRupee}
                  label="Consultation Fee"
                  value={`₹${doctor?.consultationFee}`}
                />

                <InfoRow
                  icon={CalendarDays}
                  label="Date"
                  value={
                    slot?.date || "-"
                  }
                />

                <InfoRow
                  icon={Clock}
                  label="Time"
                  value={`${slot?.startTime} - ${slot?.endTime}`}
                />
              </div>
            </div>

            <div className="bg-cyan-600 rounded-[2rem] p-6 text-white">
              <h3 className="font-black text-xl">
                Appointment Notes
              </h3>

              <ul className="mt-4 space-y-2 text-cyan-100">
                <li>
                  • Arrive 10 minutes early
                </li>
                <li>
                  • Carry previous reports
                </li>
                <li>
                  • Keep prescription history
                </li>
                <li>
                  • Video consultation if available
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center">
        <Icon
          className="text-cyan-600"
          size={20}
        />
      </div>

      <div>
        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="font-black text-slate-950">
          {value}
        </p>
      </div>
    </div>
  );
}