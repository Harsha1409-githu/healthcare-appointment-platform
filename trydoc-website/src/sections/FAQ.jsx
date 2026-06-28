const faqs = [
  {
    q: "What is TryDoc?",
    a: "TryDoc is a digital healthcare platform for doctor appointments, video consultations, prescriptions, follow-ups, health records and AI-assisted healthcare guidance.",
  },
  {
    q: "When is TryDoc launching?",
    a: "TryDoc is currently in development. You can join the waitlist to receive launch updates.",
  },
  {
    q: "Is TryDoc for patients only?",
    a: "No. TryDoc is designed for patients, doctors and hospitals with separate workflows for each.",
  },
  {
    q: "Does AI replace doctors?",
    a: "No. TryDoc AI is designed to support symptom understanding and specialist discovery. It does not replace professional medical advice.",
  },
  {
    q: "Can hospitals join TryDoc?",
    a: "Yes. Hospitals will be able to manage doctors, appointments, operations and analytics through TryDoc Hospital.",
  },
];

export default function FAQSection() {
  return (
    <section className="max-w-4xl mx-auto px-5 py-20">
      <div className="text-center">
        <p className="text-xs font-black text-cyan-700">FAQ</p>
        <h2 className="text-4xl md:text-5xl font-black mt-3">
          Questions people ask.
        </h2>
      </div>

      <div className="space-y-3 mt-10">
        {faqs.map((item) => (
          <details
            key={item.q}
            className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm group"
          >
            <summary className="font-black cursor-pointer list-none flex items-center justify-between">
              {item.q}
              <span className="text-cyan-600 group-open:rotate-45 transition">
                +
              </span>
            </summary>

            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}