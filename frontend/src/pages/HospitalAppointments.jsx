import { useEffect, useState } from "react";
import api from "../api/axios";

export default function HospitalAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showPrescription, setShowPrescription] = useState(null);

  const [prescriptionForm, setPrescriptionForm] = useState({
    diagnosis: "",
    medicines: "",
    notes: "",
  });

  const fetchAppointments = () => {
    setLoading(true);

    api
      .get("/appointment")
      .then((res) => {
        setAppointments(res.data || []);
      })
      .catch((err) => {
        console.error("Hospital appointment API error:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const markCompleted = async (id) => {
    const confirmComplete = window.confirm(
      "Mark this appointment as completed?"
    );

    if (!confirmComplete) return;

    try {
      await api.patch(`/appointment/${id}/complete`);

      setAppointments((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: "COMPLETED" }
            : item
        )
      );
    } catch (error) {
      console.error("Complete appointment error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to complete appointment"
      );
    }
  };

  const savePrescription = async (appointmentId) => {
    if (
      !prescriptionForm.diagnosis ||
      !prescriptionForm.medicines
    ) {
      alert("Diagnosis and medicines are required");
      return;
    }

    try {
      await api.post("/prescription", {
        appointmentId,
        diagnosis: prescriptionForm.diagnosis,
        medicines: prescriptionForm.medicines,
        notes: prescriptionForm.notes,
      });

      alert("Prescription saved successfully");

      setShowPrescription(null);

      setPrescriptionForm({
        diagnosis: "",
        medicines: "",
        notes: "",
      });
    } catch (error) {
      console.error("Prescription error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to save prescription"
      );
    }
  };

  const statusClass = (status) => {
    if (status === "BOOKED") {
      return "bg-green-100 text-green-700";
    }

    if (status === "CANCELLED") {
      return "bg-red-100 text-red-700";
    }

    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">
          Hospital Appointments
        </h1>

        <p className="text-gray-500 mb-8">
          View, complete appointments and add prescriptions.
        </p>

        {loading ? (
          <p className="text-gray-500">
            Loading appointments...
          </p>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <p className="text-gray-500">
              No appointments found.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4">Patient</th>
                    <th className="p-4">Doctor</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Time</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((appointment) => (
                    <>
                      <tr
                        key={appointment.id}
                        className="border-t"
                      >
                        <td className="p-4">
                          <p className="font-semibold">
                            {appointment.patientName}
                          </p>

                          <p className="text-sm text-gray-500">
                            {appointment.patientPhone}
                          </p>

                          {appointment.patient?.email && (
                            <p className="text-xs text-gray-400">
                              {appointment.patient.email}
                            </p>
                          )}
                        </td>

                        <td className="p-4">
                          <p className="font-semibold">
                            {appointment.doctor?.doctorName}
                          </p>

                          <p className="text-sm text-blue-600">
                            {appointment.doctor?.specialization}
                          </p>
                        </td>

                        <td className="p-4">
                          {appointment.slot?.date}
                        </td>

                        <td className="p-4">
                          {appointment.slot?.startTime} -{" "}
                          {appointment.slot?.endTime}
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>
                        </td>

                        <td className="p-4">
                          {appointment.status === "BOOKED" && (
                            <button
                              onClick={() =>
                                markCompleted(appointment.id)
                              }
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                              Mark Completed
                            </button>
                          )}

                          {appointment.status === "COMPLETED" && (
                            <button
                              onClick={() =>
                                setShowPrescription(
                                  showPrescription === appointment.id
                                    ? null
                                    : appointment.id
                                )
                              }
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                            >
                              Add Prescription
                            </button>
                          )}

                          {appointment.status === "CANCELLED" && (
                            <span className="text-gray-400 text-sm">
                              No action
                            </span>
                          )}
                        </td>
                      </tr>

                      {showPrescription === appointment.id && (
                        <tr>
                          <td
                            colSpan="6"
                            className="p-6 bg-gray-50"
                          >
                            <h3 className="font-bold text-lg mb-4">
                              Add Prescription
                            </h3>

                            <div className="grid gap-4">
                              <input
                                type="text"
                                placeholder="Diagnosis"
                                value={
                                  prescriptionForm.diagnosis
                                }
                                onChange={(e) =>
                                  setPrescriptionForm({
                                    ...prescriptionForm,
                                    diagnosis: e.target.value,
                                  })
                                }
                                className="w-full border p-3 rounded-lg"
                              />

                              <textarea
                                placeholder="Medicines"
                                rows="4"
                                value={
                                  prescriptionForm.medicines
                                }
                                onChange={(e) =>
                                  setPrescriptionForm({
                                    ...prescriptionForm,
                                    medicines: e.target.value,
                                  })
                                }
                                className="w-full border p-3 rounded-lg"
                              />

                              <textarea
                                placeholder="Notes"
                                rows="3"
                                value={prescriptionForm.notes}
                                onChange={(e) =>
                                  setPrescriptionForm({
                                    ...prescriptionForm,
                                    notes: e.target.value,
                                  })
                                }
                                className="w-full border p-3 rounded-lg"
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
                                    setShowPrescription(null)
                                  }
                                  className="border px-5 py-2 rounded-lg hover:bg-gray-100"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}