import { useNavigate } from "react-router-dom";

function DoctorCard({ doctor }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
      <h2 className="text-xl font-bold">
        {doctor.doctorName}
      </h2>

      <p className="text-blue-600">
        {doctor.specialization}
      </p>

      <p className="mt-2">
        Experience: {doctor.experience} Years
      </p>

      <p>
        Fee: ₹{doctor.consultationFee}
      </p>

      <p>
        City: {doctor.city || doctor.hospital?.city}
      </p>

      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() =>
          navigate(`/doctor/${doctor.id}`)
        }
      >
        Book Appointment
      </button>
    </div>
  );
}

export default DoctorCard;