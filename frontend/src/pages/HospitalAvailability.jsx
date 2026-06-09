import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  Stethoscope,
  Save,
  Sparkles,
  CalendarCheck,
  Timer,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Search,
  UserRound,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import api from "../api/axios";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function HospitalAvailability() {
  const hospitalUser = JSON.parse(
    localStorage.getItem("hospitalUser") ||
      localStorage.getItem("user") ||
      "null"
  );

  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    doctorId: "",
    dayOfWeek: "MONDAY",
    startTime: "09:00",
    endTime: "17:00",
    slotDuration: 30,
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (form.doctorId) fetchSlots(form.doctorId);
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
    if (!form.doctorId || !selectedDate) {
      alert("Please select doctor and date");
      return;
    }

    try {
      setLoading(true);

      await api.post("/slot/generate", {
        doctorId: form.doctorId,
        date: selectedDate,
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

  const filteredDoctors = doctors.filter((doctor) =>
    `${doctor.doctorName} ${doctor.specialization}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const availableSlots = slots.filter((slot) => slot.isAvailable);
  const bookedSlots = slots.filter((slot) => !slot.isAvailable);

  const selectedDateSlots = slots
    .filter((slot) => slot.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const selectedOpenSlots = selectedDateSlots.filter(
    (slot) => slot.isAvailable
  );

  const selectedBookedSlots = selectedDateSlots.filter(
    (slot) => !slot.isAvailable
  );

  const calendarDays = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());

    return Array.from({ length: 42 }).map((_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);

      const dateKey = date.toISOString().split("T")[0];
      const daySlots = slots.filter((slot) => slot.date === dateKey);

      return {
        date,
        dateKey,
        isCurrentMonth: date.getMonth() === month,
        isToday:
          dateKey === new Date().toISOString().split("T")[0],
        total: daySlots.length,
        available: daySlots.filter((slot) => slot.isAvailable).length,
        booked: daySlots.filter((slot) => !slot.isAvailable).length,
      };
    });
  }, [calendarDate, slots]);

  const changeMonth = (direction) => {
    setCalendarDate((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + direction);
      return next;
    });
  };

  const monthTitle = calendarDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-950 text-white">
        <div className="max-w-[1500px] mx-auto px-6 py-10">
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-5">
                <CalendarDays size={18} className="text-cyan-300" />
                <span className="text-sm font-bold">
                  Hospital Schedule Management
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black">
                Availability Calendar
              </h1>

              <p className="text-slate-300 mt-3 max-w-3xl">
                Manage doctor working hours, generate slots, and monitor daily
                booking capacity in one organized calendar view.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full xl:w-[520px]">
              <TopStat label="Doctors" value={doctors.length} />
              <TopStat label="Open Slots" value={availableSlots.length} />
              <TopStat label="Booked" value={bookedSlots.length} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-6 py-8">
        <div className="grid xl:grid-cols-[360px_1fr] gap-6">
          <aside className="space-y-6">
            <Card>
              <SectionTitle
                icon={Stethoscope}
                title="Doctor"
                subtitle="Select doctor"
              />

              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 mb-4">
                <Search size={18} className="text-blue-600" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search doctor..."
                  className="w-full bg-transparent outline-none text-slate-800"
                />
              </div>

              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {filteredDoctors.length === 0 ? (
                  <p className="text-center text-slate-500 py-6">
                    No doctors found
                  </p>
                ) : (
                  filteredDoctors.map((doctor) => (
                    <button
                      key={doctor.id}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          doctorId: doctor.id,
                        }))
                      }
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition ${
                        form.doctorId === doctor.id
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white hover:bg-blue-50 border-slate-200 text-slate-800"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                        {doctor.profileImage ? (
                          <img
                            src={doctor.profileImage}
                            alt={doctor.doctorName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserRound size={24} />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="font-black truncate">
                          {doctor.doctorName}
                        </p>
                        <p
                          className={`text-xs truncate ${
                            form.doctorId === doctor.id
                              ? "text-blue-100"
                              : "text-slate-500"
                          }`}
                        >
                          {doctor.specialization || "Specialist"}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </Card>

            <Card>
              <SectionTitle
                icon={Save}
                title="Working Hours"
                subtitle="Define weekly schedule"
              />

              <form onSubmit={saveAvailability} className="space-y-4">
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

                <div className="grid grid-cols-2 gap-3">
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
                  placeholder="Slot duration"
                />

                <button
                  disabled={loading || doctors.length === 0}
                  className="w-full flex items-center justify-center gap-2 bg-slate-950 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition disabled:bg-slate-400"
                >
                  <Save size={18} />
                  {loading ? "Saving..." : "Save Availability"}
                </button>
              </form>
            </Card>

            <Card>
              <SectionTitle
                icon={Sparkles}
                title="Generate Slots"
                subtitle="Create slots for selected date"
              />

              <button
                onClick={generateSlots}
                disabled={loading || doctors.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-2xl font-black hover:scale-[1.02] transition disabled:bg-slate-400 disabled:scale-100"
              >
                <Sparkles size={18} />
                {loading ? "Generating..." : `Generate for ${selectedDate}`}
              </button>

              <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                Tip: Select a date in the calendar first. Make sure the date
                matches the saved availability day.
              </p>
            </Card>
          </aside>

          <main className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <Metric
                icon={CalendarCheck}
                label="Selected Date"
                value={selectedDate}
              />
              <Metric
                icon={CheckCircle2}
                label="Available"
                value={selectedOpenSlots.length}
              />
              <Metric
                icon={XCircle}
                label="Booked"
                value={selectedBookedSlots.length}
              />
              <Metric
                icon={Clock}
                label="Total Slots"
                value={selectedDateSlots.length}
              />
            </div>

            <Card noPadding>
              <div className="p-6 border-b border-slate-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">
                      {monthTitle}
                    </h2>
                    <p className="text-slate-500 mt-1">
                      {selectedDoctor
                        ? `${selectedDoctor.doctorName} • ${selectedDoctor.specialization}`
                        : "Select a doctor to view availability"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => changeMonth(-1)}
                      className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-50"
                    >
                      <ChevronLeft />
                    </button>

                    <button
                      onClick={() => {
                        const today = new Date();
                        setCalendarDate(today);
                        setSelectedDate(
                          today.toISOString().split("T")[0]
                        );
                      }}
                      className="px-5 py-3 rounded-2xl bg-slate-950 text-white font-bold"
                    >
                      Today
                    </button>

                    <button
                      onClick={() => changeMonth(1)}
                      className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-50"
                    >
                      <ChevronRight />
                    </button>

                    <button
                      onClick={() => fetchSlots(form.doctorId)}
                      disabled={!form.doctorId}
                      className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 text-white font-bold disabled:bg-slate-400"
                    >
                      <RefreshCw size={18} />
                      Refresh
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="p-4 text-center text-xs md:text-sm font-black text-slate-500 uppercase"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {calendarDays.map((day) => (
                  <button
                    key={day.dateKey}
                    onClick={() => setSelectedDate(day.dateKey)}
                    className={`min-h-[128px] p-3 border-r border-b border-slate-100 text-left transition ${
                      selectedDate === day.dateKey
                        ? "bg-blue-50 ring-2 ring-blue-500 ring-inset"
                        : day.isCurrentMonth
                        ? "bg-white hover:bg-slate-50"
                        : "bg-slate-50/70 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-black ${
                          day.isToday
                            ? "bg-blue-600 text-white"
                            : "text-slate-800"
                        }`}
                      >
                        {day.date.getDate()}
                      </span>

                      {day.total > 0 && (
                        <span className="text-[11px] font-black px-2 py-1 rounded-full bg-slate-900 text-white">
                          {day.total}
                        </span>
                      )}
                    </div>

                    {day.total > 0 && (
                      <div className="mt-4 space-y-2">
                        <div className="flex gap-1">
                          {day.available > 0 && (
                            <div className="h-2 flex-1 rounded-full bg-emerald-500" />
                          )}
                          {day.booked > 0 && (
                            <div className="h-2 flex-1 rounded-full bg-red-500" />
                          )}
                        </div>

                        <p className="text-[11px] font-bold text-slate-500">
                          {day.available} open • {day.booked} booked
                        </p>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Slots on {selectedDate}
                  </h2>
                  <p className="text-sm text-slate-500">
                    Monitor available and booked appointment times.
                  </p>
                </div>
              </div>

              {selectedDateSlots.length === 0 ? (
                <div className="text-center py-12 rounded-2xl bg-slate-50 border border-slate-100">
                  <Clock className="text-blue-600 mx-auto mb-4" size={40} />
                  <h3 className="text-xl font-black text-slate-900">
                    No slots for this date
                  </h3>
                  <p className="text-slate-500 mt-2">
                    Select this date and generate slots.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {selectedDateSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`rounded-2xl p-4 border ${
                        slot.isAvailable
                          ? "bg-emerald-50 border-emerald-100"
                          : "bg-red-50 border-red-100"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-black text-slate-900">
                            {slot.startTime}
                          </p>
                          <p className="text-sm text-slate-500">
                            {slot.startTime} - {slot.endTime}
                          </p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black ${
                            slot.isAvailable
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {slot.isAvailable ? "OPEN" : "BOOKED"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}

function TopStat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
      <p className="text-xs font-bold uppercase text-slate-300">
        {label}
      </p>
      <p className="text-3xl font-black mt-1">{value}</p>
    </div>
  );
}

function Card({ children, noPadding = false }) {
  return (
    <div
      className={`bg-white rounded-[2rem] shadow-xl border border-slate-100 ${
        noPadding ? "" : "p-6"
      }`}
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
        <Icon className="text-blue-600" size={22} />
      </div>

      <div>
        <h2 className="text-xl font-black text-slate-900">
          {title}
        </h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow p-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
          <Icon className="text-blue-600" size={22} />
        </div>

        <div>
          <p className="text-xs font-bold text-slate-400 uppercase">
            {label}
          </p>
          <p className="text-xl font-black text-slate-900 break-all">
            {value}
          </p>
        </div>
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