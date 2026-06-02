import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    api.get("/doctor").then((res) => {
      setDoctors(res.data);
    });
  }, []);

  return (
    <div>
      <h2>Doctors</h2>

      {doctors.map((doc) => (
        <div key={doc.id} style={{ border: "1px solid black", margin: 10 }}>
          <h3>{doc.doctorName}</h3>
          <p>{doc.specialization}</p>
          <p>₹{doc.consultationFee}</p>

          <Link to={`/doctor/${doc.id}`}>
            View
          </Link>
        </div>
      ))}
    </div>
  );
}