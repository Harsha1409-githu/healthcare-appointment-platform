import { useEffect, useState } from "react";
import {
  Star,
  Quote,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Harsha V",
      role: "Patient",
      location: "Chennai",
      review:
        "Booking appointments was extremely easy. The doctor consultation experience was smooth and professional.",
    },
    {
      name: "Ajith Kumar",
      role: "Patient",
      location: "Bangalore",
      review:
        "The AI symptom checker guided me to the right specialist quickly and saved a lot of time.",
    },
    {
      name: "Mohana Kannan",
      role: "Patient",
      location: "Hyderabad",
      review:
        "Having prescriptions and medical records in one place makes healthcare management much easier.",
    },
    {
      name: "Krish",
      role: "Patient",
      location: "Mumbai",
      review:
        "Video consultation and digital prescription features are very useful. Everything feels simple and reliable.",
    },
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextSlide = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const previousSlide = () => {
    setActive((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const current = testimonials[active];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-[#f4fbff] overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-black text-sm border border-cyan-100">
            <ShieldCheck size={17} />
            PATIENT TESTIMONIALS
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-slate-950 mt-5">
            Trusted by patients
            <span className="block text-cyan-600">
              across India
            </span>
          </h2>

          <p className="text-slate-500 text-lg mt-5 leading-relaxed">
            Real experiences from people who use MediCare for appointments,
            video consultations, prescriptions and healthcare management.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <button
            onClick={previousSlide}
            className="hidden md:flex absolute left-[-70px] top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white border border-slate-200 shadow-lg items-center justify-center hover:bg-cyan-50 hover:text-cyan-600 transition z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={26} />
          </button>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-7 md:p-10 min-h-[360px] transition-all duration-500">
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <Quote size={38} className="text-cyan-200" />
            </div>

            <p className="text-slate-700 leading-relaxed mt-8 text-xl md:text-2xl font-semibold">
              “{current.review}”
            </p>

            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-cyan-600 flex items-center justify-center text-white font-black text-xl shadow-sm">
                  {current.name.charAt(0)}
                </div>

                <div>
                  <h3 className="font-black text-slate-950 text-lg">
                    {current.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {current.role} • {current.location}
                  </p>
                </div>
              </div>

              <div className="hidden md:block text-right">
                <p className="text-3xl font-black text-cyan-600">
                  5.0
                </p>

                <p className="text-xs font-bold text-slate-400">
                  Rating
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-[-70px] top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-cyan-600 text-white shadow-lg items-center justify-center hover:bg-cyan-700 transition z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight size={26} />
          </button>

          <div className="flex md:hidden items-center justify-center gap-4 mt-6">
            <button
              onClick={previousSlide}
              className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center hover:bg-cyan-50 hover:text-cyan-600 transition"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center hover:bg-cyan-700 transition"
              aria-label="Next testimonial"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-7">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActive(index)}
                className={`h-3 rounded-full transition-all ${
                  active === index
                    ? "w-10 bg-cyan-600"
                    : "w-3 bg-slate-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}