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
  Search,
  ClipboardList,
  Trash2,
  X,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../components/PageHeader";
import api from "../api/axios";
import usePullToRefresh from "../hooks/usePullToRefresh";

export default function MedicineReminders() {
  const patient = JSON.parse(
    localStorage.getItem("patientUser") ||
      localStorage.getItem("user") ||
      "null"
  );

  const selectedProfile = JSON.parse(
    localStorage.getItem("selectedProfile") || "null"
  );

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [timeFilter, setTimeFilter] = useState("ALL");

  const [form, setForm] = useState({
    medicineName: "",
    dosage: "",
    reminderTime: "08:00",
    startDate: "",
    endDate: "",
  });

  const fetchReminders = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      if (!patient?.id) {
        setReminders([]);
        return;
      }

      const res = await api.get(`/medicine-reminder/patient/${patient.id}`);
      setReminders(res.data || []);
    } catch (error) {
      console.error("Reminder error:", error);
      toast.error("Unable to load reminders");
      setReminders([]);
    } finally {
      setLoading(false);
    }
  };

  const { pullDistance, refreshing, visible } = usePullToRefresh(async () => {
    await fetchReminders(false);
    toast.success("Reminders refreshed");
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  const createReminder = async () => {
    if (!patient?.id) {
      toast.error("Please login again");
      return;
    }

    if (
      !form.medicineName ||
      !form.dosage ||
      !form.reminderTime ||
      !form.startDate ||
      !form.endDate
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setSaving(true);

      await api.post("/medicine-reminder", {
        patientId: patient.id,
        familyMemberId: selectedProfile?.isSelf ? undefined : selectedProfile?.id,
        medicineName: form.medicineName,
        dosage: form.dosage,
        reminderTime: form.reminderTime,
        startDate: form.startDate,
        endDate: form.endDate,
      });

      toast.success("Reminder added");

      setForm({
        medicineName: "",
        dosage: "",
        reminderTime: "08:00",
        startDate: "",
        endDate: "",
      });

      fetchReminders(false);
    } catch (error) {
      console.error("Create reminder error:", error);
      toast.error(error.response?.data?.message || "Failed to create reminder");
    } finally {
      setSaving(false);
    }
  };

  const deleteReminder = async (id) => {
    if (!window.confirm("Delete this reminder?")) return;

    try {
      await api.delete(`/medicine-reminder/${id}`);
      toast.success("Reminder deleted");
      fetchReminders(false);
    } catch (error) {
      console.error("Delete reminder error:", error);
      toast.error(error.response?.data?.message || "Failed to delete reminder");
    }
  };

  const getTimeGroup = (time) => {
    const hour = Number(time?.split(":")[0]);
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Night";
  };

  const profileReminders = useMemo(() => {
    return reminders.filter((item) => {
      const familyMember = item.familyMember || null;

      if (!selectedProfile) return true;

      if (selectedProfile.isSelf) {
        return !familyMember;
      }

      return familyMember?.id === selectedProfile.id;
    });
  }, [reminders, selectedProfile]);

  const filteredReminders = profileReminders.filter((item) => {
    const matchesSearch = `${item.medicineName || ""} ${item.dosage || ""}`
      .toLowerCase()
      .includes(search.toLowerCase().trim());

    const group = getTimeGroup(item.reminderTime);
    const matchesTime = timeFilter === "ALL" || group === timeFilter;

    return matchesSearch && matchesTime;
  });

  const nextReminder = useMemo(() => {
    if (profileReminders.length === 0) return null;

    return [...profileReminders].sort((a, b) =>
      String(a.reminderTime).localeCompare(String(b.reminderTime))
    )[0];
  }, [profileReminders]);

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-28">
      {visible && (
        <div
          className="fixed top-0 left-0 right-0 z-[100] flex justify-center transition-all duration-300"
          style={{ transform: `translateY(${pullDistance}px)` }}
        >
          <div className="mt-3 bg-white border border-slate-200 shadow-lg rounded-full px-4 py-2 flex items-center gap-2">
            <div
              className={`w-4 h-4 border-2 border-cyan-600 border-t-transparent rounded-full ${
                refreshing ? "animate-spin" : ""
              }`}
            />

            <span className="text-xs font-black text-cyan-700">
              {refreshing
                ? "Refreshing..."
                : pullDistance > 70
                ? "Release to refresh"
                : "Pull to refresh"}
            </span>
          </div>
        </div>
      )}

      <PageHeader
        title="Medicine Reminders"
        subtitle={`${filteredReminders.length} reminders`}
      />

      <div className="max-w-md mx-auto px-4">
        <section>
          <p className="text-xs text-cyan-700 font-black">CURRENT PROFILE</p>

          <div className="flex items-center justify-between mt-1">
            <div>
              <h1 className="text-xl font-black text-slate-950">
                {selectedProfile?.fullName || patient?.fullName || "Patient"}
              </h1>

              <p className="text-xs text-slate-500">
                {selectedProfile?.relation || "SELF"}
                {selectedProfile?.age ? ` • ${selectedProfile.age}Y` : ""}
                {selectedProfile?.gender ? ` • ${selectedProfile.gender}` : ""}
              </p>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center">
              <UserRound className="text-cyan-600" size={21} />
            </div>
          </div>
        </section>

        {nextReminder && (
          <section className="bg-cyan-600 rounded-3xl p-4 text-white shadow-sm mt-2">
            <div className="flex items-center gap-2">
              <Bell size={18} />
              <p className="text-xs font-black text-cyan-100">
                NEXT REMINDER
              </p>
            </div>

            <div className="flex items-end justify-between gap-3 mt-2">
              <div className="min-w-0">
                <h2 className="text-xl font-black truncate">
                  {nextReminder.medicineName}
                </h2>

                <p className="text-sm text-cyan-100 mt-1 truncate">
                  {nextReminder.dosage}
                </p>
              </div>

              <p className="text-2xl font-black shrink-0">
                {nextReminder.reminderTime}
              </p>
            </div>
          </section>
        )}

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3 mt-2">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3">
            <Search className="text-cyan-600 shrink-0" size={17} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicine"
              className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-slate-400"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto mt-2 pb-1">
            {[
              ["ALL", "All"],
              ["Morning", "Morning"],
              ["Afternoon", "Noon"],
              ["Night", "Night"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setTimeFilter(value)}
                className={`shrink-0 px-3 py-2 rounded-full text-xs font-black border ${
                  timeFilter === value
                    ? "bg-cyan-600 text-white border-cyan-600"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mt-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 flex items-center justify-center">
              <Plus className="text-cyan-600" size={20} />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-950">
                Add Reminder
              </h2>

              <p className="text-xs text-slate-500 font-semibold">
                Schedule medicine for this profile
              </p>
            </div>
          </div>

          <div className="space-y-3">
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
              placeholder="Example: 1 tablet after food"
              icon={ClipboardList}
            />

            <div className="grid grid-cols-2 gap-3">
              <InputBox
                label="Time"
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
            </div>

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
              icon={CalendarDays}
            />

            <button
              type="button"
              onClick={createReminder}
              disabled={saving}
              className="w-full bg-cyan-600 text-white py-3.5 rounded-2xl font-black disabled:bg-slate-400 active:scale-95 transition"
            >
              {saving ? "Saving..." : "Save Reminder"}
            </button>
          </div>
        </section>

        <section className="mt-2">
          <h2 className="text-lg font-black text-slate-950 mb-2">
            My Reminders
          </h2>

          {loading ? (
            <ReminderSkeleton />
          ) : filteredReminders.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {filteredReminders.map((item) => (
                <ReminderCard
                  key={item.id}
                  item={item}
                  getTimeGroup={getTimeGroup}
                  deleteReminder={deleteReminder}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
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
    <label className="block">
      <p className="text-xs font-black text-slate-700 mb-1.5">{label}</p>

      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 focus-within:ring-2 focus-within:ring-cyan-500">
        <Icon className="text-cyan-600 shrink-0" size={17} />

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-sm text-slate-800"
        />
      </div>
    </label>
  );
}

function ReminderCard({ item, getTimeGroup, deleteReminder }) {
  const group = getTimeGroup(item.reminderTime);
  const familyMember = item.familyMember || null;

  const config =
    group === "Morning"
      ? {
          icon: Sun,
          color: "bg-yellow-50 text-yellow-600",
        }
      : group === "Afternoon"
      ? {
          icon: Coffee,
          color: "bg-cyan-50 text-cyan-600",
        }
      : {
          icon: Moon,
          color: "bg-indigo-50 text-indigo-600",
        };

  const Icon = config.icon;

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${config.color}`}
        >
          <Icon size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-black text-slate-950 truncate">
            {item.medicineName}
          </h3>

          <p className="text-sm text-slate-500 mt-1">{item.dosage}</p>

          {familyMember && (
            <span className="inline-flex mt-2 px-2 py-1 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-black">
              {familyMember.fullName} • {familyMember.relation}
            </span>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-50 text-cyan-700 text-xs font-black">
              <Clock size={14} />
              {item.reminderTime}
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 text-xs font-black">
              <CheckCircle2 size={14} />
              {group}
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-2">
            {item.startDate} → {item.endDate}
          </p>
        </div>

        <button
          type="button"
          onClick={() => deleteReminder(item.id)}
          className="w-9 h-9 rounded-2xl bg-red-50 flex items-center justify-center shrink-0"
        >
          <Trash2 size={17} className="text-red-600" />
        </button>
      </div>
    </div>
  );
}

function ReminderSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 animate-pulse"
        >
          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100" />

            <div className="flex-1">
              <div className="h-4 bg-slate-100 rounded-full w-36" />
              <div className="h-3 bg-slate-100 rounded-full w-24 mt-3" />
              <div className="h-8 bg-slate-100 rounded-full w-44 mt-3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
      <Pill className="text-slate-300 mx-auto" size={34} />

      <p className="font-black text-slate-900 mt-3">
        No medicine reminders
      </p>

      <p className="text-sm text-slate-500 mt-1">
        Stay on track with medicines, vitamins and supplements.
      </p>
    </div>
  );
}