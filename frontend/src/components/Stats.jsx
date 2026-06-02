export default function Stats() {
  const stats = [
    {
      title: "Doctors",
      value: "100+",
    },
    {
      title: "Hospitals",
      value: "20+",
    },
    {
      title: "Patients",
      value: "5000+",
    },
    {
      title: "Appointments",
      value: "10000+",
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6">

        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white shadow rounded-xl p-6 text-center"
          >
            <h2 className="text-3xl font-bold text-blue-600">
              {item.value}
            </h2>

            <p className="mt-2 text-gray-600">
              {item.title}
            </p>
          </div>
        ))}

      </div>
    </section>
  );
}