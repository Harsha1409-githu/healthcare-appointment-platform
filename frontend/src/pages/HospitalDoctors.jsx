import { useEffect, useState } from "react";
import api from "../api/axios";

export default function HospitalDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    doctorName: "",
    specialization: "",
    experience: "",
    qualification: "",
    consultationFee: "",
    mobile: "",
    email: "",
    hospitalId: "",
  });

  const fetchDoctors = () => {
    setLoading(true);

    api
      .get("/doctor")
      .then((res) => {
        setDoctors(
          (res.data || []).filter(
            (doctor) => doctor.isActive
          )
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addDoctor = async (e) => {
    e.preventDefault();

    try {
      await api.post("/doctor", {
        ...form,
        experience: Number(form.experience),
        consultationFee: Number(
          form.consultationFee
        ),
      });

      alert("Doctor added successfully");

      setForm({
        doctorName: "",
        specialization: "",
        experience: "",
        qualification: "",
        consultationFee: "",
        mobile: "",
        email: "",
        hospitalId: "",
      });

      fetchDoctors();
    } catch (error) {
      console.error(error);
      alert("Failed to add doctor");
    }
  };

  const deactivateDoctor = async (id) => {
    const confirmDelete = window.confirm(
      "Deactivate this doctor?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/doctor/${id}`);

      setDoctors((prev) =>
        prev.filter((doc) => doc.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to deactivate doctor");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">
          Hospital Doctor Management
        </h1>

        {/* Add Doctor Form */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">
            Add Doctor
          </h2>

          <form
            onSubmit={addDoctor}
            className="grid md:grid-cols-2 gap-4"
          >
            <input
              name="doctorName"
              placeholder="Doctor Name"
              value={form.doctorName}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              name="specialization"
              placeholder="Specialization"
              value={form.specialization}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              name="experience"
              type="number"
              placeholder="Experience"
              value={form.experience}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              name="qualification"
              placeholder="Qualification"
              value={form.qualification}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              name="consultationFee"
              type="number"
              placeholder="Consultation Fee"
              value={form.consultationFee}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              name="mobile"
              placeholder="Mobile"
              value={form.mobile}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              name="hospitalId"
              placeholder="Hospital ID"
              value={form.hospitalId}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 text-white py-3 rounded-lg"
            >
              Add Doctor
            </button>
          </form>
        </div>

        {/* Doctors List */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            Doctors
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid gap-4">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="border rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold">
                      {doctor.doctorName}
                    </h3>

                    <p className="text-blue-600">
                      {doctor.specialization}
                    </p>

                    <p className="text-gray-500">
                      {doctor.experience} years |
                      ₹{doctor.consultationFee}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      deactivateDoctor(
                        doctor.id
                      )
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Deactivate
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}