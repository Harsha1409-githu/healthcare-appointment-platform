import { useEffect, useState } from "react";
import axios from "axios";

export default function FeaturedDoctors() {

  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/doctors")
      .then((res) => setDoctors(res.data.slice(0, 3)));
  }, []);

  return (
    <section className="py-16">

      <div className="max-w-7xl mx-auto">

        <h2 className="text-3xl font-bold text-center mb-10">
          Featured Doctors
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-xl shadow p-6"
            >
              <h3 className="font-bold text-xl">
                {doctor.doctorName}
              </h3>

              <p className="text-blue-600">
                {doctor.specialization}
              </p>

              <p className="mt-2">
                {doctor.experience} Years Experience
              </p>

              <p className="mt-2">
                ₹{doctor.consultationFee}
              </p>
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}