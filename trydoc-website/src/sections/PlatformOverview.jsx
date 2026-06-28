const stats = [
  {
    value: "Patients",
    label: "Book • Consult • Heal",
  },
  {
    value: "Doctors",
    label: "Manage • Prescribe • Follow up",
  },
  {
    value: "Hospitals",
    label: "Operate • Monitor • Scale",
  },
  {
    value: "AI",
    label: "Guide • Match • Assist",
  },
];

export default function PlatformOverview() {
  return (
    <section className="bg-white px-5 py-14 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 rounded-[2.5rem] border border-slate-100 bg-[#f8fbfc] p-4 shadow-sm md:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.value}
            className="rounded-[2rem] bg-white p-5 text-center"
          >
            <p className="text-2xl font-black text-slate-950">
              {item.value}
            </p>

            <p className="mt-2 text-xs font-bold text-slate-500">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}