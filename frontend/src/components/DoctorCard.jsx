import { useNavigate } from "react-router-dom";

function DoctorCard({ doctor }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "20px",
        marginBottom: "15px",
        borderRadius: "10px",
      }}
    >
      <h2>{doctor.doctorName}</h2>

      <p>{doctor.specialization}</p>

      <p>{doctor.experience} Years Experience</p>

      <p>₹{doctor.consultationFee}</p>

      <p>{doctor.city || doctor.hospital?.city}</p>

      <button
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