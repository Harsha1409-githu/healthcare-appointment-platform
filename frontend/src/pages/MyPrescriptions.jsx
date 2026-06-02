import { useEffect, useState } from "react";
import api from "../api/axios";

export default function MyPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await api.get("/prescription/my");
      setPrescriptions(res.data || []);
    } catch (error) {
      console.error("Prescription API error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading prescriptions...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">
          My Prescriptions
        </h1>

        {prescriptions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <p className="text-gray-500">
              No prescriptions found.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {prescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="bg-white rounded-2xl shadow p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">
                      {prescription.doctor?.doctorName}
                    </h2>

                    <p className="text-blue-600">
                      {prescription.doctor?.specialization}
                    </p>
                  </div>

                  <div className="text-sm text-gray-500">
                    {new Date(
                      prescription.createdAt
                    ).toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-5">
                  <h3 className="font-semibold text-gray-800">
                    Diagnosis
                  </h3>

                  <p className="mt-1 text-gray-700">
                    {prescription.diagnosis}
                  </p>
                </div>

                <div className="mt-5">
                  <h3 className="font-semibold text-gray-800">
                    Medicines
                  </h3>

                  <pre className="mt-1 whitespace-pre-wrap text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {prescription.medicines}
                  </pre>
                </div>

                {prescription.notes && (
                  <div className="mt-5">
                    <h3 className="font-semibold text-gray-800">
                      Notes
                    </h3>

                    <p className="mt-1 text-gray-700">
                      {prescription.notes}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <a
                    href={`${import.meta.env.VITE_API_URL}/prescription/${prescription.id}/pdf`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Download PDF
                  </a>

                  <button
                    onClick={() => window.print()}
                    className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100"
                  >
                    Print
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}