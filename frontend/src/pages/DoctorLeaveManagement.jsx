import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Briefcase,
  CalendarDays,
  HeartPulse,
  Loader2,
  Plane,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/axios";
import PageHeader from "../components/PageHeader";

const REASONS = [
  { label: "Vacation", icon: Plane },
  { label: "Sick", icon: HeartPulse },
  { label: "Conference", icon: Briefcase },
  { label: "Emergency", icon: AlertTriangle },
];

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const getDays = (start, end) => {
  if (!start || !end) return 0;
  const diff = new Date(end) - new Date(start);
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)) + 1);
};

export default function DoctorLeaveManagement() {

  const doctor = JSON.parse(
    localStorage.getItem("doctorUser") || "null"
  );

  const doctorId =
    doctor?.id ||
    doctor?.doctorId ||
    doctor?._id ||
    doctor?.userId ||
    doctor?.doctor?.id;

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    reason: "Vacation",
  });

useEffect(() => {
  if (doctorId) {
    loadLeaves();
  }
}, [doctorId]);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/leave/doctor/${doctorId}`);
      setLeaves(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load leaves");
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  const applyLeave = async () => {
    if (!form.startDate || !form.endDate) {
      toast.error("Select start and end date");
      return;
    }

    if (form.startDate > form.endDate) {
      toast.error("End date must be after start date");
      return;
    }
    
    if (!doctorId) {
  toast.error("Doctor not found");
  return;
}
    try {
      setSaving(true);

      await api.post("/leave", {
        doctorId,
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
      });

      setForm({
        startDate: "",
        endDate: "",
        reason: "Vacation",
      });

      toast.success("Leave applied");
      await loadLeaves();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to apply leave");
    } finally {
      setSaving(false);
    }
  };

  const deleteLeave = async (id) => {
    if (!window.confirm("Delete this leave?")) return;

    try {
      await api.delete(`/leave/${id}`);
      toast.success("Leave deleted");
      await loadLeaves();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete leave");
    }
  };

  const upcomingLeaves = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];

    return leaves
      .filter((leave) => String(leave.endDate) >= today)
      .sort((a, b) => String(a.startDate).localeCompare(String(b.startDate)));
  }, [leaves]);

  const totalDays = upcomingLeaves.reduce(
    (sum, item) => sum + getDays(item.startDate, item.endDate),
    0
  );

  return (
    <main className="min-h-screen bg-[#f6f8fb] pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
      <PageHeader title="Leave Management" subtitle="Block unavailable days" />

      <div className="mx-auto max-w-md px-3">
        <section className="rounded-[1.7rem] border border-slate-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
              <CalendarDays size={24} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700">
                Doctor Schedule
              </p>
              <h1 className="text-xl font-black text-slate-950">
                Leave Planner
              </h1>
              <p className="text-xs font-semibold text-slate-500">
                Blocks patient bookings during leave
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <MiniStat label="Leaves" value={upcomingLeaves.length} />
            <MiniStat label="Days" value={totalDays} />
            <MiniStat label="Applied" value={leaves.length} />
          </div>
        </section>

        <section className="mt-3 rounded-[1.7rem] border border-slate-100 bg-white p-3 shadow-sm">
          <SectionTitle title="Apply Leave" subtitle="Choose dates and reason" />

          <div className="mt-3 grid grid-cols-2 gap-2">
            <DateField
              label="Start"
              value={form.startDate}
              onChange={(value) =>
                setForm({
                  ...form,
                  startDate: value,
                  endDate: form.endDate && value > form.endDate ? value : form.endDate,
                })
              }
            />

            <DateField
              label="End"
              value={form.endDate}
              onChange={(value) =>
                setForm({
                  ...form,
                  endDate: value,
                })
              }
            />
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {REASONS.map((item) => {
              const Icon = item.icon;
              const active = form.reason === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      reason: item.label,
                    })
                  }
                  className={`rounded-2xl border px-2 py-3 text-center active:scale-95 ${
                    active
                      ? "border-cyan-600 bg-cyan-600 text-white"
                      : "border-slate-100 bg-slate-50 text-slate-700"
                  }`}
                >
                  <Icon size={18} className="mx-auto" />
                  <p className="mt-1 truncate text-[10px] font-black">
                    {item.label}
                  </p>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={applyLeave}
            disabled={saving}
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-600 text-sm font-black text-white active:scale-95 disabled:bg-slate-300"
          >
            {saving && <Loader2 size={17} className="animate-spin" />}
            Apply Leave
          </button>

          {form.startDate && form.endDate && (
            <p className="mt-2 rounded-2xl bg-cyan-50 px-3 py-2 text-center text-xs font-black text-cyan-700">
              {getDays(form.startDate, form.endDate)} day leave • {form.reason}
            </p>
          )}
        </section>

        <section className="mt-3 rounded-[1.7rem] border border-slate-100 bg-white p-3 shadow-sm">
          <SectionTitle
            title="Upcoming Leaves"
            subtitle={`${upcomingLeaves.length} active leave blocks`}
          />

          <div className="mt-3 space-y-2">
            {loading ? (
              <LoadingRows />
            ) : upcomingLeaves.length === 0 ? (
              <EmptyState />
            ) : (
              upcomingLeaves.map((leave) => (
                <LeaveRow
                  key={leave.id}
                  leave={leave}
                  onDelete={() => deleteLeave(leave.id)}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-2 py-3 text-center">
      <p className="text-xl font-black leading-none text-slate-950">{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase text-slate-500">
        {label}
      </p>
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-base font-black text-slate-950">{title}</h2>
      <p className="text-xs font-semibold text-slate-500">{subtitle}</p>
    </div>
  );
}

function DateField({ label, value, onChange }) {
  return (
    <label className="block">
      <p className="mb-1 text-[10px] font-black uppercase text-slate-500">
        {label}
      </p>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-800 outline-none focus:border-cyan-500"
      />
    </label>
  );
}

function LeaveRow({ leave, onDelete }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl bg-slate-50 p-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-black text-slate-950">
            {leave.reason}
          </p>

          <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black text-cyan-700">
            {getDays(leave.startDate, leave.endDate)} days
          </span>
        </div>

        <p className="mt-1 text-xs font-semibold text-slate-500">
          {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
        </p>
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 active:scale-95"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function LoadingRows() {
  return (
    <>
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-[68px] animate-pulse rounded-2xl bg-slate-50"
        />
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl bg-slate-50 p-6 text-center">
      <CalendarDays className="mx-auto text-cyan-600" size={32} />
      <h3 className="mt-2 text-base font-black text-slate-950">
        No upcoming leaves
      </h3>
      <p className="mt-1 text-sm font-semibold text-slate-500">
        Applied leaves will appear here.
      </p>
    </div>
  );
}