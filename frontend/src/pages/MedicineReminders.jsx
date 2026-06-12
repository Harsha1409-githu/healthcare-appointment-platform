import { useEffect, useMemo, useState } from "react";
import {
  Pill,
  Plus,
  Clock,
  CalendarDays,
  CheckCircle2,
  Sun,
  Moon,
  Coffee,
  Bell,
  Activity,
  ClipboardList,
  ShieldCheck,
  Search,
  Filter,
  CalendarCheck,
  ArrowRight,
} from "lucide-react";
import api from "../api/axios";

export default function MedicineReminders() {
  const patient = JSON.parse(
    localStorage.getItem("patientUser") ||
      localStorage.getItem("user") ||
      "null"
  );

  const [reminders, setReminders] = useState([]);
  const [search, setSearch] = useState("");
  const [timeFilter, setTimeFilter] = useState("ALL");

  const [form, setForm] = useState({
    medicineName: "",
    dosage: "",
    reminderTime: "08:00",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      if (!patient?.id) {
        setReminders([]);
        return;
      }

      const res = await api.get(`/medicine-reminder/patient/${patient.id}`);
      setReminders(res.data || []);
    } catch (error) {
      console.error("Reminder error:", error);
      setReminders([]);
    }
  };

  const createReminder = async () => {
    if (!patient?.id) {
      alert("Patient not found. Please logout and login again.");
      return;
    }

    if (
      !form.medicineName ||
      !form.dosage ||
      !form.reminderTime ||
      !form.startDate ||
      !form.endDate
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      await api.post("/medicine-reminder", {
        patientId: patient.id,
        medicineName: form.medicineName,
        dosage: form.dosage,
        reminderTime: form.reminderTime,
        startDate: form.startDate,
        endDate: form.endDate,
      });

      setForm({
        medicineName: "",
        dosage: "",
        reminderTime: "08:00",
        startDate: "",
        endDate: "",
      });

      fetchReminders();
    } catch (error) {
      console.error("Create reminder error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      alert(error.response?.data?.message || "Failed to create reminder");
    }
  };

  const getTimeGroup = (time) => {
    const hour = Number(time?.split(":")[0]);

    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Night";
  };

  const filteredReminders = reminders.filter((item) => {
    const matchesSearch = `${item.medicineName || ""} ${item.dosage || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const group = getTimeGroup(item.reminderTime);
    const matchesTime = timeFilter === "ALL" || group === timeFilter;

    return matchesSearch && matchesTime;
  });

  const grouped = {
    Morning: filteredReminders.filter(
      (r) => getTimeGroup(r.reminderTime) === "Morning"
    ),
    Afternoon: filteredReminders.filter(
      (r) => getTimeGroup(r.reminderTime) === "Afternoon"
    ),
    Night: filteredReminders.filter(
      (r) => getTimeGroup(r.reminderTime) === "Night"
    ),
  };

  const stats = useMemo(() => {
    return {
      total: reminders.length,
      morning: reminders.filter((r) => getTimeGroup(r.reminderTime) === "Morning")
        .length,
      afternoon: reminders.filter(
        (r) => getTimeGroup(r.reminderTime) === "Afternoon"
      ).length,
      night: reminders.filter((r) => getTimeGroup(r.reminderTime) === "Night")
        .length,
    };
  }, [reminders]);

  const nextReminder = useMemo(() => {
    if (reminders.length === 0) return null;

    return [...reminders].sort((a, b) =>
      String(a.reminderTime).localeCompare(String(b.reminderTime))
    )[0];
  }, [reminders]);

  return (
    <div className="min-h-screen bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-6 py-8">
        <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm mb-4">
                <Pill size={17} />
                MEDICINE REMINDERS
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-slate-950">
                Track Daily Medicines
              </h1>

              <p className="text-slate-500 mt-3 max-w-2xl text-lg leading-relaxed">
                Add medicines, dosage and reminder timings to stay consistent
                with your treatment routine.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MiniStat title="Total" value={stats.total} icon={ClipboardList} />
              <MiniStat title="Morning" value={stats.morning} icon={Sun} />
              <MiniStat title="Noon" value={stats.afternoon} icon={Coffee} />
              <MiniStat title="Night" value={stats.night} icon={Moon} />
            </div>
          </div>
        </section>

        <section className="grid xl:grid-cols-[420px_1fr] gap-8">
          <aside className="space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 xl:sticky xl:top-24">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center">
                  <Plus className="text-cyan-600" size={24} />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    Add Reminder
                  </h2>

                  <p className="text-sm text-slate-500">
                    Schedule medicine alerts
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <InputBox
                  label="Medicine Name"
                  value={form.medicineName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      medicineName: e.target.value,
                    })
                  }
                  placeholder="Example: Paracetamol"
                  icon={Pill}
                />

                <InputBox
                  label="Dosage"
                  value={form.dosage}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      dosage: e.target.value,
                    })
                  }
                  placeholder="Example: 1 Tablet after food"
                  icon={ClipboardList}
                />

                <InputBox
                  label="Reminder Time"
                  type="time"
                  value={form.reminderTime}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      reminderTime: e.target.value,
                    })
                  }
                  icon={Clock}
                />

                <InputBox
                  label="Start Date"
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      startDate: e.target.value,
                    })
                  }
                  icon={CalendarDays}
                />

                <InputBox
                  label="End Date"
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      endDate: e.target.value,
                    })
                  }
                  icon={CalendarCheck}
                />

                <button
                  onClick={createReminder}
                  className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black hover:bg-cyan-700 transition flex items-center justify-center gap-2"
                >
                  Save Reminder
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <div className="bg-cyan-600 rounded-[2rem] shadow-sm p-6 text-white">
              <Bell className="mb-4" size={30} />

              <h2 className="text-xl font-black">
                Next Reminder
              </h2>

              {nextReminder ? (
                <>
                  <p className="text-cyan-100 mt-2">
                    {nextReminder.medicineName}
                  </p>

                  <p className="text-3xl font-black mt-2">
                    {nextReminder.reminderTime}
                  </p>

                  <p className="text-sm text-cyan-100 mt-2">
                    {nextReminder.dosage}
                  </p>
                </>
              ) : (
                <p className="text-cyan-100 mt-2">
                  No reminders scheduled yet.
                </p>
              )}
            </div>
          </aside>

          <main>
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 mb-6">
              <div className="grid lg:grid-cols-[1fr_260px] gap-4">
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                  <Search className="text-cyan-600" size={20} />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search medicine or dosage..."
                    className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
                  />
                </div>

                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                  <Filter className="text-cyan-600" size={20} />

                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="w-full bg-transparent outline-none text-slate-800 font-semibold"
                  >
                    <option value="ALL">All Timings</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <ReminderGroup
                title="Morning"
                icon={Sun}
                items={grouped.Morning}
                tone="yellow"
              />

              <ReminderGroup
                title="Afternoon"
                icon={Coffee}
                items={grouped.Afternoon}
                tone="cyan"
              />

              <ReminderGroup
                title="Night"
                icon={Moon}
                items={grouped.Night}
                tone="indigo"
              />
            </div>
          </main>
        </section>
      </div>
    </div>
  );
}

function InputBox({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
}) {
  return (
    <div>
      <p className="text-sm font-black text-slate-700 mb-2">
        {label}
      </p>

      <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-cyan-500">
        <Icon className="text-cyan-600" size={20} />

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-slate-800"
        />
      </div>
    </div>
  );
}

function ReminderGroup({ title, icon: Icon, items, tone }) {
  const toneStyles = {
    yellow: "bg-yellow-50 text-yellow-600",
    cyan: "bg-cyan-50 text-cyan-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl ${
              toneStyles[tone] || "bg-cyan-50 text-cyan-600"
            } flex items-center justify-center`}
          >
            <Icon size={23} />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-950">
              {title}
            </h2>

            <p className="text-sm text-slate-500">
              {items.length} medicines scheduled
            </p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-3xl p-8 text-center">
          <Pill className="mx-auto text-slate-300 mb-3" size={38} />

          <p className="font-black text-slate-950">
            No medicines for {title}
          </p>

          <p className="text-sm text-slate-500 mt-1">
            Add a reminder to see it here.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item) => (
            <ReminderCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReminderCard({ item }) {
  return (
    <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 hover:bg-cyan-50/40 transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black text-slate-950 text-lg">
            {item.medicineName}
          </h3>

          <p className="text-slate-500 mt-1">
            {item.dosage}
          </p>
        </div>

        <CheckCircle2 className="text-emerald-600" size={24} />
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-cyan-50 text-cyan-700 text-sm font-bold border border-cyan-100">
          <Clock size={15} />
          {item.reminderTime}
        </span>

        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white text-slate-600 text-sm font-bold border border-slate-100">
          <CalendarDays size={15} />
          {item.startDate} - {item.endDate}
        </span>
      </div>
    </div>
  );
}

function MiniStat({ title, value, icon: Icon }) {
  return (
    <div className="min-w-[90px] bg-slate-50 rounded-2xl border border-slate-100 p-3">
      <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center mb-2">
        <Icon className="text-cyan-600" size={18} />
      </div>

      <p className="text-xl font-black text-slate-950">
        {value}
      </p>

      <p className="text-xs text-slate-500 font-bold">
        {title}
      </p>
    </div>
  );
}