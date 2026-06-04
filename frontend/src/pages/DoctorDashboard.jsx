import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function DoctorDashboard() {
  const navigate = useNavigate();

  const doctor = JSON.parse(
    localStorage.getItem("doctorUser") || "null"
  );

  const [appointments, setAppointments] = useState([]);
  const [showPrescriptionForm, setShowPrescriptionForm] =
    useState(null);

  const [form, setForm] = useState({
    diagnosis: "",
    medicines: "",
    notes: "",
  });

  useEffect(() => {
    if (!doctor) {
      navigate("/doctor/login");
      return;
    }

    fetchAppointments();
  }, []);

  const logout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorUser");
    navigate("/doctor/login");
  };

  const fetchAppointments = async () => {
    try {
      const res = await api.get(
        `/appointment/doctor/${doctor.id}`
      );

      setAppointments(res.data || []);
    } catch (error) {
      console.error("Appointment API error:", error);
    }
  };

  const completeAppointment = async (id) => {
    try {
      await api.patch(`/appointment/${id}/complete`);
      fetchAppointments();
    } catch (error) {
      console.error("Complete error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to complete appointment"
      );
    }
  };

  const savePrescription = async (appointmentId) => {
    if (!form.diagnosis || !form.medicines) {
      alert("Diagnosis and medicines are required");
      return;
    }

    try {
      await api.post("/prescription", {
        appointmentId,
        diagnosis: form.diagnosis,
        medicines: form.medicines,
        notes: form.notes,
      });

      alert("Prescription created successfully");

      setForm({
        diagnosis: "",
        medicines: "",
        notes: "",
      });

      setShowPrescriptionForm(null);
      fetchAppointments();
    } catch (error) {
      console.error("Prescription error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to create prescription"
      );
    }
  };

  const completedCount = appointments.filter(
    (a) => a.status === "COMPLETED"
  ).length;

  const pendingCount = appointments.filter(
    (a) => a.status === "BOOKED"
  ).length;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome Dr. {doctor?.doctorName}
            </h1>

            <p className="text-gray-500 mt-2">
              {doctor?.specialization}
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold">
              Total Appointments
            </h2>

            <p className="text-3xl mt-2">
              {appointments.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold">
              Completed
            </h2>

            <p className="text-3xl mt-2">
              {completedCount}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold">
              Pending
            </h2>

            <p className="text-3xl mt-2">
              {pendingCount}
            </p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-5">
            My Appointments
          </h2>

          {appointments.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-500">
                No appointments found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white p-5 rounded-xl shadow"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <h3 className="font-bold text-lg">
                        {appointment.patient?.fullName ||
                          appointment.patientName}
                      </h3>

                      <p className="text-gray-600">
                        Phone: {appointment.patientPhone}
                      </p>

                      <p className="text-gray-600">
                        Date: {appointment.slot?.date}
                      </p>

                      <p className="text-gray-600">
                        Time: {appointment.slot?.startTime} -{" "}
                        {appointment.slot?.endTime}
                      </p>

                      <p className="mt-2">
                        Status:{" "}
                        <span
                          className={`font-semibold ${
                            appointment.status === "COMPLETED"
                              ? "text-green-600"
                              : appointment.status === "CANCELLED"
                              ? "text-red-600"
                              : "text-blue-600"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </p>
                    </div>

                    <div className="flex gap-3">
                      {appointment.status === "BOOKED" && (
                        <button
                          onClick={() =>
                            completeAppointment(
                              appointment.id
                            )
                          }
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          Complete
                        </button>
                      )}

                      {appointment.status ===
                        "COMPLETED" && (
                        <button
                          onClick={() =>
                            setShowPrescriptionForm(
                              showPrescriptionForm ===
                                appointment.id
                                ? null
                                : appointment.id
                            )
                          }
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                          Create Prescription
                        </button>
                      )}
                    </div>
                  </div>

                  {showPrescriptionForm ===
                    appointment.id && (
                    <div className="mt-5 border-t pt-5">
                      <h3 className="font-bold mb-4">
                        Create Prescription
                      </h3>

                      <input
                        type="text"
                        placeholder="Diagnosis"
                        value={form.diagnosis}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            diagnosis: e.target.value,
                          })
                        }
                        className="w-full border p-3 rounded-lg mb-3"
                      />

                      <textarea
                        placeholder="Medicines"
                        rows="4"
                        value={form.medicines}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            medicines: e.target.value,
                          })
                        }
                        className="w-full border p-3 rounded-lg mb-3"
                      />

                      <textarea
                        placeholder="Notes"
                        rows="3"
                        value={form.notes}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            notes: e.target.value,
                          })
                        }
                        className="w-full border p-3 rounded-lg mb-3"
                      />

                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            savePrescription(
                              appointment.id
                            )
                          }
                          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                        >
                          Save Prescription
                        </button>

                        <button
                          onClick={() =>
                            setShowPrescriptionForm(null)
                          }
                          className="border px-5 py-2 rounded-lg hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}