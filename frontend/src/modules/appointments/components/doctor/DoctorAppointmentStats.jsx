export default function DoctorAppointmentStats({ stats }) {
  return (
    <div className="mt-3 grid grid-cols-4 gap-2">
      <Stat label="Today" value={stats.today} />
      <Stat label="Waiting" value={stats.waiting} />
      <Stat label="Video" value={stats.video} />
      <Stat label="Done" value={stats.done} />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-2 py-3 text-center">
      <p className="text-xl font-black leading-none text-slate-950">
        {value}
      </p>
      <p className="mt-1 text-[10px] font-black uppercase text-slate-500">
        {label}
      </p>
    </div>
  );
}