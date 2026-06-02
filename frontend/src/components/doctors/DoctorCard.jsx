export default function DoctorCard({ doctor, onBook }) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">

      <h2 className="text-lg font-semibold">
        {doctor.doctorName}
      </h2>

      <p className="text-blue-600 font-medium">
        {doctor.specialization}
      </p>

      <div className="text-sm text-gray-600 mt-2 space-y-1">
        <p>{doctor.experience} Years Experience</p>
        <p>₹{doctor.consultationFee}</p>
        <p>{doctor.city || "Chennai"}</p>
      </div>

      <button
        onClick={() => onBook(doctor)}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
      >
        Book Appointment
      </button>
    </div>
  );
}