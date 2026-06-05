import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  Stethoscope,
  Save,
  Sparkles,
  CalendarCheck,
  BadgeCheck,
  Timer,
  RefreshCw,
} from "lucide-react";
import api from "../api/axios";

export default function HospitalAvailability() {
  const hospitalUser = JSON.parse(
    localStorage.getItem("hospitalUser") ||
      localStorage.getItem("user") ||
      "null"
  );

  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    doctorId: "",
    dayOfWeek: "MONDAY",
    startTime: "09:00",
    endTime: "17:00",
    slotDuration: 30,
  });

  const [slotDate, setSlotDate] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (form.doctorId) {
      fetchSlots(form.doctorId);
    }
  }, [form.doctorId]);

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/doctor");

      const hospitalDoctors = (res.data || []).filter(
        (doctor) =>
          doctor.isActive &&
          doctor.hospital?.id === hospitalUser?.id
      );

      setDoctors(hospitalDoctors);

      if (hospitalDoctors.length > 0) {
        setForm((prev) => ({
          ...prev,
          doctorId: hospitalDoctors[0].id,
        }));
      }
    } catch (err) {
      console.error("Doctor API error:", err);
    }
  };

  const fetchSlots = async (doctorId) => {
    try {
      const res = await api.get(`/slot/doctor/${doctorId}`);
      setSlots(res.data || []);
    } catch (err) {
      console.error("Slots API error:", err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveAvailability = async (e) => {
    e.preventDefault();

    if (!form.doctorId) {
      alert("Please select doctor");
      return;
    }

    try {
      setLoading(true);

      await api.post("/availability", {
        ...form,
        slotDuration: Number(form.slotDuration),
      });

      alert("Availability saved successfully");
    } catch (error) {
      console.error("Availability error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to save availability"
      );
    } finally {
      setLoading(false);
    }
  };

  const generateSlots = async () => {
    if (!form.doctorId || !slotDate) {
      alert("Please select doctor and date");
      return;
    }

    try {
      setLoading(true);

      await api.post("/slot/generate", {
        doctorId: form.doctorId,
        date: slotDate,
      });

      alert("Slots generated successfully");
      fetchSlots(form.doctorId);
    } catch (error) {
      console.error("Slot generation error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to generate slots"
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctor = doctors.find(
    (doctor) => doctor.id === form.doctorId
  );

  const availableSlots = slots.filter((s) => s.isAvailable);
  const bookedSlots = slots.filter((s) => !s.isAvailable);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/40 to-white">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      <div className="absolute top-40 right-0 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-8 md:p-10 text-white shadow-2xl mb-8">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur mb-5">
              <CalendarDays size={18} className="text-cyan-300" />
              <span className="text-sm font-semibold">
                Hospital Availability Center
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Manage Doctor Availability
            </h1>

            <p className="text-blue-100 mt-3 max-w-2xl">
              Set doctor working hours, generate appointment slots and monitor
              available booking capacity.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            icon={Stethoscope}
            title="Doctors"
            value={doctors.length}
            desc="Active doctors in your hospital"
            gradient="from-blue-600 to-cyan-500"
          />

          <SummaryCard
            icon={CalendarCheck}
            title="Available Slots"
            value={availableSlots.length}
            desc="Open for patient booking"
            gradient="from-emerald-600 to-teal-500"
          />

          <SummaryCard
            icon={Timer}
            title="Booked Slots"
            value={bookedSlots.length}
            desc="Already reserved by patients"
            gradient="from-purple-600 to-fuchsia-500"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Save Availability */}
          <form
            onSubmit={saveAvailability}
            className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
                <Save className="text-white" size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Save Availability
                </h2>

                <p className="text-slate-500 text-sm">
                  Define working hours and slot duration.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <SelectField
                icon={Stethoscope}
                name="doctorId"
                value={form.doctorId}
                onChange={handleChange}
              >
                {doctors.length === 0 ? (
                  <option value="">No doctors found</option>
                ) : (
                  doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.doctorName} - {doctor.specialization}
                    </option>
                  ))
                )}
              </SelectField>

              <SelectField
                icon={CalendarDays}
                name="dayOfWeek"
                value={form.dayOfWeek}
                onChange={handleChange}
              >
                <option value="MONDAY">Monday</option>
                <option value="TUESDAY">Tuesday</option>
                <option value="WEDNESDAY">Wednesday</option>
                <option value="THURSDAY">Thursday</option>
                <option value="FRIDAY">Friday</option>
                <option value="SATURDAY">Saturday</option>
                <option value="SUNDAY">Sunday</option>
              </SelectField>

              <div className="grid md:grid-cols-2 gap-4">
                <InputField
                  icon={Clock}
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                />

                <InputField
                  icon={Clock}
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                />
              </div>

              <InputField
                icon={Timer}
                type="number"
                name="slotDuration"
                value={form.slotDuration}
                onChange={handleChange}
                placeholder="Slot Duration in minutes"
              />

              <button
                disabled={loading || doctors.length === 0}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:scale-[1.02] transition disabled:bg-gray-400 disabled:scale-100"
              >
                <Save size={18} />
                {loading ? "Saving..." : "Save Availability"}
              </button>
            </div>
          </form>

          {/* Generate Slots */}
          <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg">
                <Sparkles className="text-white" size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Generate Slots
                </h2>

                <p className="text-slate-500 text-sm">
                  Create bookable appointment slots for a selected date.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <SelectField
                icon={Stethoscope}
                value={form.doctorId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    doctorId: e.target.value,
                  })
                }
              >
                {doctors.length === 0 ? (
                  <option value="">No doctors found</option>
                ) : (
                  doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.doctorName} - {doctor.specialization}
                    </option>
                  ))
                )}
              </SelectField>

              <InputField
                icon={CalendarDays}
                type="date"
                value={slotDate}
                onChange={(e) => setSlotDate(e.target.value)}
              />

              <button
                onClick={generateSlots}
                disabled={loading || doctors.length === 0}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:scale-[1.02] transition disabled:bg-gray-400 disabled:scale-100"
              >
                <Sparkles size={18} />
                {loading ? "Generating..." : "Generate Slots"}
              </button>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-slate-600">
                <p className="font-bold text-blue-700 mb-1">
                  Slot Generation Tip
                </p>
                Make sure selected date matches saved availability day.
                Example: if availability is MONDAY, choose a Monday date.
              </div>
            </div>
          </div>
        </div>

        {/* Selected Doctor + Slots */}
        <div className="mt-8 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Generated Slots
              </h2>

              <p className="text-slate-500 text-sm">
                {selectedDoctor
                  ? `${selectedDoctor.doctorName} - ${selectedDoctor.specialization}`
                  : "Select a doctor to view slots"}
              </p>
            </div>

            <button
              onClick={() => fetchSlots(form.doctorId)}
              disabled={!form.doctorId}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-950 text-white font-bold hover:bg-blue-700 transition disabled:bg-slate-400"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>

          {slots.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
                <Clock className="text-blue-600" size={36} />
              </div>

              <h3 className="text-2xl font-black text-slate-900">
                No slots generated yet
              </h3>

              <p className="text-slate-500 mt-2">
                Save availability and generate slots for a specific date.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className={`rounded-2xl p-4 border shadow-sm ${
                    slot.isAvailable
                      ? "bg-emerald-50 border-emerald-100"
                      : "bg-red-50 border-red-100"
                  }`}
                >
                  <div className="flex items-center gap-2 font-black text-slate-900">
                    <Clock size={18} />
                    {slot.startTime} - {slot.endTime}
                  </div>

                  <p className="text-sm text-slate-500 mt-1">
                    {slot.date}
                  </p>

                  <span
                    className={`inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full text-xs font-bold ${
                      slot.isAvailable
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <BadgeCheck size={13} />
                    {slot.isAvailable ? "Available" : "Booked"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  title,
  value,
  desc,
  gradient,
}) {
  return (
    <div className="group relative">
      <div
        className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-40 blur transition duration-500`}
      />

      <div className="relative bg-white rounded-[2rem] p-6 shadow-xl border border-white group-hover:-translate-y-1 transition duration-500">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg mb-5`}
        >
          <Icon className="text-white" size={27} />
        </div>

        <p className="text-slate-500 text-sm">{title}</p>

        <h2 className="text-4xl font-black text-slate-950 mt-1">
          {value}
        </h2>

        <p className="text-slate-500 text-sm mt-2">{desc}</p>
      </div>
    </div>
  );
}

function InputField({
  icon: Icon,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 transition">
      <Icon size={19} className="text-blue-600" />

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
        required
      />
    </div>
  );
}

function SelectField({
  icon: Icon,
  name,
  value,
  onChange,
  children,
}) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 transition">
      <Icon size={19} className="text-blue-600" />

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent outline-none text-slate-800"
        required
      >
        {children}
      </select>
    </div>
  );
}