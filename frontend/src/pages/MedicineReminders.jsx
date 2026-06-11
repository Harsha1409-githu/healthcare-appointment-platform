import { useEffect, useState } from "react";
import {
  Pill,
  Plus,
  Clock,
  CalendarDays,
  CheckCircle2,
  Sun,
  Moon,
  Coffee,
} from "lucide-react";
import api from "../api/axios";

export default function MedicineReminders() {
  const patient = JSON.parse(
    localStorage.getItem("patientUser") ||
      localStorage.getItem("user") ||
      "null"
  );

  const [reminders, setReminders] = useState([]);

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

      const res = await api.get(
        `/medicine-reminder/patient/${patient.id}`
      );

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

      alert(
        error.response?.data?.message ||
          "Failed to create reminder"
      );
    }
  };

  const getTimeGroup = (time) => {
    const hour = Number(time?.split(":")[0]);

    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Night";
  };

  const grouped = {
    Morning: reminders.filter(
      (r) => getTimeGroup(r.reminderTime) === "Morning"
    ),
    Afternoon: reminders.filter(
      (r) => getTimeGroup(r.reminderTime) === "Afternoon"
    ),
    Night: reminders.filter(
      (r) => getTimeGroup(r.reminderTime) === "Night"
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/40 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white p-8 shadow-2xl mb-8">
          <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mb-5">
            <Pill className="text-cyan-300" size={34} />
          </div>

          <h1 className="text-4xl font-black">
            Medicine Reminders
          </h1>

          <p className="text-blue-100 mt-2">
            Track medicines, dosage and daily reminder timings.
          </p>
        </div>

        <div className="grid lg:grid-cols-[420px_1fr] gap-6">
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-5">
              <Plus className="text-blue-600" />
              <h2 className="text-xl font-black">
                Add Reminder
              </h2>
            </div>

            <div className="space-y-4">
              <input
                placeholder="Medicine Name"
                value={form.medicineName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    medicineName: e.target.value,
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                placeholder="Dosage e.g. 1 Tablet"
                value={form.dosage}
                onChange={(e) =>
                  setForm({
                    ...form,
                    dosage: e.target.value,
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="time"
                value={form.reminderTime}
                onChange={(e) =>
                  setForm({
                    ...form,
                    reminderTime: e.target.value,
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    startDate: e.target.value,
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    endDate: e.target.value,
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={createReminder}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700"
              >
                Save Reminder
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <ReminderGroup
              title="Morning"
              icon={Sun}
              items={grouped.Morning}
            />

            <ReminderGroup
              title="Afternoon"
              icon={Coffee}
              items={grouped.Afternoon}
            />

            <ReminderGroup
              title="Night"
              icon={Moon}
              items={grouped.Night}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ReminderGroup({ title, icon: Icon, items }) {
  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
          <Icon className="text-blue-600" size={23} />
        </div>

        <h2 className="text-xl font-black">{title}</h2>
      </div>

      {items.length === 0 ? (
        <p className="text-slate-500">
          No medicines for {title}.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 rounded-2xl p-5 border border-slate-100"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-black text-slate-900 text-lg">
                    {item.medicineName}
                  </h3>

                  <p className="text-slate-500 mt-1">
                    {item.dosage}
                  </p>
                </div>

                <CheckCircle2
                  className="text-emerald-600"
                  size={24}
                />
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                  <Clock size={15} />
                  {item.reminderTime}
                </span>

                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-bold">
                  <CalendarDays size={15} />
                  {item.startDate} - {item.endDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}