import {
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  FlaskConical,
  HeartPulse,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { Link } from "react-router-dom";

import PageHeader from "@/components/PageHeader";
import { useMyCare } from "@/modules/my-care/hooks";
import { PatientRecommendationCard } from "@/modules/recommendation/components";

export default function MyCarePage() {
  const {
    patient,
    loading,
    medicines,
    recommendations,
    labOrders,
    appointments,
    prescriptions,
    stats,
  } = useMyCare();

  const activeMedicines = medicines.filter((item) => item.isActive);
  const pendingRecommendations = recommendations.filter(
    (item) => item.status === "RECOMMENDED"
  );
  const upcomingAppointments = appointments.filter(
    (item) => item.status === "BOOKED"
  );

  const totalTasks =
    activeMedicines.length +
    pendingRecommendations.length +
    labOrders.length +
    upcomingAppointments.length;

  const completedTasks = Math.max(
    0,
    prescriptions.length > 0 ? Math.min(2, prescriptions.length) : 0
  );

  const progress =
    totalTasks === 0 ? 100 : Math.min(100, Math.round((completedTasks / totalTasks) * 100));

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f8fb] pb-28">
        <PageHeader title="My Care" subtitle="Your health actions" />

        <div className="mx-auto max-w-md px-4">
          <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent" />
            <p className="mt-3 text-sm font-bold text-slate-500">
              Loading your care plan...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8fb] pb-32">
      <PageHeader title="My Care" subtitle="Today&apos;s care plan" />

      <div className="mx-auto max-w-md px-4">
        <section className="rounded-[2rem] bg-gradient-to-br from-cyan-600 to-blue-700 p-5 text-white shadow-sm">
          <p className="text-xs font-black text-cyan-100">TODAY&apos;S CARE</p>

          <h1 className="mt-1 text-2xl font-black">
            Hello {patient?.fullName?.split(" ")?.[0] || "Patient"} 👋
          </h1>

          <p className="mt-1 text-sm font-semibold text-cyan-100">
            {totalTasks === 0
              ? "You&apos;re all caught up today."
              : `${totalTasks} care actions need your attention.`}
          </p>

          <div className="mt-5 rounded-3xl bg-white/15 p-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-cyan-100">
                  CARE PROGRESS
                </p>
                <p className="mt-1 text-3xl font-black">{progress}%</p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-cyan-700">
                <HeartPulse size={27} />
              </div>
            </div>

            <div className="mt-4 h-3 rounded-full bg-white/20">
              <div
                className="h-3 rounded-full bg-white transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </section>

        <section className="mt-3 grid grid-cols-4 gap-2">
          <MiniStat icon={Pill} label="Meds" value={activeMedicines.length} />
          <MiniStat icon={ShieldCheck} label="Reco" value={pendingRecommendations.length} />
          <MiniStat icon={FlaskConical} label="Labs" value={labOrders.length} />
          <MiniStat icon={CalendarCheck} label="Appts" value={upcomingAppointments.length} />
        </section>

        <CareSection
  icon={ShieldCheck}
  title="Doctor Recommendations"
  count={pendingRecommendations.length}
  to="/patient/recommendations"
>
  {pendingRecommendations.length === 0 ? (
    <EmptyMini text="No pending doctor recommendations." />
  ) : (
    <div className="space-y-2">
      {pendingRecommendations.slice(0, 2).map((recommendation) => (
        <CompactRecommendation
          key={recommendation.id}
          recommendation={recommendation}
        />
      ))}
    </div>
  )}
</CareSection>

        <CareSection
          icon={Pill}
          title="Medicine Timeline"
          count={activeMedicines.length}
          to="/patient/medicine-reminders"
        >
          {activeMedicines.length === 0 ? (
            <EmptyMini text="No active medicine reminders." />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {activeMedicines.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-slate-100 bg-slate-50 p-3"
                >
                  <p className="text-sm font-black text-slate-950">
                    {item.medicineName}
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-500">
                    {item.dosage}
                  </p>
                  <p className="mt-2 inline-flex rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-black text-cyan-700">
                    {item.reminderTime}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CareSection>

       
       

        <CareSection
          icon={Stethoscope}
          title="Upcoming Follow-up"
          count={upcomingAppointments.length}
          to="/patient/appointments"
        >
          {upcomingAppointments.length === 0 ? (
            <EmptyMini text="No upcoming follow-up appointments." />
          ) : (
            <div className="space-y-2">
              {upcomingAppointments.slice(0, 2).map((appointment) => (
                <TaskItem
                  key={appointment.id}
                  icon={CalendarCheck}
                  title={appointment.doctor?.doctorName || "Doctor"}
                  subtitle={`${appointment.slot?.date || "-"} • ${
                    appointment.slot?.startTime || "-"
                  }`}
                />
              ))}
            </div>
          )}
        </CareSection>

        <section className="mt-3 rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm">
          <h2 className="text-base font-black text-slate-950">Quick Actions</h2>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <QuickAction to="/patient/lab-tests" icon={FlaskConical} label="Book Tests" />
            <QuickAction to="/patient/recommendations" icon={ShieldCheck} label="Reco" />
            <QuickAction to="/patient/prescriptions" icon={Pill} label="Rx" />
          </div>
        </section>
      </div>
    </main>
  );
}

function CareSection({ icon: Icon, title, count, to, children }) {
  return (
    <section className="mt-3 rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50">
            <Icon className="text-cyan-600" size={21} />
          </div>

          <div>
            <h2 className="text-base font-black text-slate-950">{title}</h2>
            <p className="text-xs font-semibold text-slate-500">
              {count} item{count === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <Link
          to={to}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500"
        >
          <ChevronRight size={18} />
        </Link>
      </div>

      {children}
    </section>
  );
}

function TaskItem({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white">
        <Icon className="text-cyan-600" size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-slate-950">{title}</p>
        <p className="truncate text-xs font-semibold text-slate-500">
          {subtitle}
        </p>
      </div>

      <CheckCircle2 className="shrink-0 text-slate-300" size={18} />
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-3 text-center shadow-sm">
      <Icon className="mx-auto text-cyan-600" size={18} />
      <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
      <p className="text-[10px] font-bold text-slate-500">{label}</p>
    </div>
  );
}

function QuickAction({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="rounded-3xl border border-slate-100 bg-slate-50 p-3 text-center active:scale-95"
    >
      <Icon className="mx-auto text-cyan-600" size={20} />
      <p className="mt-2 text-[11px] font-black text-slate-700">{label}</p>
    </Link>
  );
}

function EmptyMini({ text }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm font-semibold text-slate-500">
      {text}
    </div>
  );
}

function CompactRecommendation({ recommendation }) {
  const items = recommendation.items || [];
  const names = items.map((item) => item.name);
  const preview =
    names.length > 3
      ? `${names.slice(0, 3).join(", ")} +${names.length - 3} more`
      : names.join(", ");

  return (
    <Link
      to="/patient/recommendations"
      className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-slate-50 p-3 active:scale-95"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white">
        <FlaskConical className="text-cyan-600" size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-slate-950">
          {recommendation.title || "Doctor Recommended Tests"}
        </p>
        <p className="truncate text-xs font-semibold text-slate-500">
          {items.length} item{items.length === 1 ? "" : "s"} recommended
        </p>
        {preview && (
          <p className="mt-1 truncate text-[11px] font-bold text-cyan-700">
            {preview}
          </p>
        )}
      </div>

      <ChevronRight className="shrink-0 text-slate-400" size={18} />
    </Link>
  );
}