import {
  Star,
  Quote,
} from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Harsha V",
      role: "Patient",
      rating: 5,
      review:
        "Booking an appointment was incredibly simple and the doctor consultation was excellent.",
    },
    {
      name: "Ajith Kumar",
      role: "Patient",
      rating: 5,
      review:
        "The AI symptom checker helped me find the right specialist within minutes.",
    },
    {
      name: "Mohana Kannan",
      role: "Patient",
      rating: 5,
      review:
        "Medical records and prescriptions are available in one place. Very convenient.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-100">
            Patient Reviews
          </span>

          <h2 className="text-5xl font-black text-slate-900 mt-6">
            Trusted By
            <span className="block text-blue-600">
              Thousands Of Patients
            </span>
          </h2>

          <p className="text-slate-500 text-lg mt-4">
            Real experiences from patients using MediCare.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 hover:-translate-y-2 transition duration-500"
            >
              <Quote
                className="text-blue-600 mb-5"
                size={40}
              />

              <div className="flex gap-1 mb-4">
                {[...Array(item.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-slate-600 leading-relaxed">
                "{item.review}"
              </p>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="font-black text-slate-900">
                  {item.name}
                </h3>

                <p className="text-sm text-slate-500">
                  {item.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}