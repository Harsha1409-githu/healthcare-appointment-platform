import { useEffect, useState } from "react";
import api from "../api/axios";

export default function HospitalAvailability() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    doctorId: "",
    dayOfWeek: "MONDAY",
    startTime: "09:00",
    endTime: "17:00",
    slotDuration: 30,
  });

  const [slotDate, setSlotDate] = useState("");

  useEffect(() => {
    api
      .get("/doctor")
      .then((res) => {
        const activeDoctors = (res.data || []).filter(
          (doctor) => doctor.isActive
        );
        setDoctors(activeDoctors);

        if (activeDoctors.length > 0) {
          setForm((prev) => ({
            ...prev,
            doctorId: activeDoctors[0].id,
          }));
        }
      })
      .catch((err) => {
        console.error("Doctor API error:", err);
      });
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveAvailability = async (e) => {
    e.preventDefault();

    if (!form.doctorId) {
      alert("Please select doctor");
      return;
    }

    try {
      setLoading(true);

      await api.post("/availability", {
        ...form,
        slotDuration: Number(form.slotDuration),
      });

      alert("Availability saved successfully");
    } catch (error) {
      console.error("Availability error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to save availability"
      );
    } finally {
      setLoading(false);
    }
  };

  const generateSlots = async () => {
    if (!form.doctorId || !slotDate) {
      alert("Please select doctor and date");
      return;
    }

    try {
      setLoading(true);

      await api.post("/slot/generate", {
        doctorId: form.doctorId,
        date: slotDate,
      });

      alert("Slots generated successfully");
    } catch (error) {
      console.error("Slot generation error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to generate slots"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">
          Manage Doctor Availability
        </h1>

        <p className="text-gray-500 mb-8">
          Set doctor working hours and generate appointment slots.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <form
            onSubmit={saveAvailability}
            className="bg-white rounded-2xl shadow p-6"
          >
            <h2 className="text-xl font-bold mb-5">
              Save Availability
            </h2>

            <div className="grid gap-4">
              <select
                name="doctorId"
                value={form.doctorId}
                onChange={handleChange}
                className="border rounded-lg p-3"
              >
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.doctorName} - {doctor.specialization}
                  </option>
                ))}
              </select>

              <select
                name="dayOfWeek"
                value={form.dayOfWeek}
                onChange={handleChange}
                className="border rounded-lg p-3"
              >
                <option value="MONDAY">Monday</option>
                <option value="TUESDAY">Tuesday</option>
                <option value="WEDNESDAY">Wednesday</option>
                <option value="THURSDAY">Thursday</option>
                <option value="FRIDAY">Friday</option>
                <option value="SATURDAY">Saturday</option>
                <option value="SUNDAY">Sunday</option>
              </select>

              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="border rounded-lg p-3"
              />

              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="border rounded-lg p-3"
              />

              <input
                type="number"
                name="slotDuration"
                value={form.slotDuration}
                onChange={handleChange}
                className="border rounded-lg p-3"
                placeholder="Slot Duration in minutes"
              />

              <button
                disabled={loading}
                className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? "Saving..." : "Save Availability"}
              </button>
            </div>
          </form>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-5">
              Generate Slots
            </h2>

            <div className="grid gap-4">
              <select
                value={form.doctorId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    doctorId: e.target.value,
                  })
                }
                className="border rounded-lg p-3"
              >
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.doctorName} - {doctor.specialization}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={slotDate}
                onChange={(e) => setSlotDate(e.target.value)}
                className="border rounded-lg p-3"
              />

              <button
                onClick={generateSlots}
                disabled={loading}
                className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? "Generating..." : "Generate Slots"}
              </button>

              <div className="bg-blue-50 rounded-xl p-4 text-sm text-gray-600">
                Make sure the selected date matches the saved day.
                Example: if you saved MONDAY availability, choose a Monday date.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}