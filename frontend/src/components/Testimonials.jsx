import { useEffect, useState } from "react";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Harsha V",
      location: "Chennai",
      review:
        "Booking appointments was very easy and the consultation was smooth.",
    },
    {
      name: "Ajith Kumar",
      location: "Bangalore",
      review:
        "The symptom checker helped me quickly find the right specialist.",
    },
    {
      name: "Mohana Kannan",
      location: "Hyderabad",
      review:
        "Prescriptions and medical records are easy to manage in one place.",
    },
    {
      name: "Krish",
      location: "Mumbai",
      review:
        "Video consultation and digital prescriptions are very useful.",
    },
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const current = testimonials[active];

  return (
    <section className="py-6 bg-[#f4fbff]">
      <div className="max-w-[1450px] mx-auto px-4 md:px-6">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-4">
          Patient Stories
        </h2>

        <div className="min-h-[190px] bg-[#f4fbff] rounded-2xl border border-cyan-100 flex flex-col items-center justify-center text-center px-5 py-6">
          <div className="flex justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={15}
                className="fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>

          <p className="text-base md:text-lg text-slate-800 leading-relaxed font-black max-w-xl">
            “{current.review}”
          </p>

          <div className="mt-4">
            <h3 className="font-black text-cyan-700 text-sm">
              {current.name}
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              {current.location}
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-1.5 mt-4">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              className={`h-2 rounded-full transition-all ${
                active === index
                  ? "w-6 bg-cyan-600"
                  : "w-2 bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}