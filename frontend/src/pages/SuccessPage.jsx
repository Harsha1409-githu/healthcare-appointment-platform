import { Link } from "react-router-dom";

export default function SuccessPage() {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center text-4xl">
          ✅
        </div>

        <h1 className="text-3xl font-bold mt-6 text-gray-800">
          Appointment Confirmed
        </h1>

        <p className="text-gray-500 mt-3">
          Your appointment has been booked successfully.
        </p>

        <div className="bg-blue-50 rounded-xl p-4 mt-6 text-left">
          <p className="text-sm text-gray-500">
            Next Step
          </p>

          <p className="font-semibold text-gray-800 mt-1">
            You can view or cancel your appointment from My Appointments.
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <Link to="/appointments">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
              View My Appointments
            </button>
          </Link>

          <Link to="/doctors">
            <button className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50">
              Book Another Appointment
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}