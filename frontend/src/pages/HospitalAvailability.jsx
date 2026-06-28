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
  Search,
  UserRound,
  CheckCircle2,
  XCircle,
  Loader2,
  Building2,
  ShieldCheck,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
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
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

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
    if (form.doctorId) {
      fetchSlots(form.doctorId);
    } else {
      setSlots([]);
    }
  }, [form.doctorId]);

  const fetchDoctors = async () => {
    try {
      setDoctorLoading(true);

      const res = await api.get("/doctor");

      const hospitalDoctors = (res.data || []).filter(
        (doctor) => doctor.isActive && doctor.hospital?.id === hospitalUser?.id
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
      setDoctors([]);
    } finally {
      setDoctorLoading(false);
    }
  };

  const fetchSlots = async (doctorId) => {
    if (!doctorId) return;

    try {
      const res = await api.get(`/slot/doctor/${doctorId}`);
      setSlots(res.data || []);
    } catch (err) {
      console.error("Slots API error:", err);
      setSlots([]);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleDoctorSelect = (doctorId) => {
    setForm((prev) => ({
      ...prev,
      doctorId,
    }));
  };

  const saveAvailability = async (e) => {
    e.preventDefault();

    if (!form.doctorId) {
      alert("Please select doctor");
      return;
    }

    if (form.startTime >= form.endTime) {
      alert("End time must be after start time");
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

      alert(error.response?.data?.message || "Failed to save availability");
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

      alert(error.response?.data?.message || "Failed to generate slots");
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctor = doctors.find((doctor) => doctor.id === form.doctorId);

  const filteredDoctors = doctors.filter((doctor) =>
    `${doctor.doctorName || ""} ${doctor.specialization || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const selectedDateSlots = slots
    .filter((slot) => slot.date === selectedDate)
    .sort((a, b) =>
      String(a.startTime || "").localeCompare(String(b.startTime || ""))
    );

  const selectedOpenSlots = selectedDateSlots.filter((slot) => slot.isAvailable);
  const selectedBookedSlots = selectedDateSlots.filter(
    (slot) => !slot.isAvailable
  );

  const totalOpenSlots = slots.filter((slot) => slot.isAvailable).length;
  const totalBookedSlots = slots.filter((slot) => !slot.isAvailable).length;

  const today = new Date().toISOString().split("T")[0];

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-36">
      <PageHeader
        title="Availability"
        subtitle="Manage doctor slots"
      />

      <div className="max-w-md mx-auto px-4">
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center">
              <Building2 className="text-cyan-600" size={28} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-cyan-700 font-black">
                HOSPITAL SCHEDULE
              </p>

              <h1 className="text-xl font-black text-slate-950 truncate">
                {hospitalUser?.hospitalName || "Availability Calendar"}
              </h1>

              <p className="text-sm text-slate-500 truncate">
                Save working hours and generate appointment slots
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <MiniStat icon={Stethoscope} label="Doctors" value={doctors.length} />
            <MiniStat icon={CheckCircle2} label="Open" value={totalOpenSlots} />
            <MiniStat icon={XCircle} label="Booked" value={totalBookedSlots} />
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <SectionTitle
            icon={Stethoscope}
            title="Select Doctor"
            subtitle="Choose active hospital doctor"
          />

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 mb-3">
            <Search size={18} className="text-cyan-600 shrink-0" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctor..."
              className="w-full bg-transparent outline-none text-sm text-slate-800"
            />
          </div>

          {doctorLoading ? (
            <div className="text-center text-slate-500 py-6">
              <Loader2 className="mx-auto animate-spin text-cyan-600 mb-2" />
              Loading doctors...
            </div>
          ) : filteredDoctors.length === 0 ? (
            <p className="text-center text-slate-500 py-6 text-sm font-bold">
              No active doctors found
            </p>
          ) : (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {filteredDoctors.map((doctor) => (
                <button
                  key={doctor.id}
                  type="button"
                  onClick={() => handleDoctorSelect(doctor.id)}
                  className={`shrink-0 w-40 rounded-3xl border p-3 text-left active:scale-95 transition ${
                    form.doctorId === doctor.id
                      ? "bg-cyan-600 text-white border-cyan-600 shadow-md"
                      : "bg-slate-50 text-slate-800 border-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-11 h-11 rounded-2xl overflow-hidden bg-white/20 flex items-center justify-center shrink-0">
                      {doctor.profileImage ? (
                        <img
                          src={doctor.profileImage}
                          alt={doctor.doctorName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserRound size={22} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="font-black text-sm truncate">
                        {doctor.doctorName}
                      </p>

                      <p
                        className={`text-[11px] truncate ${
                          form.doctorId === doctor.id
                            ? "text-cyan-50"
                            : "text-slate-500"
                        }`}
                      >
                        {doctor.specialization || "Specialist"}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedDoctor && (
            <div className="mt-3 bg-cyan-50 border border-cyan-100 rounded-2xl p-3">
              <p className="text-xs font-black text-cyan-700">
                SELECTED DOCTOR
              </p>

              <p className="text-sm font-black text-slate-950 mt-1">
                {selectedDoctor.doctorName} •{" "}
                {selectedDoctor.specialization || "Specialist"}
              </p>
            </div>
          )}
        </section>

        <form
          onSubmit={saveAvailability}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3"
        >
          <SectionTitle
            icon={Save}
            title="Working Hours"
            subtitle="Define weekly schedule"
          />

          <div className="space-y-3">
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
              type="submit"
              disabled={loading || doctors.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-slate-950 text-white py-4 rounded-2xl font-black disabled:bg-slate-400 active:scale-95 transition"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Availability
                </>
              )}
            </button>
          </div>
        </form>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <SectionTitle
            icon={Sparkles}
            title="Generate Slots"
            subtitle="Create appointment slots for date"
          />

          <InputField
            icon={CalendarCheck}
            type="date"
            name="selectedDate"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              type="button"
              onClick={() => setSelectedDate(today)}
              className="bg-slate-50 border border-slate-100 text-slate-700 py-3 rounded-2xl font-black text-sm"
            >
              Today
            </button>

            <button
              type="button"
              onClick={generateSlots}
              disabled={loading || doctors.length === 0}
              className="bg-cyan-600 text-white py-3 rounded-2xl font-black text-sm disabled:bg-slate-400 active:scale-95 transition"
            >
              Generate
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            Tip: Save weekly availability first. Then choose a matching date and
            generate slots.
          </p>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-3">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-black text-slate-950">
                Slots on {selectedDate}
              </h2>

              <p className="text-xs text-slate-500">
                {selectedDateSlots.length} total slots
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchSlots(form.doctorId)}
              disabled={!form.doctorId}
              className="w-10 h-10 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 disabled:text-slate-300"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <MiniStat
              icon={CalendarCheck}
              label="Total"
              value={selectedDateSlots.length}
            />
            <MiniStat
              icon={CheckCircle2}
              label="Open"
              value={selectedOpenSlots.length}
            />
            <MiniStat
              icon={XCircle}
              label="Booked"
              value={selectedBookedSlots.length}
            />
          </div>

          {selectedDateSlots.length === 0 ? (
            <div className="text-center py-10 rounded-2xl bg-slate-50 border border-slate-100">
              <Clock className="text-cyan-600 mx-auto mb-3" size={36} />

              <h3 className="text-lg font-black text-slate-950">
                No slots for this date
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Generate slots after saving availability.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedDateSlots.map((slot) => (
                <SlotRow key={slot.id} slot={slot} />
              ))}
            </div>
          )}
        </section>

        <section className="bg-cyan-600 rounded-3xl p-4 text-white mt-3">
          <div className="flex gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h3 className="text-sm font-black">
                Availability Tip
              </h3>

              <p className="text-xs text-cyan-100 mt-1 leading-relaxed">
                Patients can only book generated open slots for active doctors.
                Keep schedules updated daily.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SlotRow({ slot }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-2xl border p-3 ${
        slot.isAvailable
          ? "bg-emerald-50 border-emerald-100"
          : "bg-red-50 border-red-100"
      }`}
    >
      <div>
        <p className="font-black text-slate-950">
          {slot.startTime} - {slot.endTime}
        </p>

        <p className="text-xs text-slate-500 mt-0.5">
          {slot.date}
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
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center">
      <Icon className="text-cyan-600 mx-auto" size={18} />

      <p className="text-sm font-black text-slate-950 mt-1">
        {value}
      </p>

      <p className="text-[10px] text-slate-500 font-bold">
        {label}
      </p>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center">
        <Icon className="text-cyan-600" size={22} />
      </div>

      <div>
        <h2 className="text-lg font-black text-slate-950">
          {title}
        </h2>

        <p className="text-xs text-slate-500">
          {subtitle}
        </p>
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
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 focus-within:ring-2 focus-within:ring-cyan-500">
      <Icon size={18} className="text-cyan-600 shrink-0" />

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
        required
      />
    </div>
  );
}

function SelectField({ icon: Icon, name, value, onChange, children }) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 focus-within:ring-2 focus-within:ring-cyan-500">
      <Icon size={18} className="text-cyan-600 shrink-0" />

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent outline-none text-sm text-slate-800"
        required
      >
        {children}
      </select>
    </div>
  );
}